import Link from 'next/link';

interface CourseCardProps {
    id: string;
    title: string;
    thumbnail?: string;
    price: number;
    category: string;
    instructor: string;
    language: string;
    lectureCount: number;
    enrollmentCount: number;
    rating?: number;
}

export default function CourseCard({
    id, title, thumbnail, price, category, instructor,
    lectureCount, enrollmentCount, rating = 4.5,
}: CourseCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group hover:-translate-y-1">
            {/* Thumbnail */}
            <div className="relative h-44 bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden">
                {thumbnail ? (
                    <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">📚</span>
                    </div>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-green-600 text-white text-xs font-semibold rounded-full shadow">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-base leading-tight mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-gray-500 mb-2">by {instructor}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <span className="text-amber-500 font-bold text-sm">{rating}</span>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`}
                                fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="text-xs text-gray-400">({enrollmentCount} students)</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {lectureCount} lectures
                    </span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xl font-bold text-green-700">₹{price.toLocaleString('en-IN')}</span>
                    <Link href={`/courses/${id}`}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all">
                        Enroll Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
