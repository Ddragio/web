'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';

export default function VideoPlayerPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [activeLecture, setActiveLecture] = useState<any>(null);
    const [progress, setProgress] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            const [courseRes, progressRes] = await Promise.all([
                api.getCourse(id as string),
                api.getCourseProgress(id as string),
            ]);
            setCourse(courseRes.course);
            setProgress(progressRes.completedLectureIds || []);
            if (courseRes.course?.lectures?.length > 0) {
                setActiveLecture(courseRes.course.lectures[0]);
            }
        } catch {
            setCourse({
                id, title: 'BPSC Complete Course', lectures: [
                    { id: 'l1', title: 'Introduction to BPSC', order: 1, isFree: true, duration: 1800 },
                    { id: 'l2', title: 'Indian History — Ancient', order: 2, isFree: false, duration: 3600 },
                    { id: 'l3', title: 'Indian History — Medieval', order: 3, isFree: false, duration: 3200 },
                    { id: 'l4', title: 'Indian Geography', order: 4, isFree: false, duration: 2800 },
                    { id: 'l5', title: 'Indian Polity', order: 5, isFree: false, duration: 3400 },
                ],
            });
            setActiveLecture({ id: 'l1', title: 'Introduction to BPSC', order: 1, isFree: true, duration: 1800 });
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async (lectureId: string) => {
        try {
            await api.markComplete(lectureId);
            setProgress((prev) => [...prev, lectureId]);
        } catch { }
    };

    const navigateLecture = (direction: 'prev' | 'next') => {
        if (!course?.lectures || !activeLecture) return;
        const idx = course.lectures.findIndex((l: any) => l.id === activeLecture.id);
        const newIdx = direction === 'prev' ? idx - 1 : idx + 1;
        if (newIdx >= 0 && newIdx < course.lectures.length) {
            setActiveLecture(course.lectures[newIdx]);
        }
    };

    const formatDuration = (s: number) => { const m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`; };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;

    const currentIdx = course?.lectures?.findIndex((l: any) => l.id === activeLecture?.id) ?? 0;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex flex-col lg:flex-row">
                {/* Video Player */}
                <div className="flex-1">
                    {/* Player Area */}
                    <div className="bg-black aspect-video flex items-center justify-center relative">
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4">▶️</div>
                            <p className="text-lg font-medium">{activeLecture?.title}</p>
                            <p className="text-sm text-gray-400 mt-1">Video player will load with S3 signed URL</p>
                        </div>
                        {/* Prevent right-click */}
                        <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()}></div>
                    </div>

                    {/* Controls */}
                    <div className="bg-white p-4 border-b">
                        <div className="flex items-center justify-between max-w-4xl mx-auto">
                            <button onClick={() => navigateLecture('prev')} disabled={currentIdx <= 0}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium disabled:opacity-30 transition-colors">
                                ← Previous
                            </button>
                            <div className="text-center">
                                <h2 className="font-bold text-gray-800">{activeLecture?.title}</h2>
                                <p className="text-xs text-gray-500">Lecture {currentIdx + 1} of {course?.lectures?.length}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!progress.includes(activeLecture?.id) ? (
                                    <button onClick={() => markComplete(activeLecture?.id)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                        ✓ Mark Complete
                                    </button>
                                ) : (
                                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">✅ Completed</span>
                                )}
                                <button onClick={() => navigateLecture('next')} disabled={currentIdx >= (course?.lectures?.length || 0) - 1}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium disabled:opacity-30 transition-colors">
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="p-6 max-w-4xl mx-auto">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="font-bold text-gray-800 mb-3">📝 Lecture Notes</h3>
                            <p className="text-sm text-gray-500 mb-4">Download notes for this lecture to study offline.</p>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                                📥 Download Notes PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lecture Sidebar */}
                <div className="lg:w-80 bg-white border-l overflow-y-auto max-h-screen lg:sticky lg:top-16">
                    <div className="p-4 border-b bg-green-50">
                        <h3 className="font-bold text-gray-800 text-sm">{course?.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{progress.length} / {course?.lectures?.length || 0} completed</p>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${course?.lectures?.length ? (progress.length / course.lectures.length) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                    <div className="divide-y">
                        {course?.lectures?.map((lecture: any, i: number) => (
                            <button key={lecture.id} onClick={() => setActiveLecture(lecture)}
                                className={`w-full text-left p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${activeLecture?.id === lecture.id ? 'bg-green-50 border-l-4 border-green-600' : ''}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${progress.includes(lecture.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {progress.includes(lecture.id) ? '✓' : i + 1}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-sm font-medium ${activeLecture?.id === lecture.id ? 'text-green-700' : 'text-gray-700'}`}>{lecture.title}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{formatDuration(lecture.duration)}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
