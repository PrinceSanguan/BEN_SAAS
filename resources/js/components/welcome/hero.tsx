import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { Activity, ArrowRight, Award, CheckCircle, Clock, Menu, Play, Shield, Star, Target, X, Zap } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface HeroProps {
    pageContent: Record<string, Record<string, string>>;
}

const Hero: React.FC<HeroProps> = ({ pageContent }) => {
    // Get hero content
    const hero = pageContent?.hero || {};

    const [currentBg, setCurrentBg] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    // Enhanced background images with better variety
    const backgroundImages = [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1566351810-2b3c8b5b0c7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    ];

    // Handle smooth scrolling for navigation links
    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();

        if (sectionId === '') {
            // For the Home link, scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        } else {
            // For other section links
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                });
            }
        }

        // Close mobile menu if open
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    // Enhanced scroll effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Background rotation with smoother transitions
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    // Enhanced GSAP animations with stagger effects
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Enhanced entrance animations
            tl.from(titleRef.current, {
                y: 120,
                opacity: 0,
                duration: 1.4,
                ease: 'power4.out',
            })
                .from(
                    subtitleRef.current,
                    {
                        y: 60,
                        opacity: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                    },
                    '-=1',
                )
                .from(
                    ctaRef.current?.children || [],
                    {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.15,
                        ease: 'back.out(1.4)',
                    },
                    '-=0.8',
                )
                .from(
                    profileRef.current,
                    {
                        y: 80,
                        opacity: 0,
                        scale: 0.9,
                        duration: 1.2,
                        ease: 'power3.out',
                    },
                    '-=0.6',
                )
                .from(
                    statsRef.current?.children || [],
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power2.out',
                    },
                    '-=0.4',
                );

            // Enhanced floating animations
            gsap.to(profileRef.current, {
                y: -15,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
            });

            // Parallax effect for decorative elements
            gsap.to('.floating-element', {
                y: -20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
                stagger: 0.5,
            });
        }, heroRef);

        return () => ctx.revert();
    }, []);

    // Enhanced counter animation
    const animateCounter = useCallback((element: HTMLElement, target: number, suffix = '') => {
        gsap.to(
            { value: 0 },
            {
                value: target,
                duration: 2,
                ease: 'power2.out',
                onUpdate: function () {
                    element.textContent = Math.round(this.targets()[0].value) + suffix;
                },
            },
        );
    }, []);

    // Intersection observer for stats animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.counter');
                        counters.forEach((counter, index) => {
                            const targets = [1000, 10, 1, 0];
                            const suffixes = ['+', '+', '', ''];
                            animateCounter(counter as HTMLElement, targets[index], suffixes[index]);
                        });
                    }
                });
            },
            { threshold: 0.5 },
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, [animateCounter]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleVideoPlay = () => {
        setIsVideoPlaying(true);
        // Here you would typically open a modal or navigate to video
        console.log('Playing demo video...');
    };

    return (
        <div ref={heroRef} className="relative flex min-h-screen flex-col">
            {/* Enhanced Navigation Bar */}
            <header
                className={`fixed top-0 right-0 left-0 z-50 w-full px-6 py-4 transition-all duration-300 ${
                    scrollY > 50
                        ? 'border-b border-slate-800 bg-slate-900/98 shadow-2xl backdrop-blur-lg'
                        : 'border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm'
                }`}
            >
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="group flex items-center gap-3">
                            <div className="relative">
                                <Activity className="h-9 w-9 text-blue-500 transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-lg transition-all group-hover:blur-xl"></div>
                            </div>
                            <span className="text-xl font-black tracking-tight text-white">AthleteTrack</span>
                        </a>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-8 lg:flex">
                        {['Home', 'About Us', 'Our Training', 'Apply', 'Testimonials'].map((item, index) => (
                            <a
                                key={item}
                                href={item === 'Home' ? '#' : `#${item.toLowerCase().replace(/ /g, '-')}`}
                                className="group relative text-sm font-medium text-white/80 transition-all hover:scale-105 hover:text-white"
                                onClick={(e) => handleNavClick(e, item === 'Home' ? '' : item.toLowerCase().replace(/ /g, '-'))}
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-blue-500 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link href={route('login')}>
                            <Button
                                variant="outline"
                                className="hidden items-center gap-2 rounded-lg border border-blue-500/50 text-white transition-all hover:scale-105 hover:bg-blue-500/20 sm:flex"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-blue-400"
                                >
                                    <path
                                        d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Log in
                            </Button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="sm" className="text-white lg:hidden" onClick={toggleMenu} aria-label="Toggle menu">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="absolute top-full right-0 left-0 border-b border-slate-800 bg-slate-900/98 shadow-2xl backdrop-blur-lg lg:hidden">
                        <nav className="container mx-auto space-y-4 px-6 py-6">
                            {['Home', 'About Us', 'Our Training', 'Apply', 'Testimonials'].map((item) => (
                                <a
                                    key={item}
                                    href={item === 'Home' ? '#' : `#${item.toLowerCase().replace(/ /g, '-')}`}
                                    className="block py-2 text-lg font-medium text-white/80 transition-colors hover:text-white"
                                    onClick={(e) => handleNavClick(e, item === 'Home' ? '' : item.toLowerCase().replace(/ /g, '-'))}
                                >
                                    {item}
                                </a>
                            ))}
                            <Link href={route('login')}>
                                <Button variant="outline" className="mt-4 w-full border border-blue-500/50 text-white hover:bg-blue-500/20">
                                    Log in
                                </Button>
                            </Link>
                        </nav>
                    </div>
                )}
            </header>

            {/* Add padding to account for fixed header */}
            <div className="pt-20"></div>

            {/* Enhanced Hero Section */}
            <main className="relative flex-1 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                {/* Enhanced Background Image Slider */}
                <div className="absolute inset-0 z-0">
                    {backgroundImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-3000 ease-in-out ${
                                index === currentBg ? 'scale-110 opacity-50' : 'scale-100 opacity-0'
                            }`}
                            style={{
                                backgroundImage: `url('${image}')`,
                                filter: 'brightness(0.6) contrast(1.2) saturate(1.1)',
                            }}
                        />
                    ))}

                    {/* Enhanced gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-slate-900/90 to-black/95"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.15)_0%,transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(147,51,234,0.1)_0%,transparent_50%)]"></div>
                </div>

                {/* Enhanced Decorative Elements */}
                <div className="floating-element absolute top-20 left-10 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-blue-500/15 to-cyan-500/15 blur-3xl"></div>
                <div className="floating-element absolute right-10 bottom-20 h-80 w-80 animate-pulse rounded-full bg-gradient-to-r from-purple-500/15 to-pink-500/15 blur-3xl delay-1000"></div>
                <div className="floating-element absolute top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-500/8 to-purple-500/8 blur-3xl"></div>

                {/* Enhanced floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-1 w-1 animate-pulse rounded-full bg-gradient-to-r from-blue-400/40 to-cyan-400/40"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 4}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
                    <div className="mx-auto mb-24 max-w-6xl text-center">
                        <h1 ref={titleRef} className="mb-8 text-5xl leading-tight font-black tracking-tight text-white md:text-6xl lg:text-8xl">
                            {hero.main_title || 'Where Young Athletes'}
                            <span className="mt-4 block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                {hero.title_highlight || 'Train Smarter — Not Just Harder'}
                            </span>
                        </h1>

                        <p
                            ref={subtitleRef}
                            className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed font-light text-gray-200 md:text-2xl lg:text-3xl"
                        >
                            {hero.subtitle ||
                                'Expert guidance that builds performance, protects against injury, and brings out the best in your child.'}
                            <span className="mt-3 block text-lg font-medium text-blue-300 md:text-xl">
                                {hero.subtitle_secondary || 'Scientifically designed, individually delivered — and fully supported for parents.'}
                            </span>
                        </p>

                        <div ref={ctaRef} className="mb-24 flex flex-col items-center justify-center gap-6 sm:flex-row">
                            <Button
                                size="lg"
                                className="group flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-12 text-xl font-bold text-white shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/50 sm:w-auto"
                            >
                                <Zap className="h-6 w-6" />
                                {hero.cta_button || 'Start Your Journey'}
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl border-2 border-white/50 px-12 text-xl font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white/70 hover:bg-white/20 sm:w-auto"
                                onClick={handleVideoPlay}
                            >
                                <Play className="h-6 w-6 fill-current" />
                                {hero.demo_button || 'Watch Demo'}
                            </Button>
                        </div>
                    </div>

                    {/* Enhanced Bottom Section */}
                    <div className="mx-auto max-w-6xl">
                        <div className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/70 to-slate-900/70 p-12 shadow-2xl backdrop-blur-xl">
                            <div className="mb-12 text-center">
                                <h2 className="mb-8 text-4xl font-black text-white md:text-5xl">
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                        A Coaching Experience Your Child Will Love
                                    </span>
                                </h2>
                                <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-200 md:text-2xl">
                                    Our programme is more than reps and drills — it's a creative, positive environment where young athletes feel
                                    supported, challenged, and excited to train. Every session is engaging, novel, and focused — because when training
                                    is fun, commitment comes naturally.
                                </p>
                            </div>

                            {/* Enhanced feature highlights */}
                            <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
                                <div className="group text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-blue-600/30 shadow-lg transition-transform group-hover:scale-110">
                                        <Target className="h-10 w-10 text-blue-400" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Personalized</h3>
                                    <p className="text-lg leading-relaxed text-gray-300">
                                        Tailored programs designed for each athlete's unique needs, goals, and developmental stage
                                    </p>
                                </div>
                                <div className="group text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/30 shadow-lg transition-transform group-hover:scale-110">
                                        <CheckCircle className="h-10 w-10 text-purple-400" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Safe & Effective</h3>
                                    <p className="text-lg leading-relaxed text-gray-300">
                                        Evidence-based methods with our proven zero injury record across thousands of training sessions
                                    </p>
                                </div>
                                <div className="group text-center">
                                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500/30 to-green-600/30 shadow-lg transition-transform group-hover:scale-110">
                                        <Star className="h-10 w-10 text-green-400" />
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold text-white">Results Driven</h3>
                                    <p className="text-lg leading-relaxed text-gray-300">
                                        Proven track record of athletic development with measurable improvements in strength and performance
                                    </p>
                                </div>
                            </div>

                            {/* Additional trust elements */}
                            <div className="mt-12 border-t border-slate-700/50 pt-8">
                                <div className="flex flex-wrap items-center justify-center gap-8">
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Clock className="h-5 w-5 text-blue-400" />
                                        <span className="font-medium">Flexible Scheduling</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Shield className="h-5 w-5 text-green-400" />
                                        <span className="font-medium">Fully Insured</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-300">
                                        <Award className="h-5 w-5 text-amber-400" />
                                        <span className="font-medium">Certified Professionals</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Hero;
