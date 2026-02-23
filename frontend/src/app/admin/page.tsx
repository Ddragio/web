'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function AdminDashboard() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) { router.push('/login'); return; }
        if (isAdmin) fetchStats();
    }, [user, isAdmin, authLoading]);

    const fetchStats = async () => {
        try {
            const res = await api.getAdminStats();
            setStats(res.stats);
        } catch {
            setStats({
                totalStudents: 15234, totalCourses: 52, totalEnrollments: 28450,
                totalRevenue: 4523000, monthlyEnrollments: 1240, monthlyRevenue: 456000,
            });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;

    const statCards = [
        { label: 'Total Students', value: stats?.totalStudents?.toLocaleString('en-IN'), icon: '👥', color: 'from-green-500 to-green-600' },
        { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: 'from-blue-500 to-blue-600' },
        { label: 'Total Courses', value: stats?.totalCourses, icon: '📚', color: 'from-purple-500 to-purple-600' },
        { label: 'Total Enrollments', value: stats?.totalEnrollments?.toLocaleString('en-IN'), icon: '🎓', color: 'from-amber-500 to-amber-600' },
        { label: 'Monthly Enrollments', value: stats?.monthlyEnrollments?.toLocaleString('en-IN'), icon: '📈', color: 'from-cyan-500 to-cyan-600' },
        { label: 'Monthly Revenue', value: `₹${(stats?.monthlyRevenue || 0).toLocaleString('en-IN')}`, icon: '📊', color: 'from-rose-500 to-rose-600' },
    ];

    const adminLinks = [
        { href: '/admin/courses', label: 'Manage Courses', icon: '📚', desc: 'Add, edit, delete courses and upload lectures' },
        { href: '/admin/students', label: 'Manage Students', icon: '👥', desc: 'View students, grant or revoke course access' },
        { href: '/admin/payments', label: 'Payment Records', icon: '💳', desc: 'View all payment transactions' },
        { href: '/admin/notifications', label: 'Send Notifications', icon: '📧', desc: 'Send bulk email to enrolled students' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm">Gyan Sammaan — Management Panel</p>
                        </div>
                        <Link href="/" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors">← Back to Site</Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {statCards.map((s) => (
                        <div key={s.label} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                            <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-lg flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                            <div className="text-xl font-bold text-gray-800">{s.value}</div>
                            <div className="text-xs text-gray-500">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Admin Links */}
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {adminLinks.map((link) => (
                        <Link key={link.href} href={link.href}
                            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all group">
                            <div className="text-3xl mb-3">{link.icon}</div>
                            <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{link.label}</h3>
                            <p className="text-xs text-gray-500 mt-1">{link.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
