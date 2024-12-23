import { parse } from 'csv-parse/sync'
import { stringify } from 'csv-stringify/sync'

interface CSVRecord {
  [key: string]: string
}

export function parseCSV(content: Buffer): CSVRecord[] {
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
  })
}

export function filterByGender(records: CSVRecord[]): { males: CSVRecord[], females: CSVRecord[] } {
  const males = records.filter((record) => record.gender.toLowerCase() === 'male')
  const females = records.filter((record) => record.gender.toLowerCase() === 'female')
  return { males, females }
}

export function convertToCSV(records: CSVRecord[]): string {
  return stringify(records, { header: true })
}

