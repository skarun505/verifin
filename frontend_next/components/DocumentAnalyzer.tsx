'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { apiClient, API_BASE } from '@/lib/api'

export default function DocumentAnalyzer() {
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)
    const [error, setError] = useState('')
    const [downloading, setDownloading] = useState(false)

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

    const downloadPDFReport = async () => {
        if (!analysis) return
        setDownloading(true)

        try {
            const input = document.getElementById('analysis-report')
            if (!input) return

            // Capture the visual report
            const canvas = await html2canvas(input, {
                scale: 2,
                backgroundColor: '#0f172a', // Match theme background
                useCORS: true,
                logging: false
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            })

            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            // Add Header
            pdf.setFillColor(15, 23, 42) // Slate 900
            pdf.rect(0, 0, pdfWidth, 20, 'F')
            pdf.setFontSize(16)
            pdf.setTextColor(255, 255, 255)
            pdf.text('VeriFin Analysis Report', 105, 12, { align: 'center' })

            // Add Image
            pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight)

            pdf.save(`${file?.name.replace('.pdf', '')}_Analysis.pdf`)
        } catch (error) {
            console.error('PDF Generation Error:', error)
            alert('Failed to generate PDF')
        } finally {
            setDownloading(false)
        }
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
                        <div className="text-6xl mb-4 text-white/50">📄</div>
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
                            <span className="text-3xl text-white/50">📄</span>
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

            {/* Loading - Fixed Spinner */}
            {loading && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <div className="text-xl font-semibold text-white mb-2">Analyzing Document...</div>
                    <p className="text-gray-400 text-sm">Extracting text, financial data, and insights</p>
                </div>
            )}

            {/* Analysis Results */}
            {analysis && !loading && (
                <div className="space-y-6">
                    {/* Capture Wrapper */}
                    <div id="analysis-report" className="space-y-6 p-4 rounded-xl">
                        {/* Document Info */}
                        <div className="glass rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">Document Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <InfoCard icon="📝" label="Type" value={analysis.document_type} />
                                <InfoCard icon="📊" label="Words" value={analysis.word_count?.toLocaleString() || 'N/A'} />
                                <InfoCard icon="📋" label="Characters" value={analysis.text_length?.toLocaleString() || 'N/A'} />
                                <InfoCard icon="💡" label="Sentiment" value={analysis.sentiment} />
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="glass rounded-2xl p-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/50">
                            <h3 className="text-2xl font-bold text-white mb-4">Summary</h3>
                            <p className="text-gray-200 leading-relaxed text-justify">{analysis.summary}</p>
                        </div>

                        {/* Financial Data */}
                        {analysis.financial_data && Object.keys(analysis.financial_data).length > 0 && (
                            <div className="glass rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">Extracted Financial Data</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(analysis.financial_data).map(([key, value]: [string, any]) => (
                                        <div key={key} className="p-4 rounded-xl bg-green-500/20 border border-green-500/50 flex justify-between items-center">
                                            <span className="text-green-300 text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="text-2xl font-bold text-white">₹{value}</span>
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
                                            <span className="text-2xl mt-1">✨</span>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-white mb-1">{insight.title}</h4>
                                                <p className="text-gray-300">{insight.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Download Report */}
                    <div className="text-center pb-8">
                        <button
                            onClick={downloadPDFReport}
                            disabled={downloading}
                            className="px-8 py-4 gradient-success rounded-xl font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 mx-auto disabled:opacity-50"
                        >
                            <span className="text-xl mr-2">{downloading ? '⏳' : '📥'}</span>
                            {downloading ? 'Generating PDF...' : 'Download Analysis Report'}
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

            {/* Help Section when no analysis */}
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

function InfoCard({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-white/5 rounded-xl p-4 text-center">
            <div className="text-2xl mb-2 text-purple-400">{icon}</div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-lg font-bold text-white">{value}</p>
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
