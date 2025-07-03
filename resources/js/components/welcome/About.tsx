import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import {
    ArrowRight,
    Award,
    BookOpen,
    Calendar,
    Globe,
    GraduationCap,
    Heart,
    Quote,
    Shield,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface AboutProps {
    pageContent: Record<string, Record<string, string>>;
}

const About: React.FC<AboutProps> = ({ pageContent }) => {
    const about = pageContent?.about || {};

    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const credentialsRef = useRef<HTMLDivElement>(null);
    const achievementsRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for triggering animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.2 },
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // GSAP Animations
    useEffect(() => {
        if (!isVisible) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Header animation
            tl.from(headerRef.current, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
            })
                // Image animation
                .from(
                    imageRef.current,
                    {
                        x: -80,
                        opacity: 0,
                        duration: 1.4,
                        ease: 'power3.out',
                    },
                    '-=0.8',
                )
                // Content animation
                .from(
                    contentRef.current?.children || [],
                    {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power2.out',
                    },
                    '-=1',
                )
                // Credentials card animation
                .from(
                    credentialsRef.current,
                    {
                        scale: 0.8,
                        opacity: 0,
                        duration: 1,
                        ease: 'back.out(1.4)',
                    },
                    '-=0.6',
                )
                // Achievements animation
                .from(
                    achievementsRef.current?.children || [],
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: 'power2.out',
                    },
                    '-=0.4',
                );

            // Floating animations
            gsap.to(credentialsRef.current, {
                y: -10,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
            });

            // Parallax effect for decorative elements
            gsap.to('.floating-bg', {
                y: -20,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'power2.inOut',
                stagger: 0.5,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    const achievements = [
        { icon: Users, label: 'Athletes Trained', value: '1,000+', color: 'blue' },
        { icon: Calendar, label: 'Years Experience', value: '10+', color: 'purple' },
    ];

    const credentials = [
        {
            icon: GraduationCap,
            title: 'PhD in Paediatric Strength Training',
            description: 'University of Birmingham',
            color: 'blue',
        },
        {
            icon: Award,
            title: 'UKSCA Accredited',
            description: 'Strength & Conditioning Coach',
            color: 'purple',
        },
        {
            icon: Shield,
            title: 'Youth Specialist Certification',
            description: 'International Youth Conditioning Association',
            color: 'green',
        },
        {
            icon: Globe,
            title: 'Published Researcher',
            description: 'Peer-reviewed journals worldwide',
            color: 'amber',
        },
    ];

    const philosophyPoints = [
        {
            icon: Heart,
            title: 'Enjoyment First',
            description: 'Training should be fun, engaging, and something kids look forward to',
        },
        {
            icon: Target,
            title: 'Individual Focus',
            description: 'Every child is unique and deserves personalized attention and programming',
        },
        {
            icon: TrendingUp,
            title: 'Progressive Development',
            description: 'Building skills systematically while respecting developmental stages',
        },
        {
            icon: Shield,
            title: 'Safety Always',
            description: 'Zero compromise on safety with evidence-based injury prevention',
        },
    ];

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-32">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

            {/* Enhanced Decorative Elements */}
            <div className="floating-bg absolute top-0 left-0 h-32 w-full bg-gradient-to-r from-blue-500/15 to-purple-500/15 blur-xl"></div>
            <div className="floating-bg absolute top-40 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-3xl"></div>
            <div className="floating-bg absolute bottom-40 left-0 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-3xl"></div>
            <div className="floating-bg absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl"></div>

            {/* Enhanced Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAtMTJ2MmgtMnYtMmgyek0zMCAyNHYyaC0ydi0yaDJ6bS00IDRoMnYyaC0ydi0yek0zMCAyMHYyaC0ydi0yaDJ6bS00IDBoMnYyaC0ydi0yek0zNCAyMHYyaC0ydi0yaDJ6bTAgMTJ2MmgtMnYtMmgyek0zMCAyOHYyaC0ydi0yaDJ6bS04IDhoMnYyaC0ydi0yek0zNCAyOHYyaC0ydi0yaDJ6TTI2IDI0djJoLTJ2LTJoMnptLTQgNGgydjJoLTJ2LTJ6bTAgOGgydjJoLTJ2LTJ6bTAtOGg0djJoLTR2LTJ6bTQgMTJ2LTJoMnYyaC0yek0yNiAzNnYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 mix-blend-overlay"></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-1 w-1 animate-pulse rounded-full bg-blue-400/30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4">
                {/* Enhanced Section Header */}
                <div ref={headerRef} className="relative">
                    <div className="mb-20 flex flex-col items-center justify-center">
                        <div className="mb-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2 shadow-lg shadow-blue-500/25">
                            <div className="rounded-full bg-slate-900 p-3">
                                <GraduationCap className="h-8 w-8 text-blue-400" />
                            </div>
                        </div>
                        <h2 className="mb-6 max-w-4xl text-center text-4xl leading-tight font-black text-white md:text-5xl lg:text-6xl">
                            {about.section_title || 'Meet Dr Ben Pullen —'}
                            <span className="mt-2 block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
                                {about.title_highlight || 'Expert in Youth Strength Development'}
                            </span>
                        </h2>
                        <p className="mb-8 max-w-3xl text-center text-xl leading-relaxed text-gray-300 md:text-2xl">
                            {about.description ||
                                "The world's leading researcher in youth strength training, transforming how young athletes develop"}
                        </p>
                        <div className="h-1.5 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/50"></div>
                    </div>
                </div>

                <div className="mb-20 grid grid-cols-1 items-start gap-16 xl:grid-cols-12">
                    {/* Enhanced Left Column - Image and Credentials */}
                    <div ref={imageRef} className="relative xl:col-span-5">
                        <div className="group relative">
                            {/* Enhanced Main Image with Frame */}
                            <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-700 group-hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]">
                                {about.profile_image ? (
                                    <img
                                        src={`/upload-image/${about.profile_image}`}
                                        alt={about.section_title || 'Expert Profile'}
                                        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <img
                                        src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                                        alt="Dr Ben Pullen - Youth Strength Training Expert"
                                        className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                                {/* Enhanced overlay content */}
                                <div className="absolute right-6 bottom-6 left-6 z-20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                        <Badge className="border-0 bg-blue-500/90 font-bold text-white">World Expert</Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Floating Credentials Card */}
                            <div
                                ref={credentialsRef}
                                className="absolute -right-8 -bottom-12 z-20 max-w-sm transform rounded-2xl border border-blue-500/40 bg-gradient-to-br from-slate-800/95 to-slate-900/95 p-8 shadow-2xl shadow-blue-500/20 backdrop-blur-xl transition-all duration-700 group-hover:-translate-y-4 hover:border-blue-500/60 md:-right-16"
                            >
                                <h3 className="mb-6 flex items-center text-2xl font-black text-white">
                                    <GraduationCap className="mr-3 h-6 w-6 text-blue-400" />
                                    Credentials
                                </h3>
                                <div className="space-y-4">
                                    {credentials.slice(0, 3).map((cred, index) => (
                                        <div key={index} className="group/item flex items-start gap-3">
                                            <div
                                                className={`rounded-full bg-${cred.color}-900/60 flex-shrink-0 p-2 group-hover/item:bg-${cred.color}-900/80 transition-all`}
                                            >
                                                <cred.icon className={`h-5 w-5 text-${cred.color}-400`} />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-white">{cred.title}</span>
                                                <span className="text-xs text-gray-400">{cred.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* View all credentials link */}
                                <Button variant="ghost" size="sm" className="mt-4 w-full text-blue-400 hover:bg-blue-500/10 hover:text-blue-300">
                                    View All Credentials
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            {/* Enhanced Background Decorative Elements */}
                            <div className="absolute -top-8 -left-8 z-0 h-40 w-40 animate-pulse rounded-2xl border-2 border-dashed border-blue-500/30"></div>
                            <div className="absolute -right-8 -bottom-8 z-0 h-40 w-40 animate-pulse rounded-2xl border-2 border-dashed border-purple-500/30 delay-1000"></div>

                            {/* Glow effects */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"></div>
                        </div>
                    </div>

                    {/* Enhanced Right Column - Content */}
                    <div ref={contentRef} className="xl:col-span-7">
                        <div className="prose prose-lg prose-invert max-w-none">
                            <div className="mb-8">
                                <p className="mb-6 text-xl leading-relaxed font-light text-gray-200 md:text-2xl">
                                    {about.main_text_1 ||
                                        'This programme was created to solve a clear problem: most youth training is either watered down or misapplied adult training.'}
                                </p>

                                <p className="mb-6 text-lg leading-relaxed text-gray-300 md:text-xl">
                                    {about.main_text_2 ||
                                        'Dr Ben Pullen holds a PhD in paediatric strength training and has coached over 1,000 young athletes. His research explored how to make strength training engaging and developmentally aligned - blending sport science with psychological insight.'}
                                </p>

                                <p className="mb-10 text-lg leading-relaxed text-gray-300 md:text-xl">
                                    {about.main_text_3 ||
                                        'Now, that work is delivered to families worldwide through a structured, engaging programme that delivers results, builds confidence, and supports parents every step of the way.'}
                                </p>
                            </div>

                            {/* Enhanced Philosophy Card with Quote */}
                            <div className="group mb-10 transform rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 backdrop-blur-xl transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20">
                                <div className="flex items-start gap-6">
                                    <div className="mt-1 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-4 transition-transform group-hover:scale-110">
                                        <Quote className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="mb-4 flex items-center text-2xl font-black text-white">
                                            Philosophy Highlight
                                            <Sparkles className="ml-3 h-6 w-6 text-amber-400" />
                                        </h3>
                                        <blockquote className="mb-4 text-2xl leading-relaxed font-bold text-blue-300 italic md:text-3xl">
                                            "
                                            {about.quote ||
                                                "Kids don't need pressure — they need purposeful challenge. We train children to enjoy training, not endure it."}
                                            "
                                        </blockquote>
                                        <cite className="font-medium text-gray-400">— Dr Ben Pullen, PhD</cite>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Philosophy Points */}
                            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                                {philosophyPoints.map((point, index) => (
                                    <div
                                        key={index}
                                        className="group rounded-xl border border-slate-700/50 bg-slate-800/60 p-6 backdrop-blur-md transition-all hover:border-slate-600/50 hover:bg-slate-800/80"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 transition-transform group-hover:scale-110">
                                                <point.icon className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="mb-2 text-lg font-bold text-white">{point.title}</h4>
                                                <p className="text-sm leading-relaxed text-gray-300">{point.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Enhanced CTA Buttons */}
                            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                                <Button className="group rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-bold text-white shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/50">
                                    Learn More About Our Approach
                                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl border-2 border-white/30 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white/50 hover:bg-white/10"
                                >
                                    View Research Papers
                                    <BookOpen className="ml-3 h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Achievements Section */}
                <div ref={achievementsRef} className="mt-20">
                    <div className="mb-12 text-center">
                        <h3 className="mb-4 text-3xl font-black text-white md:text-4xl">
                            Proven Track Record of
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"> Excellence</span>
                        </h3>
                        <p className="mx-auto max-w-2xl text-xl text-gray-300">Numbers that speak to our commitment to youth athletic development</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-8 text-center backdrop-blur-xl transition-all hover:scale-105 hover:border-slate-600/50"
                            >
                                <div
                                    className={`h-16 w-16 bg-gradient-to-br from-${achievement.color}-500/30 to-${achievement.color}-600/30 mx-auto mb-4 flex items-center justify-center rounded-full transition-transform group-hover:scale-110`}
                                >
                                    <achievement.icon className={`h-8 w-8 text-${achievement.color}-400`} />
                                </div>
                                <div className={`text-3xl font-black md:text-4xl text-${achievement.color}-400 mb-2`}>{achievement.value}</div>
                                <div className="text-sm font-medium text-gray-300">{achievement.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Testimonial Section */}
                <div className="mt-20 rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-12 backdrop-blur-xl">
                    <div className="text-center">
                        <div className="mb-6 flex justify-center">
                            <div className="rounded-full bg-gradient-to-r from-amber-400 to-amber-600 p-4">
                                <Quote className="h-8 w-8 text-black" />
                            </div>
                        </div>
                        <blockquote className="mx-auto mb-6 max-w-4xl text-2xl leading-relaxed font-bold text-white italic md:text-3xl">
                            "Dr Pullen's approach revolutionized how we think about youth training. Our athletes are stronger, more confident, and
                            genuinely excited about their development."
                        </blockquote>
                        <cite className="text-lg font-medium text-gray-400">— Sarah Mitchell, Head of Youth Development, Elite Sports Academy</cite>
                        <div className="mt-4 flex justify-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
