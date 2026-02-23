'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

export default function AdminCoursesPage() {
    const { user, isAdmin, loading: authLoading } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', price: '', category: 'BPSC', language: 'HINDI', instructor: '' });

    useEffect(() => {
        if (!authLoading && (!user || !isAdmin)) { router.push('/login'); return; }
        if (isAdmin) fetchCourses();
    }, [user, isAdmin, authLoading]);

    const fetchCourses = async () => {
        try {
            const res = await api.getCourses();
            setCourses(res.courses || []);
        } catch {
            setCourses([
                { id: '1', title: 'BPSC Complete Course', price: 2999, category: 'BPSC', isPublished: true, _count: { lectures: 120, enrollments: 2340 } },
                { id: '2', title: 'UPSC Prelims Foundation', price: 4999, category: 'UPSC', isPublished: true, _count: { lectures: 200, enrollments: 1850 } },
                { id: '3', title: 'SSC CGL 2025', price: 1999, category: 'SSC', isPublished: false, _count: { lectures: 85, enrollments: 3100 } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createCourse(form);
            setShowForm(false);
            fetchCourses();
        } catch (err: any) {
            alert(err.message || 'Failed to create course');
        }
    };

    const handleDelete = async (courseId: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;
        try {
            await api.deleteCourse(courseId);
            setCourses((prev) => prev.filter((c) => c.id !== courseId));
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Course Management</h1>
                        <p className="text-gray-400 text-sm">Add, edit, and manage your courses</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/admin" className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20">← Dashboard</Link>
                        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">+ Add Course</button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Add Course Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Add New Course</h3>
                        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" placeholder="e.g. BPSC Complete Course" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm resize-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                                <input type="text" value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm">
                                    {['BPSC', 'UPSC', 'SSC', 'RAILWAY', 'BANKING'].map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="HINDI">Hindi</option>
                                    <option value="ENGLISH">English</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex gap-2">
                                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Create Course</button>
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Courses Table */}
                {loading ? (
                    <div className="bg-white rounded-xl h-48 animate-pulse"></div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Lectures</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Students</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {courses.map((c) => (
                                    <tr key={c.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{c.title}</td>
                                        <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{c.category}</span></td>
                                        <td className="px-4 py-3 text-sm text-gray-600">₹{c.price?.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{c._count?.lectures || 0}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{c._count?.enrollments || 0}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${c.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {c.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Edit</button>
                                                <button onClick={() => handleDelete(c.id)} className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">Delete</button>
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
