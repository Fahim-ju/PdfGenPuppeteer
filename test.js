const { generatePDF } = require('./pdfGenerator');
const path = require('path');
const fs = require('fs');
const { poData } = require('./sampleData.js');

async function test() {
    try {
        console.log('Testing PDF generation...');
        console.log('PO Number:', poData.header.poNumber);
        console.log('Supplier:', poData.supplier.name);
        console.log('Items count:', poData.items.length);
        
        const pdfBuffer = await generatePDF(poData);
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
