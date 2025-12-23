const puppeteer = require('puppeteer');
const fs = require('fs').promises;

/**
 * Generate PDF from HTML template with data
 * @param {string} templatePath - Path to HTML template file
 * @param {object} data - Data object with placeholder values
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generatePDF(templatePath, data) {
    let browser;
    
    try {
        // Read the HTML template
        let htmlContent = await fs.readFile(templatePath, 'utf-8');
        
        // Replace all placeholders with actual data
        htmlContent = replacePlaceholders(htmlContent, data);
        
        // Launch Puppeteer
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set the HTML content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="width: 100%; font-size: 7pt; padding: 5px 20px; margin: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border: 2.5px solid #000; padding: 8px; background: white;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="width: 120px; height: 60px; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24pt;">PMC</div>
                            <div style="font-size: 7pt; line-height: 1.2;">
                                PRINCIPAL<br>MANUFACTURING<br>CORPORATION<br>2800 SOUTH 19th AVENUE<br>BROADVIEW, IL 60155
                            </div>
                            <div style="font-size: 7pt; line-height: 1.2;">
                                Principal Manufacturing Corporation<br>2800 South 19th Avenue<br>Broadview, IL 60155<br>Tel: 708-865-7500<br>Fax: 708-865-7632
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <h1 style="font-size: 16pt; font-weight: bold; margin-bottom: 5px;">PURCHASE ORDER</h1>
                            <div style="font-size: 18pt; font-weight: bold;">{{PO_NUMBER}}</div>
                        </div>
                    </div>
                </div>
            `,
            footerTemplate: '<div>Created by PMC</div>',
            margin: {
                top: '140px',
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

/**
 * Replace all {{PLACEHOLDER}} values in HTML with actual data
 * @param {string} html - HTML content with placeholders
 * @param {object} data - Data object
 * @returns {string} - HTML with replaced values
 */
function replacePlaceholders(html, data) {
    let result = html;
    
    // Replace each placeholder
    for (const [key, value] of Object.entries(data)) {
        const placeholder = `{{${key}}}`;
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        result = result.replace(regex, value || '');
    }
    
    // Replace any remaining unreplaced placeholders with empty string
    result = result.replace(/\{\{[A-Z_0-9]+\}\}/g, '');
    
    return result;
}

module.exports = {
    generatePDF,
    replacePlaceholders
};
