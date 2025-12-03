'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { projectsAPI } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Sparkles, Download, Copy, ArrowLeft, FileText, Zap, CheckCircle2, AlertCircle, Rocket, Clock, Target, TrendingUp } from 'lucide-react'
import { useState } from 'react'

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const projectId = parseInt(params.id as string)
  
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Fetch project
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await projectsAPI.get(projectId)
      return response.data
    },
  })

  // Fetch epics, stories, tasks
  const { data: epics } = useQuery({
    queryKey: ['epics', projectId],
    queryFn: async () => {
      const response = await projectsAPI.getEpics(projectId)
      return response.data
    },
    enabled: !!project,
  })

  const { data: stories } = useQuery({
    queryKey: ['stories', projectId],
    queryFn: async () => {
      const response = await projectsAPI.getStories(projectId)
      return response.data
    },
    enabled: !!project,
  })

  const { data: tasks } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: async () => {
      const response = await projectsAPI.getTasks(projectId)
      return response.data
    },
    enabled: !!project,
  })

  // Generate sprint plan mutation
  const generateMutation = useMutation({
    mutationFn: async (provider: string) => {
      return await projectsAPI.generateSprintPlan(projectId, provider)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['epics', projectId] })
      queryClient.invalidateQueries({ queryKey: ['stories', projectId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      setGenerating(false)
      setSuccess('Sprint plan generated successfully!')
      setTimeout(() => setSuccess(''), 5000)
    },
    onError: (err: any) => {
      setGenerating(false)
      const errorDetail = err.response?.data?.detail || 'Failed to generate sprint plan'
      setError(errorDetail)
      setTimeout(() => setError(''), 10000)
    },
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess('')
    try {
      await projectsAPI.uploadSpec(projectId, file)
      queryClient.invalidateQueries({ queryKey: ['project', projectId] })
      setSuccess('Spec uploaded successfully! You can now generate the sprint plan.')
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload spec')
      setTimeout(() => setError(''), 5000)
    } finally {
      setUploading(false)
    }
  }

  const handleGenerateSprintPlan = async (provider: string = 'groq') => {
    setGenerating(true)
    setError('')
    setSuccess('')
    try {
      await generateMutation.mutateAsync(provider)
    } catch (err) {
      // Error handled in mutation
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await projectsAPI.exportPDF(projectId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sprint_plan_${projectId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setSuccess('PDF downloaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to download PDF')
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleDownloadCSV = async () => {
    try {
      const response = await projectsAPI.exportCSV(projectId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `sprint_plan_${projectId}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setSuccess('CSV downloaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to download CSV')
      setTimeout(() => setError(''), 5000)
    }
  }

  const handleCopyToJIRA = async () => {
    try {
      const response = await projectsAPI.exportJIRA(projectId)
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `jira_import_${projectId}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      setSuccess('JIRA CSV downloaded! Import this file into JIRA.')
      setTimeout(() => setSuccess(''), 5000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to export JIRA CSV')
      setTimeout(() => setError(''), 5000)
    }
  }

  if (projectLoading || !project) {
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
          <p style={{ fontSize: '1rem', fontWeight: '500', color: '#64748B' }}>Loading project...</p>
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  const hasSpec = !!(project.spec_content || project.description)
  const hasSprintPlan = epics && epics.length > 0

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
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '1.25rem 2rem', 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '1.25rem'
        }}>
          <Button 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            style={{
              color: '#64748B',
              fontWeight: '500',
              height: '2.25rem',
              padding: '0.5rem 0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flexShrink: 0,
              marginTop: '0.125rem'
            }}
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
            <span>Back to Dashboard</span>
          </Button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0F172A',
              marginBottom: '0.5rem',
              lineHeight: '1.3'
            }}>
              {project.name}
            </h1>
            {project.description && (
              <p style={{
                fontSize: '0.875rem',
                color: '#64748B',
                lineHeight: '1.5',
                margin: 0
              }}>
                {project.description.length > 100 
                  ? project.description.substring(0, 100) + '...' 
                  : project.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Status Messages */}
        {error && (
          <Card style={{
            marginBottom: '1.5rem',
            background: error.includes('Ollama') || error.includes('ollama') || error.includes('503')
              ? '#DBEAFE'
              : error.includes('quota') || error.includes('Quota') || error.includes('402')
              ? '#FEF3C7'
              : '#FEF2F2',
            border: error.includes('Ollama') || error.includes('ollama') || error.includes('503')
              ? '1px solid #93C5FD'
              : error.includes('quota') || error.includes('Quota') || error.includes('402')
              ? '1px solid #FCD34D'
              : '1px solid #FECACA',
            borderRadius: '12px'
          }}>
            <CardContent style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: (error.includes('Ollama') || error.includes('quota')) ? '1rem' : '0' }}>
                <AlertCircle style={{ 
                  width: '1.25rem', 
                  height: '1.25rem', 
                  flexShrink: 0, 
                  color: error.includes('Ollama') || error.includes('ollama') || error.includes('503')
                    ? '#2563EB'
                    : error.includes('quota') || error.includes('Quota') || error.includes('402')
                    ? '#F59E0B'
                    : '#DC2626'
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    color: error.includes('Ollama') || error.includes('ollama') || error.includes('503')
                      ? '#1E40AF'
                      : error.includes('quota') || error.includes('Quota') || error.includes('402')
                      ? '#92400E'
                      : '#991B1B', 
                    fontWeight: '600', 
                    marginBottom: '0.5rem', 
                    fontSize: '0.95rem' 
                  }}>
                    {error.includes('Ollama') || error.includes('ollama') || error.includes('Groq') || error.includes('groq') || error.includes('503')
                      ? '🔧 LLM Provider Error'
                      : error.includes('quota') || error.includes('Quota') || error.includes('402')
                      ? '⚠️ API Quota Exceeded'
                      : 'Error'}
                  </div>
                  <div style={{ 
                    color: error.includes('Ollama') || error.includes('ollama') || error.includes('503')
                      ? '#1E3A8A'
                      : error.includes('quota') || error.includes('Quota') || error.includes('402')
                      ? '#78350F'
                      : '#991B1B', 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5' 
                  }}>
                    {error}
                  </div>
                  {(error.includes('Ollama') || error.includes('ollama') || error.includes('503')) && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #93C5FD' }}>
                      <div style={{ color: '#1E40AF', fontWeight: '600', marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                        📦 Setup Ollama (Free, No Tokens Required):
                      </div>
                      <ol style={{ margin: 0, paddingLeft: '1.5rem', color: '#1E3A8A', fontSize: '0.8125rem', lineHeight: '1.8' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                          <strong>Install Ollama:</strong> Visit <a href="https://ollama.com" target="_blank" rel="noopener" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>ollama.com</a> and download for your OS
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                          <strong>Pull the model:</strong> Run <code style={{ background: '#F1F5F9', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.75rem' }}>ollama pull qwen2.5:7b-instruct</code>
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                          <strong>Start Ollama:</strong> Run <code style={{ background: '#F1F5F9', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.75rem' }}>ollama serve</code> (or it may run automatically as a service)
                        </li>
                        <li>
                          <strong>Verify:</strong> Check that Ollama is running at <code style={{ background: '#F1F5F9', padding: '0.125rem 0.375rem', borderRadius: '4px', fontSize: '0.75rem' }}>http://localhost:11434</code>
                        </li>
                      </ol>
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#EFF6FF', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
                        <div style={{ color: '#1E40AF', fontSize: '0.75rem', lineHeight: '1.6' }}>
                          <strong>💡 Tip:</strong> Once Ollama is set up, you can use AI-powered sprint planning completely free, without any API tokens!
                        </div>
                      </div>
                    </div>
                  )}
                  {(error.includes('quota') || error.includes('Quota') || error.includes('402')) && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#FFFFFF', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                      <div style={{ color: '#78350F', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                        💡 Solutions:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#78350F', fontSize: '0.8125rem', lineHeight: '1.8' }}>
                        <li>Use Ollama (free, no tokens) - click "Generate with Ollama (Free)" button above</li>
                        <li>Add credits to your OpenAI account at <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener" style={{ color: '#0EA5E9', textDecoration: 'underline' }}>platform.openai.com/account/billing</a></li>
                        <li>Wait for your quota to reset (usually monthly)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card style={{
            marginBottom: '1.5rem',
            background: '#D1FAE5',
            border: '1px solid #A7F3D0',
            borderRadius: '12px'
          }}>
            <CardContent style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#065F46' }}>
              <CheckCircle2 style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{success}</span>
            </CardContent>
          </Card>
        )}

        {/* Next Steps Guide */}
        {!hasSprintPlan && (
          <Card style={{
            marginBottom: '2rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              height: '3px',
              background: '#0EA5E9'
            }}></div>
            <CardHeader style={{ padding: '2rem 2rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '10px',
                  background: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Rocket style={{ width: '1.5rem', height: '1.5rem', color: '#0EA5E9' }} />
                </div>
                <CardTitle style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#0F172A'
                }}>
                  Next Steps to Generate Your Sprint Plan
                </CardTitle>
              </div>
              <CardDescription style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Follow these steps to create your AI-powered sprint plan
              </CardDescription>
            </CardHeader>
            <CardContent style={{ padding: '0 2rem 2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.25rem'
              }}>
                {/* Step 1 */}
                <div style={{
                  padding: '1.5rem',
                  background: hasSpec ? '#D1FAE5' : '#F8FAFC',
                  borderRadius: '12px',
                  border: hasSpec ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '8px',
                      background: hasSpec ? '#10B981' : '#E0F2FE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: hasSpec ? '#FFFFFF' : '#0EA5E9',
                      fontSize: '0.875rem'
                    }}>
                      {hasSpec ? <CheckCircle2 style={{ width: '1.125rem', height: '1.125rem' }} /> : '1'}
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#0F172A'
                    }}>
                      {hasSpec ? 'Spec Ready ✓' : 'Upload Product Spec'}
                    </h3>
                  </div>
                  <p style={{
                    color: '#64748B',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {hasSpec 
                      ? 'Great! You have a spec document or description ready.'
                      : 'Upload a PDF, DOCX, or TXT file with your product requirements, or use the project description you provided.'}
                  </p>
                  {!hasSpec && (
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                      <Button
                        onClick={() => document.getElementById('file-upload')?.click()}
                        disabled={uploading}
                        style={{
                          width: '100%',
                          background: uploading ? '#CBD5E1' : '#0EA5E9',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: '600',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          height: '2.75rem'
                        }}
                      >
                        <Upload style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                        <span>{uploading ? 'Uploading...' : 'Upload Spec Document'}</span>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Step 2 */}
                <div style={{
                  padding: '1.5rem',
                  background: hasSprintPlan ? '#D1FAE5' : (hasSpec ? '#F8FAFC' : '#F1F5F9'),
                  borderRadius: '12px',
                  border: hasSprintPlan ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                  opacity: hasSpec ? 1 : 0.6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '8px',
                      background: hasSprintPlan 
                        ? '#10B981'
                        : (hasSpec 
                          ? '#E0F2FE'
                          : '#CBD5E1'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: hasSprintPlan ? '#FFFFFF' : (hasSpec ? '#0EA5E9' : '#94A3B8'),
                      fontSize: '0.875rem'
                    }}>
                      {hasSprintPlan ? <CheckCircle2 style={{ width: '1.125rem', height: '1.125rem' }} /> : '2'}
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#0F172A'
                    }}>
                      {hasSprintPlan ? 'Sprint Plan Generated ✓' : 'Generate Sprint Plan'}
                    </h3>
                  </div>
                  <p style={{
                    color: '#64748B',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {hasSprintPlan
                      ? 'Your sprint plan has been generated with epics, stories, and tasks!'
                      : hasSpec
                        ? 'Click the button below to let AI analyze your spec and generate a complete sprint plan with epics, stories, tasks, and effort estimates.'
                        : 'Upload a spec first to enable this step.'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <Button
                      onClick={() => handleGenerateSprintPlan('groq')}
                      disabled={generating || !hasSpec}
                      style={{
                        width: '100%',
                        background: (generating || !hasSpec) ? '#CBD5E1' : '#0EA5E9',
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: '600',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: (generating || !hasSpec) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        height: '2.75rem'
                      }}
                    >
                      <Sparkles style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                      <span>{generating ? 'Generating with AI...' : 'Generate with Groq (Free)'}</span>
                    </Button>
                    <Button
                      onClick={() => handleGenerateSprintPlan('openai')}
                      disabled={generating || !hasSpec}
                      variant="outline"
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        color: '#475569',
                        border: '1px solid #CBD5E1',
                        fontWeight: '600',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: (generating || !hasSpec) ? 'not-allowed' : 'pointer',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        height: '2.75rem'
                      }}
                    >
                      <Zap style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
                      <span>Try with OpenAI (GPT-4o)</span>
                    </Button>
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{
                  padding: '1.5rem',
                  background: hasSprintPlan ? '#F8FAFC' : '#F1F5F9',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  opacity: hasSprintPlan ? 1 : 0.6
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '8px',
                      background: hasSprintPlan ? '#EDE9FE' : '#CBD5E1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      color: hasSprintPlan ? '#8B5CF6' : '#94A3B8',
                      fontSize: '0.875rem'
                    }}>
                      3
                    </div>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#0F172A'
                    }}>
                      Export & Use
                    </h3>
                  </div>
                  <p style={{
                    color: '#64748B',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {hasSprintPlan
                      ? 'Export your sprint plan to JIRA, download as PDF/CSV, or review the detailed breakdown below.'
                      : 'After generating your sprint plan, you can export it to JIRA or download it as PDF/CSV.'}
                  </p>
                  {hasSprintPlan && (
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Button
                        variant="outline"
                        onClick={handleCopyToJIRA}
                        style={{
                          background: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.8125rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          height: '2.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Copy style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
                        <span>Export JIRA CSV</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        style={{
                          background: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.8125rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          height: '2.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Download style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
                        <span>Download PDF</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleDownloadCSV}
                        style={{
                          background: '#FFFFFF',
                          color: '#475569',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.8125rem',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          height: '2.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        <Download style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
                        <span>Download CSV</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Download Section - Prominent */}
        {hasSprintPlan && (
          <Card style={{
            marginBottom: '2rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              height: '3px',
              background: '#0EA5E9'
            }}></div>
            <CardContent style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '10px',
                  background: '#E0F2FE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Download style={{ width: '1.5rem', height: '1.5rem', color: '#0EA5E9' }} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: '#0F172A',
                    marginBottom: '0.25rem'
                  }}>
                    Download Sprint Plan
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748B'
                  }}>
                    Export your sprint plan in various formats for documentation and import into JIRA
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Button
                  onClick={handleDownloadPDF}
                  style={{
                    background: '#0EA5E9',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    height: '2.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Download style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  <span>Download PDF</span>
                </Button>
                <Button
                  onClick={handleDownloadCSV}
                  variant="outline"
                  style={{
                    background: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    height: '2.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Download style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  <span>Download CSV</span>
                </Button>
                <Button
                  onClick={handleCopyToJIRA}
                  variant="outline"
                  style={{
                    background: '#FFFFFF',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    height: '2.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Copy style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  <span>Export for JIRA</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sprint Plan Summary */}
        {hasSprintPlan && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}>
            {[
              { icon: Target, label: 'Epics', value: epics?.length || 0, color: '#0EA5E9', bg: '#E0F2FE' },
              { icon: FileText, label: 'Stories', value: stories?.length || 0, color: '#8B5CF6', bg: '#EDE9FE' },
              { icon: Zap, label: 'Tasks', value: tasks?.length || 0, color: '#10B981', bg: '#D1FAE5' },
              { icon: Clock, label: 'Total Effort', value: `${epics?.reduce((sum: number, epic: any) => sum + (epic.estimated_effort || 0), 0) || 0} SP`, color: '#F59E0B', bg: '#FEF3C7' }
            ].map((stat, idx) => (
              <Card key={idx} style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '3px',
                  background: stat.color
                }}></div>
                <CardContent style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '8px',
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem'
                  }}>
                    <stat.icon style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: stat.color
                    }} />
                  </div>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#0F172A',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#64748B',
                    fontWeight: '500'
                  }}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Epics, Stories, Tasks Tree */}
        {hasSprintPlan && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {epics?.map((epic: any) => {
              const epicStories = stories?.filter((s: any) => s.epic_id === epic.id) || []
              return (
                <Card key={epic.id} style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '3px',
                    background: '#0EA5E9'
                  }}></div>
                  <CardHeader style={{ padding: '1.5rem 1.5rem 1rem' }}>
                    <CardTitle style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0F172A', marginBottom: '0.5rem' }}>
                      {epic.title}
                    </CardTitle>
                    <CardDescription style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {epic.description}
                    </CardDescription>
                    <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.8125rem',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        background: '#E0F2FE',
                        color: '#0C4A6E',
                        fontWeight: '600',
                        border: '1px solid #BAE6FD'
                      }}>
                        {epic.priority || 'Medium'} Priority
                      </span>
                      <span style={{
                        fontSize: '0.8125rem',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        background: '#D1FAE5',
                        color: '#065F46',
                        fontWeight: '600',
                        border: '1px solid #A7F3D0'
                      }}>
                        {epic.estimated_effort || 0} Story Points
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent style={{ padding: '0 1.5rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {epicStories.map((story: any) => {
                        const storyTasks = tasks?.filter((t: any) => t.story_id === story.id) || []
                        return (
                          <div key={story.id} style={{
                            marginLeft: '1rem',
                            paddingLeft: '1.25rem',
                            borderLeft: '2px solid #E2E8F0',
                            paddingTop: '0.5rem'
                          }}>
                            <h4 style={{
                              fontSize: '1rem',
                              fontWeight: '700',
                              color: '#0F172A',
                              marginBottom: '0.5rem'
                            }}>
                              {story.title}
                            </h4>
                            <p style={{
                              fontSize: '0.875rem',
                              color: '#64748B',
                              marginBottom: '1rem',
                              lineHeight: '1.5'
                            }}>
                              {story.description}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                              {storyTasks.map((task: any) => (
                                <div key={task.id} style={{
                                  marginLeft: '1rem',
                                  padding: '0.75rem',
                                  background: '#F8FAFC',
                                  borderRadius: '8px',
                                  border: '1px solid #E2E8F0'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{
                                      fontSize: '0.875rem',
                                      fontWeight: '500',
                                      color: '#0F172A'
                                    }}>
                                      {task.title}
                                    </span>
                                    <span style={{
                                      fontSize: '0.8125rem',
                                      color: '#64748B',
                                      background: '#F1F5F9',
                                      padding: '0.25rem 0.625rem',
                                      borderRadius: '12px',
                                      fontWeight: '500'
                                    }}>
                                      {task.estimated_hours || 0}h
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
