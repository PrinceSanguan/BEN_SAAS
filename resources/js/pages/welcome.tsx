import { Button } from '@/components/ui/button';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import CTA from '@/components/welcome/cta';
import Features from '@/components/welcome/features';
import Footer from '@/components/welcome/footer';
import Hero from '@/components/welcome/hero';
import HowItWorks from '@/components/welcome/howitworks';
import Testimonials from '@/components/welcome/testimonials';

import TopThreeLeaderboard from '@/components/welcome/Ranking-Section';
import type { SharedData } from '@/types';

declare global {
    interface Window {
        route: (...args: unknown[]) => string;
    }
}

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Add dark mode class to body
    useEffect(() => {
        document.documentElement.classList.add('dark');

        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <Head title="AthleteTrack">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta
                    name="description"
                    content="AthleteTrack - The ultimate platform for tracking athletic progress, setting goals, and achieving your potential."
                />
            </Head>

            {/* Header with dark mode styles */}
            <header className="fixed top-0 right-0 left-0 z-50 border-b border-gray-800 bg-gray-950/90 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-8 w-8 text-blue-500" />
                        <span className="text-xl font-bold text-white">AthleteTrack</span>
                    </div>

                    <nav className="hidden md:flex">
                        <ul className="flex space-x-8">
                            <li>
                                <a href="#features" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#how-it-works" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a href="#ranking" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                                    Rankings
                                </a>
                            </li>
                            <li>
                                <a href="#latest-news" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                                    Latest News
                                </a>
                            </li>
                            <li>
                                <a href="#testimonials" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                                    Testimonials
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="text-sm font-medium text-gray-300 transition-colors hover:text-blue-400">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link href={window.route('login')} className="text-sm font-medium text-white">
                                <Button className="shadow-lg transition-all hover:shadow-blue-500/20">Login</Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={window.route('login')}
                                    className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 md:block dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Log in
                                </Link>
                                {/* <Link href={window.route('register')} className="text-sm font-medium text-white">
                                    <Button className="shadow-lg transition-all hover:shadow-blue-500/20">Get Started</Button>
                                </Link> */}
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            className="flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 md:hidden"
                            onClick={toggleMenu}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="border-t border-gray-800 px-4 py-3">
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#features"
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#how-it-works"
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    How It Works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#ranking"
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Rankings
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#latest-news"
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Latest News
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#testimonials"
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Testimonials
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    FAQ
                                </a>
                            </li>
                            <li>
                                <Link
                                    href={window.route('login')}
                                    className="block text-sm font-medium text-gray-300 hover:text-blue-400"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Log in
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* Sub-components below */}
            <div className="bg-gray-950 text-white">
                <Hero />
                <Features />
                <HowItWorks />
                <TopThreeLeaderboard />
                <Testimonials />
                <CTA />
                <Footer />
            </div>
        </>
    );
}
