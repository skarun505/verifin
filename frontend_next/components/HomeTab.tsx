'use client'

import React from 'react'

export default function HomeTab() {
    return (
        <div className="space-y-16 pb-12 w-full max-w-6xl mx-auto px-4">
            {/* Hero Section - Brand & Tagline */}
            <div className="text-center py-24 relative overflow-hidden rounded-3xl glass border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl" />
                <div className="relative z-10 px-4">
                    <h1 className="text-7xl font-bold text-transparent bg-clip-text gradient-primary">
                        VeriFin
                    </h1>
                </div>
            </div>

            {/* Problem & Solution Section */}
            <div className="glass rounded-3xl p-12 border border-white/10">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* The Problem */}
                    <div>
                        <div className="text-4xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-white mb-4">The Problem</h2>
                        <p className="text-gray-300 leading-relaxed">
                            Traditional financial analysis is fragmented across multiple platforms, time-consuming,
                            and requires extensive manual research to make informed investment decisions.
                        </p>
                    </div>

                    {/* Who Struggles */}
                    <div>
                        <div className="text-4xl mb-4">👥</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Who Struggles</h2>
                        <ul className="text-gray-300 leading-relaxed space-y-2">
                            <li>💼 Individual Investors</li>
                            <li>📊 Financial Analysts</li>
                            <li>🎓 Students & Researchers</li>
                            <li>🏢 Small Investment Firms</li>
                        </ul>
                    </div>

                    {/* Our Solution */}
                    <div>
                        <div className="text-4xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Our Solution</h2>
                        <p className="text-gray-300 leading-relaxed">
                            VeriFin consolidates real-time market data, AI-powered document analysis, and
                            intelligent company comparisons into one unified platform.
                        </p>
                    </div>
                </div>
            </div>

            {/* What Users Will Experience */}
            <div className="glass rounded-3xl p-12 border border-white/10">
                <h2 className="text-4xl font-bold text-white mb-8 text-center">
                    What Users Will Experience
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <ExperienceCard
                        icon="📊"
                        title="Real-Time Company Analysis"
                        description="Instant access to live financial data, stock prices, and comprehensive company overviews for 100+ Indian and global companies."
                    />
                    <ExperienceCard
                        icon="🤖"
                        title="AI-Powered Document Analysis"
                        description="Upload financial documents (PDFs) and get instant AI-generated insights, summaries, and key metrics extraction."
                    />
                    <ExperienceCard
                        icon="⚖️"
                        title="Intelligent Company Comparison"
                        description="Side-by-side comparison of multiple companies with AI-driven insights on competitive advantages and market positioning."
                    />
                    <ExperienceCard
                        icon="💬"
                        title="Interactive AI Chat"
                        description="Ask questions about companies, markets, or financial concepts and get intelligent, context-aware answers."
                    />
                </div>
            </div>

            {/* Important Disclaimer */}
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-3xl p-10">
                <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">⚠️</div>
                    <div>
                        <h3 className="text-2xl font-bold text-red-300 mb-4">Important Disclaimer</h3>
                        <div className="text-gray-300 space-y-3 leading-relaxed">
                            <p>
                                <strong>VeriFin is for informational and educational purposes only.</strong> The content provided does not constitute
                                financial, investment, or legal advice.
                            </p>
                            <p>
                                All data is sourced from publicly available information and should not be used as the sole basis for making
                                investment decisions. Users are strongly advised to consult with qualified financial professionals before making
                                any investment or financial decisions.
                            </p>
                            <p>
                                <strong>VeriFin Inc. and its data providers</strong> do not guarantee the accuracy, completeness, or timeliness
                                of the information. Past performance is not indicative of future results.
                            </p>
                            <p className="text-red-400 font-semibold">
                                ⚡ Investing involves risk, including the potential loss of principal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Minimal Footer */}
            <div className="text-center pt-12 pb-6 border-t border-white/10">
                <p className="text-gray-500 text-sm">
                    © 2026 VeriFin Inc. All rights reserved.
                </p>
            </div>
        </div>
    )
}

function ExperienceCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105">
            <div className="text-5xl mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    )
}
