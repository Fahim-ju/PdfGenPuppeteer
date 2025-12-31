const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

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
      const { generatePurchaseOrderHTML } = require("./htmlTemplate.js");
      htmlContent = generatePurchaseOrderHTML(data);
    }

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set base URL for loading CSS files
    const cssPath = path.join(__dirname, "template-styles.css");
    const cssContent = await fs.readFile(cssPath, "utf-8");

    // Inject CSS directly into HTML
    htmlContent = htmlContent.replace(
      '<link rel="stylesheet" href="template-styles.css">',
      `<style>
${cssContent}

/* Ensure content doesn't appear above header on new pages */
@media print {
  .container {
    margin: 0 0;
    padding: 0px 48px;
    width: 100%;
    //border: 5px solid #ebe846ff;
  }

  .date-time,
  .header {
    page-break-inside: avoid;
    page-break-after: avoid;
  }

  .info-grid {
    page-break-inside: avoid;
  }

  .main-section {
    box-decoration-break: clone;
    -webkit-box-decoration-break: clone;
  }

  .items-table thead {
    display: table-header-group !important;
    }

    .items-table tbody tr {
        page-break-inside: auto !important;
    }

    .items-table tbody td {
        page-break-inside: auto !important;
    }

    .items-table tfoot {
        display: table-row-group !important;
        page-break-inside: avoid !important;
    }

    .notes-table thead {
        display: table-header-group !important;
    }

  .notes-header {
    page-break-after: avoid;
  }

  .notes-content {
    page-break-inside: auto;
  }

  .notes-content p,
  .notes-content h3 {
    orphans: 2;
    widows: 2;
  }
}
</style>`
    );

    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    const currentDateTime = new Date().toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    // Create header template for every page
    const headerTemplate = `
            <div style="width: 100%; font-size: 9pt; -webkit-print-color-adjust: exact; position: relative;">
            <div style="font-size: 8pt; width: 70%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; padding-left: 16px; font-weight: normal; position: relative;">
                <span>${currentDateTime}</span>
                <span class="page-title">PURCHASE ORDER</span>
            </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border: 2.5px solid #000; padding: 10px 25px 15px 25px; margin: 0px 48px">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 120px; height: 60px; background: #000; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24pt; border: 2px solid #000;">PMC</div>
                        <div style="font-size: 7pt; line-height: 1.2;">
                            PRINCIPAL<br>
                            MANUFACTURING<br>
                            CORPORATION<br>
                            2800 SOUTH 19th AVENUE<br>
                            BROADVIEW, IL 60155
                        </div>
                        <div style="font-size: 7pt; line-height: 1.2;">
                            ${data.header?.company?.name || "Principal Manufacturing Corporation"}<br>
                            ${data.header?.company?.address || "2800 South 19th Avenue"}<br>
                            ${data.header?.company?.city || "Broadview, IL 60155"}<br>
                            ${data.header?.company?.phone || "Tel: 708-865-7500"}<br>
                            ${data.header?.company?.fax || "Fax: 708-865-7632"}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <h1 style="font-size: 16pt; font-weight: bold; margin: 0 0 5px 0;">PURCHASE ORDER</h1>
                        <div style="font-size: 18pt; font-weight: bold;">${data.header?.poNumber || ""}</div>
                    </div>
                </div>
            </div>
        `;
    const footerTemplate = `
    <div style="font-size: 10px; width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 0px 20px; -webkit-print-color-adjust: exact; box-sizing: border-box;">
        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90%; padding-right: 10px;"> 
            <a href="https://www.plexonline.com/5c1a707e-0ca9-4cbe-b4a5-af0dbf6e6921/modules/systemadministration/login/index.aspx?Message=For%20security%20reasons,%20you%20must%20log%20in%20again%20after%2090%20minutes%20of%20inactivity.&Session_Key={5c1a707e-0ca9-4cbe-b4a5-af0dbf6e6921" style="color: #000; text-decoration: none;">https://www.plexonline.com/5c1a707e-0ca9-4cbe-b4a5-af0dbf6e6921/modules/systemadministration/login/index.aspx?Message=For%20security%20reasons,%20you%20must%20log%20in%20again%20after%2090%20minutes%20of%20inactivity.&Session_Key={5c1a707e-0ca9-4cbe-b4a5-af0dbf6e6921</a>
        </div>
        <div style="white-space: nowrap;">
            <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>
    </div>
`;
// Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate,
      margin: {
        top: "130px", // Space for header (header height ~100px + some spacing)
        bottom: "50px", // Space for footer
      },
      preferCSSPageSize: true,
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error in generatePDF:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  generatePDF,
};
