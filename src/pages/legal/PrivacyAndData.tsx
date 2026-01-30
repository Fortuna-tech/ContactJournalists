import { Helmet } from "react-helmet-async";
import PublicLayout from "@/layouts/PublicLayout";
import { blogTheme } from "@/styles/blogTheme";

const PrivacyAndData = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Privacy and Data | ContactJournalists</title>
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl text-black mb-8" style={blogTheme.h1Style}>
          Privacy and Data
        </h1>

        <p className="text-sm text-slate-500 mb-8">Last updated: January 29th 2026</p>

        <div className="space-y-6 text-slate-600">
          <p>
            ContactJournalists.com is built to help founders connect with journalists while respecting privacy, transparency, and data protection.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>How press requests are sourced</h2>

          <p>ContactJournalists.com shares press and media requests from multiple sources.</p>

          <p>
            Most press requests are sourced from publicly available journalist requests, including those shared on public platforms, newsletters, and websites where journalists actively invite pitches.
          </p>

          <p>
            Some press requests are submitted directly by journalist members who choose to share opportunities with our audience.
          </p>

          <p>We do not fabricate press requests and we do not automate outreach on behalf of users.</p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Journalist database</h2>

          <p>ContactJournalists.com maintains a limited database of journalists, writers, and content creators.</p>

          <p>These contacts:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Have publicly available professional contact details</li>
            <li>Actively accept pitches, collaborations, or media enquiries</li>
            <li>Are sourced from public websites, portfolios, media pages, and similar sources</li>
          </ul>

          <p>We do not scrape private inboxes and we do not sell journalist contact data.</p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Removal and opt-out requests</h2>

          <p>Journalists may request the removal or correction of their contact details at any time.</p>

          <p>Removal requests can be sent to:</p>
          <p>
            <a href="mailto:hello@contactjournalists.com" className="text-purple-600 hover:underline">
              hello@contactjournalists.com
            </a>
          </p>

          <p>We aim to process valid removal requests within 5 business days.</p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Our approach to data protection</h2>

          <p>We:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Collect only data required to operate the service</li>
            <li>Limit access to personal data</li>
            <li>Use trusted third-party services</li>
            <li>Apply appropriate technical and organisational security measures</li>
            <li>Follow UK GDPR and ICO guidance</li>
          </ul>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyAndData;
