import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";

interface BrevoSignupFormProps {
  title?: string;
  description?: string;
  buttonText?: string;
  successMessage?: string;
}

export function BrevoSignupForm({
  title = "📥 Download Your Free P&L Template",
  description = "Enter your email to get instant access to the Google Sheets & Excel P&L template. Join founders who are taking control of their finances.",
  buttonText = "Get Free Template",
  successMessage = "Success! Check your email for the P&L template.",
}: BrevoSignupFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe-pl-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
        toast({
          title: "Template on the way! 🎉",
          description: successMessage,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Something went wrong",
          description: error.error || "Please try again later",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 rounded-2xl border border-accent-mint/30 bg-gradient-to-r from-accent-mint/10 to-accent-blue/10">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="h-8 w-8 text-accent-mint" />
          <h3 className="text-2xl font-bold text-white">Check Your Email!</h3>
        </div>
        <p className="text-slate-300">
          Your free P&L template is on its way. If you don't see it in a few
          minutes, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-2xl border border-accent-blue/30 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-base-800 border-white/10 text-white placeholder:text-slate-500"
          data-testid="input-email-pl-template"
          disabled={isLoading}
          required
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-accent-blue to-accent-violet hover:opacity-95 transition-opacity font-semibold text-white shadow-glow"
          data-testid="button-submit-pl-template"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      <p className="text-xs text-slate-500 mt-4">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
