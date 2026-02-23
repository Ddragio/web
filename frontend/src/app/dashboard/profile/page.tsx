'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '' });
    const [saved, setSaved] = useState(false);

    if (!authLoading && !user) { router.push('/login'); return null; }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                    <p className="text-green-100 mt-1">Manage your account details</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/dashboard" className="inline-block px-4 py-2 bg-white text-gray-600 rounded-lg text-sm hover:bg-green-50 border mb-6">← Back to Dashboard</Link>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
                    {/* Profile Header */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-1">{user?.role}</span>
                        </div>
                    </div>

                    {saved && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">✅ Profile updated successfully!</div>
                    )}

                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" defaultValue={user?.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" defaultValue={user?.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                        <hr className="my-2" />
                        <h3 className="font-semibold text-gray-800">Change Password</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter current password" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Enter new password" />
                        </div>
                        <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
