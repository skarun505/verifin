'use client'

import { useState } from 'react'
import CompanySearch from '@/components/CompanySearch'
import CompanyOverview from '@/components/CompanyOverview'
import CompanyComparison from '@/components/CompanyComparison'
import AiChat from '@/components/AiChat'
import DocumentAnalyzer from '@/components/DocumentAnalyzer'
import HomeTab from '@/components/HomeTab'

export default function Home() {
    const [activeTab, setActiveTab] = useState('home')
    const [selectedCompany, setSelectedCompany] = useState<any>(null)

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'search', label: 'Search' }, // Merged Search & Overview
        { id: 'compare', label: 'Compare' },
        { id: 'chat', label: 'AI Chat' },
        { id: 'document', label: 'Documents' },
    ]

    return (
        <main className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="glass border-b border-white/10 flex-none">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center overflow-hidden p-2 bg-white">
                                <img src="/logo.png" alt="VeriFin Logo" className="w-full h-full object-contain" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">VeriFin</h1>
                                <p className="text-sm text-gray-300">Financial Intelligence Platform</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-wrap gap-3 justify-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${activeTab === tab.id
                                ? 'gradient-primary text-white shadow-lg shadow-purple-500/50'
                                : 'glass text-gray-300 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'home' && (
                        <HomeTab />
                    )}

                    {activeTab === 'search' && (
                        <CompanySearch
                            onCompanySelect={(company) => {
                                setSelectedCompany(company)
                                setActiveTab('overview')
                            }}
                        />
                    )}

                    {activeTab === 'overview' && (
                        <CompanyOverview company={selectedCompany} />
                    )}

                    {activeTab === 'compare' && (
                        <CompanyComparison />
                    )}

                    {activeTab === 'chat' && (
                        <AiChat />
                    )}

                    {activeTab === 'document' && (
                        <DocumentAnalyzer />
                    )}
                </div>
            </div>

        </main>
    )
}
