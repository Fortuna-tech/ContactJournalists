import { Helmet } from "react-helmet-async";
import PublicLayout from "@/layouts/PublicLayout";
import { blogTheme } from "@/styles/blogTheme";

const RequestRemoval = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Request Removal | ContactJournalists</title>
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl text-black mb-8" style={blogTheme.h1Style}>
          Contact
        </h1>

        <p className="text-sm text-slate-500 mb-8">Last updated: January 25th 2026</p>

        <div className="space-y-6 text-slate-600">
          <p>
            For general enquiries or data protection questions:
            <br />
            <a href="mailto:hello@contactjournalists.com" className="text-purple-600 hover:underline">
              hello@contactjournalists.com
            </a>
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Request Removal</h2>

          <p>
            If you are a journalist, writer, or content creator and would like your details removed from ContactJournalists.com, you can request this at any time.
            <br />
            We respect individual preferences and aim to keep all information accurate and up to date.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>Who this applies to</h2>

          <p>You can request removal if:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Your contact details appear on ContactJournalists.com</li>
            <li>You no longer wish to receive pitches or collaboration requests</li>
            <li>Your information is outdated or incorrect</li>
          </ul>

          <p>
            This applies whether your details were sourced from publicly available information or submitted previously.
          </p>

          <h2 className="text-xl sm:text-2xl text-black pt-6" style={blogTheme.h2Style}>How to request removal</h2>

          <p>Please email us with the following details:</p>
          <p>
            Email: <a href="mailto:hello@contactjournalists.com" className="text-purple-600 hover:underline">hello ( @ ) contactjournalists.com</a>
            <br />
            Subject line: Request Removal
          </p>

          <p>In your message, please include:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>The email address or contact details you want removed</li>
            <li>A link to where the information appears (if available)</li>
            <li>Any relevant context (optional)</li>
          </ul>

          <p>
            You do not need to create an account or provide additional personal information.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RequestRemoval;
