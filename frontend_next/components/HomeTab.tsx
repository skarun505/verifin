import React from 'react';

export default function HomeTab() {
    return (
        <div className="space-y-12 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center py-16 relative overflow-hidden rounded-3xl glass border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl" />
                <div className="relative z-10">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text gradient-primary mb-6">
                        Financial Intelligence Reimagined
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        VeriFin unifies real-time market data, AI-driven document analysis, and intelligent comparisons into a single, professional ecosystem.
                    </p>
                </div>
            </div>

            {/* The Problem & Solution */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-bold text-xl">!</div>
                        <h3 className="text-2xl font-bold text-white">The Challenge</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        Investors today face fragmented data sources. Annual reports are dense PDFs, news is scattered, and comparing companies manually is error-prone and time-consuming. Raw data lacks context.
                    </p>
                </div>

                <div className="glass p-8 rounded-3xl border border-white/5 hover:border-green-500/30 transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xl">✓</div>
                        <h3 className="text-2xl font-bold text-white">The VeriFin Solution</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed">
                        A centralized platform leveraging Generative AI to parse complex documents, provide instant comparative insights, and offer real-time financial intelligence. We turn data into actionable wisdom.
                    </p>
                </div>
            </div>

            {/* Key Highlights / Features */}
            <div>
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Capabilities</h2>
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

            {/* Novelty Section */}
            <div className="glass p-10 rounded-3xl border border-blue-500/20 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Why VeriFin?</h2>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                    Unlike traditional screeners, VeriFin integrates <strong>unstructured data</strong> (documents) with <strong>structured market data</strong> (stocks). Our novelty lies in the seamless fusion of Generative AI reasoning with precise financial metrics.
                </p>
            </div>
        </div>
    );
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
