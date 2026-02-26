export const metadata = {
  title: "Privacy Policy | MAPRIMO Technologies",
};

export default function PrivacyPage() {
  return (
    <div className="container py-24 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>At MAPRIMO Technologies, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information you provide directly to us via our contact forms, including your name, email address, company name, and any message you send us.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use your information solely to respond to your inquiries and provide our services. We do not sell or share your personal information with third parties for marketing purposes.</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Security</h2>
        <p>We implement reasonable security measures to protect your information, but no method of transmission over the internet is 100% secure.</p>
      </div>
    </div>
  );
}
