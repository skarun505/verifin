// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

// API Response interface - supports both data and response fields
export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    response?: string  // Chat endpoint returns 'response' field
    message?: string
    error?: string
}

// API Client
class ApiClient {
    private baseUrl: string

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || 'API request failed')
            }

            return data
        } catch (error: any) {
            console.error('API Error:', error)
            return {
                success: false,
                error: error.message || 'Network error occurred',
            }
        }
    }

    // Health check
    async healthCheck() {
        return this.request('/health')
    }

    // Company resolution
    async resolveCompany(query: string) {
        return this.request('/resolve-company', {
            method: 'POST',
            body: JSON.stringify({ query }),
        })
    }

    // Company overview
    async getCompanyOverview(query: string) {
        return this.request('/company-overview', {
            method: 'POST',
            body: JSON.stringify({ query }),
        })
    }

    // Company comparison
    async compareCompanies(company1: string, company2: string) {
        return this.request('/company-compare', {
            method: 'POST',
            body: JSON.stringify({ company1, company2 }),
        })
    }

    // AI Chat
    async chat(message: string, context?: any) {
        return this.request('/chat', {
            method: 'POST',
            body: JSON.stringify({ message, context }),
        })
    }

    // Document analysis
    async analyzeDocument(fileContent: string, filename: string) {
        return this.request('/document-analyze', {
            method: 'POST',
            body: JSON.stringify({ file_content: fileContent, filename }),
        })
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE)

// Export API base URL
export { API_BASE }
