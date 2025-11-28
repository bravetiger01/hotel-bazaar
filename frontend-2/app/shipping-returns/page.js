'use client';

export default function ShippingReturns() {
  return (
    <main className="content-main py-8 px-4 lg:px-8 bg-purple-50 min-h-screen">
      <section className="container max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-purple-700 relative pb-3 mb-6">
          Shipping & Returns Policy
          <span className="block w-16 h-1 bg-purple-300 absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded"></span>
        </h2>
        <p className="text-sm italic text-center text-gray-500 mb-8">Last updated: July 28, 2025</p>

        {/* 1. Shipping Policy */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">1. Shipping Policy</h3>

          <h4 className="font-semibold text-purple-600">1.1. Processing Time</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Orders are processed within <strong>1-3 business days</strong> after payment.</li>
            <li>Bulk or custom orders may take longer; details will be shared upon order confirmation.</li>
          </ul>

          <h4 className="font-semibold text-purple-600">1.2. Delivery Time & Tracking</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>We use reliable courier services for delivery.</li>
            <li>Estimated delivery: <strong>3–7 business days</strong> in major cities; longer in remote areas.</li>
            <li>Tracking info will be emailed once the order is shipped.</li>
          </ul>

          <h4 className="font-semibold text-purple-600">1.3. Shipping Charges</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Calculated at checkout based on order weight, volume, and location.</li>
            <li>Free shipping offers will be shown during checkout (if applicable).</li>
          </ul>

          <h4 className="font-semibold text-purple-600">1.4. Delivery Issues</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li><strong>Wrong Address:</strong> Customer bears cost/delay for inaccurate addresses.</li>
            <li><strong>Missed Delivery:</strong> Follow courier instructions or attempt will be retried.</li>
            <li><strong>Damaged Package:</strong> Do <em>not</em> accept visibly damaged deliveries. Contact us with photos.</li>
          </ul>
        </section>

        {/* 2. Returns & Refunds */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">2. Returns & Refunds Policy</h3>

          <h4 className="font-semibold text-purple-600">2.1. 7-Day Return Policy</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Applies to products that are:
              <ul className="list-disc ml-6 mt-1 space-y-1">
                <li><strong>Damaged</strong> in transit</li>
                <li><strong>Incorrect</strong> item delivered</li>
                <li><strong>Defective</strong> item with manufacturing faults</li>
              </ul>
            </li>
            <li>Email <a href="mailto:hotelbazar2025@gmail.com" className="text-purple-600 underline">hotelbazar2025@gmail.com</a> with order details and photos/videos within 7 days.</li>
          </ul>

          <h4 className="font-semibold text-purple-600">2.2. Return Conditions</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Item must be unused and in original packaging.</li>
            <li>Valid proof of purchase is required.</li>
            <li>No returns accepted for issues outside our control (e.g., opened chemicals).</li>
          </ul>

          <h4 className="font-semibold text-purple-600">2.3. Return Process</h4>
          <ol className="list-decimal ml-6 mb-4 space-y-1">
            <li><strong>Contact Us</strong> via email with issue details and media proof.</li>
            <li><strong>Approval</strong> will be sent with return instructions.</li>
            <li><strong>Inspection</strong> of item post-return to approve/reject refund or replacement.</li>
          </ol>

          <h4 className="font-semibold text-purple-600">2.4. Refunds</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>If payment was made but order failed, email us immediately with transaction details.</li>
            <li>Approved refunds are processed to the original payment method in <strong>7–10 business days</strong>.</li>
            <li>Shipping charges are non-refundable unless the error was ours.</li>
          </ul>

          <h4 className="font-semibold text-purple-600">2.5. Non-Returnable Items</h4>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Opened or partially used chemicals (unless damaged on delivery).</li>
            <li>Products without original packaging.</li>
          </ul>
        </section>

        {/* 3. Responsibilities */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">3. Our Responsibilities & Limitations</h3>
          <p className="font-medium mb-1">We are responsible for:</p>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Delivering correct items in proper condition</li>
            <li>Secure packaging</li>
            <li>Processing valid returns/refunds</li>
          </ul>

          <p className="font-medium mb-1">We are <em>not</em> responsible for:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Improper use/storage of products</li>
            <li>Courier delays, strikes, holidays, or natural events</li>
            <li>Incorrect orders placed by customer</li>
            <li>Minor visual differences not affecting functionality</li>
          </ul>
        </section>

        {/* 4. Safety Protocols */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">4. Rules & Protocols for Product Use</h3>
          <ul className="list-disc ml-6 mb-4 space-y-1">
            <li>Read the <em>Manufacturer’s Instructions</em> and <em>SDS</em> before use.</li>
            <li>Use proper <em>PPE</em>: gloves, eye protection, masks.</li>
            <li>Ensure proper ventilation while storing/using chemicals.</li>
            <li>Store products safely and out of reach of children or untrained personnel.</li>
            <li>Dispose of chemicals responsibly per local regulations.</li>
            <li>Products are intended for <strong>commercial/hotel use only</strong>.</li>
          </ul>

          <p className="text-sm italic mt-2 text-gray-600">
            By purchasing from Hotel Bazar, you agree to follow these safety practices.
          </p>
        </section>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-4">
          <a href="/support" className="w-full md:w-auto px-6 py-3 rounded-full bg-purple-600 text-white font-semibold text-center hover:bg-purple-700 transition animate-pulse">
            Need More Help? Contact Support
          </a>
          <a href="/terms-conditions" className="w-full md:w-auto px-6 py-3 rounded-full border-2 border-purple-600 text-purple-700 font-semibold text-center hover:bg-purple-50 transition animate-pulse">
            Read Our Full Terms & Conditions
          </a>
        </div>
      </section>
    </main>
  );
}
