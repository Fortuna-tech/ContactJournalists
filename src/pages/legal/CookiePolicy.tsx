import { Helmet } from "react-helmet-async";
import PublicLayout from "@/layouts/PublicLayout";
import { blogTheme } from "@/styles/blogTheme";

const CookiePolicy = () => {
  return (
    <PublicLayout>
      <Helmet>
        <title>Cookie Policy | ContactJournalists</title>
      </Helmet>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl text-black mb-8" style={blogTheme.h1Style}>
          Cookie Policy
        </h1>

        <p className="text-sm text-slate-500 mb-8">Last updated: January 25th 2026</p>

        <div className="space-y-6 text-slate-600">
          <p>
            ContactJournalists.com uses cookies to ensure the website functions correctly and to understand how it is used.
          </p>

          <p>Cookies may be used to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Enable essential site functionality</li>
            <li>Remember user preferences</li>
            <li>Analyse site usage and performance</li>
          </ul>

          <p>
            You can manage or disable cookies through your browser settings. Disabling cookies may affect site functionality.
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CookiePolicy;
