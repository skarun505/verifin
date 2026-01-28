'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface CompanyOverviewProps {
    company?: any
}

export default function CompanyOverview({ company }: CompanyOverviewProps) {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState('')
    const [timeRange, setTimeRange] = useState<'1Y' | '2Y' | '3Y' | '5Y'>('5Y')
    const [downloadingPDF, setDownloadingPDF] = useState(false)

    const downloadPDF = async () => {
        if (!data) return
        setDownloadingPDF(true)

        try {
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            let yPosition = 20

            // ========== PAGE 1: COVER + COMPANY INFO ==========
            // Header with Purple Background
            pdf.setFillColor(139, 92, 246) // Purple
            pdf.rect(0, 0, pageWidth, 40, 'F')
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(24)
            pdf.setFont('helvetica', 'bold')
            pdf.text('VeriFin', 15, 20)
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'normal')
            pdf.text('Financial Intelligence Report', 15, 30)

            yPosition = 50

            // Company Name & Ticker with Symbol
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(20)
            pdf.setFont('helvetica', 'bold')
            pdf.text(data.name, 15, yPosition)
            yPosition += 8

            // Ticker Symbol - Prominently displayed
            pdf.setFontSize(14)
            pdf.setTextColor(139, 92, 246) // Purple
            pdf.text(`Symbol: ${data.ticker} • ${data.sector} • ${data.industry}`, 15, yPosition)
            yPosition += 15

            // Current Price Box
            pdf.setFillColor(240, 240, 255)
            pdf.roundedRect(15, yPosition, 80, 25, 3, 3, 'F')
            pdf.setFontSize(10)
            pdf.setTextColor(100, 100, 100)
            pdf.text('Current Stock Price', 20, yPosition + 7)
            pdf.setFontSize(20)
            pdf.setTextColor(0, 0, 0)
            pdf.setFont('helvetica', 'bold')
            pdf.text(String(data.price), 20, yPosition + 17)

            const changeColor: [number, number, number] = data.change_pct?.startsWith('+') ? [34, 197, 94] : [239, 68, 68] // Green / Red
            pdf.setTextColor(...changeColor)
            pdf.setFontSize(12)
            pdf.text(`${data.change} (${data.change_pct})`, 20, yPosition + 22)
            yPosition += 35

            // Key Metrics Grid
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Key Metrics', 15, yPosition)
            yPosition += 8

            const metrics = [
                ['Market Cap', data.marketCap],
                ['P/E Ratio', String(data.pe_ratio)],
                ['Volume', data.volume],
                ['Dividend Yield', data.dividend_yield],
                ['52W High', data['52_week_high']],
                ['52W Low', data['52_week_low']],
            ]

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            metrics.forEach(([label, value], index) => {
                const xPos = 15 + (index % 2) * 90
                const yPos = yPosition + Math.floor(index / 2) * 10
                pdf.setTextColor(100, 100, 100)
                pdf.text(label, xPos, yPos)
                pdf.setTextColor(0, 0, 0)
                pdf.text(String(value), xPos + 40, yPos)
            })
            yPosition += 40

            // Company Description
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Company Description', 15, yPosition)
            yPosition += 7
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            const descLines = pdf.splitTextToSize(data.description, pageWidth - 30)
            pdf.text(descLines, 15, yPosition)
            yPosition += descLines.length * 5 + 10

            // ========== PAGE 2: CHARTS ==========
            pdf.addPage()
            yPosition = 20

            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Financial Charts & Analysis', 15, yPosition)
            yPosition += 15

            // Render Charts as Images
            const priceChartElement = document.getElementById('price-chart-container')
            const finHistoryChartElement = document.getElementById('financial-history-chart')

            if (priceChartElement) {
                try {
                    const canvas = await html2canvas(priceChartElement, { backgroundColor: '#ffffff' } as any)
                    const imgData = canvas.toDataURL('image/png')
                    pdf.addImage(imgData, 'PNG', 15, yPosition, pageWidth - 30, 80)
                    yPosition += 90
                } catch (e) {
                    console.error('Chart rendering failed:', e)
                }
            }

            if (finHistoryChartElement && yPosition < pageHeight - 100) {
                try {
                    const canvas = await html2canvas(finHistoryChartElement, { backgroundColor: '#ffffff' } as any)
                    const imgData = canvas.toDataURL('image/png')
                    pdf.addImage(imgData, 'PNG', 15, yPosition, pageWidth - 30, 80)
                    yPosition += 90
                } catch (e) {
                    console.error('Chart rendering failed:', e)
                }
            }

            // ========== PAGE 3: OUTLOOK & DISCLAIMER ==========
            pdf.addPage()
            yPosition = 20

            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Long-Term Perspective', 15, yPosition)
            yPosition += 10

            if (data.long_term_outlook) {
                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Company Outlook:', 15, yPosition)
                yPosition += 6
                pdf.setFontSize(9)
                pdf.setFont('helvetica', 'normal')
                const companyLines = pdf.splitTextToSize(data.long_term_outlook.company_perspective, pageWidth - 30)
                pdf.text(companyLines, 15, yPosition)
                yPosition += companyLines.length * 5 + 10

                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Sector Perspective:', 15, yPosition)
                yPosition += 6
                pdf.setFontSize(9)
                pdf.setFont('helvetica', 'normal')
                const sectorLines = pdf.splitTextToSize(data.long_term_outlook.sector_perspective, pageWidth - 30)
                pdf.text(sectorLines, 15, yPosition)
                yPosition += sectorLines.length * 5 + 15
            }

            // Summary Points
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Summary', 15, yPosition)
            yPosition += 8
            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            const summaryPoints = [
                `• Ticker Symbol: ${data.ticker}`,
                `• Current Price: ${data.price} (${data.change_pct})`,
                `• Market Cap: ${data.marketCap}`,
                `• Sector: ${data.sector}`,
                `• Risk Level: ${data.long_term_outlook?.risk_level || 'N/A'}`,
                `• Growth Potential: ${data.long_term_outlook?.growth_potential || 'N/A'}`
            ]
            summaryPoints.forEach(point => {
                pdf.text(point, 15, yPosition)
                yPosition += 5
            })
            yPosition += 15

            // Disclaimer - IMPORTANT
            pdf.setFillColor(255, 240, 240)
            pdf.roundedRect(15, yPosition, pageWidth - 30, 50, 2, 2, 'F')
            pdf.setTextColor(200, 0, 0)
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text('⚠️ IMPORTANT DISCLAIMER', 20, yPosition + 7)
            yPosition += 12
            pdf.setTextColor(80, 80, 80)
            pdf.setFontSize(8)
            pdf.setFont('helvetica', 'normal')
            const disclaimerText = pdf.splitTextToSize(
                'This report is for informational and educational purposes only and does not constitute financial, investment, or legal advice. The content provided is based on publicly available data and should not be used as the sole basis for making investment decisions. Users are strongly advised to consult with qualified financial professionals before making any investment or financial decisions. VeriFin Inc. and Yahoo Finance do not guarantee the accuracy, completeness, or timeliness of the information. Past performance is not indicative of future results. Investing involves risk, including the potential loss of principal.',
                pageWidth - 40
            )
            pdf.text(disclaimerText, 20, yPosition)
            yPosition += disclaimerText.length * 4 + 10

            // Footer on all pages
            const totalPages = pdf.internal.pages.length - 1 // Subtract the null page
            for (let i = 1; i <= totalPages; i++) {
                pdf.setPage(i)
                pdf.setFontSize(8)
                pdf.setTextColor(150, 150, 150)
                pdf.text(
                    `Generated by VeriFin • ${new Date().toLocaleString()} • Page ${i} of ${totalPages}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                )
                pdf.setTextColor(100, 100, 100)
                pdf.text(
                    '© 2026 VeriFin Inc. All rights reserved. • Powered by Yahoo Finance',
                    pageWidth / 2,
                    pageHeight - 5,
                    { align: 'center' }
                )
            }

            pdf.save(`${data.name}_VeriFin_Report_${new Date().toISOString().split('T')[0]}.pdf`)
        } catch (error) {
            console.error('PDF generation error:', error)
            alert('Failed to generate PDF. Please try again.')
        } finally {
            setDownloadingPDF(false)
        }
    }

    const fetchOverview = async (searchQuery: string) => {
        setLoading(true)
        setError('')
        setData(null)

        try {
            const response = await apiClient.getCompanyOverview(searchQuery)

            if (response.success) {
                setData(response.data)
            } else {
                setError(response.error || response.message || 'Failed to fetch company data')
            }
        } catch (err: any) {
            setError(err.message || 'Request failed')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            fetchOverview(query)
        }
    }

    useEffect(() => {
        if (company && company.ticker) {
            fetchOverview(company.ticker)
        }
    }, [company])

    // Filter historical data based on time range
    const getFilteredHistoricalData = () => {
        if (!data?.historical_data?.share_prices) return []

        const currentYear = new Date().getFullYear()
        const years = timeRange === '1Y' ? 1 : timeRange === '2Y' ? 2 : timeRange === '3Y' ? 3 : 5
        const cutoffYear = currentYear - years

        return data.historical_data.share_prices.filter((item: any) => item.year >= cutoffYear)
    }

    const historicalData = getFilteredHistoricalData()

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="glass rounded-2xl p-6">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter company name or ticker (e.g., MRF, Airtel, Apple, Tesla)"
                        className="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 gradient-primary rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                    >
                        {loading ? '⏳' : '📊'} Analyze
                    </button>
                </form>
                <p className="text-gray-400 text-sm mt-3">
                    💡 Try: TCS, Infosys, Wipro, HCL, Coforge, MRF, CEAT, Airtel, Idea, SBI, HDFC, ICICI, Reliance, Apple, Microsoft, Nvidia, Google, Amazon, Meta, Tesla, Samsung
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="glass rounded-2xl p-12 text-center">
                    <div className="animate-spin text-6xl mb-4">⏳</div>
                    <p className="text-gray-300">Fetching real-time stock data...</p>
                    <p className="text-gray-400 text-sm mt-2">Powered by Yahoo Finance</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="glass rounded-2xl p-6 border-2 border-red-500/50 bg-red-500/10">
                    <p className="text-red-300 text-lg font-semibold mb-2">❌ {error}</p>
                    <p className="text-gray-300 text-sm mb-3">
                        The company you searched for was not found or doesn't have available data.
                    </p>
                    <p className="text-gray-400 text-sm">
                        💡 <strong>Suggestions:</strong>
                    </p>
                    <ul className="text-gray-400 text-sm mt-2 ml-4 list-disc">
                        <li>Check the spelling of the company name or ticker symbol</li>
                        <li>Try Indian companies like: TCS, Infosys, Wipro, HCL, Reliance, Airtel, SBI, HDFC, ICICI</li>
                        <li>Try Global companies like: Apple, Microsoft, Google, Amazon, Tesla, Nvidia, Meta</li>
                        <li>View the full list in <code className="bg-white/10 px-2 py-1 rounded">COMPANIES_TRACKED.md</code></li>
                    </ul>
                </div>
            )}

            {/* Company Data */}
            {data && (
                <div className="space-y-6">
                    {/* Header with Logo */}
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                {data.logo && (
                                    <img
                                        src={data.logo}
                                        alt={data.name}
                                        className="w-16 h-16 rounded-xl bg-white/10 p-2 object-contain"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                )}
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-2">{data.name}</h2>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="inline-block px-4 py-1 rounded-full bg-purple-500/30 text-purple-200 font-bold text-sm">
                                            {data.ticker}
                                        </span>
                                        <span className="text-gray-300">{data.sector}</span>
                                        <span className="text-gray-400">•</span>
                                        <span className="text-gray-300">{data.industry}</span>
                                    </div>
                                    {data.type === 'private' && (
                                        <span className="inline-block mt-2 px-3 py-1 rounded-full bg-orange-500/30 text-orange-200 text-sm">
                                            Private Company
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-bold text-white">{data.price}</div>
                                <div className={`text-xl font-semibold mt-1 ${data.change_pct?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                    {data.change} ({data.change_pct})
                                </div>
                                <p className="text-gray-400 text-sm mt-1">Real-time price</p>
                            </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                            {data.description}
                        </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard title="Market Cap" value={data.marketCap} icon="💰" />
                        <MetricCard title="P/E Ratio" value={data.pe_ratio} icon="📈" />
                        <MetricCard title="Volume" value={data.volume} icon="📊" />
                        <MetricCard title="Dividend Yield" value={data.dividend_yield} icon="💵" />
                        <MetricCard title="52W High" value={data['52_week_high']} icon="⬆️" />
                        <MetricCard title="52W Low" value={data['52_week_low']} icon="⬇️" />
                        <MetricCard title="Employees" value={data.employees} icon="👥" />
                        <MetricCard title="Type" value={data.type} icon="🏢" />
                    </div>

                    {/* 5-Year Price Chart */}
                    {historicalData.length > 0 && (
                        <div className="glass rounded-2xl p-8" id="price-chart-container">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white">📈 Share Price Trend</h3>
                                <div className="flex gap-2">
                                    {(['1Y', '2Y', '3Y', '5Y'] as const).map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setTimeRange(range)}
                                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${timeRange === range
                                                ? 'gradient-primary text-white'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#ffffff80"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                    />
                                    <YAxis stroke="#ffffff80" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #475569',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value: any) => [`${data.currency}${value.toFixed(2)}`, 'Price']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#8b5cf6"
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', r: 4 }}
                                        activeDot={{ r: 6 }}
                                        name="Stock Price"
                                    />
                                </LineChart>
                            </ResponsiveContainer>

                            <p className="text-gray-400 text-sm text-center mt-4">
                                {data.historical_data.note} • Currency: {data.currency}
                            </p>
                        </div>
                    )}

                    {/* Volume Chart */}
                    {historicalData.length > 0 && (
                        <div className="glass rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">📊 Trading Volume</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#ffffff80"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                    />
                                    <YAxis stroke="#ffffff80" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1e293b',
                                            border: '1px solid #475569',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        formatter={(value: any) => [value.toLocaleString(), 'Volume']}
                                    />
                                    <Bar dataKey="volume" fill="#10b981" name="Volume" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Long-term Outlook */}
                    {data.long_term_outlook && (
                        <div className="glass rounded-2xl p-8">
                            <h3 className="text-2xl font-bold text-white mb-6">🔮 Long-term Perspective</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6">
                                    <h4 className="text-lg font-semibold text-blue-300 mb-3">Company Outlook</h4>
                                    <p className="text-gray-200 leading-relaxed">{data.long_term_outlook.company_perspective}</p>
                                </div>

                                <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-6">
                                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Sector Perspective</h4>
                                    <p className="text-gray-200 leading-relaxed">{data.long_term_outlook.sector_perspective}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                <OutlookCard label="Risk Level" value={data.long_term_outlook.risk_level} color="orange" />
                                <OutlookCard label="Growth Potential" value={data.long_term_outlook.growth_potential} color="green" />
                                <OutlookCard label="Sector" value={data.sector} color="blue" />
                                <OutlookCard label="Last Updated" value={new Date(data.long_term_outlook.last_updated).toLocaleDateString()} color="gray" />
                            </div>
                        </div>
                    )}

                    {/* Download PDF Button */}
                    <div className="text-center">
                        <button
                            onClick={downloadPDF}
                            disabled={downloadingPDF}
                            className="px-8 py-4 gradient-success rounded-xl font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {downloadingPDF ? '⏳ Generating PDF...' : '📥 Download Report (PDF)'}
                        </button>
                        <p className="text-gray-400 text-sm mt-2">Complete financial intelligence report</p>
                    </div>
                </div>
            )}
        </div>
    )
}

function MetricCard({ title, value, icon }: { title: string; value: any; icon: string }) {
    return (
        <div className="glass rounded-xl p-6 hover:bg-white/10 transition-all">
            <div className="text-3xl mb-2">{icon}</div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    )
}

function OutlookCard({ label, value, color }: { label: string; value: string; color: string }) {
    const colors: any = {
        orange: 'bg-orange-500/20 text-orange-300',
        green: 'bg-green-500/20 text-green-300',
        blue: 'bg-blue-500/20 text-blue-300',
        gray: 'bg-gray-500/20 text-gray-300'
    }

    return (
        <div className={`${colors[color]} rounded-lg p-4 text-center`}>
            <p className="text-xs opacity-70 mb-1">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    )
}
