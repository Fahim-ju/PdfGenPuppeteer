# PDF Generator with Puppeteer

A Node.js application for generating PDFs from HTML templates using Puppeteer. Built for debugging and testing PDF generation.

## Features

- 📄 Generate PDFs from HTML templates
- 🔍 Live preview in browser
- ⬇️ Download generated PDFs
- ✏️ Edit sample data in real-time
- 🎨 Beautiful debug interface

## Installation

1. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. For development with auto-restart:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## API Endpoints

- `GET /` - Debug interface
- `GET /template` - View HTML template
- `GET /api/sample-data` - Get sample data
- `POST /api/generate-pdf` - Generate PDF for viewing
- `POST /api/download-pdf` - Generate PDF for download
- `POST /api/update-data` - Update sample data

## Project Structure

```
PdfGenPuppeteer/
├── server.js              # Express server
├── pdfGenerator.js        # Puppeteer PDF generation logic
├── sampleData.json        # Sample data for template
├── template 1.html        # HTML template
├── public/
│   └── index.html        # Debug interface
└── package.json
```

## How to Use

1. **View PDF**: Click "View PDF" to generate and display the PDF in the browser
2. **Download PDF**: Click "Download PDF" to generate and download the PDF file
3. **Edit Data**: Switch to "Data Editor" tab to modify the JSON data
4. **Preview Template**: Click "Preview Template" to view the raw HTML template
5. **Reset Data**: Click "Reset Data" to reload the original sample data

## Customization

- Edit `template 1.html` to modify the PDF layout
- Update `sampleData.json` to change default values
- Modify `pdfGenerator.js` to adjust PDF generation settings

## Requirements

- Node.js 14 or higher
- npm or yarn
