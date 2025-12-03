'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, Target, TrendingUp, FileText, Sparkles, Rocket, BarChart3, Clock, Users, CheckCircle2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#F8FAFC',
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '8px',
              background: '#E0F2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap style={{ width: '1.5rem', height: '1.5rem', color: '#0EA5E9' }} />
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1E293B'
            }}>
              SmartPlanner AI
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/login')}
              style={{
                color: '#64748B',
                fontWeight: '500',
                height: '2.25rem',
                padding: '0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Login
            </Button>
            <Button 
              onClick={() => router.push('/register')}
              style={{
                background: '#0EA5E9',
                color: '#FFFFFF',
                fontWeight: '600',
                padding: '0.625rem 1.5rem',
                border: 'none',
                height: '2.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '8px'
              }}
            >
              <span>Get Started</span>
              <ArrowRight style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#F1F5F9',
            borderRadius: '20px',
            marginBottom: '1.5rem',
            border: '1px solid #E2E8F0'
          }}>
            <Sparkles style={{ width: '1rem', height: '1rem', color: '#64748B' }} />
            <span style={{ color: '#475569', fontWeight: '500', fontSize: '0.875rem' }}>
              Powered by GPT-4o & Claude 3.5 Sonnet
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: '1.25rem',
            lineHeight: '1.1'
          }}>
            AI-Powered Sprint
            <br />
            <span style={{ color: '#0EA5E9' }}>
              Planning Made Simple
            </span>
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#64748B',
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto 2.5rem'
          }}>
            Transform product requirements into fully structured JIRA-style sprint plans
            with <strong style={{ color: '#0F172A' }}>automatic effort estimation</strong> and 
            <strong style={{ color: '#0F172A' }}> intelligent velocity prediction</strong>
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            marginBottom: '4rem',
            alignItems: 'center'
          }}>
            <Button 
              size="lg" 
              onClick={() => router.push('/register')}
              style={{
                background: '#0EA5E9',
                color: '#FFFFFF',
                fontSize: '1.125rem',
                fontWeight: '600',
                padding: '1rem 2.5rem',
                borderRadius: '8px',
                border: 'none',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem'
              }}
            >
              <span>Start Planning Free</span>
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/demo')}
              style={{
                background: '#FFFFFF',
                color: '#475569',
                fontSize: '1.125rem',
                fontWeight: '600',
                padding: '1rem 2.5rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                height: '3.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              View Live Demo
            </Button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '2rem',
            background: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid #E2E8F0'
          }}>
            {[
              { value: '10x', label: 'Faster Planning', icon: Rocket, color: '#0EA5E9' },
              { value: '95%', label: 'Accuracy', icon: Target, color: '#10B981' },
              { value: '24/7', label: 'Available', icon: Clock, color: '#8B5CF6' }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '10px',
                  background: stat.color === '#0EA5E9' ? '#E0F2FE' : stat.color === '#10B981' ? '#D1FAE5' : '#EDE9FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <stat.icon style={{ width: '1.5rem', height: '1.5rem', color: stat.color }} />
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0F172A', marginBottom: '0.5rem' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 2rem', background: '#F8FAFC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '1rem'
            }}>
              Everything You Need to
              <br />
              <span style={{ color: '#0EA5E9' }}>
                Plan Perfect Sprints
              </span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
              Powerful features designed to streamline your sprint planning workflow
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: FileText, title: 'Smart Spec Upload', desc: 'Upload PDF, DOCX, or text files. Our AI automatically extracts epics and requirements with precision.', color: '#0EA5E9' },
              { icon: Target, title: 'AI Decomposition', desc: 'Automatic epic → story → task breakdown using GPT-4o and Claude 3.5 Sonnet with intelligent effort estimation.', color: '#8B5CF6' },
              { icon: TrendingUp, title: 'Velocity Prediction', desc: 'Predict sprint velocity using historical data and Pinecone embeddings for accurate timeline estimation.', color: '#10B981' },
              { icon: BarChart3, title: 'Real-time Analytics', desc: 'Track sprint progress, velocity trends, and team performance with beautiful visualizations.', color: '#F59E0B' },
              { icon: Clock, title: 'Timeline Estimation', desc: 'Get accurate project timelines based on historical velocity and team capacity analysis.', color: '#6366F1' },
              { icon: Users, title: 'Team Collaboration', desc: 'Share sprint plans, assign tasks, and collaborate seamlessly with your entire team.', color: '#EC4899' }
            ].map((feature, idx) => (
              <Card
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.borderColor = '#CBD5E1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#E2E8F0'
                }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '10px',
                  background: feature.color === '#0EA5E9' ? '#E0F2FE' : 
                             feature.color === '#8B5CF6' ? '#EDE9FE' :
                             feature.color === '#10B981' ? '#D1FAE5' :
                             feature.color === '#F59E0B' ? '#FEF3C7' :
                             feature.color === '#6366F1' ? '#E0E7FF' : '#FCE7F3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  <feature.icon style={{ width: '1.5rem', height: '1.5rem', color: feature.color }} />
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#0F172A',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#64748B',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}>
                  {feature.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 2rem', background: '#FFFFFF' }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: '#F8FAFC',
          borderRadius: '16px',
          padding: '3rem',
          border: '1px solid #E2E8F0',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: '#D1FAE5',
            borderRadius: '20px',
            marginBottom: '1.5rem',
            border: '1px solid #A7F3D0'
          }}>
            <CheckCircle2 style={{ width: '1rem', height: '1rem', color: '#10B981' }} />
            <span style={{ color: '#065F46', fontWeight: '600', fontSize: '0.875rem' }}>Trusted by 1000+ Teams</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: '1rem'
          }}>
            Ready to Transform Your Planning?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748B',
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join teams using AI to streamline their sprint planning process.
            Start free, no credit card required.
          </p>
          <Button 
            size="lg"
            onClick={() => router.push('/register')}
            style={{
              background: '#0EA5E9',
              color: '#FFFFFF',
              fontSize: '1.125rem',
              fontWeight: '600',
              padding: '1rem 2.5rem',
              borderRadius: '8px',
              border: 'none',
              height: '3.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              margin: '0 auto'
            }}
          >
            <span>Get Started Free</span>
            <Rocket style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
          </Button>
          <p style={{ color: '#94A3B8', marginTop: '1.5rem', fontSize: '0.875rem' }}>
            No credit card required • 14-day free trial
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #E2E8F0',
        background: '#FFFFFF',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Zap style={{ width: '1.25rem', height: '1.25rem', color: '#0EA5E9' }} />
            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1E293B' }}>SmartPlanner AI</span>
          </div>
          <p style={{ color: '#94A3B8', textAlign: 'right', fontSize: '0.875rem' }}>
            © 2024 SmartPlanner AI. Built with Next.js, FastAPI, and LangChain.
          </p>
        </div>
      </footer>
    </div>
  )
}
