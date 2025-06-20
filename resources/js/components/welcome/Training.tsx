// resources/js/components/welcome/Training.tsx
import { Button } from '@/components/ui/button';
import { Activity, ArrowRight, Award, BarChart3, CheckCircle, FileText, Target, Users } from 'lucide-react';
import React from 'react';

interface TrainingProps {
    pageContent: Record<string, Record<string, string>>;
}

const Training: React.FC<TrainingProps> = ({ pageContent }) => {
    // Get training content
    const training = pageContent?.training || {};

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-24">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAtMTJ2MmgtMnYtMmgyek0zMCAyNHYyaC0ydi0yaDJ6bS00IDRoMnYyaC0ydi0yek0zMCAyMHYyaC0ydi0yaDJ6bS00IDBoMnYyaC0ydi0yek0zNCAyMHYyaC0ydi0yaDJ6bTAgMTJ2MmgtMnYtMmgyek0zMCAyOHYyaC0ydi0yaDJ6bS04IDhoMnYyaC0ydi0yek0zNCAyOHYyaC0ydi0yaDJ6TTI2IDI0djJoLTJ2LTJoMnptLTQgNGgydjJoLTJ2LTJ6bTAgOGgydjJoLTJ2LTJ6bTAtOGg0djJoLTR2LTJ6bTQgMTJ2LTJoMnYyaC0yek0yNiAzNnYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 to-transparent"></div>
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent"></div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="mb-16 text-center">
                        <div className="mb-4 inline-flex items-center justify-center">
                            <span className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-sm font-semibold text-blue-400">
                                TRAINING PROGRAMS
                            </span>
                        </div>
                        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                            {training.section_title || 'A Proven System for Developing'}
                            <span className="mt-2 block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                {training.title_highlight || 'Strong, Confident Young Athletes'}
                            </span>
                        </h2>
                    </div>

                    {/* Main Content */}
                    <div className="mb-16 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        {/* Left Column - Text Content */}
                        <div className="prose prose-lg prose-invert max-w-none">
                            <p className="mb-6 text-lg leading-relaxed text-gray-300">
                                {training.intro_text ||
                                    'Our programmes are built for young athletes aged 9–12 who need more than just a generic training plan. We combine science-backed coaching, movement assessments, and engaging guided sessions to deliver real results — without overwhelming parents with complicated routines or unnecessary information.'}
                            </p>

                            <p className="mb-6 text-lg leading-relaxed text-gray-300">
                                {training.description_1 ||
                                    "We focus on long-term athletic development. Your child will become stronger, faster, and more resilient — both physically and mentally. But more importantly, they'll develop the confidence and competence to enjoy sport and excel in it."}
                            </p>

                            <p className="mb-10 text-lg leading-relaxed text-gray-300">
                                {training.description_2 ||
                                    "From the outset, you'll receive clear insights into your child's performance and a step-by-step plan for how we'll help them improve. You'll have regular check-ins with the expert coaches to ensure everything is on track, and access to a private parent community for ongoing education and support."}
                            </p>

                            <div className="mb-8 rounded-xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-md">
                                <h3 className="mb-4 text-xl font-bold text-white">
                                    {training.benefits_title ||
                                        'While each coaching plan is tailored to the individual, every athlete benefits from:'}
                                </h3>
                                <ul className="list-none space-y-4 pl-0">
                                    {[
                                        training.benefit_1 || 'Expert-led movement and physical performance assessments',
                                        training.benefit_2 || 'Engaging, video-led training sessions',
                                        training.benefit_3 || 'Ongoing progress reviews and adaptations based on results',
                                        training.benefit_4 || 'Direct support for parents throughout the journey',
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-blue-400" />
                                            <span className="text-gray-300">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="text-lg font-semibold text-blue-300 italic">
                                {training.closing_statement || 'This is elite-level development delivered in a way that makes sense for families.'}
                            </p>

                            <div className="mt-10">
                                <Button className="group rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-500/40">
                                    {training.cta_button || 'Learn more about our approach'}
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Column - Performance Report Visuals */}
                        <div className="relative">
                            {/* Main Performance Report Image */}
                            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/70 p-6 shadow-2xl backdrop-blur-md">
                                <div className="mb-4 flex items-center gap-3 border-b border-slate-700/50 pb-4">
                                    <BarChart3 className="h-6 w-6 text-blue-400" />
                                    <h3 className="text-xl font-bold text-white">Performance Report</h3>
                                </div>

                                {/* Performance Metrics Chart/Image - Placeholder */}
                                <div className="mb-6 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/70">
                                    {training.report_image ? (
                                        <img
                                            src={`/upload-image/${training.report_image}`}
                                            alt="Performance Report"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="p-6 text-center">
                                            <Activity className="mx-auto mb-4 h-16 w-16 text-blue-400" />
                                            <p className="text-sm text-gray-400">Performance metrics visualization would appear here</p>
                                        </div>
                                    )}
                                </div>

                                {/* Performance Metrics Grid */}
                                <div className="mb-4 grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Speed', value: '8.5', icon: <Target className="h-4 w-4 text-blue-400" />, change: '+12%' },
                                        { label: 'Strength', value: '7.2', icon: <Award className="h-4 w-4 text-blue-400" />, change: '+8%' },
                                        { label: 'Endurance', value: '9.0', icon: <Activity className="h-4 w-4 text-blue-400" />, change: '+15%' },
                                        { label: 'Agility', value: '8.3', icon: <Users className="h-4 w-4 text-blue-400" />, change: '+10%' },
                                    ].map((metric, index) => (
                                        <div key={index} className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-4">
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {metric.icon}
                                                    <span className="text-sm text-gray-400">{metric.label}</span>
                                                </div>
                                                <span className="text-xs font-semibold text-green-400">{metric.change}</span>
                                            </div>
                                            <div className="text-2xl font-bold text-white">{metric.value}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Document */}
                            <div className="absolute -bottom-8 -left-8 z-20 max-w-[200px] rotate-[-5deg] transform rounded-lg border border-slate-700/50 bg-slate-800/90 p-4 shadow-2xl backdrop-blur-md">
                                <div className="mb-2 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-blue-400" />
                                    <h4 className="text-sm font-bold text-white">Movement Screening</h4>
                                </div>
                                <div className="mb-2 flex h-24 items-center justify-center rounded-lg bg-slate-900/70">
                                    {training.screening_image ? (
                                        <img
                                            src={`/upload-image/${training.screening_image}`}
                                            alt="Movement Screening"
                                            className="h-full w-full rounded-lg object-cover"
                                        />
                                    ) : (
                                        <p className="text-center text-xs text-gray-400">Movement analysis visualization</p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-400">Score:</span>
                                    <span className="font-bold text-white">87/100</span>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-6 -right-6 z-0 h-32 w-32 rounded-lg border-2 border-dashed border-blue-500/20"></div>
                            <div className="absolute -right-6 -bottom-6 z-0 h-40 w-40 rounded-lg border-2 border-dashed border-cyan-500/20"></div>
                        </div>
                    </div>

                    {/* Summary Banner */}
                    <div className="rounded-xl border border-blue-500/20 bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-8 text-center backdrop-blur-md">
                        <h3 className="mb-4 text-2xl font-bold text-white">
                            {training.banner_title || "Ready to develop your young athlete's potential?"}
                        </h3>
                        <p className="mx-auto mb-6 max-w-3xl text-lg text-gray-300">
                            {training.banner_description ||
                                'Join our program today and give your child the foundation they need for athletic success.'}
                        </p>
                        <Button size="lg" className="rounded-lg bg-blue-600 px-8 py-6 text-lg font-semibold text-white hover:bg-blue-700">
                            {training.banner_cta || 'Get Started Today'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Training;
