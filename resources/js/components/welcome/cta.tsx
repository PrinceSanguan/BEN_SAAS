// resources/js/components/welcome/cta.tsx
'use client';

import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type React from 'react';
import { useEffect, useRef } from 'react';

interface CTAProps {
    pageContent: Record<string, Record<string, string>>;
}

const CTA: React.FC<CTAProps> = ({ pageContent }) => {
    // Get CTA content
    const cta = pageContent?.cta || {};

    const ctaRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate CTA content
        gsap.from(contentRef.current, {
            scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top bottom-=100',
                toggleActions: 'play none none none',
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        });

        // Animate CTA button
        gsap.from(buttonRef.current, {
            scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top bottom-=150',
                toggleActions: 'play none none none',
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.5,
            delay: 0.3,
            ease: 'back.out(1.7)',
        });

        // Add pulse animation to button
        gsap.to(buttonRef.current, {
            scale: 1.05,
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: 'sine.inOut',
            delay: 1,
        });
    }, []);

    return (
        <section ref={ctaRef} className="bg-gradient-to-r from-blue-900 to-indigo-900 py-20">
            <div className="container mx-auto px-4">
                <div ref={contentRef} className="mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">{cta.title || 'Ready to Start Your Athletic Journey?'}</h2>
                    <p className="mb-8 text-lg text-gray-200">
                        {cta.description ||
                            'Join thousands of young athletes who are tracking their progress, competing on leaderboards, and achieving their strength and conditioning goals.'}
                    </p>
                    <div ref={buttonRef} className="inline-block">
                        <Button
                            size="lg"
                            className="h-12 bg-white px-8 text-blue-900 shadow-lg transition-all hover:bg-gray-100 hover:shadow-white/20"
                        >
                            {cta.button_text || 'Get Started Today'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
