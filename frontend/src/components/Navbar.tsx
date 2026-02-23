'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/courses', label: 'Courses' },
        { href: '/test-series', label: 'Test Series' },
        { href: '/resources', label: 'Free Resources' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-green-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                            ज्ञा
                        </div>
                        <div className="flex flex-col leading-tight">
                            <span className="text-lg font-bold text-green-700">Gyan Sammaan</span>
                            <span className="text-[10px] text-blue-600 -mt-0.5">ज्ञान से सफलता तक</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href}
                                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link href="/admin" className="px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                                        Admin Panel
                                    </Link>
                                )}
                                <Link href="/dashboard" className="px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50 rounded-lg transition-colors">
                                    Dashboard
                                </Link>
                                <button onClick={logout} className="px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-1.5 text-sm font-semibold text-green-700 border-2 border-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    Login
                                </Link>
                                <Link href="/register" className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 border-t mt-2">
                        <div className="flex flex-col gap-1 pt-3">
                            {navLinks.map((link) => (
                                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                                    className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg">
                                    {link.label}
                                </Link>
                            ))}
                            <div className="border-t mt-2 pt-2 flex flex-col gap-1">
                                {user ? (
                                    <>
                                        <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-green-700">Dashboard</Link>
                                        {isAdmin && <Link href="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-blue-700">Admin Panel</Link>}
                                        <button onClick={() => { logout(); setMobileOpen(false); }} className="px-3 py-2 text-sm font-medium text-red-600 text-left">Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-semibold text-green-700">Login</Link>
                                        <Link href="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-blue-600 rounded-lg text-center">Register</Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
