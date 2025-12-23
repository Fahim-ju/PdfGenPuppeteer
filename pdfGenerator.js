const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generate PDF from HTML template with data
 * @param {object} data - Data object from sampleData.js structure
 * @param {Function} templateFunction - Optional template function (generatePurchaseOrderHTML)
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generatePDF(data, templateFunction = null) {
    let browser;
    
    try {
        let htmlContent;
        
        // If template function is provided, use it; otherwise use the default approach
        if (templateFunction) {
            htmlContent = templateFunction(data);
        } else {
            // Fallback: try to import htmlTemplate.js
            const { generatePurchaseOrderHTML } = require('./htmlTemplate.js');
            htmlContent = generatePurchaseOrderHTML(data);
        }
        
        // Launch Puppeteer
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set base URL for loading CSS files
        const cssPath = path.join(__dirname, 'template-styles.css');
        const cssContent = await fs.readFile(cssPath, 'utf-8');
        
        // Inject CSS directly into HTML
        htmlContent = htmlContent.replace(
            '<link rel="stylesheet" href="template-styles.css">',
            `<style>${cssContent}</style>`
        );
        
        // Set the HTML content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: false,
            margin: {
                top: '0.25in',
                right: '0.35in',
                bottom: '0.25in',
                left: '0.35in'
            }
        });
        
        return pdfBuffer;
        
    } catch (error) {
        console.error('Error in generatePDF:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = {
    generatePDF
};
