'use client';
import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            await api.forgotPassword(email);
            setSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl mx-auto flex items-center justify-center text-white text-2xl mb-3">🔒</div>
                        <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
                        <p className="text-gray-500 text-sm mt-1">Enter your email to receive a password reset OTP</p>
                    </div>

                    {sent ? (
                        <div className="text-center">
                            <div className="text-5xl mb-4">✉️</div>
                            <h2 className="text-lg font-bold text-green-700 mb-2">OTP Sent!</h2>
                            <p className="text-gray-500 text-sm mb-6">If an account exists with {email}, you will receive an OTP shortly.</p>
                            <Link href="/login" className="text-green-600 font-semibold hover:underline">← Back to Login</Link>
                        </div>
                    ) : (
                        <>
                            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="your@email.com" />
                                </div>
                                <button type="submit" disabled={loading}
                                    className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                                    {loading ? 'Sending OTP...' : 'Send OTP →'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-gray-500 mt-6">
                                <Link href="/login" className="text-green-600 font-semibold hover:underline">← Back to Login</Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
