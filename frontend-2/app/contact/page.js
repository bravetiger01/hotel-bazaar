"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    states: '',
    subject: '',
    name: '',
    mail: '',
    subscribe: true
  });
  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const accessKey = 'b7daefe7-5123-4acd-86ce-3ccca501b2a7';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    return (
      formData.firstname.trim() &&
      formData.lastname.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.states &&
      formData.subject.trim()
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    setStatus('Sending...');
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        ...formData,
      }),
    });

    const result = await response.json();
    if (result.success) {
      setStatus('Message sent successfully!');
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        states: '',
        subject: '',
        name: '',
        mail: '',
        subscribe: true
      });
      setSubmitted(false);
    } else {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-10 text-[#0f172a]">
      <h1 className="text-3xl font-bold text-center text-[#0f172a]">Contact Us - Hotel Bazar</h1>

      <form onSubmit={handleSubmit} className="bg-purple-60 p-8 rounded-lg shadow space-y-6 border border-purple-200">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[#0f172a]">First Name</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded ${submitted && !formData.firstname ? 'border-red-500' : 'border-purple-300'} focus:outline-none focus:ring-2 focus:ring-purple-400 text-[#0f172a]`}
              placeholder="Your first name"
            />
            {submitted && !formData.firstname && <small className="text-red-500">Required</small>}
          </div>
          <div>
            <label className="block font-medium text-[#0f172a]">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded ${submitted && !formData.lastname ? 'border-red-500' : 'border-purple-300'} focus:outline-none focus:ring-2 focus:ring-purple-400 text-[#0f172a]`}
              placeholder="Your last name"
            />
            {submitted && !formData.lastname && <small className="text-red-500">Required</small>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-[#0f172a]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded ${submitted && !formData.email ? 'border-red-500' : 'border-purple-300'} focus:outline-none focus:ring-2 focus:ring-purple-400 text-[#0f172a]`}
              placeholder="Your email"
            />
            {submitted && !formData.email && <small className="text-red-500">Required</small>}
          </div>
          <div>
            <label className="block font-medium text-[#0f172a]">Phone Number</label>
            <PhoneInput
              country={'in'}
              value={formData.phone}
              onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
              inputProps={{ name: 'phone', required: true }}
              inputClass={`w-full px-4 py-[9px] border rounded ${submitted && !formData.phone ? 'border-red-500' : 'border-purple-300'} focus:outline-none text-[#0f172a]`}
              containerClass="w-full"
            />
            {submitted && !formData.phone && <small className="text-red-500">Required</small>}
          </div>
        </div>

        <div>
          <label className="block font-medium text-[#0f172a]">State</label>
          <select
            name="states"
            value={formData.states}
            onChange={handleChange}
            className={`w-full border px-4 py-2 rounded ${submitted && !formData.states ? 'border-red-500' : 'border-purple-300'} focus:outline-none focus:ring-2 focus:ring-purple-400 text-[#0f172a]`}
          >
            <option value="">Select state</option>
            {["Andhra Pradesh", "Assam", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Karnataka", "Kerala", "Maharashtra", "Rajasthan", "Tamil Nadu", "Uttar Pradesh", "West Bengal"].map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {submitted && !formData.states && <small className="text-red-500">Required</small>}
        </div>

        <div>
          <label className="block font-medium text-[#0f172a]">Message</label>
          <textarea
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Write something..."
            rows={5}
            className={`w-full border px-4 py-2 rounded ${submitted && !formData.subject ? 'border-red-500' : 'border-purple-300'} focus:outline-none focus:ring-2 focus:ring-purple-400 text-[#0f172a]`}
          ></textarea>
          {submitted && !formData.subject && <small className="text-red-500">Required</small>}
        </div>

        <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition">
          Submit
        </button>
        <p className="text-center font-medium text-[#0f172a]">{status}</p>
      </form>
    </div>
  );
}
