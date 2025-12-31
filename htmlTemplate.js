/**
 * Generates HTML for Purchase Order based on provided data
 * @param {Object} data - Purchase order data object
 * @returns {string} Complete HTML document as string
 */
export function generatePurchaseOrderHTML(data) {
  const currentDateTime = new Date().toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Generate items rows
  const itemsRows = data.items
    .map(
      (item) => `
                    <tr>
                        <td class="align-center">${item.item || ""}</td>
                        <td>${item.part || ""}</td>
                        <td>${item.desc || ""}</td>
                        <td class="align-center">${item.jobNo || ""}</td>
                        <td class="align-center">${item.status || ""}</td>
                        <td class="align-center">${item.account || ""}</td>
                        <td class="align-center">${item.date || ""}</td>
                        <td class="align-right">${item.qty || ""}</td>
                        <td class="align-right">${item.unit || ""}</td>
                        <td class="align-right">${item.ext || ""}</td>
                    </tr>`
    )
    .join("");

  // Calculate grand total (same as subTotalPrice if no tax/fees)
  const grandTotal = data.totals?.grandTotal || data.totals?.subTotalPrice || "$0.00";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Order ${data.header?.poNumber || ""}</title>
    <link rel="stylesheet" href="template-styles.css">
</head>
<body>
    <div class="container">
        <div class="main-section">
            <div class="info-grid">
                <div class="info-section">
                    <div class="info-row">
                        <span class="info-label">Supplier:</span>
                        <span>${data.supplier?.name || ""}<br>
                        ${data.supplier?.tradeName ? data.supplier.tradeName + "<br>" : ""}${data.supplier?.address || ""}<br>
                        ${data.supplier?.city || ""}</span>
                    </div>
                    
                    <div class="info-row" style="margin-top: 10px;">
                        <span class="info-label">Attention:</span>
                        <span>${data.supplier?.attention?.name || ""}<br>
                        ${data.supplier?.attention?.phone || ""}</span>
                    </div>
                    
                    <div class="info-row" style="margin-top: 10px;">
                        <span class="info-label">Ship To:</span>
                        <span>${data.shipTo?.name || ""}<br>
                        ${data.shipTo?.address || ""}${data.shipTo?.note ? " " + data.shipTo.note : ""}<br>
                        ${data.shipTo?.city || ""}</span>
                    </div>
                    
                    <div class="info-row" style="margin-top: 10px;">
                        <span class="info-label">Route To Employee:</span>
                        <span>${data.poInfo?.routeToEmployee || ""}</span>
                    </div>
                </div>
                
                <div class="info-section">
                    <div class="info-row">
                        <span class="info-label">PO No:</span>
                        <span>${data.poInfo?.poNo || data.header?.poNumber || ""}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">PO Date:</span>
                        <span>${data.poInfo?.poDate || ""}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Buyer:</span>
                        <span>${data.poInfo?.buyer || ""}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">PO Revision:</span>
                        <span>${data.poInfo?.poRevision || ""}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Revision Date:</span>
                        <span>${data.poInfo?.revisionDate || ""}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Ordered By:</span>
                        <span>${data.poInfo?.orderedBy || ""}<br>${data.poInfo?.orderedByPhone || ""}<br>${
                        data.poInfo?.orderedByEmail || ""}
                        </span>
                    </div>
                    
                    <div style="margin-top: 10px;">
                        <div class="info-row">
                            <span class="info-label">Via:</span>
                            <span>${data.poInfo?.via || ""}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Pymt Terms:</span>
                            <span>${data.poInfo?.pymtTerms || ""}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">FOB:</span>
                            <span>${data.poInfo?.fob || ""}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Freight Terms:</span>
                            <span>${data.poInfo?.freightTerms || ""}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Note:</span>
                            <span>${data.poInfo?.note || ""}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Route To:</span>
                            <span>${data.poInfo?.routeTo || ""}</span>
                        </div>
                    </div>
                </div>
            </div>
                        
            <table class="items-table">
                <colgroup>
                    <col class="col-item-rel">
                    <col class="col-part">
                    <col class="col-description">
                    <col class="col-job-no">
                    <col class="col-status">
                    <col class="col-account">
                    <col class="col-due-date">
                    <col class="col-quantity">
                    <col class="col-unit-price">
                    <col class="col-extended">
                </colgroup>
                <thead>
                <tr>
                    <th colspan="10" style="text-align: center;">Items</th>
                </tr>
                    <tr>
                        <th>Item/Rel</th>
                        <th>Part</th>
                        <th>Description</th>
                        <th>Accounting Job No</th>
                        <th>Due Status</th>
                        <th>Account</th>
                        <th>Due Date</th>
                        <th>Order Quantity</th>
                        <th>Unit Price</th>
                        <th>Extended Price</th>
                    </tr>
                </thead>
                <tbody>
${itemsRows}
                    <tr class="totals-row">
                        <td colspan="7"></td>
                        <td class="align-right">Sub Total:</td>
                        <td class="align-right">${data.totals?.subTotalQty || ""}</td>
                        <td class="align-right">${data.totals?.subTotalPrice || ""}</td>
                    </tr>
                    <tr class="grand-total-row">
                        <td colspan="9" class="align-right"><strong>Grand Total:</strong></td>
                        <td class="align-right"><strong>${grandTotal}</strong></td>
                    </tr>
                </tbody>
            </table>
            
            <div class="notes-header">Notes</div>
            <div class="notes-content">

                <p><strong>${data.notes || ""}</strong></p>
                
                <h3>Instructions to Supplier:</h3>
                
                <p><strong>This Purchase Order is subject to the PMC Terms and Conditions of Purchase.</strong></p>
                
                <p>Unless this is a fixed-quantity contract under Section 2.1 of Principal Manufacturing Corporation Terms and Conditions of Purchase ("T&C") or expressly indicated otherwise, this Purchase Order is a requirements contract under which Buyer is committing to purchase and Seller is committing to deliver 100% of Buyer's requirements. Specific quantities listed above may communicate release levels under a requirements contract under Section 2.2 or 2.3 of the T&C. This Purchase Order incorporates and is governed exclusively by the T&C effective as of the date of this Purchase Order, and for any renewals of this Purchase Order on the most recent renewal date, which can be accessed at <a href="https://www.principalmfg.com/wp-content/uploads/Terms-Conditions-of-Purchase-September-2025.pdf" class="blue-link">https://www.principalmfg.com/wp-content/uploads/Terms-Conditions-of-Purchase-September-2025.pdf</a> or from Buyer's purchasing representatives. It is expressly limited to its stated terms, and Buyer rejects any additional or different terms proposed by Seller, which are not binding on Buyer unless expressly agreed to by Buyer in writing. Subject to Buyer's termination rights, this contract is binding for the length of the applicable OEM vehicle program production life (including extensions and model refreshes as determined by the OEM), and the service parts obligations that follow.</p>
                
                <p><strong>For a copy of the PMC Supplier Manual.</strong><br>
                <a href="https://www.principalmfg.com/wp-content/uploads/Supplier-Manual-5.2-edition-PDF.pdf" class="blue-link">https://www.principalmfg.com/wp-content/uploads/Supplier-Manual-5.2-edition-PDF.pdf</a></p>
                
                <h3>MATERIAL CERTIFICATION REQUIRED EACH SHIPMENT</h3>
                
                <p>Material certification shall specify the material conforms to blueprint raw material and declare the grade</p>
                
                <p style="margin-top: 25px;">PMC will be closed for Thanksgiving November 27 and 28th</p>
                
                <p style="margin-top: 15px;"><strong>RECEIVING HOURS WEEKDAYS 7 AM TO 3:30 PM</strong></p>
                
                <p style="margin-top: 15px;">PMC is ISO 14001 registered and <span style="text-decoration: underline;">all suppliers are required to comply to with the handling of any substance of concern in a safe manner in accordance with applicable laws and regulations.</span></p>
                
                <p style="margin-top: 15px;">When shipping product through a common carrier to PMC, please use the following criteria: Description: Unfinished Metal Stampings, Class: 50, NMFC: 104500.</p>

                <p style="margin-top: 10px; font-style: italic; font-weight: bold;">A CERTIFICATION IS REQUIRED WITH EVERY SHIPMENT.</p>
            </div>
        </div>

        <div class="footer">
            <em>Print: ${currentDateTime}</em>
        </div>
    </div>
</body>
</html>`;
}
