const http = require('http');
const fs = require('fs');
const { poData } = require('./sampleData.js');

// Test the API endpoint
const postData = JSON.stringify({ data: poData });

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate-pdf',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Calling API to generate PDF...');

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    const chunks = [];
    
    res.on('data', (chunk) => {
        chunks.push(chunk);
    });
    
    res.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        
        if (res.statusCode === 200) {
            fs.writeFileSync('api-test-output.pdf', pdfBuffer);
            console.log('✅ PDF generated via API successfully!');
            console.log('✅ Saved as api-test-output.pdf');
            console.log('PDF size:', pdfBuffer.length, 'bytes');
        } else {
            console.error('❌ Error:', pdfBuffer.toString());
        }
        
        process.exit(0);
    });
});

req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
    process.exit(1);
});

req.write(postData);
req.end();
