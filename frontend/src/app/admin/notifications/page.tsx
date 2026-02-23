'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminNotificationsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ courseId: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    if (!authLoading && (!user || !isAdmin)) {
        router.push('/login');
        return null;
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSending(true);
            await api.sendNotification(form);
            setSent(true);
            setForm({ courseId: '', subject: '', message: '' });
        } catch (err: any) {
            alert(err.message || 'Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Send Notifications</h1>
                        <p className="text-gray-400 text-sm">Send bulk email to enrolled students</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20">← Dashboard</Link>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    {sent ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-bold text-green-700 mb-2">Notification Sent!</h3>
                            <p className="text-gray-500 mb-4">Email has been sent to all enrolled students of the selected course.</p>
                            <button onClick={() => setSent(false)} className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Send Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSend} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                                <input type="text" required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter course ID to send to its students" />
                                <p className="text-xs text-gray-400 mt-1">All enrolled students of this course will receive the notification</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                                <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g. New lecture uploaded!" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea rows={6} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" placeholder="Write your message here..." />
                            </div>
                            <button type="submit" disabled={sending}
                                className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                                {sending ? 'Sending...' : '📧 Send Notification'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
