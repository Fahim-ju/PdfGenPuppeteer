import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import { generatePDF } from './pdfGenerator';
import { poData, PoData } from './sampleData';
import { generatePurchaseOrderHTML } from './htmlTemplate';
import * as fs from 'fs';

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ type: 'application/pdf', limit: '50mb' }));
app.use(express.static('public'));

// Serve the template HTML for preview
app.get('/template', (req: Request, res: Response) => {
    const html = generatePurchaseOrderHTML(poData);
    res.send(html);
});

// Get sample data
app.get('/api/sample-data', (req: Request, res: Response) => {
    res.json(poData);
});

// Generate PDF with sample data
app.post('/api/generate-pdf', async (req: Request, res: Response) => {
    try {
        console.log('Generating PDF...');
        const data: PoData = req.body.data || poData;
        console.log('Using data with PO Number:', data.header?.poNumber);
        
        const pdfBuffer = await generatePDF(data);
        console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=purchase-order.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.end(pdfBuffer, 'binary');
    } catch (error) {
        console.error('Error generating PDF:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to generate PDF', message: errorMessage });
    }
});

// Generate PDF and download
app.post('/api/download-pdf', async (req: Request, res: Response) => {
    try {
        const data: PoData = req.body.data || poData;
        
        const pdfBuffer = await generatePDF(data);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=purchase-order.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer, 'binary');
    } catch (error) {
        console.error('Error generating PDF:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to generate PDF', message: errorMessage });
    }
});

// Update sample data (for testing)
app.post('/api/update-data', (req: Request, res: Response) => {
    try {
        const newData: PoData = req.body;
        // Export as module format
        const dataString = `export const poData = ${JSON.stringify(newData, null, 2)};\n`;
        fs.writeFileSync('./sampleData.ts', dataString);
        res.json({ success: true, message: 'Sample data updated' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Failed to update data', message: errorMessage });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} to test PDF generation`);
});
