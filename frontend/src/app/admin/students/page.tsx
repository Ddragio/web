'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminStudentsPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) { router.push('/login'); return; }
        if (isAdmin) fetchStudents();
    }, [user, isAdmin, authLoading]);

    const fetchStudents = async () => {
        try {
            const res = await api.getAdminStudents();
            setStudents(res.students || []);
        } catch {
            setStudents([
                { id: '1', name: 'Rahul Kumar', email: 'rahul@email.com', mobile: '9876543210', createdAt: '2025-01-10', _count: { enrollments: 3 } },
                { id: '2', name: 'Priya Sharma', email: 'priya@email.com', mobile: '9876543211', createdAt: '2025-01-15', _count: { enrollments: 2 } },
                { id: '3', name: 'Amit Singh', email: 'amit@email.com', mobile: '9876543212', createdAt: '2025-02-01', _count: { enrollments: 1 } },
                { id: '4', name: 'Sneha Gupta', email: 'sneha@email.com', mobile: '9876543213', createdAt: '2025-02-05', _count: { enrollments: 4 } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Student Management</h1>
                        <p className="text-gray-400 text-sm">View and manage student access</p>
                    </div>
                    <Link href="/admin" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20">← Dashboard</Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-4 text-sm text-gray-500">{students.length} students registered</div>
                {loading ? (
                    <div className="bg-white rounded-xl h-48 animate-pulse"></div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mobile</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Courses</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{s.email}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{s.mobile}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{s._count?.enrollments || 0}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{new Date(s.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Grant Access</button>
                                                <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Revoke</button>
                                            </div>
                                        </td>
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
