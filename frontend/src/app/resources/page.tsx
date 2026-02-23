'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function ResourcesPage() {
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const res = await api.getResources();
                setResources(res.resources || []);
            } catch {
                setResources([
                    { id: '1', title: 'BPSC Previous Year Papers (2015-2024)', category: 'previous-papers', fileUrl: '#', description: '10 years of BPSC Prelims papers with answer keys', downloadCount: 12500 },
                    { id: '2', title: 'Monthly Current Affairs — January 2025', category: 'current-affairs', fileUrl: '#', description: 'Comprehensive monthly current affairs for all exams', downloadCount: 8900 },
                    { id: '3', title: 'Indian Polity — Complete Notes PDF', category: 'notes', fileUrl: '#', description: 'Chapter-wise polity notes in Hindi', downloadCount: 15200 },
                    { id: '4', title: 'Bihar Special — History & Geography', category: 'notes', fileUrl: '#', description: 'Complete Bihar GK notes for BPSC', downloadCount: 9800 },
                    { id: '5', title: 'UPSC CSAT Practice Questions', category: 'previous-papers', fileUrl: '#', description: '500+ CSAT practice questions with solutions', downloadCount: 7300 },
                    { id: '6', title: 'Economy Notes — Basic to Advanced', category: 'notes', fileUrl: '#', description: 'Indian Economy notes by Gyan Sammaan faculty', downloadCount: 6100 },
                    { id: '7', title: 'Monthly Current Affairs — December 2024', category: 'current-affairs', fileUrl: '#', description: 'December 2024 current affairs compilation', downloadCount: 11400 },
                    { id: '8', title: 'SSC Quantitative Aptitude Formula Sheet', category: 'notes', fileUrl: '#', description: 'All important formulas for SSC exams', downloadCount: 18700 },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, []);

    const tabs = [
        { key: 'all', label: 'All Resources', icon: '📁' },
        { key: 'current-affairs', label: 'Current Affairs', icon: '📰' },
        { key: 'previous-papers', label: 'Previous Year Papers', icon: '📄' },
        { key: 'notes', label: 'Study Notes', icon: '📝' },
    ];

    const filtered = activeTab === 'all' ? resources : resources.filter((r) => r.category === activeTab);

    return (
        <div className="min-h-screen bg-[#F0FAF4]">
            <div className="bg-gradient-to-r from-green-700 to-blue-700 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Free Resources</h1>
                    <p className="text-green-100">Download free study material, current affairs & previous year papers</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50 border'}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20"><div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div></div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map((resource) => (
                            <div key={resource.id} className="bg-white rounded-xl shadow-md p-5 flex items-start gap-4 card-hover border border-gray-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                    {resource.category === 'current-affairs' ? '📰' : resource.category === 'previous-papers' ? '📄' : '📝'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-800 text-sm mb-1">{resource.title}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{resource.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">📥 {resource.downloadCount?.toLocaleString('en-IN')} downloads</span>
                                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors">
                                            Download PDF ↓
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
