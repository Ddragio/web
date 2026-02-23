'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import api from '@/lib/api';
import Link from 'next/link';

export default function CourseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [openSyllabus, setOpenSyllabus] = useState<string[]>([]);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await api.getCourse(id as string);
            setCourse(res.course);
        } catch {
            // Mock data
            setCourse({
                id, title: 'BPSC Complete Course — 67th BPSC Special', description: 'This comprehensive course covers all aspects of BPSC examination preparation including General Studies, CSAT, and optional subjects. Our expert faculty will guide you through detailed video lectures, practice tests, and study material.\n\nइस कोर्स में BPSC परीक्षा की पूरी तैयारी कराई जाएगी। सभी विषयों को विस्तार से कवर किया गया है।',
                price: 2999, category: 'BPSC', language: 'HINDI', instructor: 'Dr. Rakesh Kumar', isPublished: true,
                _count: { enrollments: 2340 },
                lectures: [
                    { id: 'l1', title: 'Introduction to BPSC Exam Pattern', order: 1, isFree: true, duration: 1800 },
                    { id: 'l2', title: 'Indian History — Ancient India', order: 2, isFree: false, duration: 3600 },
                    { id: 'l3', title: 'Indian History — Medieval India', order: 3, isFree: false, duration: 3200 },
                    { id: 'l4', title: 'Indian Geography — Physical Features', order: 4, isFree: false, duration: 2800 },
                    { id: 'l5', title: 'Indian Polity — Constitution Basics', order: 5, isFree: false, duration: 3400 },
                    { id: 'l6', title: 'Bihar Special — History & Culture', order: 6, isFree: true, duration: 2600 },
                    { id: 'l7', title: 'Economy — Basic Concepts', order: 7, isFree: false, duration: 3000 },
                    { id: 'l8', title: 'Current Affairs — Strategy', order: 8, isFree: false, duration: 2200 },
                ],
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) { router.push('/login'); return; }
        try {
            setEnrolling(true);
            const res = await api.createOrder(id as string);
            // Open Razorpay checkout
            const options = {
                key: res.key,
                amount: res.order.amount,
                currency: 'INR',
                name: 'Gyan Sammaan',
                description: res.course.title,
                order_id: res.order.id,
                handler: async (response: any) => {
                    await api.verifyPayment({ ...response, courseId: id });
                    router.push('/dashboard');
                },
                prefill: { email: user.email },
                theme: { color: '#1A7A3C' },
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            alert(err.message || 'Payment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Course not found</h2>
                    <Link href="/courses" className="text-green-600 hover:underline mt-2 inline-block">Browse all courses</Link>
                </div>
            </div>
        );
    }

    const totalDuration = course.lectures?.reduce((acc: number, l: any) => acc + (l.duration || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            {/* Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js" async />

            {/* Hero */}
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{course.category}</span>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{course.language === 'HINDI' ? 'हिंदी' : 'English'}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-green-100 mb-4">by <span className="font-semibold text-white">{course.instructor}</span></p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-green-100">
                                <span className="flex items-center gap-1">📚 {course.lectures?.length || 0} lectures</span>
                                <span className="flex items-center gap-1">⏱️ {formatDuration(totalDuration)} total</span>
                                <span className="flex items-center gap-1">👥 {course._count?.enrollments || 0} students</span>
                                <span className="flex items-center gap-1">⭐ 4.5 rating</span>
                            </div>
                        </div>
                        {/* Price Card */}
                        <div className="lg:w-80">
                            <div className="bg-white rounded-2xl shadow-xl p-6">
                                <div className="text-center mb-4">
                                    <span className="text-4xl font-black text-green-700">₹{course.price.toLocaleString('en-IN')}</span>
                                </div>
                                <button onClick={handleEnroll} disabled={enrolling}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-lg disabled:opacity-50">
                                    {enrolling ? 'Processing...' : 'Enroll Now →'}
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-3">Secure payment via Razorpay (UPI, Cards, Net Banking)</p>
                                <div className="mt-4 space-y-2 text-sm text-gray-600">
                                    <p className="flex items-center gap-2">✅ Full lifetime access</p>
                                    <p className="flex items-center gap-2">✅ Certificate of completion</p>
                                    <p className="flex items-center gap-2">✅ Downloadable notes</p>
                                    <p className="flex items-center gap-2">✅ Doubt support</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        {/* Description */}
                        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">About This Course</h2>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</div>
                        </section>

                        {/* Syllabus / Lectures */}
                        <section className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Course Content ({course.lectures?.length || 0} Lectures)
                            </h2>
                            <div className="space-y-2">
                                {course.lectures?.map((lecture: any, index: number) => (
                                    <div key={lecture.id} className="border border-gray-100 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setOpenSyllabus((prev) =>
                                                prev.includes(lecture.id) ? prev.filter((id) => id !== lecture.id) : [...prev, lecture.id]
                                            )}
                                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                    {index + 1}
                                                </span>
                                                <div>
                                                    <h3 className="font-medium text-gray-800 text-sm">{lecture.title}</h3>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-gray-500">{formatDuration(lecture.duration)}</span>
                                                        {lecture.isFree && (
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Free Preview</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <svg className={`w-5 h-5 text-gray-400 transition-transform ${openSyllabus.includes(lecture.id) ? 'rotate-180' : ''}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {openSyllabus.includes(lecture.id) && (
                                            <div className="px-4 pb-4 pt-0 text-sm text-gray-500">
                                                {lecture.isFree ? (
                                                    <button className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                                                        ▶ Watch Free Preview
                                                    </button>
                                                ) : (
                                                    <p className="text-gray-400 italic">Enroll to unlock this lecture</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Instructor */}
                        <section className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Instructor</h2>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                                    {course.instructor?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{course.instructor}</h3>
                                    <p className="text-sm text-gray-500 mb-2">Faculty at Gyan Sammaan</p>
                                    <p className="text-sm text-gray-600">Expert faculty with years of experience in coaching students for competitive exams. Known for simplified explanations and exam-focused approach.</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
