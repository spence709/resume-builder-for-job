"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"

interface ResumePreviewProps {
  resume: string
  jobTitle: string
  atsScore?: number
  scoreSummary?: string
}

export default function ResumePreview({ resume, jobTitle, atsScore, scoreSummary }: ResumePreviewProps) {
  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobTitle }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `resume-${jobTitle.toLowerCase().replace(/\s+/g, "-")}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading PDF:", error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
    if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
    return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
  }

  return (
    <div className="space-y-4">
      {atsScore !== undefined && (
        <Card className={`p-4 ${getScoreColor(atsScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">ATS Compatibility Score</p>
              <p className="text-xs mt-1">{scoreSummary}</p>
            </div>
            <div className="text-3xl font-bold">{atsScore}</div>
          </div>
        </Card>
      )}

      {/* Resume Preview */}
      <Card className="p-6 bg-white dark:bg-slate-900 max-h-96 overflow-y-auto">
        <div className="prose dark:prose-invert max-w-none text-sm">
          <div className="whitespace-pre-wrap text-slate-900 dark:text-slate-100 font-mono text-xs leading-relaxed">
            {resume}
          </div>
        </div>
      </Card>

      <Button
        onClick={handleDownloadPDF}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 flex items-center justify-center gap-2"
      >
        <Download size={18} />
        Download as PDF
      </Button>
    </div>
  )
}
