import { useEffect } from "react";
import { Link } from "react-router-dom";

const WaitlisSignup = () => {
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    return () => {
      document.documentElement.classList.remove("scroll-smooth");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-900 via-base-800 to-base-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-base-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg md:text-xl font-bold text-white"
          >
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-gradient-to-r from-accent-blue to-accent-violet"></div>
            <span className="hidden sm:inline">Contact Journalists</span>
            <span className="sm:hidden">CJ</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4 px-4">
              Get Started with Contact Journalists
            </h1>
            <p className="text-slate-400 text-sm sm:text-base md:text-lg px-4">
              Join thousands of founders and PR professionals already on the
              waiting list
            </p>
          </div>

          {/* Signup Form - No box, fully scrollable */}
          <div className="w-full">
            <iframe
              src="https://db7e141b.sibforms.com/serve/MUIFAPKrP2-iluwefSnbYlralRVJwVTg5JsapICIh2S3c7zx02ZVsXIqSv2V3mCoa5Pb7J-i2IUP5q43_clX1SbPI96Dcun6n3H4zsNtr0QyHsIN4yJMkuYSXeOqq-fnlbiZ-tYEKOKoP7MjBWLIND58dEEJPf0VtcgtWTtRJOEQOg2poTc-bkICmPLMvs9MejgfNkxP8YJY_nLD"
              frameBorder="0"
              scrolling="auto"
              allowFullScreen
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "100%",
                width: "100%",
                minHeight: "800px",
              }}
              className="w-full border-0"
            ></iframe>
          </div>

          {/* Bottom CTA */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-400">
              Questions? Ping us a message at{" "}
              <a
                href="mailto:hello@contactjournalists.com"
                className="text-accent-blue hover:underline"
              >
                hello@contactjournalists.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WaitlisSignup;
