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
  return (
    <div className="p-8 rounded-2xl border border-accent-blue/30 bg-gradient-to-r from-accent-blue/10 to-accent-violet/10">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <p className="text-slate-300 mb-6">{description}</p>

      {/* Brevo Form Iframe */}
      <div className="w-full">
        <iframe
          width="540"
          height="305"
          src="https://db7e141b.sibforms.com/serve/MUIFAPKrP2-iluwefSnbYlralRVJwVTg5JsapICIh2S3c7zx02ZVsXIqSv2V3mCoa5Pb7J-i2IUP5q43_clX1SbPI96Dcun6n3H4zsNtr0QyHsIN4yJMkuYSXeOqq-fnlbiZ-tYEKOKoP7MjBWLIND58dEEJPf0VtcgtWTtRJOEQOg2poTc-bkICmPLMvs9MejgfNkxP8YJY_nLD"
          frameBorder="0"
          scrolling="auto"
          allowFullScreen
          style={{
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '100%',
            borderRadius: '0.5rem'
          }}
          title="P&L Template Download Form"
        ></iframe>
      </div>

      <p className="text-xs text-slate-500 mt-4">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}
