import { Helmet } from "react-helmet-async";
import PublicLayout from "@/layouts/PublicLayout";
import { blogTheme } from "@/styles/blogTheme";

const TermsOfService = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Terms of Service | ContactJournalists</title>
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl text-black mb-8" style={blogTheme.h1Style}>
          Terms of Service
        </h1>

        <p className="text-sm text-slate-500 mb-8">Last updated: January 29th 2026</p>

        <div className="space-y-6 text-slate-600">
          <p>
            By using ContactJournalists.com, you agree to these Terms of Service.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Use of the service</h2>

          <p>
            You agree to use the platform lawfully and responsibly. You must not misuse data, attempt unauthorised access, or engage in unlawful or abusive activity.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Access</h2>

          <p>
            We reserve the right to suspend or restrict access where misuse or unlawful activity is identified.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Payments</h2>

          <p>
            Subscriptions are billed in advance. You may cancel at any time. Access continues until the end of the current billing period.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Intellectual property</h2>

          <p>
            All content, software, branding, and materials on ContactJournalists.com are owned by or licensed to us and may not be reused without permission.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Liability</h2>

          <p>
            The service is provided as available. We do not guarantee uninterrupted access or specific outcomes from use of the platform.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Governing law</h2>

          <p>
            These terms are governed by the laws of England and Wales.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;
