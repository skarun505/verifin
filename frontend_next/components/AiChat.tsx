'use client'

import { useState, useRef, useEffect } from 'react'
import { apiClient } from '@/lib/api'

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

export default function AiChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm **VeriFin AI**, your intelligent financial assistant.\n\n**Important:** I'm a financial intelligence agent. My responses are for informational purposes only and not financial advice. Always consult a certified financial advisor before making investment decisions.\n\nI can help you with:\nStock analysis and comparisons\nInvestment strategies\nMarket insights\nFinancial planning\n\nWhat would you like to know?",
            timestamp: Date.now()
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')

        // Add user message
        setMessages(prev => [...prev, {
            role: 'user',
            content: userMessage,
            timestamp: Date.now()
        }])

        setLoading(true)

        try {
            const response = await apiClient.chat(userMessage)

            if (response.success) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.response,
                    timestamp: Date.now()
                }])
            } else {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                    timestamp: Date.now()
                }])
            }
        } catch (err: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Connection error. Please check your internet and try again.',
                timestamp: Date.now()
            }])
        } finally {
            setLoading(false)
        }
    }

    const quickQuestions = [
        "What are safe long-term investments?",
        "Explain P/E ratio",
        "How to compare companies?",
        "What is market cap?",
        "Investment strategies",
        "Dividend investing tips"
    ]

    const askQuickQuestion = (question: string) => {
        setInput(question)
    }

    return (
        <div className="glass rounded-2xl shadow-2xl flex flex-col" style={{ height: '80vh' }}>
            {/* Header */}
            <div className="gradient-primary rounded-t-2xl p-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                        AI
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">VeriFin AI Assistant</h2>
                        <p className="text-white/80 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                            Ready to Help
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
                <div className="p-4 bg-blue-500/10 border-b border-white/10">
                    <p className="text-gray-300 text-sm mb-3">Try these quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, i) => (
                            <button
                                key={i}
                                onClick={() => askQuickQuestion(question)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 text-sm transition-all border border-white/20 hover:border-purple-400"
                            >
                                {question}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-6 py-4 ${msg.role === 'user'
                                ? 'gradient-primary text-white'
                                : 'bg-white/10 text-gray-200 border border-white/20'
                                }`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-bold">AI</span>
                                    <span className="text-xs text-gray-400">VeriFin AI</span>
                                </div>
                            )}
                            <div className="prose prose-invert max-w-none">
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 last:mb-0">
                                        {line.split('**').map((part, j) =>
                                            j % 2 === 0 ? part : <strong key={j} className="text-white font-semibold">{part}</strong>
                                        )}
                                    </p>
                                ))}
                            </div>
                            <div className="text-xs text-gray-400 mt-2 text-right">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-6 py-4 border border-white/20">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">AI</span>
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                                <span className="text-gray-400 text-sm">AI is thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Warning Banner */}
            <div className="px-6 py-2 bg-orange-500/20 border-t border-orange-500/50">
                <p className="text-orange-200 text-xs flex items-center gap-2">
                    <span className="font-bold">Important:</span>
                    <span>Responses are for informational purposes only. Not financial advice. Consult certified advisors.</span>
                </p>
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-6 border-t border-white/10">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me anything about stocks, investments, or finance..."
                        disabled={loading}
                        className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="px-8 py-4 gradient-primary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
                <p className="text-gray-400 text-xs mt-2 text-center">
                    Tip: Ask about specific companies, investment strategies, or financial concepts
                </p>
            </form>
        </div>
    )
}
