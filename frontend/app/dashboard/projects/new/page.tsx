'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FileText, Zap, Rocket, AlertCircle } from 'lucide-react'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await projectsAPI.create({ name, description })
      router.push(`/dashboard/projects/${response.data.id}`)
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }
      setError(err.response?.data?.detail || 'Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            style={{
              color: '#64748B',
              fontWeight: '500'
            }}
          >
            <ArrowLeft style={{ marginRight: '0.5rem', width: '1rem', height: '1rem' }} />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <Card style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <CardHeader style={{
            textAlign: 'center',
            padding: '2.5rem 2rem 1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '12px',
                background: '#E0F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FileText style={{ width: '2rem', height: '2rem', color: '#0EA5E9' }} />
              </div>
            </div>
            <CardTitle style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '0.5rem'
            }}>
              Create New Project
            </CardTitle>
            <CardDescription style={{
              fontSize: '1rem',
              color: '#64748B',
              marginTop: '0.5rem'
            }}>
              Start planning your next sprint with AI-powered automation
            </CardDescription>
          </CardHeader>

          <CardContent style={{ padding: '0 2rem 2.5rem' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {error && (
                <div style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626',
                  padding: '0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FileText style={{ width: '1rem', height: '1rem' }} />
                  Project Name
                  <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#94A3B8' }}>(Required)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0EA5E9'
                    e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="e.g., E-commerce Platform Redesign, Mobile App MVP, API Integration Project"
                  required
                />
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#64748B',
                  padding: '0.75rem',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}>
                  <strong style={{ color: '#475569' }}>💡 Tip:</strong> Choose a clear, descriptive name that identifies your project. Examples:
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, listStyle: 'disc' }}>
                    <li>Product feature names: "User Authentication System", "Payment Gateway Integration"</li>
                    <li>Project types: "Mobile App MVP", "Website Redesign", "API Migration"</li>
                    <li>Client/team names: "Q4 E-commerce Platform", "Customer Portal v2.0"</li>
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Zap style={{ width: '1rem', height: '1rem' }} />
                  Description (Optional)
                  <span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#94A3B8' }}>Recommended for better AI results</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '120px',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#0EA5E9'
                    e.target.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#CBD5E1'
                    e.target.style.boxShadow = 'none'
                  }}
                  placeholder="Example: Build a modern e-commerce platform with user authentication, product catalog, shopping cart, payment integration, and admin dashboard. Target launch: Q2 2024. Tech stack: React, Node.js, PostgreSQL. Key requirements: Mobile responsive, secure payment processing, real-time inventory updates."
                  rows={6}
                />
                <div style={{
                  fontSize: '0.8125rem',
                  color: '#64748B',
                  padding: '0.75rem',
                  background: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0'
                }}>
                  <strong style={{ color: '#475569' }}>🤖 AI Enhancement:</strong> A detailed description helps our AI generate more accurate sprint plans. Include:
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, listStyle: 'disc' }}>
                    <li><strong>Project Goals:</strong> What are you trying to achieve?</li>
                    <li><strong>Key Features:</strong> Main functionality and user stories</li>
                    <li><strong>Technical Requirements:</strong> Tech stack, integrations, constraints</li>
                    <li><strong>Timeline/Budget:</strong> Deadlines, milestones, resource limits</li>
                    <li><strong>Success Criteria:</strong> How will you measure completion?</li>
                  </ul>
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.75rem', color: '#94A3B8' }}>
                    <strong>💡 Pro Tip:</strong> You can also upload a detailed product specification document after creating the project for even better results!
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '0.5rem'
              }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontWeight: '600',
                    padding: '0.875rem',
                    borderRadius: '8px'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    background: loading ? '#CBD5E1' : '#0EA5E9',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: '600',
                    padding: '0.875rem',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '1rem',
                        height: '1rem',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      <span>Creating Project...</span>
                    </>
                  ) : (
                    <>
                      <Rocket style={{ width: '1rem', height: '1rem' }} />
                      <span>Create Project</span>
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Info Section */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                marginBottom: '1rem'
              }}>
                <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#0EA5E9' }} />
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#0F172A'
                }}>
                  What happens next?
                </h3>
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                {[
                  'Upload your product specification document',
                  'AI will analyze and extract epics, stories, and tasks',
                  'Get automatic effort estimates and sprint planning',
                  'Export to JIRA or download as PDF/CSV'
                ].map((step, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    color: '#475569',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      borderRadius: '50%',
                      background: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontWeight: '700',
                      color: '#0EA5E9',
                      fontSize: '0.75rem'
                    }}>
                      {idx + 1}
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
