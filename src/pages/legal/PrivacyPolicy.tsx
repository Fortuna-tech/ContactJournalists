import { Helmet } from "react-helmet-async";
import PublicLayout from "@/layouts/PublicLayout";
import { blogTheme } from "@/styles/blogTheme";

const PrivacyPolicy = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Privacy Policy | ContactJournalists</title>
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl text-black mb-8" style={blogTheme.h1Style}>
          Privacy Policy
        </h1>

        <p className="text-sm text-slate-500 mb-8">Last updated: January 29th 2026</p>

        <div className="space-y-6 text-slate-600">
          <p>
            ContactJournalists.com is operated in the United Kingdom and complies with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>

          <p>
            ContactJournalists.com is the data controller responsible for the processing of personal data described in this policy.
          </p>

          <p>
            This Privacy Policy explains how we collect, use, and protect personal data.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Information we collect</h2>

          <p>We may collect and process the following information:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Name and email address</li>
            <li>Payment information processed securely by third-party providers</li>
            <li>Usage data such as pages visited or features used</li>
            <li>Communications sent to us</li>
          </ul>

          <p>We do not knowingly collect special category personal data.</p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>How we use personal data</h2>

          <p>Personal data is used to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Provide access to ContactJournalists.com</li>
            <li>Communicate with users about the service</li>
            <li>Send marketing emails where consent has been given</li>
            <li>Improve platform functionality and performance</li>
            <li>Maintain security and prevent misuse</li>
            <li>Meet legal and regulatory obligations</li>
          </ul>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Lawful basis for processing</h2>

          <p>Under UK GDPR, we process personal data using the following lawful bases:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Consent</li>
            <li>Legitimate interests</li>
            <li>Legal obligations</li>
          </ul>

          <p>Consent may be withdrawn at any time.</p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Journalist data</h2>

          <p>
            ContactJournalists.com provides access to journalist and media contact information that is publicly available and intended for professional outreach.
          </p>

          <p>
            Information about how journalist data and press requests are sourced is explained in the Privacy and Data page.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Data sharing</h2>

          <p>We do not sell personal data.</p>

          <p>
            Personal data may be shared with trusted third-party service providers, including payment processors, email services, and analytics providers. All third parties are required to comply with UK GDPR.
          </p>

          <p>
            Some service providers may process data outside the United Kingdom. Where this occurs, appropriate safeguards are in place in accordance with UK GDPR.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Data retention</h2>

          <p>
            Personal data is retained only for as long as necessary to operate the service or meet legal requirements.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Your rights</h2>

          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Access your personal data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent</li>
            <li>Object to processing</li>
            <li>Request data portability</li>
            <li>Lodge a complaint with the Information Commissioner's Office</li>
          </ul>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Children's data</h2>

          <p>
            ContactJournalists.com is not intended for use by children and we do not knowingly collect personal data from individuals under the age of 18.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Contact</h2>

          <p>For privacy-related enquiries:</p>
          <p>
            <a href="mailto:hello@contactjournalists.com" className="text-purple-600 hover:underline">
              hello@contactjournalists.com
            </a>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
