'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function CompanyComparison() {
    const [company1, setCompany1] = useState('')
    const [company2, setCompany2] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>(null)
    const [error, setError] = useState('')
    const [downloadingPDF, setDownloadingPDF] = useState(false)

    const handleCompare = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!company1.trim() || !company2.trim()) {
            setError('Please enter both company names')
            return
        }

        setLoading(true)
        setError('')
        setData(null)

        try {
            const response = await apiClient.compareCompanies(company1, company2)

            if (response.success) {
                setData(response)
            } else {
                setError(response.message || response.error || 'Comparison failed')
            }
        } catch (err: any) {
            setError(err.message || 'Request failed')
        } finally {
            setLoading(false)
        }
    }

    const downloadComparisonPDF = async () => {
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

            // ========== HEADER ==========
            pdf.setFillColor(139, 92, 246) // Purple
            pdf.rect(0, 0, pageWidth, 40, 'F')
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(24)
            pdf.setFont('helvetica', 'bold')
            pdf.text('VeriFin', 15, 20)
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'normal')
            pdf.text('Company Comparison Report', 15, 30)

            yPosition = 50

            // ========== COMPANY HEADERS ==========
            // Company 1
            pdf.setFillColor(139, 92, 246) // Purple
            pdf.roundedRect(15, yPosition, 85, 35, 3, 3, 'F')
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text(data.company1.name, 20, yPosition + 10)
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            pdf.text(`Ticker: ${data.company1.ticker}`, 20, yPosition + 18)
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text(String(data.company1.price), 20, yPosition + 28)

            // Company 2
            pdf.setFillColor(16, 185, 129) // Green
            pdf.roundedRect(110, yPosition, 85, 35, 3, 3, 'F')
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(16)
            pdf.setFont('helvetica', 'bold')
            pdf.text(data.company2.name, 115, yPosition + 10)
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            pdf.text(`Ticker: ${data.company2.ticker}`, 115, yPosition + 18)
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text(String(data.company2.price), 115, yPosition + 28)

            yPosition += 45

            // ========== KEY METRICS COMPARISON TABLE ==========
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(14)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Key Metrics Comparison', 15, yPosition)
            yPosition += 10

            // Table Header
            pdf.setFillColor(240, 240, 240)
            pdf.rect(15, yPosition, pageWidth - 30, 8, 'F')
            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'bold')
            pdf.text(data.company1.ticker, 25, yPosition + 6)
            pdf.text('Metric', pageWidth / 2 - 15, yPosition + 6, { align: 'center' })
            pdf.text(data.company2.ticker, pageWidth - 35, yPosition + 6, { align: 'right' })
            yPosition += 10

            // Metrics Rows
            const metrics = [
                ['Market Cap', data.company1.marketCap, data.company2.marketCap],
                ['Price', data.company1.price, data.company2.price],
                ['Change', `${data.company1.change} (${data.company1.change_pct})`, `${data.company2.change} (${data.company2.change_pct})`],
                ['P/E Ratio', String(data.company1.pe_ratio), String(data.company2.pe_ratio)],
                ['Volume', data.company1.volume, data.company2.volume],
                ['52W High', data.company1['52_week_high'], data.company2['52_week_high']],
                ['52W Low', data.company1['52_week_low'], data.company2['52_week_low']],
            ]

            pdf.setFont('helvetica', 'normal')
            pdf.setFontSize(9)

            metrics.forEach(([metric, val1, val2], index) => {
                if (index % 2 === 0) {
                    pdf.setFillColor(250, 250, 250)
                    pdf.rect(15, yPosition, pageWidth - 30, 8, 'F')
                }

                pdf.setTextColor(100, 100, 100)
                pdf.text(String(val1), 25, yPosition + 6)
                pdf.setTextColor(0, 0, 0)
                pdf.setFont('helvetica', 'bold')
                pdf.text(String(metric), pageWidth / 2 - 15, yPosition + 6, { align: 'center' })
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(100, 100, 100)
                pdf.text(String(val2), pageWidth - 35, yPosition + 6, { align: 'right' })

                yPosition += 8
            })

            yPosition += 10

            // ========== SECTOR & INDUSTRY INFO ==========
            pdf.setTextColor(0, 0, 0)
            pdf.setFontSize(12)
            pdf.setFont('helvetica', 'bold')
            pdf.text('Company Overview', 15, yPosition)
            yPosition += 8

            pdf.setFontSize(9)
            pdf.setFont('helvetica', 'normal')
            pdf.text(`Sector: ${data.company1.sector} vs ${data.company2.sector}`, 15, yPosition)
            yPosition += 6
            pdf.text(`Industry: ${data.company1.industry} vs ${data.company2.industry}`, 15, yPosition)
            yPosition += 6
            pdf.text(`Type: ${data.company1.type} vs ${data.company2.type}`, 15, yPosition)
            yPosition += 15

            // ========== ANALYSIS (if available) ==========
            if (data.analysis) {
                pdf.setFontSize(12)
                pdf.setFont('helvetica', 'bold')
                pdf.text('AI Analysis', 15, yPosition)
                yPosition += 8

                pdf.setFontSize(9)
                pdf.setFont('helvetica', 'normal')

                const analysisPoints = [
                    ['Valuation', data.analysis.valuation],
                    ['Growth', data.analysis.growth],
                    ['Risk', data.analysis.risk],
                    ['Recommendation', data.analysis.recommendation]
                ]

                analysisPoints.forEach(([label, value]) => {
                    if (yPosition > pageHeight - 30) {
                        pdf.addPage()
                        yPosition = 20
                    }
                    pdf.setFont('helvetica', 'bold')
                    pdf.text(`${label}:`, 15, yPosition)
                    pdf.setFont('helvetica', 'normal')
                    const lines = pdf.splitTextToSize(String(value), pageWidth - 30)
                    pdf.text(lines, 15, yPosition + 5)
                    yPosition += 5 + (lines.length * 5) + 3
                })
            }

            // ========== DISCLAIMER ==========
            if (yPosition > pageHeight - 60) {
                pdf.addPage()
                yPosition = 20
            }

            pdf.setFillColor(255, 240, 240)
            pdf.roundedRect(15, yPosition, pageWidth - 30, 45, 2, 2, 'F')
            pdf.setTextColor(200, 0, 0)
            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text('⚠️ IMPORTANT DISCLAIMER', 20, yPosition + 7)
            yPosition += 12
            pdf.setTextColor(80, 80, 80)
            pdf.setFontSize(8)
            pdf.setFont('helvetica', 'normal')
            const disclaimerText = pdf.splitTextToSize(
                'This comparison report is for informational and educational purposes only and does not constitute financial, investment, or legal advice. The content is based on publicly available data and should not be used as the sole basis for investment decisions. Users should consult with qualified financial professionals before making any investment decisions. VeriFin Inc. does not guarantee the accuracy, completeness, or timeliness of the information. Investing involves risk, including potential loss of principal.',
                pageWidth - 40
            )
            pdf.text(disclaimerText, 20, yPosition)

            // ========== FOOTER ON ALL PAGES ==========
            const totalPages = pdf.internal.pages.length - 1
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
                    '© 2026 VeriFin Inc. All rights reserved.',
                    pageWidth / 2,
                    pageHeight - 5,
                    { align: 'center' }
                )
            }

            pdf.save(`${data.company1.ticker}_vs_${data.company2.ticker}_Comparison_${new Date().toISOString().split('T')[0]}.pdf`)

        } catch (error) {
            console.error('PDF generation error:', error)
            alert('Failed to generate PDF')
        } finally {
            setDownloadingPDF(false)
        }
    }

    // Prepare data for dual-line chart (if both have historical data)
    const getDualChartData = () => {
        if (!data?.company1?.historical_data?.share_prices || !data?.company2?.historical_data?.share_prices) {
            return []
        }

        const data1 = data.company1.historical_data.share_prices
        const data2 = data.company2.historical_data.share_prices

        // Combine by date
        const combined = data1.map((item1: any) => {
            const item2 = data2.find((d: any) => d.date === item1.date)
            return {
                date: item1.date,
                [data.company1.ticker]: item1.price,
                [data.company2.ticker]: item2?.price || 0
            }
        })

        return combined.filter((item: any) => item[data.company2.ticker] > 0)
    }

    const dualChartData = data ? getDualChartData() : []

    // Prepare financial data
    const getFinancialData = () => {
        if (!data?.company1?.financial_history || !data?.company2?.financial_history) return []

        const hist1 = data.company1.financial_history
        const hist2 = data.company2.financial_history

        const years = Array.from(new Set([...hist1.map((h: any) => h.year), ...hist2.map((h: any) => h.year)])).sort()

        return years.map(year => {
            const h1 = hist1.find((h: any) => h.year === year)
            const h2 = hist2.find((h: any) => h.year === year)
            return {
                year: year.toString(),
                [`${data.company1.ticker}_Rev`]: h1?.revenue || 0,
                [`${data.company1.ticker}_Prof`]: h1?.profit || 0,
                [`${data.company2.ticker}_Rev`]: h2?.revenue || 0,
                [`${data.company2.ticker}_Prof`]: h2?.profit || 0,
            }
        })
    }

    const financialChartData = data ? getFinancialData() : []

    const formatBillions = (value: number) => {
        if (value >= 1e12) return (value / 1e12).toFixed(1) + 'T'
        if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B'
        if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M'
        return value.toString()
    }

    return (
        <div className="glass rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-3">
                    Compare Companies
                </h2>
                <p className="text-gray-300">
                    Side-by-side comparison with visual charts
                </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleCompare} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        value={company1}
                        onChange={(e) => setCompany1(e.target.value)}
                        placeholder="First company (e.g., MRF, Airtel)"
                        className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                        type="text"
                        value={company2}
                        onChange={(e) => setCompany2(e.target.value)}
                        placeholder="Second company (e.g., TCS, Infosys)"
                        className="px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-4 gradient-primary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50"
                >
                    {loading ? 'Comparing...' : 'Compare Now'}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 mb-6">
                    <p className="font-semibold">Error: {error}</p>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-12">
                    <div className="animate-spin text-6xl mb-4 text-purple-500">⏳</div>
                    <p className="text-gray-300">Fetching comparison data...</p>
                </div>
            )}

            {/* Comparison Results */}
            {data && data.success && (
                <div className="space-y-6" id="comparison-report">
                    {/* Companies Header */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl gradient-primary">
                            <div className="flex items-center gap-3 mb-2">
                                {data.company1.logo && (
                                    <img src={data.company1.logo} alt="" className="w-10 h-10 rounded-lg bg-white/20 p-1" onError={(e) => e.currentTarget.style.display = 'none'} />
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{data.company1.name}</h3>
                                    <p className="text-white/80 text-sm">{data.company1.ticker}</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mt-3">{data.company1.price}</div>
                            <div className={`text-lg ${data.company1.change_pct?.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                                {data.company1.change} ({data.company1.change_pct})
                            </div>
                        </div>
                        <div className="p-6 rounded-xl gradient-success">
                            <div className="flex items-center gap-3 mb-2">
                                {data.company2.logo && (
                                    <img src={data.company2.logo} alt="" className="w-10 h-10 rounded-lg bg-white/20 p-1" onError={(e) => e.currentTarget.style.display = 'none'} />
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{data.company2.name}</h3>
                                    <p className="text-white/80 text-sm">{data.company2.ticker}</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white mt-3">{data.company2.price}</div>
                            <div className={`text-lg ${data.company2.change_pct?.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                                {data.company2.change} ({data.company2.change_pct})
                            </div>
                        </div>
                    </div>

                    {/* Dual Price Chart */}
                    {dualChartData.length > 0 && (
                        <div className="glass rounded-xl p-8">
                            <h4 className="text-2xl font-bold text-white mb-6">Price Comparison (5 Years)</h4>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={dualChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#ffffff80"
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                                    />
                                    <YAxis stroke="#ffffff80" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey={data.company1.ticker} stroke="#8b5cf6" strokeWidth={3} name={data.company1.name} dot={false} />
                                    <Line type="monotone" dataKey={data.company2.ticker} stroke="#10b981" strokeWidth={3} name={data.company2.name} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Financial Performance Charts (Revenue & Profit) */}
                    {financialChartData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Revenue Chart */}
                            <div className="glass rounded-xl p-6">
                                <h4 className="text-xl font-bold text-white mb-4">Revenue History</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={financialChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                        <XAxis dataKey="year" stroke="#ffffff80" />
                                        <YAxis stroke="#ffffff80" tickFormatter={formatBillions} />
                                        <Tooltip
                                            formatter={(value: any) => formatBillions(value)}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Legend />
                                        <Bar dataKey={`${data.company1.ticker}_Rev`} name={data.company1.ticker} fill="#8b5cf6" />
                                        <Bar dataKey={`${data.company2.ticker}_Rev`} name={data.company2.ticker} fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Net Profit Chart */}
                            <div className="glass rounded-xl p-6">
                                <h4 className="text-xl font-bold text-white mb-4">Net Profit History</h4>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={financialChartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                        <XAxis dataKey="year" stroke="#ffffff80" />
                                        <YAxis stroke="#ffffff80" tickFormatter={formatBillions} />
                                        <Tooltip
                                            formatter={(value: any) => formatBillions(value)}
                                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#fff' }}
                                        />
                                        <Legend />
                                        <Bar dataKey={`${data.company1.ticker}_Prof`} name={data.company1.ticker} fill="#a78bfa" />
                                        <Bar dataKey={`${data.company2.ticker}_Prof`} name={data.company2.ticker} fill="#34d399" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Metrics Comparison */}
                    <div className="bg-white/5 rounded-xl p-6">
                        <h4 className="text-xl font-bold text-white mb-4">Key Metrics</h4>
                        <div className="space-y-3">
                            <ComparisonRow
                                label="Market Cap"
                                value1={data.company1.marketCap}
                                value2={data.company2.marketCap}
                            />
                            <ComparisonRow
                                label="Price"
                                value1={data.company1.price}
                                value2={data.company2.price}
                            />
                            <ComparisonRow
                                label="P/E Ratio"
                                value1={data.company1.pe_ratio}
                                value2={data.company2.pe_ratio}
                            />
                            <ComparisonRow
                                label="Volume"
                                value1={data.company1.volume}
                                value2={data.company2.volume}
                            />
                            <ComparisonRow
                                label="52W High"
                                value1={data.company1['52_week_high']}
                                value2={data.company2['52_week_high']}
                            />
                            <ComparisonRow
                                label="52W Low"
                                value1={data.company1['52_week_low']}
                                value2={data.company2['52_week_low']}
                            />
                        </div>
                    </div>

                    {/* Sector & Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-blue-300 mb-3">Company Overview</h4>
                            <div className="space-y-2 text-sm text-gray-200">
                                <p><strong>Sector:</strong> {data.company1.sector} vs {data.company2.sector}</p>
                                <p><strong>Industry:</strong> {data.company1.industry} vs {data.company2.industry}</p>
                                <p><strong>Type:</strong> {data.company1.type} vs {data.company2.type}</p>
                            </div>
                        </div>

                        <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-6">
                            <h4 className="text-lg font-semibold text-purple-300 mb-3">Key Highlights</h4>
                            <div className="space-y-2 text-sm text-gray-200">
                                <p>• Both companies show strong market presence</p>
                                <p>• Trading volumes indicate active investor interest</p>
                                <p>• Consider long-term fundamentals for investment</p>
                            </div>
                        </div>
                    </div>

                    {/* Analysis */}
                    {data.analysis && (
                        <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-6">
                            <h4 className="text-xl font-bold text-white mb-4">Analysis</h4>
                            <div className="space-y-3 text-gray-200">
                                <p><strong>Valuation:</strong> {data.analysis.valuation}</p>
                                <p><strong>Growth:</strong> {data.analysis.growth}</p>
                                <p><strong>Risk:</strong> {data.analysis.risk}</p>
                                <p><strong>Recommendation:</strong> {data.analysis.recommendation}</p>
                            </div>
                        </div>
                    )}

                    {/* Download PDF Button (part of component but typically not what we want to capture, but it's fine) */}
                    {/* We used to have it here, but we should move it OUT of the capture area maybe? 
                        Or just hide it during capture using CSS classes? 
                        Actually, html2canvas supports 'ignoreElements'. But simple way is move button outside div.
                    */}
                </div>
            )}

            {/* Download Button - Outside capture area */}
            {data && data.success && (
                <div className="text-center mt-8">
                    <button
                        onClick={downloadComparisonPDF}
                        disabled={downloadingPDF}
                        className="px-8 py-4 gradient-success rounded-xl font-semibold text-white hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
                    >
                        {downloadingPDF ? 'Generating PDF...' : 'Download Comparison Report'}
                    </button>
                    <p className="text-gray-400 text-sm mt-2">Complete side-by-side comparison</p>
                </div>
            )}
        </div>
    )
}

function ComparisonRow({ label, value1, value2 }: { label: string; value1: any; value2: any }) {
    return (
        <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-white/10">
            <div className="text-center">
                <span className="text-white font-semibold">{value1}</span>
            </div>
            <div className="text-center">
                <span className="text-gray-400 text-sm">{label}</span>
            </div>
            <div className="text-center">
                <span className="text-white font-semibold">{value2}</span>
            </div>
        </div>
    )
}
