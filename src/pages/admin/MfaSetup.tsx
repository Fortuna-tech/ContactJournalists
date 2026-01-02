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
  enrollTOTP,
  verifyTOTPEnrollment,
  hasTOTPFactor,
  type EnrollmentData,
} from "@/lib/mfa";
import { Shield, Copy, Check, Loader2 } from "lucide-react";

const MfaSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(
    null
  );
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const initEnrollment = async () => {
      try {
        // Check if user is authenticated
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        // Check if already has TOTP enrolled
        const hasTotp = await hasTOTPFactor();
        if (hasTotp) {
          navigate("/admin");
          return;
        }

        // Start enrollment
        const data = await enrollTOTP("Admin Authenticator");
        setEnrollmentData(data);
      } catch (error) {
        console.error("Failed to start MFA enrollment:", error);
        toast({
          title: "Error",
          description: "Failed to start MFA setup. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initEnrollment();
  }, [navigate, toast]);

  const handleCopySecret = async () => {
    if (!enrollmentData) return;
    await navigator.clipboard.writeText(enrollmentData.totp.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Secret key copied to clipboard",
    });
  };

  const handleVerify = async () => {
    if (!enrollmentData || code.length !== 6) return;

    setVerifying(true);
    try {
      await verifyTOTPEnrollment(enrollmentData.id, code);
      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been set up successfully.",
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
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Setting up MFA...</p>
        </div>
      </div>
    );
  }

  if (!enrollmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Setup Failed</CardTitle>
            <CardDescription>
              Unable to start MFA enrollment. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            Set Up Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            As an admin, you need to enable 2FA to access the dashboard. Scan
            the QR code below with your authenticator app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <img
                src={enrollmentData.totp.qr_code}
                alt="QR Code for authenticator app"
                className="w-48 h-48"
              />
            </div>
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Can't scan? Enter this key manually:
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="px-3 py-2 bg-muted rounded-md text-sm font-mono break-all">
                {enrollmentData.totp.secret}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopySecret}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Verification */}
          <div className="space-y-4">
            <p className="text-sm text-center font-medium">
              Enter the 6-digit code from your authenticator app:
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={handleVerify}
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
                "Verify & Enable 2FA"
              )}
            </Button>
          </div>

          {/* Supported Apps */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Recommended authenticator apps: Google Authenticator, Authy,
              1Password, Microsoft Authenticator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MfaSetup;
