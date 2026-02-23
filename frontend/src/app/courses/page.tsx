'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CourseCard from '@/components/CourseCard';
import api from '@/lib/api';

const categories = ['ALL', 'BPSC', 'UPSC', 'SSC', 'RAILWAY', 'BANKING'];
const languages = ['ALL', 'HINDI', 'ENGLISH'];

function CoursesContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'ALL';

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(initialCategory);
    const [language, setLanguage] = useState('ALL');
    const [priceRange, setPriceRange] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchCourses();
    }, [category, language, priceRange]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (category !== 'ALL') params.set('category', category);
            if (language !== 'ALL') params.set('language', language);
            if (priceRange === 'FREE') { params.set('maxPrice', '0'); }
            else if (priceRange === 'BELOW_1000') { params.set('maxPrice', '1000'); }
            else if (priceRange === 'BELOW_3000') { params.set('maxPrice', '3000'); }
            else if (priceRange === 'ABOVE_3000') { params.set('minPrice', '3000'); }
            if (search) params.set('search', search);

            const res = await api.getCourses(params.toString());
            setCourses(res.courses || []);
        } catch {
            // Use mock data if API is not available
            setCourses([
                { id: '1', title: 'BPSC Complete Course — 67th BPSC Special', price: 2999, category: 'BPSC', instructor: 'Dr. Rakesh Kumar', language: 'HINDI', _count: { lectures: 120, enrollments: 2340 } },
                { id: '2', title: 'UPSC Prelims + Mains — Complete Foundation', price: 4999, category: 'UPSC', instructor: 'Prof. Anita Singh', language: 'HINDI', _count: { lectures: 200, enrollments: 1850 } },
                { id: '3', title: 'SSC CGL 2025 — Complete Preparation', price: 1999, category: 'SSC', instructor: 'Amit Sharma', language: 'HINDI', _count: { lectures: 85, enrollments: 3100 } },
                { id: '4', title: 'Railway NTPC + Group D — Full Course', price: 1499, category: 'RAILWAY', instructor: 'Vijay Prakash', language: 'HINDI', _count: { lectures: 65, enrollments: 4200 } },
                { id: '5', title: 'Banking PO & Clerk — Complete Package', price: 2499, category: 'BANKING', instructor: 'Sneha Gupta', language: 'ENGLISH', _count: { lectures: 90, enrollments: 1600 } },
                { id: '6', title: 'BPSC Mains GS Paper I — Detailed', price: 1299, category: 'BPSC', instructor: 'Dr. Rakesh Kumar', language: 'HINDI', _count: { lectures: 45, enrollments: 980 } },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filtered = courses.filter((c) => {
        if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (category !== 'ALL' && c.category !== category) return false;
        if (language !== 'ALL' && c.language !== language) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Browse All Courses</h1>
                    <p className="text-green-100">Find the perfect course for your exam preparation</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
                            <h3 className="font-bold text-gray-800 mb-4">Filters</h3>

                            {/* Search */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-600 block mb-2">Search</label>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search courses..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-600 block mb-2">Exam Category</label>
                                <div className="space-y-1">
                                    {categories.map((c) => (
                                        <button key={c} onClick={() => setCategory(c)}
                                            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${category === c ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            {c === 'ALL' ? 'All Categories' : c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Language */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-600 block mb-2">Language</label>
                                <div className="space-y-1">
                                    {languages.map((l) => (
                                        <button key={l} onClick={() => setLanguage(l)}
                                            className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${language === l ? 'bg-blue-100 text-blue-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                            {l === 'ALL' ? 'All Languages' : l === 'HINDI' ? 'हिंदी (Hindi)' : 'English'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Price Range</label>
                                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                                    <option value="ALL">All Prices</option>
                                    <option value="FREE">Free</option>
                                    <option value="BELOW_1000">Below ₹1,000</option>
                                    <option value="BELOW_3000">Below ₹3,000</option>
                                    <option value="ABOVE_3000">Above ₹3,000</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Course Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">{filtered.length} courses found</p>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white rounded-xl shadow-md h-80 animate-pulse">
                                        <div className="h-44 bg-gray-200 rounded-t-xl"></div>
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filtered.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        id={course.id}
                                        title={course.title}
                                        thumbnail={course.thumbnail}
                                        price={course.price}
                                        category={course.category}
                                        instructor={course.instructor}
                                        language={course.language}
                                        lectureCount={course._count?.lectures || 0}
                                        enrollmentCount={course._count?.enrollments || 0}
                                    />
                                ))}
                            </div>
                        )}
                        {!loading && filtered.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No courses found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search term</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CoursesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center">
                <div className="animate-pulse text-green-700 text-xl font-semibold">Loading courses...</div>
            </div>
        }>
            <CoursesContent />
        </Suspense>
    );
}

