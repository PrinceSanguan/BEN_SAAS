import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { UsersIcon } from 'lucide-react';

interface NoAthletesProps {
    onAddClick: () => void;
}

export default function NoAthletes({ onAddClick }: NoAthletesProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        // Animate the empty state with GSAP
        const tl = gsap.timeline();

        if (containerRef.current) {
            tl.fromTo(
                containerRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
            );
        }

        // Subtle pulse animation for the icon
        if (iconRef.current) {
            gsap.to(
                iconRef.current,
                {
                    scale: 1.05,
                    opacity: 0.8,
                    duration: 1.5,
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                }
            );
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="flex flex-col items-center justify-center rounded-lg bg-white/5 p-12 text-center shadow-lg backdrop-blur-sm border border-white/10"
        >
            <div className="mb-4 rounded-full bg-blue-500/10 p-4">
                <UsersIcon ref={iconRef} className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="mt-2 text-xl font-medium text-white">No Athletes Found</h3>
            <p className="mt-1 text-gray-300">Get started by adding a new athlete to your team.</p>
            <button
                onClick={onAddClick}
                className="mt-6 rounded-md bg-[#1e88e5] px-6 py-2.5 font-medium text-white shadow hover:bg-[#1976d2] transition-colors"
            >
                Add Your First Athlete
            </button>
        </div>
    );
}
