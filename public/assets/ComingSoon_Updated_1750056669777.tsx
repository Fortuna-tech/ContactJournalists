import { useEffect, useState } from "react";

const ComingSoon = () => {
  const [signupCount, setSignupCount] = useState(1048);

  useEffect(() => {
    // Fetch real signup count from Google Sheets
    const fetchSignupCount = async () => {
      try {
        const response = await fetch('/api/signup-count');
        const data = await response.json();
        setSignupCount(data.count);
      } catch (error) {
        console.error('Error fetching signup count:', error);
      }
    };

    fetchSignupCount();
    
    // Update count every 30 seconds
    const interval = setInterval(fetchSignupCount, 30000);
    
    // JotForm loads directly via iframe - no script needed
    
    return () => clearInterval(interval);
  }, []);



  return (
    <div className="mobile-optimized-container">
      {/* Launch Toolbar */}
      <div 
        onClick={() => {
          const signupSection = document.getElementById('signup-form');
          if (signupSection) {
            signupSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="launch-toolbar"
      >
        💻 Launching August 2025 — Claim free early access while we're still in beta
      </div>

      {/* Main Container */}
      <div className="main-container">

        {/* Header */}
        <h1 className="main-title">
          ContactJournalists.com
        </h1>

        <p className="subtitle">
          Reach Journalists & TV Execs Instantly · Send Pitches That Get Picked Up · Score Free PR Worth £££
        </p>

        {/* Media Logos Section */}
        <div className="media-logos-section">
          <p className="media-text">Featured in publications like:</p>
          <div className="media-logos">
            <div className="media-logo">
              <img src="https://i.ibb.co/9gbXMpq/bbc-logo.png" alt="BBC" />
            </div>
            <div className="media-logo">
              <img src="https://i.ibb.co/5GvVrGG/forbes-logo.png" alt="Forbes" />
            </div>
            <div className="media-logo">
              <img src="https://i.ibb.co/kHZJHF4/cnn-logo.png" alt="CNN" />
            </div>
            <div className="media-logo">
              <img src="https://i.ibb.co/WyqXbhP/vogue-logo.png" alt="Vogue" />
            </div>
            <div className="media-logo">
              <img src="https://i.ibb.co/9wLLvPY/guardian-logo.png" alt="The Guardian" />
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="ticker">
          📈 Email Sign Ups: {signupCount.toLocaleString()} (And Counting)
        </div>

        {/* Steps Row */}
        <div className="steps-container">
          <div className="step-card">
            <div className="step-icon">🔍</div>
            <div className="step-text">Search 10,000+ Journalists</div>
          </div>
          <div className="step-card">
            <div className="step-icon">✉️</div>
            <div className="step-text">Send Your Pitch</div>
          </div>
          <div className="step-card">
            <div className="step-icon">🎯</div>
            <div className="step-text">Get Free PR</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🔍</span>
            Instantly access top UK journalists and bloggers
          </div>
          <div className="feature-card">
            <span className="feature-icon">🧠</span>
            Generate expert AI-powered press pitches in seconds
          </div>
          <div className="feature-card">
            <span className="feature-icon">📥</span>
            Download press lists. No faff. No fluff. Just results.
          </div>
          <div className="feature-card">
            <span className="feature-icon">📬</span>
            Media leads delivered direct to your inbox
          </div>
        </div>

        {/* Why Join Beta */}
        <h2 className="section-title">
          Why Join Our Beta?
        </h2>

        <ul className="benefits-list">
          <li>✅ Access exclusive tools before public launch</li>
          <li>🚀 Be first in line to send PR pitches with AI</li>
          <li>💌 Join a curated directory of brands getting press</li>
          <li>📣 Your feedback helps shape the future of media outreach</li>
        </ul>

        {/* Signup Form */}
        <h2 id="signup-form" className="signup-title">
          Be The First To Hear When We Go Live
        </h2>

        
<div className="jotform-container">
  <iframe
    data-tally-src="https://tally.so/embed/w2g0yb?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
    loading="lazy"
    width="100%"
    height="200"
    frameBorder="0"
    marginHeight={0}
    marginWidth={0}
    title="Contact Journalists"
  ></iframe>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        var d=document,w="https://tally.so/widgets/embed.js",v=function(){
          "undefined"!=typeof Tally?Tally.loadEmbeds():
          d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function(e){
            e.src=e.dataset.tallySrc
          })
        };
        if("undefined"!=typeof Tally)v();
        else if(d.querySelector('script[src="'+w+'"]')==null){
          var s=d.createElement("script");
          s.src=w,s.onload=v,s.onerror=v,d.body.appendChild(s);
        }
      `,
    }}
  />
</div>

      </div>

      {/* GDPR & Data Usage Disclaimer */}
      <section className="bg-gray-100 p-6 rounded-xl shadow-md mt-10 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">🛡️ GDPR & Data Usage Disclaimer</h2>
        <p className="mb-3">
          At <strong>ContactJournalists.com</strong>, we collect <strong>publicly available contact information</strong> of journalists, bloggers, and media professionals to help businesses, startups, and PR teams connect with the right people — <strong>without spending hours searching online</strong>.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li><strong>✅ We only collect contact details</strong> that are already made public by the journalist themselves (e.g. publisher websites, Twitter bios, personal portfolios).</li>
          <li><strong>✅ No private data scraping:</strong> We never access or sell personal data from private sources or behind logins.</li>
          <li><strong>✅ Opt-out anytime:</strong> Journalists can email us at <a href="mailto:hello@contactjournalists.com" className="text-blue-600 underline">hello@contactjournalists.com</a> and we'll remove their details within 48 hours.</li>
          <li><strong>✅ Purpose-limited:</strong> The data is used solely to facilitate media outreach — not for spam or mass marketing.</li>
        </ul>
        <p>
          Our goal is to <strong>make outreach easier, faster, and fairer</strong> — while fully respecting the rights of journalists and the information they choose to share publicly.
        </p>
        <p className="mt-3 text-sm text-gray-600">
          Questions? Contact us at <a href="mailto:hello@contactjournalists.com" className="text-blue-600 underline">hello@contactjournalists.com</a>.
        </p>
      </section>

      <style>{`
        .mobile-optimized-container {
          background-color: #fffdfa;
          color: #111827;
          min-height: 100vh;
          font-family: 'Outfit', sans-serif;
        }

        .launch-toolbar {
          width: 100%;
          background: #ff3366;
          color: #fff;
          text-align: center;
          font-weight: 400;
          padding: 0.75rem 1rem;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          cursor: pointer;
          font-size: 0.8rem;
          animation: slideInFromTop 0.6s ease-out;
          transition: all 0.3s ease;
        }

        .launch-toolbar:hover {
          background: #e6295a;
          transform: translateY(2px);
        }

        

        .main-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 5rem;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .main-title {
          font-size: 1.6rem;
          color: #111;
          font-weight: 800;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          line-height: 1.2;
          word-break: break-word;
          animation: fadeInUp 1s ease-out 0.5s both;
          position: relative;
        }

        .main-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 3px;
          background: linear-gradient(90deg, #ff3366, #8b5cf6);
          border-radius: 2px;
          animation: expandLine 1.2s ease-out 1s both;
        }

        .subtitle {
          font-size: 0.9rem;
          font-weight: 400;
          margin-top: 0.5rem;
          line-height: 1.4;
          padding: 0 0.5rem;
          animation: fadeInUp 1s ease-out 0.7s both;
        }

        .media-logos-section {
          margin: 2rem 0;
          animation: fadeInUp 1s ease-out 0.9s both;
        }

        .media-text {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .media-logos {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .media-logo {
          opacity: 0.7;
          transition: all 0.3s ease;
          animation: float 3s ease-in-out infinite;
        }

        .media-logo:nth-child(1) { animation-delay: 0s; }
        .media-logo:nth-child(2) { animation-delay: 0.5s; }
        .media-logo:nth-child(3) { animation-delay: 1s; }
        .media-logo:nth-child(4) { animation-delay: 1.5s; }
        .media-logo:nth-child(5) { animation-delay: 2s; }

        .media-logo:hover {
          opacity: 1;
          transform: scale(1.1) translateY(-5px);
        }

        .media-logo img {
          height: 25px;
          width: auto;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }

        .media-logo:hover img {
          filter: grayscale(0%);
        }

        .ticker {
          background: #ff3366;
          color: black;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          border-radius: 6px;
          margin-top: 2rem;
          text-align: center;
          animation: fadeInUp 1s ease-out 0.9s both;
          transition: transform 0.3s ease;
        }

        .ticker:hover {
          transform: scale(1.05);
        }

        .steps-container {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 2.5rem;
          align-items: stretch;
          flex-wrap: wrap;
          width: 100%;
          padding: 0 0.5rem;
          animation: fadeInUp 1s ease-out 1.1s both;
        }

        .step-card {
          background: linear-gradient(135deg, #e0f7fa 0%, #e1bee7 100%);
          padding: 0.75rem 0.5rem;
          border-radius: 8px;
          text-align: center;
          width: 100px;
          min-height: 90px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          max-width: 120px;
          transition: all 0.3s ease;
          animation: slideInScale 0.6s ease-out calc(1.3s + var(--delay, 0s)) both;
        }

        .step-card:hover {
          transform: translateY(-10px) scale(1.05);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .step-card:nth-child(1) { --delay: 0s; }
        .step-card:nth-child(2) { --delay: 0.1s; }
        .step-card:nth-child(3) { --delay: 0.2s; }

        .step-icon {
          font-size: 1.4rem;
          margin-bottom: 0.4rem;
        }

        .step-text {
          font-size: 0.75rem;
          line-height: 1.2;
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.2rem;
          margin-top: 2.5rem;
          max-width: 100%;
          width: 100%;
          padding: 0 0.5rem;
        }

        .feature-card {
          background: linear-gradient(135deg, #b6fbff 0%, #83a4d4 100%);
          border-radius: 12px;
          padding: 1.2rem;
          font-size: 0.9rem;
          font-weight: 400;
          text-align: center;
          line-height: 1.4;
        }

        .feature-icon {
          font-size: 1.4rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .section-title {
          margin-top: 2.5rem;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
          line-height: 1.8;
          font-size: 0.85rem;
        }

        .signup-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-top: 3rem;
        }

        .jotform-container {
          margin-top: 2rem;
          max-width: 100%;
          width: 100%;
          padding: 1.5rem;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          animation: fadeInUp 1s ease-out 1.5s both;
          transition: all 0.3s ease;
          position: relative;
        }

        .jotform-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .jotform-container iframe {
          width: 100% !important;
          min-height: 300px;
          border: none !important;
          background: white !important;
          border-radius: 8px;
        }

        /* Tablet styles */
        @media (min-width: 768px) {
          .launch-toolbar {
            font-size: 1rem;
          }

          

          .main-container {
            padding: 4rem 2rem;
            padding-top: 6rem;
          }

          .main-title {
            font-size: 2.8rem;
          }

          .subtitle {
            font-size: 1.2rem;
            padding: 0;
          }

          .ticker {
            font-size: 1rem;
            padding: 0.6rem 1.2rem;
          }

          .steps-container {
            gap: 2rem;
            padding: 0;
          }

          .step-card {
            width: 180px;
            min-height: 120px;
            padding: 1rem;
          }

          .step-icon {
            font-size: 2rem;
          }

          .step-text {
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            max-width: 800px;
            padding: 0;
          }

          .feature-card {
            padding: 2rem;
            font-size: 1.1rem;
          }

          .feature-icon {
            font-size: 2rem;
          }

          .section-title {
            font-size: 1.4rem;
          }

          .benefits-list {
            font-size: 1rem;
          }

          .signup-title {
            font-size: 1.4rem;
          }

          .signup-form {
            max-width: 400px;
            padding: 0;
          }
        }

        /* Keyframe Animations */
        @keyframes slideInFromTop {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes expandLine {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 80px;
            opacity: 1;
          }
        }

        @keyframes slideInScale {
          from {
            transform: translateY(30px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;