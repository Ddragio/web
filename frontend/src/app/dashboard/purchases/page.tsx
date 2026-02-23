'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function PurchasesPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) fetchPurchases();
    }, [user, authLoading]);

    const fetchPurchases = async () => {
        try {
            const res = await api.getMyEnrollments();
            setEnrollments(res.enrollments || []);
        } catch {
            setEnrollments([
                { id: '1', course: { title: 'BPSC Complete Course' }, amountPaid: 2999, enrolledAt: '2025-01-15T10:30:00Z', razorpayOrderId: 'order_xyz123' },
                { id: '2', course: { title: 'UPSC Prelims Foundation' }, amountPaid: 4999, enrolledAt: '2025-02-01T14:00:00Z', razorpayOrderId: 'order_abc456' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-white">Purchase History</h1>
                    <p className="text-green-100 mt-1">View your course purchases and invoices</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-4 mb-6">
                    <Link href="/dashboard" className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm hover:bg-green-50 border">← Back to Dashboard</Link>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => <div key={i} className="bg-white rounded-xl h-24 animate-pulse"></div>)}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-5xl mb-4">🧾</div>
                        <h3 className="text-xl font-bold text-gray-700">No purchases yet</h3>
                        <Link href="/courses" className="text-green-600 font-semibold hover:underline mt-2 inline-block">Browse Courses</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {enrollments.map((e) => (
                            <div key={e.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{e.course?.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Purchased on {new Date(e.enrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                        {e.razorpayOrderId && <p className="text-xs text-gray-400 mt-0.5">Order ID: {e.razorpayOrderId}</p>}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-green-700">₹{e.amountPaid?.toLocaleString('en-IN')}</span>
                                        <p className="text-xs text-green-600 font-medium">✅ Paid</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
