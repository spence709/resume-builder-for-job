import OpenAI from "openai"

export async function POST(request: Request) {
  try {
    const { jobTitle, jobDescription, originalResume } = await request.json()

    console.log("[v0] Starting resume optimization")
    console.log("[v0] Job Title:", jobTitle)
    
    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    // Validate inputs
    if (!jobTitle || !jobDescription || !originalResume) {
      return Response.json(
        { error: "Missing required fields: jobTitle, jobDescription, or originalResume" },
        { status: 400 },
      )
    }

    // Initialize OpenAI client
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const scorePrompt = `You are an ATS (Applicant Tracking System) scoring expert.
Analyze how well this resume matches the job description on a scale of 0-100.

Job Title: ${jobTitle}
Job Description:
${jobDescription}

Resume:
${originalResume}

Consider:
1. Keywords and skills match
2. Experience relevance
3. Education requirements met
4. Overall fit for the position

Return ONLY a JSON object in this format:
{"score": <number 0-100>, "summary": "<brief explanation of the score>"}
`

    let atsScore = 0
    let scoreSummary = ""
    try {
      console.log("[v0] Generating ATS score...")
      const completion = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: scorePrompt,
          },
        ],
        temperature: 0.7,
      })
      
      const scoreResponse = completion.choices[0]?.message?.content || ""
      console.log("[v0] Score response:", scoreResponse)

      const scoreData = JSON.parse(scoreResponse)
      atsScore = scoreData.score
      scoreSummary = scoreData.summary
      console.log("[v0] ATS Score calculated:", atsScore)
    } catch (scoreError) {
      console.error("[v0] Score generation error:", scoreError)
      atsScore = 65
      scoreSummary = "Could not calculate score"
    }

    const optimizePrompt = `You are an ATS resume optimization expert.
Your task is to optimize the CONTENT of a resume to match a job description, while preserving its original structure and formatting.

Job Title: ${jobTitle}
Job Description:
${jobDescription}

Original Resume:
${originalResume}

IMPORTANT RULES:
1. Keep the exact same structure, sections, and formatting as the original resume
2. Keep the same section headers and layout
3. Only modify the content within sections to:
   - Include relevant keywords from the job description
   - Highlight skills that match job requirements
   - Rephrase bullet points to emphasize relevant experience
   - Maintain professional tone
4. Do NOT add new sections or change the overall format
5. Do NOT remove any information, only rephrase for better ATS alignment
6. Keep all dates, titles, and company names exactly the same

Return ONLY the optimized resume with the same structure, no explanations.`

    console.log("[v0] Generating optimized resume...")
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: optimizePrompt,
        },
      ],
      temperature: 0.7,
    })
    
    const optimizedResume = completion.choices[0]?.message?.content || ""
    console.log("[v0] Optimization complete")

    return Response.json({ optimizedResume, atsScore, scoreSummary })
  } catch (error) {
    console.error("[v0] Full error object:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))

    return Response.json({ error: "Failed to optimize resume. Please check your API configuration." }, { status: 500 })
  }
}
