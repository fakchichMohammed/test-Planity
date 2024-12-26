# CSV Processor: Quick Rundown

Hey,

Here's a brief overview of the CSV Processor app I built.

## What It Does

- Lets users upload CSV files
- Splits the data by gender
- Provides the results as a downloadable zip

## Cool Features

1. **Slick Upload Experience**
   - Drag-and-drop or click to upload
   - Real-time progress tracking
   - Validates file type and size

2. **Smart Processing**
   - Server-side CSV parsing and splitting
   - Zip creation for easy download

3. **User-Friendly UI**
   - Responsive design (looks great on mobile!)
   - Dark mode toggle (because why not?)

4. **"Premium" Simulation**
   - Free users: 50MB limit
   - "Premium" users: 500MB limit
   - Mock upgrade process (no actual payments... yet)

## Tech Stack

- **Frontend**: Next.js 13 (with App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Libraries**: csv-parse, csv-stringify, jszip, Framer Motion

## Challenges I Tackled

1. **Handling Large Files**: Implemented streaming for upload and processing
2. **Progress Updates**: Combined actual upload progress with estimated processing time
3. **Consistent Dark Mode**: Careful color planning with Tailwind

## What's Next?

Given more time, I'd love to add:
- Real user authentication
- More CSV processing options
- Server-side streaming for huge files
- Comprehensive testing
- Actual payment processing

## run this app

npm i
npm run dev

## Wrap Up

I had a blast building this! It was a great chance to flex my full-stack muscles. I'm particularly proud of the smooth user experience and how I handled some of the trickier parts like large file processing.

Looking forward to chatting more about it. Let me know if you have any questions!

Cheers,
Mohammed