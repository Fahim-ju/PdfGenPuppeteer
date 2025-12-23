const { generatePDF } = require('./pdfGenerator');
const path = require('path');
const fs = require('fs');
const sampleData = require('./sampleData.json');

async function test() {
    try {
        console.log('Testing PDF generation...');
        const templatePath = path.join(__dirname, 'template 1.html');
        console.log('Template exists:', fs.existsSync(templatePath));
        
        const pdfBuffer = await generatePDF(templatePath, sampleData);
        console.log('✅ PDF generated successfully!');
        console.log('PDF size:', pdfBuffer.length, 'bytes');
        
        // Save test PDF
        fs.writeFileSync('test-output.pdf', pdfBuffer);
        console.log('✅ Test PDF saved as test-output.pdf');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
}

test();
