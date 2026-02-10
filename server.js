const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "happyteam@ipayonplus.com",
    pass: "lusrrydhpefqpkqz"
  }
});

function encode(data) {
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

function decode(data) {
  return JSON.parse(Buffer.from(data, "base64").toString());
}

/* Step 1: send verification email */
app.post("/submit", async (req, res) => {
  const data = req.body;

  const token = encode(data);
  const verifyLink =
    `http://localhost:3000/verify?data=${token}`;

  await transporter.sendMail({
    to: data.email,
    subject: "Verify your submission",
    html: `

      <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f7fb;padding:32px 16px;">
        <div style="max-width:580px;margin:0 auto;background:#071613;border-radius:16px;padding:36px 30px;border:1px solid rgba(148,163,184,0.2);">

            <!-- Header -->
            <div style="text-align:center;margin-bottom:20px;">
            <!-- Optional Logo -->
            <!-- <img src="https://yourdomain.com/logo.png" style="height:50px;margin-bottom:10px;"> -->

            <h2 style="margin:10px 0 6px;font-size:24px;color:#f9fafb;">
                Welcome to Happyy 👋
            </h2>

            <p style="margin:0;color:#cbd5f5;font-size:14px;">
                One Super App for everyday services in the UAE
            </p>
            </div>

            <!-- Main message -->
            <div style="margin-top:24px;color:#e5e7eb;font-size:15px;line-height:1.6;text-align:center;">
            <p style="margin-bottom:12px;">
                You're just one step away from accessing fast and secure services with Happyy.
            </p>

            <p style="margin-bottom:16px;">
                Confirm your email address to activate your request and start enjoying services like:
            </p>

            <div style="margin:16px 0;color:#cbd5f5;">
                ✔ Instant bill payments<br>
                ✔ Mobile top-ups worldwide<br>
                ✔ Gift cards & vouchers<br>
                ✔ Courier & travel services<br>
                ✔ Easy payments for your loved ones
            </div>

            <p style="margin-top:16px;">
                Click the button below to verify your email and continue.
            </p>
            </div>

            <!-- Button -->
            <div style="text-align:center;margin:30px 0;">
            <a
                href="${verifyLink}"
                style="
                display:inline-block;
                padding:14px 30px;
                background:linear-gradient(135deg,#14B8A6,#0ea5a4);
                color:#ffffff;
                text-decoration:none;
                border-radius:999px;
                font-weight:600;
                font-size:15px;
                box-shadow:0 12px 25px rgba(0,0,0,0.45);
                "
            >
                Confirm My Email
            </a>
            </div>

            <!-- Footer message -->
            <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:10px;">
            If you didn’t request this, you can safely ignore this email.
            </p>
        </div>

        <!-- Footer -->
        <p style="max-width:560px;margin:14px auto 0;text-align:center;font-size:11px;color:#6b7280;">
            © ${new Date().getFullYear()} Happyy. All rights reserved.
        </p>
        </div>
    `
    
  });

  res.json({ status: "Verification email sent"});
});

/* Step 2: user clicks link */
app.get("/verify", async (req, res) => {
  const data = decode(req.query.data);

  /* send mail to admin */
  await transporter.sendMail({
    to: "happyteam@ipayonplus.com",
    subject: "New Contact Submission",
    html: `<pre>${JSON.stringify(data, null, 2)}</pre>`
  });

  /* confirmation mail to user */
  await transporter.sendMail({
    to: data.email,
    subject: "Submission Confirmed",
    html: `
    <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f7fb;padding:32px 16px;">
        <div style="max-width:560px;margin:0 auto;background:#071613;border-radius:16px;padding:36px 30px;border:1px solid rgba(148,163,184,0.2);">

            <!-- Header -->
            <div style="text-align:center;margin-bottom:20px;">
            <!-- Optional logo -->
            <!-- <img src="https://yourdomain.com/logo.png" style="height:50px;margin-bottom:10px;"> -->

            <h2 style="margin:10px 0 6px;font-size:24px;color:#f9fafb;">
                ✅ Email Confirmed Successfully
            </h2>

            <p style="margin:0;color:#cbd5f5;font-size:14px;">
                Your request has been received by Happyy
            </p>
            </div>

            <!-- Main content -->
            <div style="margin-top:24px;color:#e5e7eb;font-size:15px;line-height:1.6;text-align:center;">
            <p style="margin-bottom:12px;">
                Thank you for confirming your email address.
            </p>

            <p style="margin-bottom:16px;">
                Our team has received your request and will get back to you shortly.
            </p>

            <p style="margin-bottom:18px;">
                Meanwhile, you can explore Happyy and enjoy services like:
            </p>

            <div style="margin:16px 0;color:#cbd5f5;">
                ✔ Fast bill payments<br>
                ✔ Mobile top-ups worldwide<br>
                ✔ Gift cards & vouchers<br>
                ✔ Courier & travel services<br>
                ✔ Payments for loved ones back home
            </div>

            <p style="margin-top:16px;">
                We’re happy to have you with us. 🚀
            </p>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center;margin:30px 0;">
            <a
                href="http://127.0.0.1:5500"
                style="
                display:inline-block;
                padding:14px 30px;
                background:linear-gradient(135deg,#14B8A6,#0ea5a4);
                color:#ffffff;
                text-decoration:none;
                border-radius:999px;
                font-weight:600;
                font-size:15px;
                box-shadow:0 12px 25px rgba(0,0,0,0.45);
                "
            >
                Visit Happyy
            </a>
            </div>

            <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:10px;">
            Need help? Our support team is always ready to assist you.
            </p>
        </div>

        <!-- Footer -->
        <p style="max-width:560px;margin:14px auto 0;text-align:center;font-size:11px;color:#6b7280;">
            © ${new Date().getFullYear()} Happyy. All rights reserved.
        </p>
    </div>
    `
  });

  /* redirect back to site */
  res.redirect("http://127.0.0.1:5500");
});

app.listen(3000, () =>
  console.log("Server running on port 3000")
);
