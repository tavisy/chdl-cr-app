export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <img
            src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
            alt="Carter Hales x BIGNERD"
            className="h-8 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600">Crown Royal Strategic Report Platform</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using the Crown Royal Strategic Report platform, you accept and agree to be bound by the
            terms and provision of this agreement.
          </p>

          <h2>Use License</h2>
          <p>
            Permission is granted to temporarily access the Crown Royal Strategic Report for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>

          <h2>Restrictions</h2>
          <ul>
            <li>You may not modify or copy the materials</li>
            <li>You may not use the materials for any commercial purpose</li>
            <li>You may not attempt to reverse engineer any software</li>
            <li>You may not remove any copyright or proprietary notations</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>
            The materials on this platform are provided on an 'as is' basis. BigNERD Solutions and Carter Hales Design
            Lab make no warranties, expressed or implied.
          </p>

          <h2>Limitations</h2>
          <p>
            In no event shall BigNERD Solutions, Carter Hales Design Lab, or their suppliers be liable for any damages
            arising out of the use or inability to use the materials.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@bignerd.solutions" className="text-blue-600 hover:underline">
              legal@bignerd.solutions
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
