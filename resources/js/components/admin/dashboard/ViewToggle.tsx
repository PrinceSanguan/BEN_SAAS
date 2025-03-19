import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ViewToggleProps {
    viewMode: 'table' | 'cards';
    setViewMode: (mode: 'table' | 'cards') => void;
}

export default function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
    const toggleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.fromTo(
            toggleRef.current,
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, delay: 0.3, ease: 'power2.out' }
        );
    }, []);

    return (
        <div ref={toggleRef} className="bg-[#0f1e38] rounded-lg p-1 inline-flex">
            <button
                onClick={() => setViewMode('table')}
                className={`rounded-md px-4 py-2 font-medium transition-all ${
                    viewMode === 'table'
                        ? 'bg-[#1e88e5] text-white shadow-md'
                        : 'text-gray-300 hover:text-white'
                }`}
            >
                Table View
            </button>
            <button
                onClick={() => setViewMode('cards')}
                className={`rounded-md px-4 py-2 font-medium transition-all ${
                    viewMode === 'cards'
                        ? 'bg-[#1e88e5] text-white shadow-md'
                        : 'text-gray-300 hover:text-white'
                }`}
            >
                Card View
            </button>
        </div>
    );
}
