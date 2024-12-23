import { NextRequest, NextResponse } from 'next/server'
import { parseCSV, filterByGender, convertToCSV } from '../utils/csvProcessor'
import { createZip } from '../utils/zipCreator'

const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB in bytes

export async function POST(req: NextRequest) {
  console.log('Received POST request to /api/process-csv')
  try {
    const fileSize = parseInt(req.headers.get('X-File-Size') || '0', 10)

    if (fileSize > MAX_FILE_SIZE) {
      console.log('File size exceeds limit:', fileSize, 'Max:', MAX_FILE_SIZE)
      return NextResponse.json({ error: 'File size exceeds the maximum limit of 500MB' }, { status: 413 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.log('No file uploaded')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log('Processing file:', file.name, 'Size:', file.size, 'bytes')

    const buffer = await file.arrayBuffer()
    const content = Buffer.from(buffer)

    console.log('Parsing CSV...')
    const records = parseCSV(content)
    console.log('Parsed', records.length, 'records')

    console.log('Filtering by gender...')
    const { males, females } = filterByGender(records)
    console.log('Males:', males.length, 'Females:', females.length)

    console.log('Converting to CSV...')
    const malesCsv = convertToCSV(males)
    const femalesCsv = convertToCSV(females)

    console.log('Creating zip...')
    const zipContent = await createZip(malesCsv, femalesCsv)
    console.log('Zip created, size:', zipContent.length, 'bytes')

    return new NextResponse(zipContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=processed_csv.zip',
      },
    })
  } catch (error) {
    console.error('Error processing CSV:', error)
    return NextResponse.json({
      error: 'Error processing CSV: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 })
  }
}

