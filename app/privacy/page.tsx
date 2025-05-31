export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img
            src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
            alt="Carter Hales x BIGNERD"
            className="h-8 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Crown Royal Strategic Report Platform</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, access the Crown
            Royal Strategic Report, or contact us for support.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To authenticate your access to the strategic report</li>
            <li>To communicate with you about the service</li>
            <li>To improve our platform and user experience</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your
            consent, except as described in this policy.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:privacy@bignerd.solutions" className="text-blue-600 hover:underline">
              privacy@bignerd.solutions
            </a>
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
