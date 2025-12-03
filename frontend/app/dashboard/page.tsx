'use client'

import { useQuery } from '@tanstack/react-query'
import { projectsAPI, authAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Zap, Rocket, TrendingUp, Calendar, LogOut, User, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await authAPI.getMe()
      return response.data
    },
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  })

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsAPI.list()
      return response.data
    },
    enabled: !!user,
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token || (userError && (userError as any).response?.status === 401)) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  }, [router, userError])

  if (userLoading || isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid #E2E8F0',
            borderTopColor: '#0EA5E9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ fontSize: '1rem', fontWeight: '500', color: '#64748B' }}>Loading your projects...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              background: '#F1F5F9',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              height: '2.25rem'
            }}>
              <User style={{ width: '0.875rem', height: '0.875rem', color: '#64748B', flexShrink: 0 }} />
              <span style={{ color: '#475569', fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap' }}>{user?.email}</span>
            </div>
            <Button 
              variant="outline"
              onClick={() => {
                localStorage.removeItem('token')
                router.push('/login')
              }}
              style={{
                background: '#FFFFFF',
                color: '#64748B',
                border: '1px solid #CBD5E1',
                fontWeight: '500',
                height: '2.25rem',
                padding: '0.5rem 0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            >
              <LogOut style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            color: '#0F172A',
            marginBottom: '0.5rem'
          }}>
            Welcome back! 👋
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#64748B', fontWeight: '400' }}>
            Manage your sprint planning projects and track your progress
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem'
        }}>
          {[
            { icon: FileText, value: projects?.length || 0, label: 'Total Projects', bg: '#E0F2FE', color: '#0EA5E9' },
            { icon: TrendingUp, value: 0, label: 'Active Sprints', bg: '#EDE9FE', color: '#8B5CF6' },
            { icon: Calendar, value: 0, label: 'Tasks Completed', bg: '#D1FAE5', color: '#10B981' },
            { icon: Rocket, value: '100%', label: 'On Track', bg: '#FEF3C7', color: '#F59E0B' }
          ].map((stat, idx) => (
            <Card key={idx} style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '8px',
                  background: stat.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon style={{ width: '1.25rem', height: '1.25rem', color: stat.color }} />
                </div>
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0F172A' }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: '500' }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Projects Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.25rem' }}>My Projects</h2>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>Create and manage your sprint planning projects</p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/projects/new')}
            style={{
              background: '#0EA5E9',
              color: '#FFFFFF',
              fontWeight: '600',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus style={{ width: '1rem', height: '1rem' }} />
            New Project
          </Button>
        </div>

        {/* Projects Grid */}
        {projects && projects.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.25rem'
          }}>
            {projects.map((project: any) => (
              <Card
                key={project.id}
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
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
                  height: '3px',
                  background: '#0EA5E9'
                }}></div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '8px',
                      background: '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText style={{ width: '1.25rem', height: '1.25rem', color: '#0EA5E9' }} />
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '12px',
                      background: '#D1FAE5',
                      color: '#065F46',
                      fontWeight: '600',
                      border: '1px solid #A7F3D0'
                    }}>
                      Active
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#0F172A',
                    marginBottom: '0.5rem'
                  }}>
                    {project.name}
                  </h3>
                  <p style={{
                    color: '#64748B',
                    marginBottom: '1rem',
                    lineHeight: '1.5',
                    fontSize: '0.875rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {project.description || 'No description provided'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', fontSize: '0.875rem' }}>
                      <Calendar style={{ width: '0.875rem', height: '0.875rem' }} />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <ArrowRight style={{ width: '1rem', height: '1rem', color: '#94A3B8' }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: '#FFFFFF',
            border: '1px dashed #CBD5E1',
            borderRadius: '12px'
          }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1.5rem',
              borderRadius: '12px',
              background: '#E0F2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText style={{ width: '2rem', height: '2rem', color: '#0EA5E9' }} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.75rem' }}>No projects yet</h3>
            <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
              Get started by creating your first project. Upload a spec and let AI generate your sprint plan!
            </p>
            <Button 
              onClick={() => router.push('/dashboard/projects/new')}
              style={{
                background: '#0EA5E9',
                color: '#FFFFFF',
                fontWeight: '600',
                padding: '0.875rem 2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus style={{ width: '1rem', height: '1rem' }} />
              Create Your First Project
            </Button>
          </Card>
        )}
      </main>
    </div>
  )
}
