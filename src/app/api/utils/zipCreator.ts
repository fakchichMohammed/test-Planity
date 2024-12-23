import JSZip from 'jszip'

export async function createZip(malesCsv: string, femalesCsv: string) {
  const zip = new JSZip()
  zip.file('males.csv', malesCsv)
  zip.file('females.csv', femalesCsv)
  return zip.generateAsync({ type: 'nodebuffer' })
}

