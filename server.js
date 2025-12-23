const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { generatePDF } = require('./pdfGenerator');
const sampleData = require('./sampleData.json');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.raw({ type: 'application/pdf', limit: '50mb' }));
app.use(express.static('public'));

// Serve the template HTML for preview
app.get('/template', (req, res) => {
    res.sendFile(path.join(__dirname, 'template 1.html'));
});

// Get sample data
app.get('/api/sample-data', (req, res) => {
    res.json(sampleData);
});

// Generate PDF with sample data
app.post('/api/generate-pdf', async (req, res) => {
    try {
        console.log('Generating PDF...');
        const data = req.body.data || sampleData;
        console.log('Using data:', Object.keys(data).length, 'keys');
        const templatePath = path.join(__dirname, 'template 1.html');
        console.log('Template path:', templatePath);
        
        const pdfBuffer = await generatePDF(templatePath, data);
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
        res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
    }
});

// Generate PDF and download
app.post('/api/download-pdf', async (req, res) => {
    try {
        const data = req.body.data || sampleData;
        const templatePath = path.join(__dirname, 'template 1.html');
        
        const pdfBuffer = await generatePDF(templatePath, data);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=purchase-order.pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.end(pdfBuffer, 'binary');
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF', message: error.message });
    }
});

// Update sample data (for testing)
app.post('/api/update-data', (req, res) => {
    try {
        const fs = require('fs');
        const newData = req.body;
        fs.writeFileSync('./sampleData.json', JSON.stringify(newData, null, 2));
        res.json({ success: true, message: 'Sample data updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update data', message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT} to test PDF generation`);
});
