import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

import CTA from '@/components/welcome/cta';
import Features from '@/components/welcome/features';
import Footer from '@/components/welcome/footer';
import Hero from '@/components/welcome/hero';
import About from '@/components/welcome/About';
import Training from '@/components/welcome/Training';
import HowItWorks from '@/components/welcome/howitworks';
import Testimonials from '@/components/welcome/testimonials';

import TopThreeLeaderboard from '@/components/welcome/Ranking-Section';

declare global {
    interface Window {
        route: (...args: unknown[]) => string;
    }
}

export default function Welcome() {
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
            <div className="bg-gray-950 text-white">
                <Hero />
                <About />
                <Training />
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
