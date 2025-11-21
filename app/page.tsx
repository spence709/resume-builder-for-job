"use client"

import { useState } from "react"
import InputForm from "@/components/input-form"
import ResumePreview from "@/components/resume-preview"

export default function Home() {
  const [optimizedResume, setOptimizedResume] = useState<string | null>(null)
  const [atsScore, setAtsScore] = useState<number | undefined>()
  const [scoreSummary, setScoreSummary] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [jobTitle, setJobTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleOptimize = async (jobTitle: string, jobDescription: string, originalResume: string) => {
    setLoading(true)
    setError(null)
    setJobTitle(jobTitle)
    setOptimizedResume(null)
    setAtsScore(undefined)
    setScoreSummary(undefined)
    
    try {
      const response = await fetch("/api/optimize-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobDescription, originalResume }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error occurred" }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setOptimizedResume(data.optimizedResume)
      setAtsScore(data.atsScore)
      setScoreSummary(data.scoreSummary)
    } catch (error) {
      console.error("Error optimizing resume:", error)
      setError(error instanceof Error ? error.message : "Failed to optimize resume. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">ATS Resume Builder</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Optimize your resume for any job description</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Input Form */}
          <div>
            <InputForm onOptimize={handleOptimize} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Right: Resume Preview */}
          <div>
            {optimizedResume ? (
              <ResumePreview
                resume={optimizedResume}
                jobTitle={jobTitle}
                atsScore={atsScore}
                scoreSummary={scoreSummary}
              />
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">Your optimized resume will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
