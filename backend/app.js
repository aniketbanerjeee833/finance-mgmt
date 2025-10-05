



import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app=express()

app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",

}));
const sale=[{
    "Party_Name": "John Doe",
    "Party_Phone": "1234567890",
    "Invoice_Date": "2023-08-01",
    "Invoice_Number": "INV123",
    "State_Of_Supply": "Gujarat",
    "Total_Amount": 270.00,
    "Total_Received": 70.00,
    "Balance_Due": 200.00,

    items:[
        {
        "Item_Name": "Monitor",
        "Quantity": 2,
       "Unit": "pcs",
       "Sale_Price": 100,
       "Discount": 0,
       "Tax_Type": "GST 5%",
       "Tax_Amount": 105,
        "Amount": 210
    },
    {
        "Item_Name": "Keyboard",
        "Quantity": 1,
       "Unit": "pcs",
       "Sale_Price": 50,
       "Discount": 0,
       "Tax_Type": "GST 5%",
       "Tax_Amount": 10,
        "Amount": 60
    }

]
}]
app.get("/print-sale", async (req, res) => {


  try {
  

    // 2️⃣ Build styled HTML invoice
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
    header { text-align: center; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 22px; text-transform: uppercase; color: #444; }
    .invoice-meta { margin-top: 10px; font-size: 14px; color: #666; }
  .address-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.address-container .info {
  flex: 1;
  padding: 15px 20px;
  font-size: 14px;
  color: #333;
}

.address-container .info h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #444;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.address-container .divider {
  width: 1px;
  background: #ddd;
}
    .info { display: flex; flex-Direction: column; margin: 20px 0; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
    th, td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; }
    th { background: #f8f8f8; font-weight: bold; color: #444; }
    tfoot td { border: none; }
    .totals { margin-top: 30px; width: 100%; display: flex; justify-content: flex-end; }
    .totals table { width: 40%; border: 1px solid #e0e0e0; }
    .totals td { padding: 8px 12px; }
    .totals tr td:first-child { text-align: right; font-weight: bold; background: #f9f9f9; }
    footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <header>
    <h1>Invoice</h1>
    <div class="invoice-meta">
      Invoice Number: ${sale[0].Invoice_Number} <br/>
      Date: ${new Date(sale[0].Invoice_Date).toLocaleDateString()}
    </div>
  </header>
<div class="address-container">
  <div class="info">
    <h4>Billed To</h4>
    <p><strong>${sale[0].Party_Name}</strong></p>
    <p><strong>State of Supply:</strong> ${sale[0].State_Of_Supply}</p>
  </div>

  <div class="divider"></div>

  <div class="info">
    <h4>Shipped To</h4>
    <p><strong>${sale[0].Party_Name}</strong></p>
    <p><strong>State of Supply:</strong> ${sale[0].State_Of_Supply}</p>
  </div>
</div>

  <table>
    <thead>
      <tr>
        <th>Sl.No</th>
        <th>Item</th>
        <th>Qty</th>
        <th>Unit Price</th>
        <th>Discount</th>
        <th>Tax Type</th>
        <th>Tax Amt</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      ${sale[0].items
        .map(
          (it, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${it.Item_Name}</td>
            <td>${it.Quantity} ${it.Unit}</td>
            <td>${it.Sale_Price.toFixed(2)}</td>
            <td>${it.Discount}</td>
            <td>${it.Tax_Type}</td>
            <td>${it.Tax_Amount.toFixed(2)}</td>
            <td>${it.Amount.toFixed(2)}</td>
          </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <!-- Totals Section -->
  <div class="totals">
    <table>
      <tr>
        <td>Total Amount</td>
        <td>${sale[0].Total_Amount.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Received</td>
        <td>${sale[0].Total_Received.toFixed(2)}</td>
      </tr>
      <tr>
        <td>Balance Due</td>
        <td>${sale[0].Balance_Due.toFixed(2)}</td>
      </tr>
    </table>
  </div>

  <footer>
    Thank you for your business! 
  </footer>
</body>
</html>
`;


    // 3️⃣ Puppeteer PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      margin: { top: "40px", bottom: "60px" },
      footerTemplate: `
        <div style="width:100%; text-align:center; font-size:10px; color:#999; padding-top:5px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>`,
      headerTemplate: `<div></div>`, // empty header
    });

    await browser.close();

    // 4️⃣ Send PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="invoice_${sale[0].Invoice_Number}.pdf"`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Error generating PDF:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});





