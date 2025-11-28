'use client';
export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto max-w-6xl bg-white rounded-lg shadow-2xl p-8 my-10">
      <h1 className="text-3xl font-bold text-purple-800 mb-5">Privacy Policy</h1>
      <p className="text-gray-500 italic mb-4">Last updated: July 28, 2025</p>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">1. Information We Collect</h2>
      <ul className="mb-2 list-disc ml-6">
        <li><b>Personal Identifiable Info (PII):</b> Name, email, shipping address, and phone number.</li>
        <li><b>Payment Info:</b> Processed by third-party gateways; not stored by us.</li>
        <li><b>Usage Data:</b> IP address, browser, pages visited, session duration.</li>
      </ul>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">2. How We Use Your Information</h2>
      <ul className="mb-2 list-disc ml-6">
        <li>Order processing and fulfillment.</li>
        <li>Dedicated customer support.</li>
        <li>Improve site functionality and product offerings.</li>
        <li>Send updates/offers/newsletters (if opted in).</li>
        <li>Prevent fraud and secure our platform.</li>
      </ul>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">3. Data Sharing and Disclosure</h2>
      <p className="mb-2">We do not sell or transfer PII without your explicit consent, except to trusted partners for processing, or as required by law.</p>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">4. Your Rights</h2>
      <p className="mb-2">You may access, update, or delete your personal info—manage via account settings or contact us.</p>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">5. Security of Your Data</h2>
      <p className="mb-2">We use industry-standard security, but no method is 100% secure online.</p>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">6. Changes to This Policy</h2>
      <p className="mb-2">Check this page for updates; policy may change periodically.</p>
      <h2 className="text-xl font-semibold text-purple-700 mb-2">7. Contact Us</h2>
      <p>Email: <a className="underline text-purple-700" href="mailto:hotelbazar2025@gmail.com">hotelbazar2025@gmail.com</a></p>
      <p>Phone: <a className="underline text-purple-700" href="tel:+919227448742">+91 9227448742</a>,{' '}
        <a className="underline text-purple-700" href="tel:+919227008742">+91 9227008742</a>
      </p>
    </main>
  );
}
