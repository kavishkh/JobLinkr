export async function parsePdf(buffer: Buffer): Promise<string> {
  try {
    // Dynamically import pdf-parse to avoid build-time issues
    const pdfParseModule = await import('pdf-parse')
    const pdfParse = pdfParseModule.default || pdfParseModule
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error('Failed to parse PDF file')
  }
}