/**
 * Transactional Email Verification Script — PLAYQ Solutions
 *
 * Verifies live delivery to Resend REST API using configured credentials.
 * Does NOT expose secrets or personal information in outputs.
 *
 * Usage:
 *   npx tsx scripts/test-email.ts [--recipient=you@example.com]
 */

import { brandConfig } from "../src/config/brand";

async function testEmailDelivery() {
  const apiKey = (process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY)?.trim();
  const fromEmail =
    process.env.NOTIFICATION_FROM_EMAIL?.trim() ||
    (process.env.NODE_ENV === "production"
      ? "notifications@playqsolutions.com"
      : "onboarding@resend.dev");

  const args = process.argv.slice(2);
  const recipientArg = args.find((a) => a.startsWith("--recipient="))?.split("=")[1];
  const toEmail = recipientArg || process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || brandConfig.primaryEmail;

  console.log(`\n================================================================`);
  console.log(` PLAYQ Solutions — Transactional Email Delivery Smoke Test`);
  console.log(` Time: ${new Date().toISOString()}`);
  console.log(`================================================================\n`);

  if (!apiKey || apiKey === "" || apiKey.includes("<") || apiKey.includes("placeholder")) {
    console.log("ℹ️  Email Status: UNCONFIGURED / MOCK MODE");
    console.log("   RESEND_API_KEY is not set or contains placeholder text.");
    console.log("   To verify live delivery on staging, set RESEND_API_KEY and re-run.\n");
    console.log("----------------------------------------------------------------");
    console.log("Result: [OFFLINE] Live email delivery cannot be verified without Resend credentials.\n");
    return;
  }

  // Obfuscate API key in console output
  const maskedKey = apiKey.substring(0, 5) + "..." + apiKey.substring(apiKey.length - 4);
  console.log(`Provider:        Resend REST API (api.resend.com)`);
  console.log(`API Key:         ${maskedKey}`);
  console.log(`Sender:          ${fromEmail}`);
  console.log(`Recipient:       ${toEmail}\n`);

  const testId = "smoke_" + Math.random().toString(36).substring(2, 8);
  const subject = `[STAGING TEST] PLAYQ Solutions Email Smoke Test (${testId})`;
  const textContent = `This is an automated smoke test email dispatched by PLAYQ Solutions.\nTest ID: ${testId}\nDispatched At: ${new Date().toISOString()}`;
  const htmlContent = `
    <div style="font-family: -apple-system, sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 8px;">
      <h2 style="color: #38bdf8;">PLAYQ Solutions — Staging Verification</h2>
      <p>This is a live transactional email smoke test.</p>
      <div style="padding: 12px; background: #1e293b; border-radius: 6px; font-family: monospace;">
        <strong>Test ID:</strong> ${testId}<br/>
        <strong>Timestamp:</strong> ${new Date().toISOString()}<br/>
        <strong>Sender:</strong> ${fromEmail}
      </div>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">System verification notice &bull; PLAYQ Solutions</p>
    </div>
  `;

  console.log("1. Dispatching test payload to Resend API...");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html: htmlContent,
        text: textContent,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.text();
      console.log(`   ✗ Delivery rejected by Resend (HTTP ${res.status} ${res.statusText})`);
      console.log(`   Diagnostic: ${errBody}`);
      console.log("\n----------------------------------------------------------------");
      console.log("❌ Result: EMAIL DELIVERY FAILED. Check domain verification and API key permissions.\n");
      process.exit(1);
    }

    const data = await res.json();
    console.log(`   ✓ Message accepted by provider.`);
    console.log(`   Resend Message ID: ${data.id || "acknowledged"}`);
    console.log("\n----------------------------------------------------------------");
    console.log("✅ Result: LIVE TRANSACTIONAL EMAIL VERIFIED. Check destination inbox.\n");
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const error = err as { name?: string; message?: string };
    console.log("\n----------------------------------------------------------------");
    console.log(`❌ Result: NETWORK ERROR DISPATCHING EMAIL (${error.name || "Error"})`);
    console.log(`   Diagnostic: ${error.message || "Request failed"}\n`);
    process.exit(1);
  }
}

testEmailDelivery().catch((err) => {
  console.error("Test email execution error:", err);
  process.exit(1);
});
