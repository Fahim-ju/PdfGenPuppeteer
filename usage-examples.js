/**
 * Example: How to use the PDF generator with your own data
 */

const { generatePDF } = require('./pdfGenerator');
const fs = require('fs');

// Example 1: Create a purchase order with custom data
async function createCustomPO() {
    const customData = {
        header: {
            company: {
                name: "My Company Inc.",
                address: "123 Business St",
                city: "Chicago, IL 60601",
                phone: "Tel: 555-1234",
                fax: "Fax: 555-5678"
            },
            poNumber: "PO-2025-001"
        },
        supplier: {
            name: "Supplier Company Ltd.",
            tradeName: "Supplier Co",
            address: "456 Vendor Ave",
            city: "New York, NY 10001",
            attention: {
                name: "John Doe",
                phone: "555-9999"
            }
        },
        shipTo: {
            name: "My Company Warehouse",
            address: "789 Storage Blvd",
            note: "(Loading Dock B)",
            city: "Chicago, IL 60602"
        },
        poInfo: {
            poNo: "PO-2025-001",
            poDate: "12/23/2025",
            buyer: "Jane Smith",
            poRevision: "Rev 1",
            revisionDate: "12/23/2025",
            orderedBy: "Jane Smith",
            via: "FedEx Ground",
            pymtTerms: "Net 30",
            fob: "Destination",
            freightTerms: "Prepaid & Add",
            note: "Urgent delivery required",
            routeTo: "Receiving Department"
        },
        items: [
            {
                item: "1",
                part: "PART-001",
                desc: "Widget Assembly Kit",
                jobNo: "JOB-2025-100",
                status: "Firm",
                account: "5000",
                date: "01/15/2026",
                qty: "100",
                unit: "$50.00",
                ext: "$5,000.00"
            },
            {
                item: "2",
                part: "PART-002",
                desc: "Gadget Component Set",
                jobNo: "JOB-2025-101",
                status: "Planned",
                account: "5001",
                date: "01/20/2026",
                qty: "50",
                unit: "$75.00",
                ext: "$3,750.00"
            }
        ],
        totals: {
            subTotalQty: "150",
            subTotalPrice: "$8,750.00"
        },
        notes: "All items must be inspected upon delivery. Please notify receiving department 24 hours before shipment."
    };

    try {
        console.log('Generating custom PDF...');
        const pdfBuffer = await generatePDF(customData);
        
        fs.writeFileSync('custom-po.pdf', pdfBuffer);
        console.log('✅ Custom PDF created: custom-po.pdf');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 2: Generate multiple PDFs
async function generateMultiplePOs() {
    const poNumbers = ['PO-001', 'PO-002', 'PO-003'];
    
    for (const poNum of poNumbers) {
        const data = {
            header: { poNumber: poNum, company: {} },
            supplier: { name: `Supplier for ${poNum}` },
            shipTo: {},
            poInfo: { poNo: poNum },
            items: [],
            totals: {},
            notes: `Purchase order ${poNum}`
        };
        
        const pdfBuffer = await generatePDF(data);
        fs.writeFileSync(`${poNum}.pdf`, pdfBuffer);
        console.log(`✅ Generated ${poNum}.pdf`);
    }
}

// Example 3: Use with Express route
function exampleExpressRoute(app) {
    app.post('/generate-po/:poNumber', async (req, res) => {
        try {
            const poData = req.body; // Get PO data from request
            const pdfBuffer = await generatePDF(poData);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=PO-${req.params.poNumber}.pdf`);
            res.send(pdfBuffer);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}

// Run example
if (require.main === module) {
    createCustomPO();
}

module.exports = {
    createCustomPO,
    generateMultiplePOs,
    exampleExpressRoute
};
