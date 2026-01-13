import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    entitlements: {
      pitches: 200,
      users: 1,
      pitchGenerator: 30, // Daily sample
      contacts: 300,
    },
  },
  growth: {
    id: "growth",
    name: "Growth",
    entitlements: {
      pitches: 800,
      users: 3,
      pitchGenerator: 80, // Full access
      contacts: 1500,
    },
  },
  team: {
    id: "team",
    name: "Team",
    entitlements: {
      pitches: 9999999,
      users: 10,
      pitchGenerator: 200, // Full access
      contacts: 9999999,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // Get billing account
    const { data: billingAccount, error: billingError } = await supabaseClient
      .from("billing_accounts")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (billingError) {
      throw billingError;
    }

    const planId = billingAccount?.plan_id || "starter"; // Default to starter limits if no plan, or maybe free?
    // If no billing account, user might be on a free tier or just started.
    // Assuming starter for now if null, or we should define a "free" plan.
    // Based on config, there is only starter, growth, team.
    // If status is incomplete/null, maybe give 0 limits?
    // For now, let's use "starter" logic but check status.

    // If status is not active/trialing, maybe limits are 0?
    // Keeping it simple: if valid plan, use it. If no plan, use starter limits but mark status.

    const plan = PLANS[planId as keyof typeof PLANS] || PLANS.starter;

    // Calculate pitch usage for current period
    const periodStart =
      billingAccount?.current_period_start ||
      billingAccount?.usage_window_start ||
      new Date(new Date().setDate(1)).toISOString(); // Default to start of month if no period

    // Count pitches sent by this user since period start
    // Note: In team scenario, we should count pitches by all users in the org.
    // But currently 1 user = 1 profile = 1 billing account.
    const { count: pitchCount, error: countError } = await supabaseClient
      .from("pitches")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", periodStart);

    if (countError) throw countError;

    // Count saved contacts by this user since period start
    const { count: contactCount, error: contactCountError } =
      await supabaseClient
        .from("saved_contacts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", periodStart);

    if (contactCountError) throw contactCountError;

    // Calculate limits
    const maxPitches = plan.entitlements.pitches;
    const remainingPitches = Math.max(0, maxPitches - (pitchCount || 0));

    // Pitch Generator Usage - Not tracked yet, assuming 0 usage or mock
    // For starter, it says "daily sample". For others "Full".
    // We'll return the max and remaining based on entitlement.
    const maxPitchGen = plan.entitlements.pitchGenerator;
    const remainingPitchGen = maxPitchGen; // Mocked: assumes 0 used

    // Users Usage
    const maxUsers = plan.entitlements.users;
    const remainingUsers = Math.max(0, maxUsers - 1); // Current user takes 1 slot

    // Contacts Usage
    const maxContacts = plan.entitlements.contacts;
    const remainingContacts = Math.max(0, maxContacts - (contactCount || 0));

    const response = {
      plan: plan.name,
      status: billingAccount?.status || "free",
      maxPitches,
      remainingPitches,
      maxPitchGen,
      remainingPitchGen,
      maxUsers,
      remainingUsers,
      maxContacts,
      remainingContacts,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
