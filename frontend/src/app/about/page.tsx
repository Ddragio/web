export default function AboutPage() {
    const faculty = [
        { name: 'Dr. Rakesh Kumar', role: 'BPSC Expert', bio: 'PhD in Political Science with 15+ years of teaching experience for BPSC exams.', icon: '👨‍🏫' },
        { name: 'Prof. Anita Singh', role: 'UPSC Faculty', bio: 'Former IAS aspirant turned educator, specializing in UPSC GS and Essay preparation.', icon: '👩‍🏫' },
        { name: 'Amit Sharma', role: 'SSC & Railway Expert', bio: '10+ years of experience coaching students for SSC CGL, CHSL, and Railway exams.', icon: '👨‍💼' },
        { name: 'Sneha Gupta', role: 'Banking Specialist', bio: 'Ex-banker with deep expertise in Bank PO, Clerk, and SO exam preparation.', icon: '👩‍💼' },
    ];

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            {/* Hero */}
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Gyan Sammaan</h1>
                    <p className="text-lg text-green-100">ज्ञान सम्मान — ज्ञान से सफलता तक</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Mission */}
                <section className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 gradient-text">Our Mission</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Gyan Sammaan (ज्ञान सम्मान) was founded with a simple mission — to make quality competitive exam coaching accessible to every student in India, regardless of their location or financial background.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        हमारा उद्देश्य है कि हर विद्यार्थी को गुणवत्तापूर्ण शिक्षा मिले। हम BPSC, UPSC, SSC, Railway और Banking जैसी प्रतियोगी परीक्षाओं की तैयारी के लिए सर्वोत्तम कोर्सेज और स्टडी मटेरियल उपलब्ध कराते हैं।
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {[
                            { num: '15,000+', label: 'Students Enrolled', icon: '🎓' },
                            { num: '50+', label: 'Expert Courses', icon: '📚' },
                            { num: '5,000+', label: 'Success Stories', icon: '🏆' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl">
                                <div className="text-4xl mb-2">{stat.icon}</div>
                                <div className="text-2xl font-bold text-green-700">{stat.num}</div>
                                <div className="text-sm text-gray-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Faculty */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Expert <span className="gradient-text">Faculty</span></h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {faculty.map((f) => (
                            <div key={f.name} className="bg-white rounded-xl shadow-md p-6 text-center card-hover border border-gray-100">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center text-4xl mb-4">
                                    {f.icon}
                                </div>
                                <h3 className="font-bold text-gray-800">{f.name}</h3>
                                <p className="text-sm text-green-600 font-medium mb-2">{f.role}</p>
                                <p className="text-xs text-gray-500">{f.bio}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* YouTube Stats */}
                <section className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-12 text-center border border-red-200">
                    <div className="text-5xl mb-4">📺</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Our YouTube Channel</h2>
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-6">
                        {[
                            { num: '100K+', label: 'Subscribers' },
                            { num: '500+', label: 'Videos' },
                            { num: '10M+', label: 'Views' },
                        ].map((s) => (
                            <div key={s.label}>
                                <div className="text-xl font-bold text-red-600">{s.num}</div>
                                <div className="text-xs text-gray-500">{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <a href="https://www.youtube.com/@gyansammaan" target="_blank" rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors">
                        Subscribe Now
                    </a>
                </section>
            </div>
        </div>
    );
}
