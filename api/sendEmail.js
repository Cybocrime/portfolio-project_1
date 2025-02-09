const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default async function handler(req, res) {
  // Allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Only allow your frontend
res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
res.setHeader("Access-Control-Allow-Headers", "Content-Type, api-key");


  // Handle OPTIONS method for preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log("❌ Invalid request method:", req.method);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, postcode, message, country } = req.body;

  console.log("📩 Received data:", { name, email, phone, postcode, message, country });

  // Validate required fields
  if (!name || !email || !phone || !postcode || !message || !country) {
    console.log("⚠️ Missing fields in request:", req.body);
    return res.status(400).json({ message: "All fields are required." });
  }

  // Validate email format
  if (!validateEmail(email)) {
    console.log("⚠️ Invalid email format:", email);
    return res.status(400).json({ message: "Invalid email format." });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { email: "cybocrime@gmail.com" }, // Replace with your Brevo verified email
        to: [{ email: "mawutorye@gmail.com" }],  // Recipient email
        subject: "New Contact Form Submission",
        htmlContent: `
          <h3>New Message from ${name}</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Postcode:</strong> ${postcode}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      }),
    });
    
    const data = await response.json();
    console.log("✅ Email sent response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Failed to send email.");
    }

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    res.status(500).json({ message: "Error sending email. Please try again later." });
  }
}
