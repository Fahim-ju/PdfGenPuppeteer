# PDF Generator with Puppeteer

A PDF generation service using Puppeteer that converts dynamically generated HTML into PDF documents for Purchase Orders.

## 🚀 Features

- **Dynamic HTML Generation**: Template-based HTML generation using JavaScript
- **PDF Generation**: High-quality PDF rendering with Puppeteer
- **REST API**: Express server with endpoints for PDF generation
- **Modular Architecture**: Separated concerns (data, template, PDF generation)
- **Flexible Data Structure**: Easy to customize and extend

## 📁 Project Structure

```
├── htmlTemplate.js         # HTML template generator function
├── sampleData.js           # Sample purchase order data
├── pdfGenerator.js         # PDF generation logic using Puppeteer
├── server.js               # Express server with API endpoints
├── template-styles.css     # CSS styles for the PDF template
├── test.js                 # Direct PDF generation test
├── test-api.js             # API endpoint test
└── public/                 # Static files (optional)
```

## 🛠️ Installation

```bash
npm install
```

### Dependencies
- `express` - Web server framework
- `puppeteer` - Headless Chrome for PDF generation
- `body-parser` - Parse request bodies

## 📝 Usage

### 1. Direct PDF Generation (Programmatic)

```javascript
const { generatePDF } = require('./pdfGenerator');
const { poData } = require('./sampleData.js');

async function createPDF() {
    const pdfBuffer = await generatePDF(poData);
    // Use pdfBuffer as needed
}
```

**Run test:**
```bash
node test.js
```

### 2. API Server

Start the server:
```bash
npm start
# or
node server.js
```

Server runs at: `http://localhost:3000`

#### API Endpoints

**Preview HTML Template**
```
GET http://localhost:3000/template
```

**Get Sample Data**
```
GET http://localhost:3000/api/sample-data
```

**Generate PDF (View in Browser)**
```
POST http://localhost:3000/api/generate-pdf
Content-Type: application/json

{
    "data": { /* your PO data */ }
}
```

**Download PDF**
```
POST http://localhost:3000/api/download-pdf
Content-Type: application/json

{
    "data": { /* your PO data */ }
}
```

**Test API:**
```bash
node test-api.js
```

## 📊 Data Structure

The data follows this structure (see `sampleData.js`):

```javascript
{
  header: {
    company: { name, address, city, phone, fax },
    poNumber: "156478224"
  },
  supplier: {
    name, tradeName, address, city,
    attention: { name, phone }
  },
  shipTo: {
    name, address, note, city
  },
  poInfo: {
    poNo, poDate, buyer, poRevision, revisionDate,
    orderedBy, via, pymtTerms, fob, freightTerms, note, routeTo
  },
  items: [
    { item, part, desc, status, date, qty, unit, ext }
  ],
  totals: {
    subTotalQty, subTotalPrice
  },
  notes: "..."
}
```

## 🎨 Customization

### Modify the HTML Template

Edit `htmlTemplate.js` - the `generatePurchaseOrderHTML()` function:

```javascript
export function generatePurchaseOrderHTML(data) {
    // Your custom HTML generation logic
    return `<!DOCTYPE html>...`;
}
```

### Modify the Styles

Edit `template-styles.css` to change the PDF appearance.

### Modify PDF Settings

Edit `pdfGenerator.js` to change PDF options:

```javascript
const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { ... }
});
```

## 🧪 Testing

1. **Test direct PDF generation:**
   ```bash
   node test.js
   ```
   Output: `test-output.pdf`

2. **Test API endpoint:**
   ```bash
   node test-api.js
   ```
   Output: `api-test-output.pdf`

3. **Preview in browser:**
   - Start server: `npm start`
   - Visit: `http://localhost:3000/template`

## 🔧 Development

For auto-restart during development:
```bash
npm run dev
```

## 📄 Output

Generated PDFs include:
- Company header with logo
- Purchase order information
- Supplier and shipping details
- Line items table with pricing
- Notes and terms & conditions
- Automatic timestamps

## 🤝 Contributing

Feel free to customize the templates, data structure, and PDF settings to match your needs.

## 📜 License

ISC
