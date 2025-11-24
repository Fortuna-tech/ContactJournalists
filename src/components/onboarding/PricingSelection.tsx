import { useState } from "react";
import { BILLING_PLANS, Plan } from "@/config/billing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PricingSelectionProps {
  onSkip?: () => void; // In case we want to allow skipping or it's not enforced yet
}

const PricingSelection = ({ onSkip }: PricingSelectionProps) => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (plan: Plan) => {
    try {
      setLoading(plan.id);
      const priceId = isAnnual
        ? plan.price.annual.priceId
        : plan.price.monthly.priceId;

      const { url } = await createCheckoutSession(priceId);

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to start checkout session. Please try again.",
        variant: "destructive",
      });
      setLoading(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose your plan</h1>
        <p className="text-muted-foreground text-lg">
          Start your 7-day free trial. Cancel anytime.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Label
            htmlFor="billing-toggle"
            className={`text-sm ${
              !isAnnual ? "text-foreground font-bold" : "text-muted-foreground"
            }`}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isAnnual}
            onCheckedChange={setIsAnnual}
          />
          <Label
            htmlFor="billing-toggle"
            className={`text-sm ${
              isAnnual ? "text-foreground font-bold" : "text-muted-foreground"
            }`}
          >
            Annually{" "}
            <span className="text-green-500 text-xs ml-1">(Save 2 months)</span>
          </Label>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {Object.values(BILLING_PLANS).map((plan) => {
          const price = isAnnual
            ? plan.price.annual.amount
            : plan.price.monthly.amount;
          const priceDisplay = `£${price}`;
          const period = isAnnual ? "/year" : "/month";

          return (
            <Card
              key={plan.id}
              className={`p-6 flex flex-col ${
                plan.id === "growth" ? "border-primary shadow-lg relative" : ""
              }`}
            >
              {plan.id === "growth" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-xl">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mt-1 h-10">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold">{priceDisplay}</span>
                <span className="text-muted-foreground">{period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                onClick={() => handleSubscribe(plan)}
                disabled={!!loading}
                variant={plan.id === "growth" ? "default" : "outline"}
              >
                {loading === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Start 7-day free trial"
                )}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PricingSelection;
