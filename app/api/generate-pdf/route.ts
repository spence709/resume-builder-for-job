export async function POST(request: Request) {
  try {
    const { resume, jobTitle } = await request.json()

    const lines = resume.split("\n")
    let yPosition = 750

    // Build proper PDF stream with resume content
    let streamContent = `BT\n/F1 16 Tf\n50 750 Td\n(${jobTitle}) Tj\nET\nBT\n/F1 12 Tf\n50 730 Td\n`

    for (const line of lines) {
      if (yPosition < 50) break
      const escapedLine = line.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
      streamContent += `(${escapedLine}) Tj\n0 -15 Td\n`
      yPosition -= 15
    }

    streamContent += `ET\n`

    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length ${streamContent.length} >>
stream
${streamContent}endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
0000000310 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${612 + streamContent.length}
%%EOF`

    const blob = new Blob([pdfContent], { type: "application/pdf" })

    return new Response(blob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${jobTitle.toLowerCase().replace(/\s+/g, "-")}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return Response.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
