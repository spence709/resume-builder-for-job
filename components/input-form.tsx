"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface InputFormProps {
  onOptimize: (jobTitle: string, jobDescription: string, originalResume: string) => void
  loading: boolean
}

export default function InputForm({ onOptimize, loading }: InputFormProps) {
  const [jobTitle, setJobTitle] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [loadingResume, setLoadingResume] = useState(true)

  useEffect(() => {
    // Automatically load the default resume template
    const loadDefaultResume = async () => {
      try {
        const response = await fetch("/api/resume-templates/software-engineer")
        if (response.ok) {
          const data = await response.json()
          setResumeText(data.content)
        } else {
          console.error("Failed to load default resume template")
        }
      } catch (error) {
        console.error("Error loading default resume template:", error)
      } finally {
        setLoadingResume(false)
      }
    }

    loadDefaultResume()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!jobTitle || !jobDescription) {
      alert("Please fill in Job Title and Job Description")
      return
    }
    if (!resumeText) {
      alert("Resume is still loading. Please wait a moment.")
      return
    }
    onOptimize(jobTitle, jobDescription, resumeText)
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Job Title</label>
          <Input
            placeholder="e.g., Senior React Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">Job Description</label>
          <Textarea
            placeholder="Paste the complete job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full h-32"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Resume (Using Default Template)
          </label>
          {loadingResume ? (
            <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">Loading resume template...</p>
            </div>
          ) : (
            <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-3 bg-slate-50 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ✓ Using default resume template (software-engineer.md)
              </p>
            </div>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold py-2"
        >
          {loading ? "Optimizing..." : "Optimize Resume"}
        </Button>
      </form>
    </Card>
  )
}
