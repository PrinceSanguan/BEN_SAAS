import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, BarChart2, CheckCircle, Clock, Medal, TrendingUp, Users, Zap } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    // Animation variants for scroll reveal
    const fadeInUp = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                <meta
                    name="description"
                    content="AthleteTrack - The ultimate platform for tracking athletic progress, setting goals, and achieving your potential."
                />
            </Head>

            {/* Header/Navigation */}
            <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Activity className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                        <span className="text-xl font-bold">AthleteTrack</span>
                    </div>

                    <nav className="hidden md:flex">
                        <ul className="flex space-x-8">
                            <li>
                                <a
                                    href="#features"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#testimonials"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Testimonials
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="text-sm font-medium text-white">
                                <Button>Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                >
                                    Log in
                                </Link>
                                <Link href={route('register')} className="text-sm font-medium text-white">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-20 dark:from-gray-900 dark:to-gray-800">
                <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl filter dark:bg-blue-900/20"></div>
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl filter dark:bg-indigo-900/20"></div>

                <div className="relative container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                            Track Your Athletic Progress
                            <span className="text-blue-600 dark:text-blue-500"> Like Never Before</span>
                        </h1>
                        <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                            Comprehensive analytics, personalized insights, and a supportive community to help you achieve your athletic goals faster.
                        </p>
                        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                            <Button size="lg" className="h-12 px-8">
                                Start Your Free Trial
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8">
                                Watch Demo
                            </Button>
                        </div>
                    </div>

                    {/* Hero Image/Screenshot */}
                    <div className="mt-16 rounded-xl bg-white p-2 shadow-2xl md:p-4 dark:bg-gray-900">
                        <div className="aspect-video overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <div className="h-full w-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                                {/* Dashboard Mockup */}
                                <div className="flex h-full flex-col p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-10 w-10 rounded-full bg-blue-500"></div>
                                            <div className="h-4 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-gray-300 dark:bg-gray-600"></div>
                                            <div className="h-8 w-8 rounded bg-gray-300 dark:bg-gray-600"></div>
                                        </div>
                                    </div>
                                    <div className="grid flex-1 grid-cols-3 gap-4">
                                        <div className="col-span-2 rounded-lg bg-white p-4 shadow-md dark:bg-gray-900">
                                            <div className="mb-2 h-5 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                                            <div className="h-40 rounded-md bg-blue-100 dark:bg-blue-900/30"></div>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-900">
                                                <div className="mb-2 h-5 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                                                <div className="h-16 rounded-md bg-green-100 dark:bg-green-900/30"></div>
                                            </div>
                                            <div className="flex-1 rounded-lg bg-white p-4 shadow-md dark:bg-gray-900">
                                                <div className="mb-2 h-5 w-24 rounded bg-gray-300 dark:bg-gray-700"></div>
                                                <div className="h-16 rounded-md bg-purple-100 dark:bg-purple-900/30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Features Designed for Athletes</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Everything you need to track progress, set goals, and achieve your athletic potential.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                    <BarChart2 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Performance Analytics</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Detailed metrics and visualizations to track your progress over time.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 2 */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Goal Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Set personalized goals and track your progress with automatic updates.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 3 */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
                                    <Medal className="h-8 w-8 text-purple-600 dark:text-purple-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Achievement System</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Earn badges and rewards as you hit milestones and improve your performance.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 4 */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/30">
                                    <Users className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Community Challenges</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Compete with other athletes and participate in community challenges.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 5 */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                                    <Zap className="h-8 w-8 text-red-600 dark:text-red-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Personalized Insights</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Get AI-powered recommendations to optimize your training and recovery.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Feature 6 */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="flex flex-col items-center p-6 text-center">
                                <div className="mb-4 rounded-full bg-teal-100 p-3 dark:bg-teal-900/30">
                                    <Clock className="h-8 w-8 text-teal-600 dark:text-teal-500" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Training History</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Comprehensive records of all your training sessions and achievements.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="bg-gray-50 py-20 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">What Athletes Say</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Join thousands of athletes who have transformed their training with our platform.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Testimonial 1 */}
                        <Card className="bg-white dark:bg-gray-800">
                            <CardContent className="p-6">
                                <div className="mb-4 flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <p className="mb-4 text-gray-600 dark:text-gray-300">
                                    "This platform has completely transformed how I track my progress. The insights helped me improve my marathon time
                                    by 15 minutes!"
                                </p>
                                <div className="flex items-center">
                                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Marathon Runner</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Testimonial 2 */}
                        <Card className="bg-white dark:bg-gray-800">
                            <CardContent className="p-6">
                                <div className="mb-4 flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <p className="mb-4 text-gray-600 dark:text-gray-300">
                                    "As a coach, this tool has been invaluable for tracking my team's performance. The analytics provide insights I
                                    never had access to before."
                                </p>
                                <div className="flex items-center">
                                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div className="h-full w-full bg-gradient-to-br from-green-400 to-blue-500"></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Michael Rodriguez</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Basketball Coach</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Testimonial 3 */}
                        <Card className="bg-white dark:bg-gray-800">
                            <CardContent className="p-6">
                                <div className="mb-4 flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <p className="mb-4 text-gray-600 dark:text-gray-300">
                                    "The community features have connected me with other athletes who push me to improve. I've seen a 20% increase in
                                    my personal records!"
                                </p>
                                <div className="flex items-center">
                                    <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div className="h-full w-full bg-gradient-to-br from-yellow-400 to-red-500"></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Emily Chen</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">CrossFit Athlete</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto mb-16 max-w-3xl text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Choose the plan that fits your athletic journey.</p>
                    </div>

                    <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                        {/* Basic Plan */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="p-6">
                                <div className="mb-4 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Starter</h3>
                                    <div className="my-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">$9</span>
                                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Perfect for individual athletes just starting out</p>
                                </div>
                                <ul className="mb-6 space-y-3">
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Basic performance tracking</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Goal setting tools</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>7-day training history</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Community access</span>
                                    </li>
                                </ul>
                                <Button className="w-full">Get Started</Button>
                            </CardContent>
                        </Card>

                        {/* Pro Plan */}
                        <Card className="relative border-2 border-blue-500 bg-white shadow-lg dark:bg-gray-900">
                            <div className="absolute -top-4 right-0 left-0 mx-auto w-fit rounded-full bg-blue-500 px-4 py-1 text-center text-xs font-semibold text-white">
                                MOST POPULAR
                            </div>
                            <CardContent className="p-6">
                                <div className="mb-4 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pro</h3>
                                    <div className="my-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">$19</span>
                                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">For dedicated athletes seeking advanced insights</p>
                                </div>
                                <ul className="mb-6 space-y-3">
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Advanced analytics dashboard</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Personalized training insights</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Full training history</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Progress reports & exports</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Priority community features</span>
                                    </li>
                                </ul>
                                <Button className="w-full" variant="default">
                                    Get Started
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Team Plan */}
                        <Card className="border-2 bg-white transition-all hover:border-blue-500 hover:shadow-lg dark:bg-gray-900">
                            <CardContent className="p-6">
                                <div className="mb-4 text-center">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Team</h3>
                                    <div className="my-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">$49</span>
                                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">For coaches and teams of up to 15 athletes</p>
                                </div>
                                <ul className="mb-6 space-y-3">
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Team management dashboard</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Comparative team analytics</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Coach-specific insights</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Team goals & challenges</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Advanced reporting</span>
                                    </li>
                                    <li className="flex items-center text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <Button className="w-full">Contact Sales</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-20 text-white dark:bg-blue-800">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="mb-6 text-3xl font-bold">Ready to Transform Your Athletic Journey?</h2>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                        Join thousands of athletes who are reaching their full potential with our comprehensive tracking platform.
                    </p>
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-900 dark:text-blue-400 dark:hover:bg-gray-800">
                        Start Your Free 14-Day Trial
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 py-12 text-gray-400">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="mb-4 flex items-center gap-2">
                                <Activity className="h-6 w-6 text-blue-500" />
                                <span className="text-lg font-bold text-white">AthleteTrack</span>
                            </div>
                            <p className="mb-4">Helping athletes track, analyze, and improve their performance with cutting-edge technology.</p>
                            <div className="flex space-x-4">
                                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                    </svg>
                                </a>
                                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-4 text-lg font-semibold text-white">Features</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Performance Analytics
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Goal Tracking
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Training Log
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Community Challenges
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Team Management
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-lg font-semibold text-white">Resources</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Blog
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Success Stories
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        API Documentation
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Guides & Tutorials
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 text-lg font-semibold text-white">Company</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="hover:text-white">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Careers
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Privacy Policy
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-white">
                                        Contact Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 border-t border-gray-800 pt-8 text-center">
                        <p>&copy; {new Date().getFullYear()} AthleteTrack. All rights reserved.</p>
                        <p className="mt-2 text-sm">Made with ❤️ by dielawn</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
