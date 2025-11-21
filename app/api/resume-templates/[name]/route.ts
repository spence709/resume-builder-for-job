import { readFile } from "fs/promises"
import { join } from "path"
import { NextRequest } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name } = await params
    const filePath = join(process.cwd(), "resumes", `${name}.md`)

    const content = await readFile(filePath, "utf-8")

    return Response.json({ content })
  } catch (error) {
    console.error("Error reading template:", error)
    return Response.json(
      { error: "Template not found" },
      { status: 404 },
    )
  }
}

