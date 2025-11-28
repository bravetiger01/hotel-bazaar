import React from "react";

export default function SupportPage() {
  return (
    <div className="bg-[#F8F4FF] min-h-screen">

      {/* Main Content */}
      <main className="py-10 px-4">
        <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          
          <h1 className="text-3xl text-center font-bold text-purple-700 ] mb-5">Support Page</h1>
          <h2 className="text-3xl font-semibold text-center text-[#4A2B7F] mb-6 relative after:absolute after:content-[''] after:left-1/2 after:-translate-x-1/2 after:bottom-0 after:w-16 after:h-1 after:bg-[#D3A7FF] after:rounded"></h2>
          
          <p className="text-gray-700 mb-6 text-base space-y-6">
            We&apos;re dedicated to providing the best support for your hospitality needs of
            chemical and housekeeping needs. Please find answers to common questions
            below or contact us directly.
          </p>

          <h3 className="text-xl font-semibold text-[#6C5CE7] border-b pb-2 mb-4">Frequently Asked Questions (FAQs)</h3>

          {faqItems.map((faq, index) => (
            <div key={index} className="mb-6 p-5 bg-[#fcfaff] border-l-4 border-[#D3A7FF] rounded hover:shadow-md transition">
              <h4 className="text-lg font-semibold text-[#4A2B7F] mb-2">Q: {faq.question}</h4>
              <p className="text-gray-700 text-base">A: {faq.answer}</p>
            </div>
          ))}

          <h3 className="text-xl font-semibold text-[#6C5CE7] border-b pb-2 mt-10 mb-4">Contact Our Support Team</h3>

          <p className="text-gray-700 mb-4">
            For any queries, assistance, or technical support, our team is ready to help:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:hotelbazar2025@gmail.com" className="text-[#6C5CE7] hover:underline">
                hotelbazar2025@gmail.com
              </a>
            </li>
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:+919227448742" className="text-[#6C5CE7] hover:underline">+91 9227448742</a>,{" "}
              <a href="tel:+919227008742" className="text-[#6C5CE7] hover:underline">+91 9227008742</a>
            </li>
          </ul>

          <p className="text-gray-700 mt-4">
            We aim to respond to all email inquiries within 24-48 business hours.
          </p>

          <div className="mt-6">
            <a
              href="/contact"
              className="inline-block px-6 py-2 bg-[#6C5CE7] hover:bg-[#8D7EEF] text-white rounded-full shadow hover:-translate-y-1 transition animate-pulse"
            >
              Send Us a Message
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

const faqItems = [
  {
    question: "What types of chemicals and housekeeping items can I order?",
    answer:
      "Hotel Bazar specializes in providing a wide range of industrial-grade cleaning chemicals, mops, brushes, and various housekeeping supplies specifically tailored for hotel use. You can view our full product catalog on the Products page.",
  },
  {
    question: "What is the Minimum Order Quantity (MOQ) for bulk orders?",
    answer:
      "Our Minimum Order Quantity (MOQ) for most products is 20 units. However, this may vary for certain specialized chemicals or equipment. Please refer to individual product pages or contact us for specific MOQs on custom orders.",
  },
  {
    question: "How can I place a bulk order?",
    answer:
      "You can place a bulk order directly through our website by adding items to your cart, or for custom requirements and large quantities, please fill out the form or subscribe to our mail or contact our sales team directly.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is dispatched, you will receive a shipping confirmation email with a tracking number. You can use this number on the respective courier service's website to track your shipment. Please allow 24-48 hours for tracking information to update.",
  },
  {
    question: "What is your return policy for damaged or incorrect products?",
    answer:
      "We offer a 7-day return policy for damaged or incorrect products. Please refer to our detailed Shipping & Returns policy page for complete information on eligibility, process, and refunds.",
  },
];
