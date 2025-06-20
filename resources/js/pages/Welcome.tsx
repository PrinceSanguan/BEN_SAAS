// resources/js/Pages/Welcome.tsx
import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import About from '@/components/welcome/About';
import Training from '@/components/welcome/Training';
import CTA from '@/components/welcome/cta';
import Features from '@/components/welcome/features';
import Footer from '@/components/welcome/footer';
import Hero from '@/components/welcome/hero';
import HowItWorks from '@/components/welcome/howitworks';
import Testimonials from '@/components/welcome/testimonials';

import TopThreeLeaderboard from '@/components/welcome/Ranking-Section';

declare global {
    interface Window {
        route: (...args: unknown[]) => string;
    }
}

interface WelcomeProps {
    pageContent: Record<string, Record<string, string>>;
}

export default function Welcome({ pageContent }: WelcomeProps) {
    // Add dark mode class to body
    useEffect(() => {
        document.documentElement.classList.add('dark');

        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

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

            {/* Sub-components below */}
            <div className="bg-gray-960 text-white">
                <Hero pageContent={pageContent} />
                <div id="about-us">
                    <About pageContent={pageContent} />
                </div>
                <div id="our-training">
                    <Training pageContent={pageContent} />
                </div>
                <Features />
                <HowItWorks />
                <TopThreeLeaderboard />
                <div id="testimonials">
                    <Testimonials />
                </div>
                <div id="apply">
                    <CTA pageContent={pageContent} />
                </div>
                <Footer />
            </div>
        </>
    );
}
