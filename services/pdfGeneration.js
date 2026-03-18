export function generateCouponHTML(user, tagNumber) {
  const formatReward = (r) => {
    switch (r?.toLowerCase()) {
      case "polishing": return "Free car checkup + Polishing";
      case "interior": return "Free car checkup + Interior Detailing";
      case "carwash": return "Free car checkup + Car wash";
      default: return r?.toUpperCase() || "";
    }
  };

  const formattedRewardText = formatReward(user.reward);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>

body{
  font-family: Arial, Helvetica, sans-serif;
  margin:40px;
  color:#000;
}

.container{
  border:2px dashed #000;
  padding:30px;
}

h1{
  text-align:center;
  margin-bottom:20px;
}

.row{
  margin-bottom:10px;
  font-size:14px;
}

.reward{
  font-size:22px;
  font-weight:bold;
  color:#0a7a38;
  margin:20px 0;
}

.footer{
  margin-top:40px;
  font-size:12px;
}

</style>
</head>

<body>

<div class="container">

<h1>Vehicle Service Reward Coupon</h1>

<div class="reward">
Reward: ${formattedRewardText}
</div>

<div class="row">
<strong>Name:</strong> ${user.fullName}
</div>

<div class="row">
<strong>Phone:</strong> ${user.phoneNumber}
</div>

<div class="row">
<strong>Vehicle Number:</strong> ${user.vehicleNumber}
</div>

<div class="row">
<strong>Vehicle Model:</strong> ${user.vehicleModel}
</div>

<div class="row">
<strong>Vehicle Type:</strong> ${user.vehicleType}
</div>

<div class="row">
<strong>Tag Number:</strong> ${tagNumber}
</div>

<div class="footer">
This coupon is valid for one-time redemption only.
</div>

</div>

</body>
</html>
`;
}

import puppeteer from "puppeteer";

export async function generateCouponPDF(user, tagNumber) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox", 
      "--disable-setuid-sandbox", 
      "--disable-dev-shm-usage"
    ],
  });

  const page = await browser.newPage();

  const html = generateCouponHTML(user, tagNumber);

  await page.setContent(html, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "40px",
      bottom: "40px",
      left: "40px",
      right: "40px",
    },
  });

  await browser.close();

  return pdfBuffer;
}
