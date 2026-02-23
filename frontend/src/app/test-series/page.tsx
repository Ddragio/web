'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function TestSeriesPage() {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await api.getTestSeries();
                setTests(res.testSeries || []);
            } catch {
                setTests([
                    { id: '1', title: 'BPSC Prelims Mock Test Series 2025', totalQuestions: 150, duration: 120, course: { title: 'BPSC', category: 'BPSC' }, _count: { testAttempts: 3200 } },
                    { id: '2', title: 'UPSC CSAT Practice Set', totalQuestions: 80, duration: 60, course: { title: 'UPSC', category: 'UPSC' }, _count: { testAttempts: 2100 } },
                    { id: '3', title: 'SSC CGL Tier-I Full Mock', totalQuestions: 100, duration: 90, course: { title: 'SSC', category: 'SSC' }, _count: { testAttempts: 4500 } },
                    { id: '4', title: 'Railway NTPC CBT-1 Practice', totalQuestions: 100, duration: 90, course: { title: 'Railway', category: 'RAILWAY' }, _count: { testAttempts: 5800 } },
                    { id: '5', title: 'Bank PO Prelims Mock Test', totalQuestions: 100, duration: 60, course: { title: 'Banking', category: 'BANKING' }, _count: { testAttempts: 2800 } },
                    { id: '6', title: 'Bihar GK Special Test', totalQuestions: 50, duration: 30, course: { title: 'BPSC', category: 'BPSC' }, _count: { testAttempts: 6200 } },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Test Series</h1>
                    <p className="text-green-100">Practice with exam-pattern mock tests and track your progress</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {loading ? (
                    <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map((test) => (
                            <div key={test.id} className="bg-white rounded-xl shadow-md p-6 card-hover border border-gray-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                        {test.course?.category || 'GENERAL'}
                                    </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg mb-3">{test.title}</h3>
                                <div className="space-y-2 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span>📝</span> {test.totalQuestions} Questions
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>⏱️</span> {test.duration} Minutes
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span>👥</span> {test._count?.testAttempts?.toLocaleString('en-IN')} Attempts
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all text-sm">
                                    Start Test →
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
