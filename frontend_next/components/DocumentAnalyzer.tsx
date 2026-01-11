'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import { apiClient, API_BASE } from '@/lib/api'

export default function DocumentAnalyzer() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [error, setError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            if (selectedFile.type === 'application/pdf') {
                setFile(selectedFile)
                setError('')
            } else {
                setError('Please select a PDF file')
                setFile(null)
            }
        }
    }

    const analyzeDocument = async () => {
        if (!file) {
            setError('Please select a PDF file first')
            return
        }

        setLoading(true)
        setError('')
        setAnalysis(null)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch(`${API_BASE}/document-analyze-upload`, {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.success) {
                setAnalysis(data)
            } else {
                setError(data.detail || 'Analysis failed')
            }
        } catch (err: any) {
            setError(err.message || 'Failed to analyze document')
        } finally {
            setLoading(false)
        }
    }

    const downloadPDFReport = () => {
        if (!analysis) return

        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        let y = 20

        // Title
        doc.setFontSize(22)
        doc.setTextColor(41, 98, 255) // Blue
        doc.text('VeriFin Analysis Report', pageWidth / 2, y, { align: 'center' })
        y += 15

        // Metadata
        doc.setFontSize(10)
        doc.setTextColor(100)
        doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' })
        doc.text(`File: ${file?.name || 'Unknown'}`, pageWidth / 2, y + 6, { align: 'center' })
        y += 20

        // Divider
        doc.setDrawColor(200)
        doc.line(15, y, pageWidth - 15, y)
        y += 15

        // Document Info
        doc.setFontSize(14)
        doc.setTextColor(0)
        doc.text('📄 Document Information', 15, y)
        y += 10
        doc.setFontSize(11)
        doc.text(`• Type: ${analysis.document_type}`, 20, y)
        doc.text(`• Company: ${analysis.company}`, 20, y + 6)
        doc.text(`• Sentiment: ${analysis.sentiment}`, 20, y + 12)
        y += 25

        // Financial Data
        if (analysis.financial_data) {
            doc.setFontSize(14)
            doc.text('💰 Key Financial Metrics', 15, y)
            y += 10
            doc.setFontSize(11)
            Object.entries(analysis.financial_data).forEach(([key, value]) => {
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                doc.text(`• ${formattedKey}: ${value}`, 20, y)
                y += 6
            })
            y += 10
        }

        // Summary
        doc.setFontSize(14)
        doc.text('📋 Executive Summary', 15, y)
        y += 10
        doc.setFontSize(11)
        const summaryLines = doc.splitTextToSize(analysis.summary, pageWidth - 30)
        doc.text(summaryLines, 20, y)
        y += (summaryLines.length * 6) + 10

        // Insights
        if (analysis.insights && analysis.insights.length > 0) {
            // Check if we need a new page
            if (y > 230) {
                doc.addPage()
                y = 20
            }
            doc.setFontSize(14)
            doc.text('💡 Strategic Insights', 15, y)
            y += 10
            doc.setFontSize(11)
            analysis.insights.forEach((insight: any) => {
                doc.setFont('helvetica', 'bold')
                doc.text(`• ${insight.title}`, 20, y)
                doc.setFont('helvetica', 'normal')
                const descLines = doc.splitTextToSize(insight.description, pageWidth - 40)
                doc.text(descLines, 25, y + 5)
                y += (descLines.length * 5) + 10

                if (y > 270) {
                    doc.addPage()
                    y = 20
                }
            })
        }

        // Footer
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setTextColor(150)
            doc.text('VeriFin - AI Financial Intelligence Platform', pageWidth / 2, 285, { align: 'center' })
        }

        doc.save(`${file?.name.replace('.pdf', '')}_Analysis_Report.pdf`)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass rounded-2xl p-8 text-center">
                <h2 className="text-4xl font-bold text-white mb-3">
                    Document Analyzer
                </h2>
                <p className="text-gray-300">
                    Upload financial PDFs for AI-powered analysis
                </p>
            </div>

            {/* Upload Area */}
            <div className="glass rounded-2xl p-8">
                <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-purple-400 transition-colors">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="text-6xl mb-4 text-white/50">File Upload</div>
                        <p className="text-2xl font-semibold text-white mb-2">
                            {file ? file.name : 'Choose PDF File'}
                        </p>
                        <p className="text-gray-400 mb-4">
                            Or drag and drop here
                        </p>
                        <div className="inline-block px-6 py-3 gradient-primary rounded-xl font-semibold text-white hover:shadow-lg transition-all">
                            Browse Files
                        </div>
                    </label>
                </div>

                {file && (
                    <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-white/10">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl text-white/50">Full PDF</span>
                            <div>
                                <p className="text-white font-semibold">{file.name}</p>
                                <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={analyzeDocument}
                            disabled={loading}
                            className="px-6 py-3 gradient-success rounded-xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Document'}
                        </button>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="glass rounded-2xl p-6 border border-red-500/50">
                    <p className="text-red-300">Error: {error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="animate-spin text-6xl mb-4 text-purple-500">Loading...</div>
                    <p className="text-gray-300">Analyzing document with AI...</p>
                    <p className="text-gray-400 text-sm mt-2">Extracting text, financial data, and insights</p>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && !loading && (
                <div className="space-y-6">
                    {/* Document Info */}
                    <div className="glass rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Document Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <InfoCard icon="Type" label="Type" value={analysis.document_type} />
                            <InfoCard icon="Words" label="Words" value={analysis.word_count?.toLocaleString() || 'N/A'} />
                            <InfoCard icon="Chars" label="Characters" value={analysis.text_length?.toLocaleString() || 'N/A'} />
                            <InfoCard icon="Sentiment" label="Sentiment" value={analysis.sentiment} />
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="glass rounded-2xl p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50">
                        <h3 className="text-2xl font-bold text-white mb-4">Summary</h3>
                        <p className="text-gray-200 leading-relaxed">{analysis.summary}</p>
                    </div>

                    {/* Financial Data */}
                    {analysis.financial_data && Object.keys(analysis.financial_data).length > 0 && (
                        <div className="glass rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Extracted Financial Data</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(analysis.financial_data).map(([key, value]: [string, any]) => (
                                    <div key={key} className="p-4 rounded-xl bg-green-500/20 border border-green-500/50">
                                        <p className="text-green-300 text-sm mb-1">{key.replace('_', ' ')}</p>
                                        <p className="text-2xl font-bold text-white">₹{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Insights */}
                    {analysis.insights && analysis.insights.length > 0 && (
                        <div className="glass rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Key Insights</h3>
                            <div className="space-y-4">
                                {analysis.insights.map((insight: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-4xl">{insight.icon}</span>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-semibold text-white mb-1">{insight.title}</h4>
                                            <p className="text-gray-300">{insight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Download Report */}
                    <div className="text-center">
                        <button
                            onClick={downloadPDFReport}
                            className="px-8 py-4 gradient-success rounded-xl font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto"
                        >
                            <span className="text-xl"></span>
                            Download Analysis Report
                        </button>
                    </div>

                    {/* Try Another */}
                    <div className="text-center">
                        <button
                            onClick={() => {
                                setFile(null)
                                setAnalysis(null)
                                setError('')
                            }}
                            className="px-6 py-3 bg-white/10 rounded-xl font-semibold text-white hover:bg-white/20 transition-all"
                        >
                            Analyze Another Document
                        </button>
                    </div>
                </div>
            )}

            {/* Help Section */}
            {!analysis && !loading && (
                <div className="glass rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">What can this do?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FeatureCard
                            icon="Type"
                            title="Document Type Detection"
                            description="Automatically identifies annual reports, quarterly reports, balance sheets"
                        />
                        <FeatureCard
                            icon="Metrics"
                            title="Financial Data Extraction"
                            description="Extracts revenue, profit, assets, and other key metrics"
                        />
                        <FeatureCard
                            icon="Sentiment"
                            title="Sentiment Analysis"
                            description="Analyzes tone to determine positive, neutral, or negative outlook"
                        />
                        <FeatureCard
                            icon="AI"
                            title="Smart Insights"
                            description="AI-powered analysis to highlight key findings and risks"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
    return (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-xl font-bold mb-2 text-white/50">{icon}</div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xl font-bold text-white/50">{icon}</span>
            <div>
                <h4 className="font-semibold text-white mb-1">{title}</h4>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
        </div>
    )
}
