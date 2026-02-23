'use client';
import { useState } from 'react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-lg text-green-100">हमसे संपर्क करें — We&apos;re here to help!</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                        {submitted ? (
                            <div className="text-center py-8">
                                <div className="text-5xl mb-4">✅</div>
                                <h3 className="text-lg font-bold text-green-700">Message Sent!</h3>
                                <p className="text-gray-500 mt-2">We&apos;ll get back to you within 24 hours.</p>
                                <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); }}
                                    className="mt-4 px-4 py-2 text-green-600 hover:underline text-sm">Send another message</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Your name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="your@email.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="How can we help you?" />
                                </div>
                                <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                                    Send Message →
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                            <div className="space-y-4">
                                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl">💬</div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">WhatsApp</h3>
                                        <p className="text-sm text-gray-500">+91 99999 99999</p>
                                    </div>
                                </a>
                                <a href="https://t.me/gyansammaan" target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl">📱</div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Telegram Group</h3>
                                        <p className="text-sm text-gray-500">@gyansammaan</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-xl">
                                    <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl">📧</div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Email</h3>
                                        <p className="text-sm text-gray-500">support@gyansammaan.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl">📍</div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Address</h3>
                                        <p className="text-sm text-gray-500">Patna, Bihar, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
