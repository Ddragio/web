'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function DashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) { router.push('/login'); return; }
        if (user) fetchEnrollments();
    }, [user, authLoading]);

    const fetchEnrollments = async () => {
        try {
            const res = await api.getMyEnrollments();
            setEnrollments(res.enrollments || []);
        } catch {
            setEnrollments([
                { id: '1', course: { id: 'c1', title: 'BPSC Complete Course', thumbnail: '', _count: { lectures: 120 } }, completedLectures: 45, enrolledAt: '2025-01-15' },
                { id: '2', course: { id: 'c2', title: 'UPSC Prelims Foundation', thumbnail: '', _count: { lectures: 200 } }, completedLectures: 12, enrolledAt: '2025-02-01' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-10">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-3xl font-bold text-white">Welcome, {user?.name || 'Student'}! 👋</h1>
                    <p className="text-green-100 mt-1">Continue your learning journey</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Nav */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { href: '/dashboard', label: 'My Courses', icon: '📚', active: true },
                        { href: '/dashboard/purchases', label: 'Purchases', icon: '🧾', active: false },
                        { href: '/dashboard/profile', label: 'Profile', icon: '👤', active: false },
                        { href: '/courses', label: 'Browse Courses', icon: '🔍', active: false },
                    ].map((nav) => (
                        <Link key={nav.href} href={nav.href}
                            className={`p-4 rounded-xl text-center text-sm font-medium transition-all ${nav.active ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50 border'}`}>
                            <div className="text-2xl mb-1">{nav.icon}</div>
                            {nav.label}
                        </Link>
                    ))}
                </div>

                {/* My Courses */}
                <h2 className="text-xl font-bold text-gray-800 mb-4">My Courses</h2>
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => <div key={i} className="bg-white rounded-xl h-28 animate-pulse"></div>)}
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">📖</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No courses yet</h3>
                        <p className="text-gray-500 mb-4">Start your preparation journey by enrolling in a course</p>
                        <Link href="/courses" className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-xl">Browse Courses →</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {enrollments.map((enrollment) => {
                            const totalLectures = enrollment.course?._count?.lectures || 1;
                            const completed = enrollment.completedLectures || 0;
                            const pct = Math.round((completed / totalLectures) * 100);
                            return (
                                <Link key={enrollment.id} href={`/dashboard/courses/${enrollment.course?.id}`}
                                    className="block bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border border-gray-100 group">
                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <div className="w-full md:w-24 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                                            📚
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">{enrollment.course?.title}</h3>
                                            <p className="text-sm text-gray-500 mt-1">{completed} / {totalLectures} lectures completed</p>
                                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-green-600">{pct}%</span>
                                            <p className="text-xs text-gray-400">completed</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
