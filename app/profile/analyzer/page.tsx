'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Navbar from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { useToast } from '@/hooks/use-toast'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Target, 
  Lightbulb,
  BookOpen,
  Award,
  AlertCircle,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
// PDF parsing will be done server-side in the API route

interface AnalysisResult {
  extractedSkills: string[]
  searchKeywords: string[]
  profileSummary: string
  getHiredTactics: string
  matchScore?: number
  strengths?: string[]
  weaknesses?: string[]
  recommendations?: string[]
}

export default function ResumeAnalyzerPage() {
  const [resume, setResume] = useState<File | null>(null)
  const [targetRole, setTargetRole] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [showJobDescription, setShowJobDescription] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.endsWith('.docx')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF or DOCX file',
          variant: 'destructive'
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 5MB',
          variant: 'destructive'
        })
        return
      }
      setResume(file)
    }
  }

  const analyzeResume = async () => {
    if (!resume || !targetRole) {
      toast({
        title: 'Missing information',
        description: 'Please upload a resume and specify a target role',
        variant: 'destructive'
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Create form data to send the file to API
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('targetRole', targetRole)
      if (showJobDescription && jobDescription) {
        formData.append('jobDescription', jobDescription)
      }
      
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (response.ok) {
        setAnalysis(data)
        toast({
          title: 'Analysis complete',
          description: 'Your resume has been analyzed successfully'
        })
      } else {
        throw new Error(data.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      toast({
        title: 'Analysis failed',
        description: 'Failed to analyze resume. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setResume(null)
    setTargetRole('')
    setAnalysis(null)
    setJobDescription('')
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="flex gap-8">
        <Sidebar />
        <div className="flex-1 w-full px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold">Resume Analyzer</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Analysis</span>
              </div>
            </div>
            <p className="text-muted-foreground">
              Get AI-powered insights and optimize your resume for better opportunities
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {!analysis ? (
              <Card className="p-8">
                <div className="space-y-6">
                  {/* Resume Upload */}
                  <div>
                    <label className="text-lg font-semibold mb-4 block">
                      Upload Your Resume
                    </label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                        resume 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        {resume ? (
                          <div className="flex items-center justify-center gap-3">
                            <FileText className="w-12 h-12 text-primary" />
                            <div className="text-left">
                              <p className="font-semibold">{resume.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(resume.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault()
                                setResume(null)
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                            <p className="font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">
                              PDF or DOCX (max 5MB)
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Target Role Input */}
                  <div>
                    <label className="text-lg font-semibold mb-2 block">
                      Target Job Title
                    </label>
                    <input
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      placeholder="e.g., Senior Software Engineer, Frontend Developer"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Optional Job Description */}
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => setShowJobDescription(!showJobDescription)}
                      className="mb-2"
                    >
                      {showJobDescription ? 'Hide' : 'Add'} Job Description (Optional)
                    </Button>
                    
                    {showJobDescription && (
                      <div className="mt-2">
                        <label className="text-sm font-medium mb-2 block">
                          Paste the job description you want to optimize for
                        </label>
                        <textarea
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          placeholder="Paste the full job description here..."
                          rows={8}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Analyze Button */}
                  <Button
                    onClick={analyzeResume}
                    disabled={!resume || !targetRole || isAnalyzing}
                    className="w-full h-12 text-lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Analyze Resume
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
                      <p className="text-muted-foreground">
                        Target Role: <span className="font-semibold">{targetRole}</span>
                      </p>
                    </div>
                    <Button variant="outline" onClick={resetAnalysis}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      New Analysis
                    </Button>
                  </div>

                  {analysis.matchScore && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Match Score</span>
                        <span className="text-sm font-bold">{analysis.matchScore}%</span>
                      </div>
                      <Progress value={analysis.matchScore} className="h-3" />
                    </div>
                  )}

                  <div className="prose max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Profile Summary</h3>
                    <p className="text-foreground">{analysis.profileSummary}</p>
                  </div>
                </Card>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">Identified Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.extractedSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-semibold">Search Keywords</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.searchKeywords.map((keyword, index) => (
                        <Badge key={index} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Strengths & Weaknesses */}
                {analysis.strengths && analysis.strengths.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold">Strengths</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h3 className="text-lg font-semibold">Areas for Improvement</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {/* Recommendations */}
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold">Get Hired Tactics</h3>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
                    <p className="text-foreground">{analysis.getHiredTactics}</p>
                  </div>
                  
                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold mb-2">Specific Recommendations</h4>
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-primary mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download Optimized Resume
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Target className="w-4 h-4 mr-2" />
                    Find Matching Jobs
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
