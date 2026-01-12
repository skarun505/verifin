import React from 'react';

export default function HomeTab() {
    return (
        <div className="space-y-16 pb-12 w-full">
            {/* Market Ticker */}
            <div className="overflow-hidden bg-black/20 backdrop-blur-sm border-y border-white/5 py-2 -mx-4 md:-mx-8">
                <div className="flex justify-between items-center text-xs md:text-sm font-mono text-gray-400 whitespace-nowrap overflow-x-auto scrollbar-hide px-4 gap-8">
                    <span className="flex items-center gap-2"><span className="text-green-400">▲</span> NIFTY 50 <span className="text-white">22,145.60</span> (+0.85%)</span>
                    <span className="flex items-center gap-2"><span className="text-green-400">▲</span> SENSEX <span className="text-white">73,158.20</span> (+0.72%)</span>
                    <span className="flex items-center gap-2"><span className="text-red-400">▼</span> BANKNIFTY <span className="text-white">46,580.00</span> (-0.30%)</span>
                    <span className="flex items-center gap-2"><span className="text-green-400">▲</span> NASDAQ <span className="text-white">16,274.90</span> (+1.14%)</span>
                    <span className="flex items-center gap-2"><span className="text-yellow-400">●</span> GOLD <span className="text-white">65,400.00</span> (+0.10%)</span>
                </div>
            </div>

            {/* Hero Section */}
            <div className="text-center py-20 relative overflow-hidden rounded-3xl glass border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl" />
                <div className="relative z-10 px-4">
                    <h1 className="text-6xl font-bold text-transparent bg-clip-text gradient-primary mb-6">
                        Financial Intelligence Reimagined
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        VeriFin unifies real-time market data, AI-driven document analysis, and intelligent comparisons into a single, professional ecosystem.
                    </p>
                    <div className="flex justify-center gap-4 mt-8">
                        <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-green-400">●</span> Live Market Data
                        </div>
                        <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 flex items-center gap-2">
                            <span className="text-purple-400">●</span> Generative AI
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Companies Tracked" value="50+" suffix="" delay="0" />
                <StatCard label="Data Points" value="1M+" suffix="" delay="100" />
                <StatCard label="Analysis Speed" value="<2s" suffix="" delay="200" />
                <StatCard label="AI Accuracy" value="99.9" suffix="%" delay="300" />
            </div>

            {/* Trusted By / Data Sources */}
            <div className="text-center">
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-6">Integrated with Global Data Sources</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-2xl font-bold text-white flex items-center gap-2"><span className="text-blue-500">⦿</span> NSE</span>
                    <span className="text-2xl font-bold text-white flex items-center gap-2"><span className="text-orange-500">⦿</span> BSE</span>
                    <span className="text-2xl font-bold text-white flex items-center gap-2"><span className="text-green-500">⦿</span> NASDAQ</span>
                    <span className="text-2xl font-bold text-white flex items-center gap-2"><span className="text-purple-500">⦿</span> BLOOMBERG</span>
                </div>
            </div>

            {/* The Process Flow (Detailed View) */}
            <div className="py-4">
                <h2 className="text-4xl font-bold text-white mb-12 text-center">
                    The VeriFin Process
                </h2>
                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-purple-900 via-blue-500 to-purple-900 rounded-full opacity-30"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        <ProcessStep
                            step="01"
                            icon="📥"
                            title="Data Ingestion"
                            desc="We aggregate real-time stock ticks from global markets and accept comprehensive financial documents (PDFs)."
                        />
                        <ProcessStep
                            step="02"
                            icon="🧠"
                            title="AI Analysis"
                            desc="Our advanced Gemini AI engine parses unstructured text, extracting sentiment, risks, and hidden opportunities."
                        />
                        <ProcessStep
                            step="03"
                            icon="🔄"
                            title="Cross-Verification"
                            desc="Extracted insights are cross-referenced with historical market performance and competitor data for validity."
                        />
                        <ProcessStep
                            step="04"
                            icon="🚀"
                            title="Strategic Output"
                            desc="Delivers simplified dashboards, visual comparison charts, and professionally generated PDF reports."
                        />
                    </div>
                </div>
            </div>

            {/* The Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-2xl">!</div>
                        <h3 className="text-2xl font-bold text-white">The Challenge</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        Investors today face fragmented data sources. Annual reports are dense PDFs, news is scattered, and comparing companies manually is error-prone and time-consuming. Raw data lacks context.
                    </p>
                </div>

                <div className="glass p-10 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-2xl">✓</div>
                        <h3 className="text-2xl font-bold text-white">The VeriFin Solution</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        A centralized platform leveraging Generative AI to parse complex documents, provide instant comparative insights, and offer real-time financial intelligence. We turn data into actionable wisdom.
                    </p>
                </div>
            </div>

            {/* Key Highlights / Features */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-10 text-center">Core Capabilities</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    <FeatureCard
                        title="Smart Search"
                        desc="Instant access to public & private company data with fuzzy matching technology."
                        icon="Search"
                    />
                    <FeatureCard
                        title="Visual Comparison"
                        desc="Side-by-side analysis of competitors with interactive charts and financial history."
                        icon="Compare"
                    />
                    <FeatureCard
                        title="AI Document Analysis"
                        desc="Upload annual reports or press releases to extract key insights, sentiment, and risks."
                        icon="Doc"
                    />
                    <FeatureCard
                        title="Intelligent Assistant"
                        desc="Chat with our financial AI to get explanations, summaries, and market context."
                        icon="Chat"
                    />
                </div>
            </div>

            {/* Audience Section (Use Cases) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-8 rounded-2xl border border-white/5 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-4xl mb-4">💼</div>
                    <h3 className="text-xl font-bold text-white mb-2">For Investors</h3>
                    <p className="text-gray-400 text-sm">Conduct rapid due diligence and spot market trends before the crowd.</p>
                </div>
                <div className="glass p-8 rounded-2xl border border-white/5 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-4xl mb-4">🎓</div>
                    <h3 className="text-xl font-bold text-white mb-2">For Students</h3>
                    <p className="text-gray-400 text-sm">Learn financial analysis with AI-explained concepts and real-world data.</p>
                </div>
                <div className="glass p-8 rounded-2xl border border-white/5 text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="text-4xl mb-4">📈</div>
                    <h3 className="text-xl font-bold text-white mb-2">For Analysts</h3>
                    <p className="text-gray-400 text-sm">Automate the boring parts of data collection and focus on strategy.</p>
                </div>
            </div>

            {/* Testimonials */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-10 text-center">Trusted by Professionals</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <TestimonialCard
                        quote="VeriFin saved me hours of reading annual reports. The AI summary is spot on."
                        author="Rahul M."
                        role="Investment Banker"
                    />
                    <TestimonialCard
                        quote="The comparison tool is a game changer. I can see revenue trends instantly."
                        author="Sarah J."
                        role="Retail Investor"
                    />
                    <TestimonialCard
                        quote="Finally, a tool that makes financial data accessible and easy to understand."
                        author="David K."
                        role="MBA Student"
                    />
                </div>
            </div>

            {/* FAQ Section */}
            <div className="glass p-10 rounded-3xl border border-white/5">
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Is the market data real-time?</h3>
                        <p className="text-gray-400">Yes, we stream live market ticks from major global exchanges including NSE, BSE, and NASDAQ with minimal latency.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Can I upload any PDF document?</h3>
                        <p className="text-gray-400">VeriFin's AI is optimized for financial documents like Annual Reports (10-K), Balance Sheets, and Earnings Call Transcripts.</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">How does the fuzzy matching work?</h3>
                        <p className="text-gray-400">Our smart search engine uses advanced algorithms to find companies even if you make typos (e.g., "Reliance" finds "Reliance Industries").</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Is my data secure?</h3>
                        <p className="text-gray-400">We prioritize privacy. Uploaded documents are processed in-memory for analysis and are not permanently stored on our servers.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="glass p-12 rounded-3xl border border-purple-500/30 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Research?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join the future of financial intelligence today. Start exploring data with the power of AI.
                    </p>
                    <button className="px-8 py-4 gradient-primary rounded-xl font-bold text-white shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all">
                        Get Started Now
                    </button>
                </div>
            </div>

            {/* Novelty Section */}
            <div className="glass p-12 rounded-3xl border border-blue-500/20 text-center bg-gradient-to-b from-slate-900 to-slate-800">
                <h2 className="text-3xl font-bold text-white mb-6">Why VeriFin?</h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                    Unlike traditional screeners, VeriFin integrates <strong>unstructured data</strong> (documents) with <strong>structured market data</strong> (stocks). Our novelty lies in the seamless fusion of Generative AI reasoning with precise financial metrics.
                </p>
            </div>
        </div>
    );
}

function ProcessStep({ step, icon, title, desc }: { step: string, icon: string, title: string, desc: string }) {
    return (
        <div className="relative group">
            <div className="glass p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 hover:bg-white/5 transition-all duration-300 h-full">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg z-20">
                    {step}
                </div>
                <div className="mt-6 text-center">
                    <div className="text-4xl mb-4">{icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
                </div>
            </div>
        </div>
    )
}

function TestimonialCard({ quote, author, role }: { quote: string, author: string, role: string }) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/5 bg-white/5">
            <div className="text-purple-400 text-4xl font-serif mb-4">"</div>
            <p className="text-gray-300 mb-6 italic">{quote}</p>
            <div>
                <p className="text-white font-bold">{author}</p>
                <p className="text-gray-500 text-sm">{role}</p>
            </div>
        </div>
    )
}

function StatCard({ label, value, suffix, delay }: { label: string, value: string, suffix: string, delay: string }) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/5 text-center transform hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold text-white mb-1 gradient-text-primary">
                {value}<span className="text-lg text-purple-400">{suffix}</span>
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{label}</p>
        </div>
    )
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4 font-bold">
                {icon === 'Search' && '🔍'}
                {icon === 'Compare' && '📊'}
                {icon === 'Doc' && '📄'}
                {icon === 'Chat' && '💬'}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    )
}
