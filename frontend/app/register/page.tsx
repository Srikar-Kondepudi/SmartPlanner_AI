'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      await authAPI.register({ email, password, full_name: fullName })
      const loginResponse = await authAPI.login({
        username: email,
        password,
      })
      localStorage.setItem('token', loginResponse.data.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Registration error:', err)
      
      // More detailed error handling
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Cannot connect to server. Please check if the backend is running and NEXT_PUBLIC_API_URL is configured correctly.')
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.detail || 'Invalid input. Please check your email and password.')
      } else if (err.response?.status === 409 || err.response?.data?.detail?.includes('already registered')) {
        setError('This email is already registered. Please try logging in instead.')
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8FAFC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Card style={{
        width: '100%',
        maxWidth: '450px',
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
              <Zap style={{ width: '2rem', height: '2rem', color: '#0EA5E9' }} />
            </div>
          </div>
          <CardTitle style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: '0.5rem'
          }}>
            Create Account
          </CardTitle>
          <CardDescription style={{
            fontSize: '1rem',
            color: '#64748B',
            marginTop: '0.5rem'
          }}>
            Start planning smarter sprints with AI
          </CardDescription>
          {typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL === 'http://localhost:8000' && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#92400E',
              margin: '1rem 2rem 0'
            }}>
              ⚠️ Backend URL is set to localhost. For production, deploy backend and update NEXT_PUBLIC_API_URL in Vercel.
            </div>
          )}
        </CardHeader>

        <CardContent style={{ padding: '0 2rem 2.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
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
                <Lock style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.125rem',
                  height: '1.125rem',
                  color: '#94A3B8',
                  zIndex: 1
                }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    paddingRight: '0.875rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
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
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.125rem',
                  height: '1.125rem',
                  color: '#94A3B8',
                  zIndex: 1
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    paddingRight: '0.875rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
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
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.125rem',
                  height: '1.125rem',
                  color: '#94A3B8',
                  zIndex: 1
                }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.75rem',
                    paddingRight: '0.875rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
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
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.625rem',
              fontSize: '0.875rem',
              color: '#64748B',
              marginTop: '0.25rem'
            }}>
              <CheckCircle2 style={{
                width: '1.125rem',
                height: '1.125rem',
                color: '#10B981',
                flexShrink: 0,
                marginTop: '0.125rem'
              }} />
              <span>By signing up, you agree to our Terms of Service and Privacy Policy</span>
            </div>

            <Button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
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
                gap: '0.5rem',
                marginTop: '0.5rem'
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </>
              )}
            </Button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid #E2E8F0'
          }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748B',
              marginBottom: '0.5rem'
            }}>
              Already have an account?
            </p>
            <button
              onClick={() => router.push('/login')}
              style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#0EA5E9',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
