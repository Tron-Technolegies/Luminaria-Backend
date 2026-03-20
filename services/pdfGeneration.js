// export function generateCouponHTML(user, tagNumber) {
//   const formatReward = (r) => {
//     switch (r?.toLowerCase()) {
//       case "polishing": return "Free car checkup + Polishing";
//       case "interior": return "Free car checkup + Interior Detailing";
//       case "carwash": return "Free car checkup + Car wash";
//       default: return r?.toUpperCase() || "";
//     }
//   };

//   const formattedRewardText = formatReward(user.reward);

//   return `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8" />
// <style>

// body{
//   font-family: Arial, Helvetica, sans-serif;
//   margin:40px;
//   color:#000;
// }

// .container{
//   border:2px dashed #000;
//   padding:30px;
// }

// h1{
//   text-align:center;
//   margin-bottom:20px;
// }

// .row{
//   margin-bottom:10px;
//   font-size:14px;
// }

// .reward{
//   font-size:22px;
//   font-weight:bold;
//   color:#0a7a38;
//   margin:20px 0;
// }

// .footer{
//   margin-top:40px;
//   font-size:12px;
// }

// </style>
// </head>

// <body>

// <div class="container">

// <h1>Vehicle Service Reward Coupon</h1>

// <div class="reward">
// Reward: ${formattedRewardText}
// </div>

// <div class="row">
// <strong>Name:</strong> ${user.fullName}
// </div>

// <div class="row">
// <strong>Phone:</strong> ${user.phoneNumber}
// </div>

// <div class="row">
// <strong>Vehicle Number:</strong> ${user.vehicleNumber}
// </div>

// <div class="row">
// <strong>Vehicle Model:</strong> ${user.vehicleModel}
// </div>

// <div class="row">
// <strong>Vehicle Type:</strong> ${user.vehicleType}
// </div>

// <div class="row">
// <strong>Tag Number:</strong> ${tagNumber}
// </div>

// <div class="footer">
// This coupon is valid for one-time redemption only.
// </div>

// </div>

// </body>
// </html>
// `;
// }

// import puppeteer from "puppeteer";

// export async function generateCouponPDF(user, tagNumber) {
//   const browser = await puppeteer.launch({
//     headless: "new",
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage"
//     ],
//   });

//   const page = await browser.newPage();

//   const html = generateCouponHTML(user, tagNumber);

//   await page.setContent(html, { waitUntil: "networkidle0" });

//   const pdfBuffer = await page.pdf({
//     format: "A4",
//     printBackground: true,
//     margin: {
//       top: "40px",
//       bottom: "40px",
//       left: "40px",
//       right: "40px",
//     },
//   });

//   await browser.close();

//   return pdfBuffer;
// }

import PDFDocument from "pdfkit";

export function generateCouponPDF(user, tagNumber) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // =========================
    // 🔲 1. OUTER BORDER (FIRST)
    // =========================
    doc
      .rect(20, 20, 555, 802) // full page border
      .dash(5, { space: 5 })
      .stroke();

    // =========================
    // 🖼️ 2. LOGO (TOP)
    // =========================
    try {
      doc.image("/header-logo.png", 50, 40, { width: 80 });
    } catch (err) {
      // ignore if logo missing
    }

    // =========================
    // 🏷️ 3. TITLE
    // =========================
    doc.fontSize(20).text("Vehicle Service Reward Coupon", 0, 50, {
      align: "center",
    });

    doc.moveDown(3);

    // =========================
    // 📦 4. CONTENT CARD (BOX)
    // =========================
    const cardX = 50;
    const cardY = 150;
    const cardWidth = 500;
    const cardHeight = 400;

    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 10).stroke();

    // Move cursor inside the card
    doc.x = cardX + 20;
    doc.y = cardY + 20;

    // =========================
    // 🎁 5. CONTENT INSIDE CARD
    // =========================

    const formatReward = (r) => {
      switch (r?.toLowerCase()) {
        case "polishing":
          return "Free car checkup + Polishing";
        case "interior":
          return "Free car checkup + Interior Detailing";
        case "carwash":
          return "Free car checkup + Car wash";
        default:
          return r?.toUpperCase() || "";
      }
    };

    const rewardText = formatReward(user.reward);

    // Reward Highlight
    doc.fontSize(16).fillColor("green").text(`Reward: ${rewardText}`);

    doc.moveDown();

    doc.fillColor("black").fontSize(12);

    doc.text(`Name: ${user.fullName}`);
    doc.text(`Phone: ${user.phoneNumber}`);
    doc.text(`Vehicle Number: ${user.vehicleNumber}`);
    doc.text(`Vehicle Model: ${user.vehicleModel}`);
    doc.text(`Vehicle Type: ${user.vehicleType}`);
    doc.text(`Tag Number: ${tagNumber}`);

    // =========================
    // 📄 6. FOOTER
    // =========================
    doc
      .fontSize(10)
      .text("This coupon is valid for one-time redemption only.", 50, 600, {
        align: "center",
      });

    doc.end();
  });
}
