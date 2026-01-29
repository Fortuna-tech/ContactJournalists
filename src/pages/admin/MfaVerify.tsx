import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  getVerifiedTOTPFactor,
  createChallenge,
  verifyTOTP,
  getAAL,
} from "@/lib/mfa";
import { ShieldCheck, Loader2, LogOut } from "lucide-react";
import { adminTheme } from "@/styles/adminTheme";

const MfaVerify = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const initVerification = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        // Check AAL - if already aal2, redirect to admin
        const { currentLevel } = await getAAL();
        if (currentLevel === "aal2") {
          navigate("/admin");
          return;
        }

        // Get the verified TOTP factor
        const factor = await getVerifiedTOTPFactor();
        if (!factor) {
          // No TOTP enrolled, redirect to setup
          navigate("/admin/mfa-setup");
          return;
        }

        setFactorId(factor.id);

        // Create a challenge
        const challenge = await createChallenge(factor.id);
        setChallengeId(challenge.id);
      } catch (error) {
        console.error("Failed to initialize MFA verification:", error);
        toast({
          title: "Error",
          description: "Failed to start verification. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initVerification();
  }, [navigate, toast]);

  const handleVerify = async () => {
    if (!factorId || !challengeId || code.length !== 6) return;

    setVerifying(true);
    try {
      await verifyTOTP(factorId, challengeId, code);
      toast({
        title: "Verified",
        description: "Two-factor authentication successful.",
      });
      navigate("/admin");
    } catch (error) {
      console.error("Verification failed:", error);
      toast({
        title: "Invalid Code",
        description: "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      });
      setCode("");

      // Create a new challenge for retry
      try {
        const challenge = await createChallenge(factorId);
        setChallengeId(challenge.id);
      } catch (e) {
        console.error("Failed to create new challenge:", e);
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className={adminTheme.page + " flex items-center justify-center"} style={adminTheme.bodyStyle}>
        <div className="text-center space-y-4">
          <div className={adminTheme.loadingSpinner + " mx-auto"}></div>
          <p className="text-slate-500">Preparing verification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={adminTheme.page + " flex items-center justify-center p-4"} style={adminTheme.bodyStyle}>
      <div className={adminTheme.cardWithShadow + " w-full max-w-md"}>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
          <CardDescription>
            Enter the 6-digit code from your authenticator app to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={handleVerify}
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button
              className="w-full"
              onClick={handleVerify}
              disabled={code.length !== 6 || verifying}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>

          {/* Sign out option */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign in with a different account
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default MfaVerify;
