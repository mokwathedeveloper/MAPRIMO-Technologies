export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="container py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>By accessing this website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
        <p>Permission is granted to temporarily view the materials on MAPRIMO Technologies&apos; website for personal, non-commercial transitory viewing only.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
        <p>The materials on this website are provided on an &apos;as is&apos; basis. MAPRIMO Technologies makes no warranties, expressed or implied.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
        <p>In no event shall MAPRIMO Technologies or its suppliers be liable for any damages arising out of the use or inability to use the materials on the website.</p>
      </div>
    </div>
  );
}
