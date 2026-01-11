'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'

interface CompanySearchProps {
    onCompanySelect?: (company: any) => void
}

export default function CompanySearch({ onCompanySelect }: CompanySearchProps) {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!query.trim()) {
            setError('Please enter a company name')
            return
        }

        setLoading(true)
        setError('')
        setResult(null)

        try {
            const response = await apiClient.resolveCompany(query)

            if (response.success) {
                setResult(response)
                if (onCompanySelect) {
                    onCompanySelect(response)
                }
            } else {
                setError(response.message || 'Company not found')
                setResult(response)
            }
        } catch (err: any) {
            setError(err.message || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="glass rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-3">
                    🔍 Find Any Company
                </h2>
                <p className="text-gray-300">
                    Search for public companies worldwide with intelligent fuzzy matching
                </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter company name (e.g., Apple, Microsoft, Reliance)"
                        className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 gradient-primary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? '⏳ Searching...' : '🔍 Search'}
                    </button>
                </div>
            </form>

            {/* Error Message */}
            {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200">
                    <p className="font-semibold">❌ {error}</p>
                </div>
            )}

            {/* Search Result */}
            {result && result.success && (
                <div className="mt-8 p-6 rounded-xl bg-green-500/20 border border-green-500/50">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                ✅ {result.name}
                            </h3>
                            <p className="text-gray-300 mb-1">
                                <span className="font-semibold">Ticker:</span> {result.ticker}
                            </p>
                            <p className="text-gray-300 mb-1">
                                <span className="font-semibold">Type:</span> {result.type}
                            </p>
                            {result.confidence && (
                                <p className="text-gray-300">
                                    <span className="font-semibold">Confidence:</span> {result.confidence}%
                                </p>
                            )}
                        </div>
                        <div className="text-6xl">✅</div>
                    </div>
                </div>
            )}

            {/* Suggestions */}
            {result && !result.success && result.suggestions && (
                <div className="mt-6 p-6 rounded-xl bg-blue-500/20 border border-blue-500/50">
                    <h4 className="text-lg font-semibold text-white mb-3">
                        💡 Did you mean?
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {result.suggestions.map((suggestion: string, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => setQuery(suggestion)}
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Example Searches */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-400 mb-3">Try these examples:</p>
                <div className="flex flex-wrap justify-center gap-2">
                    {['Apple', 'Microsoft', 'Tesla', 'Reliance', 'Amazon'].map((example) => (
                        <button
                            key={example}
                            onClick={() => setQuery(example)}
                            className="px-4 py-2 rounded-lg glass text-sm text-gray-300 hover:text-white transition-all"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
