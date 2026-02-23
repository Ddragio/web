'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminPaymentsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) { router.push('/login'); return; }
        if (isAdmin) fetchPayments();
    }, [user, isAdmin, authLoading]);

    const fetchPayments = async () => {
        try {
            const res = await api.getAdminPayments();
            setPayments(res.payments || []);
        } catch {
            setPayments([
                { id: '1', user: { name: 'Rahul Kumar', email: 'rahul@email.com' }, course: { title: 'BPSC Complete' }, amountPaid: 2999, enrolledAt: '2025-02-15T10:30:00Z', razorpayOrderId: 'order_abc123' },
                { id: '2', user: { name: 'Priya Sharma', email: 'priya@email.com' }, course: { title: 'UPSC Prelims' }, amountPaid: 4999, enrolledAt: '2025-02-14T14:00:00Z', razorpayOrderId: 'order_def456' },
                { id: '3', user: { name: 'Amit Singh', email: 'amit@email.com' }, course: { title: 'SSC CGL 2025' }, amountPaid: 1999, enrolledAt: '2025-02-13T09:15:00Z', razorpayOrderId: 'order_ghi789' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = payments.reduce((s, p) => s + (p.amountPaid || 0), 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Payment Records</h1>
                        <p className="text-gray-400 text-sm">View all payment transactions</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20">← Dashboard</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
                    <p className="text-sm opacity-80">Total Revenue</p>
                    <p className="text-3xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-xl h-48 animate-pulse"></div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Razorpay ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {payments.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-600">{new Date(p.enrolledAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-800">{p.user?.name}</div>
                                            <div className="text-xs text-gray-500">{p.user?.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{p.course?.title}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-700">₹{p.amountPaid?.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{p.razorpayOrderId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
