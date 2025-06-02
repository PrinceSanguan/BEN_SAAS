import React from "react";
import { CheckCircle, Activity, FileText, Users, ArrowRight, BarChart3, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

const Training: React.FC = () => {
  return (
    <section className="py-24 relative bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgMHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAgNHYyaC0ydi0yaDJ6bTAtMTJ2MmgtMnYtMmgyek0zMCAyNHYyaC0ydi0yaDJ6bS00IDRoMnYyaC0ydi0yek0zMCAyMHYyaC0ydi0yaDJ6bS00IDBoMnYyaC0ydi0yek0zNCAyMHYyaC0ydi0yaDJ6bTAgMTJ2MmgtMnYtMmgyek0zMCAyOHYyaC0ydi0yaDJ6bS04IDhoMnYyaC0ydi0yek0zNCAyOHYyaC0ydi0yaDJ6TTI2IDI0djJoLTJ2LTJoMnptLTQgNGgydjJoLTJ2LTJ6bTAgOGgydjJoLTJ2LTJ6bTAtOGg0djJoLTR2LTJ6bTQgMTJ2LTJoMnYyaC0yek0yNiAzNnYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 mix-blend-overlay"></div>
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-950 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold">
                TRAINING PROGRAMS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              A Proven System for Developing
              <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Strong, Confident Young Athletes
              </span>
            </h2>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
            {/* Left Column - Text Content */}
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Our programmes are built for young athletes aged 9–12 who need more than just a generic training plan. We combine science-backed coaching, movement assessments, and engaging guided sessions to deliver real results — without overwhelming parents with complicated routines or unnecessary information.
              </p>

              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                We focus on long-term athletic development. Your child will become stronger, faster, and more resilient — both physically and mentally. But more importantly, they'll develop the confidence and competence to enjoy sport and excel in it.
              </p>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                From the outset, you'll receive clear insights into your child's performance and a step-by-step plan for how we'll help them improve. You'll have regular check-ins with the expert coaches to ensure everything is on track, and access to a private parent community for ongoing education and support.
              </p>

              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">
                  While each coaching plan is tailored to the individual, every athlete benefits from:
                </h3>
                <ul className="space-y-4 pl-0 list-none">
                  {[
                    "Expert-led movement and physical performance assessments",
                    "Engaging, video-led training sessions",
                    "Ongoing progress reviews and adaptations based on results",
                    "Direct support for parents throughout the journey"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-lg text-blue-300 font-semibold italic">
                This is elite-level development delivered in a way that makes sense for families.
              </p>

              <div className="mt-10">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-6 rounded-lg shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 group">
                  Learn more about our approach
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Right Column - Performance Report Visuals */}
            <div className="relative">
              {/* Main Performance Report Image */}
              <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-700/50 pb-4">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Performance Report</h3>
                </div>

                {/* Performance Metrics Chart/Image - Placeholder */}
                <div className="aspect-[4/3] bg-slate-900/70 rounded-xl overflow-hidden mb-6 border border-slate-700/50 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Activity className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Performance metrics visualization would appear here</p>
                  </div>
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "Speed", value: "8.5", icon: <Target className="h-4 w-4 text-blue-400" />, change: "+12%" },
                    { label: "Strength", value: "7.2", icon: <Award className="h-4 w-4 text-blue-400" />, change: "+8%" },
                    { label: "Endurance", value: "9.0", icon: <Activity className="h-4 w-4 text-blue-400" />, change: "+15%" },
                    { label: "Agility", value: "8.3", icon: <Users className="h-4 w-4 text-blue-400" />, change: "+10%" }
                  ].map((metric, index) => (
                    <div key={index} className="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {metric.icon}
                          <span className="text-gray-400 text-sm">{metric.label}</span>
                        </div>
                        <span className="text-green-400 text-xs font-semibold">{metric.change}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Document */}
              <div className="absolute -bottom-8 -left-8 bg-slate-800/90 backdrop-blur-md p-4 rounded-lg shadow-2xl border border-slate-700/50 max-w-[200px] transform rotate-[-5deg] z-20">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-white">Movement Screening</h4>
                </div>
                <div className="bg-slate-900/70 rounded-lg h-24 mb-2 flex items-center justify-center">
                  <p className="text-gray-400 text-xs text-center">Movement analysis visualization</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Score:</span>
                  <span className="text-white font-bold">87/100</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 border-2 border-dashed border-blue-500/20 rounded-lg z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 border-2 border-dashed border-cyan-500/20 rounded-lg z-0"></div>
            </div>
          </div>

          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 backdrop-blur-md rounded-xl p-8 border border-blue-500/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to develop your young athlete's potential?</h3>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Join our program today and give your child the foundation they need for athletic success.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg text-lg font-semibold">
              Get Started Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Training;
