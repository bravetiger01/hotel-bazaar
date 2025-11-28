export default function About() {
  return (
    <main className="container mx-auto p-8 bg-white rounded-lg shadow-2xl mt-8 max-w-6xl">
      <h1 className="text-3xl font-semibold text-purple-800 mb-4">About Hotel Bazar</h1>
      <p className="mb-3">
        <strong>Hotel Bazar</strong> is your ultimate destination for high-quality chemicals, mops, and all essential housekeeping needs tailored specifically for the hospitality industry.
      </p>
      <p className="mb-3">
        We started our journey in 2025 with a clear vision: to become the most reliable and efficient bulk supplier for hotels, resorts, guesthouses, and other commercial establishments across India.
        We understand the unique demands of hotel maintenance and cleanliness, and our mission is to simplify your procurement process.
      </p>
      <ul className="mb-4 list-disc ml-6">
        <li>Top-grade products that meet stringent industry standards</li>
        <li>Extensive catalog including cleaning agents, durable mops, and specialized tools</li>
        <li>All available for bulk purchase</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 text-purple-700">Our Mission</h2>
      <p className="mb-3">
        Empower hotels and hospitality businesses by providing easy access to high-quality, cost-effective housekeeping chemicals and supplies, backed by exceptional service and reliable bulk delivery.
      </p>
      <h2 className="text-2xl font-bold mt-8 text-purple-700">Our Values</h2>
      <ul className="mb-4 list-disc ml-6">
        <li><strong>Quality Assurance:</strong> Only tested and proven products</li>
        <li><strong>Customer Centricity:</strong> Seamless ordering, timely delivery, responsive support</li>
        <li><strong>Reliability:</strong> Consistent product availability and dependable service</li>
        <li><strong>Efficiency:</strong> Streamlining your procurement</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 text-purple-700">Why Choose Hotel Bazar?</h2>
      <ul className="list-disc ml-6">
        <li><strong>Specialized Products:</strong> Curated for hotel housekeeping</li>
        <li><strong>Bulk Ordering:</strong> Minimum Order Quantity (MOQ) of 20 units</li>
        <li><strong>Competitive Pricing:</strong> Cost-effective solutions with quality</li>
        <li><strong>Dedicated Support:</strong> Help with product selection, orders, and after-sales</li>
      </ul>
      <hr className="my-6"/>
       <div className="mt-6">
            <a
              href="/contact"
              className="inline-block px-6 py-2 bg-[#6C5CE7] hover:bg-[#8D7EEF] text-white rounded-full shadow hover:-translate-y-1 transition animate-pulse"
            >
              Get in Touch with Us
            </a>
          </div>
    </main>
  );
}
