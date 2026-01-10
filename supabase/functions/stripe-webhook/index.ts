import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2025-07-30.basil",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret,
        undefined,
        cryptoProvider
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log(`Processing event: ${event.type}`);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const customerEmail =
    session.customer_email || session.customer_details?.email;

  if (!customerEmail) {
    console.error("No customer email in checkout session");
    return;
  }

  // Find profile by email
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", customerEmail)
    .maybeSingle();

  if (profileError || !profile) {
    console.error("Profile not found for email:", customerEmail, profileError);
    return;
  }

  // Get subscription details to extract plan and price info
  let planId: string | null = null;
  let priceId: string | null = null;
  let status = "active";
  let trialEndsAt: Date | null = null;
  let currentPeriodEnd: Date | null = null;
  let cancelAtPeriodEnd = false;

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const price = subscription.items.data[0]?.price;

    if (price) {
      priceId = price.id;
      // Map price ID to plan ID from your billing config
      planId = await mapPriceIdToPlanId(price.id);
    }

    status = subscription.status;
    trialEndsAt = subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null;
    currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;
    cancelAtPeriodEnd = subscription.cancel_at_period_end;
  }

  // Upsert billing account
  const { error: upsertError } = await supabase.from("billing_accounts").upsert(
    {
      profile_id: profile.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      plan_id: planId,
      price_id: priceId,
      status: status,
      trial_ends_at: trialEndsAt?.toISOString() || null,
      current_period_end: currentPeriodEnd?.toISOString() || null,
      cancel_at_period_end: cancelAtPeriodEnd,
    },
    {
      onConflict: "profile_id",
    }
  );

  if (upsertError) {
    console.error("Error upserting billing account:", upsertError);
    throw upsertError;
  }

  console.log(`Billing account created/updated for profile: ${profile.id}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const price = subscription.items.data[0]?.price;

  if (!price) {
    console.error("No price found in subscription");
    return;
  }

  const planId = await mapPriceIdToPlanId(price.id);
  const status = subscription.status;
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;

  const { error: updateError } = await supabase
    .from("billing_accounts")
    .update({
      stripe_subscription_id: subscriptionId,
      plan_id: planId,
      price_id: price.id,
      status: status,
      trial_ends_at: trialEndsAt?.toISOString() || null,
      current_period_end: currentPeriodEnd?.toISOString() || null,
      cancel_at_period_end: cancelAtPeriodEnd,
    })
    .eq("stripe_customer_id", customerId);

  if (updateError) {
    console.error("Error updating billing account:", updateError);
    throw updateError;
  }

  console.log(`Billing account updated for customer: ${customerId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { error: updateError } = await supabase
    .from("billing_accounts")
    .update({
      status: "canceled",
      stripe_subscription_id: null,
      plan_id: null,
      price_id: null,
      cancel_at_period_end: false,
    })
    .eq("stripe_customer_id", customerId);

  if (updateError) {
    console.error(
      "Error updating billing account on cancellation:",
      updateError
    );
    throw updateError;
  }

  console.log(`Billing account canceled for customer: ${customerId}`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return; // One-time payment, not subscription-related
  }

  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );
  const currentPeriodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000)
    : null;

  const { error: updateError } = await supabase
    .from("billing_accounts")
    .update({
      status: "active",
      current_period_end: currentPeriodEnd?.toISOString() || null,
    })
    .eq("stripe_customer_id", customerId);

  if (updateError) {
    console.error(
      "Error updating billing account on payment success:",
      updateError
    );
  } else {
    console.log(`Payment succeeded for customer: ${customerId}`);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const { error: updateError } = await supabase
    .from("billing_accounts")
    .update({
      status: "past_due",
    })
    .eq("stripe_customer_id", customerId);

  if (updateError) {
    console.error(
      "Error updating billing account on payment failure:",
      updateError
    );
  } else {
    console.log(`Payment failed for customer: ${customerId}`);
  }
}

// Map Stripe price ID to plan ID based on your billing config
async function mapPriceIdToPlanId(priceId: string): Promise<string | null> {
  // Price IDs from your billing.ts config
  const priceToPlanMap: Record<string, string> = {
    // Starter
    price_1SWz11H32orQYBkNHqpgl0rz: "starter", // monthly
    price_1SWz3ZH32orQYBkN2hPYlrjc: "starter", // annual
    // Growth
    price_1SWz1fH32orQYBkNrkXU2IQn: "growth", // monthly
    price_1SWz3HH32orQYBkNkQxvrFpb: "growth", // annual
    // Team
    price_1SWz29H32orQYBkNjBCd4p8b: "team", // monthly
    price_1SWz2tH32orQYBkNsaBMWwhN: "team", // annual
  };

  return priceToPlanMap[priceId] || null;
}
