# PDF Generator - TypeScript Project

This project has been converted to TypeScript for better type safety and developer experience.

## Project Structure

- **TypeScript Source Files** (root directory):
  - `server.ts` - Express server with API endpoints
  - `pdfGenerator.ts` - PDF generation logic using Puppeteer
  - `htmlTemplate.ts` - HTML template generator
  - `sampleData.ts` - Sample data with TypeScript interfaces
  - `tsconfig.json` - TypeScript configuration

- **Compiled Output** (`dist/` directory):
  - JavaScript files compiled from TypeScript
  - Source maps for debugging
  - Type declaration files (.d.ts)

## Setup & Installation

```bash
# Install dependencies
npm install

# Build the TypeScript project
npm run build
```

## Available Scripts

- **`npm run build`** - Compile TypeScript to JavaScript
- **`npm start`** - Build and start the production server
- **`npm run dev`** - Start development server with hot reload (using ts-node)
- **`npm run clean`** - Remove compiled output

## Development

The project uses:
- **TypeScript 5.0+** for type safety
- **ts-node** for running TypeScript directly in development
- **nodemon** for auto-reloading during development
- **Express** with typed Request/Response objects
- **Puppeteer** with full type definitions

### Type Safety

All data structures are now properly typed:
- `PoData` interface defines the structure of purchase order data
- `Company`, `Supplier`, `ShipTo`, `PoInfo`, `Item`, `Totals`, `Notes` interfaces
- Full type checking for Express routes and Puppeteer operations

## API Endpoints

- `GET /template` - Preview HTML template
- `GET /api/sample-data` - Get sample purchase order data
- `POST /api/generate-pdf` - Generate PDF (inline display)
- `POST /api/download-pdf` - Generate PDF (download)
- `POST /api/update-data` - Update sample data

## Building for Production

```bash
npm run build
npm start
```

The compiled JavaScript files in the `dist/` directory are what run in production.
