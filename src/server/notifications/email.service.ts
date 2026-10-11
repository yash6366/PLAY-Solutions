import { brandConfig } from "@/config/brand";

export interface EmailNotificationResult {
  success: boolean;
  skipped: boolean;
  messageId?: string;
  reason?: string;
  error?: string;
}

/**
 * Server-only transactional email service.
 * Dispatches internal notifications when inquiries, internship applications,
 * or mentor proposals are successfully persisted.
 *
 * Uses Resend REST API via native fetch with strict timeout and sanitized logging.
 */

function getEmailConfig() {
  const apiKey =
    process.env.RESEND_API_KEY || process.env.EMAIL_PROVIDER_API_KEY || "";
  const toEmail =
    process.env.CONTACT_NOTIFICATION_EMAIL || brandConfig.primaryEmail;
  const fromEmail =
    process.env.NOTIFICATION_FROM_EMAIL ||
    (process.env.NODE_ENV === "production"
      ? `notifications@playqsolutions.com`
      : `onboarding@resend.dev`);

  return {
    apiKey: apiKey.trim(),
    toEmail: toEmail.trim(),
    fromEmail: fromEmail.trim(),
    isConfigured: Boolean(apiKey.trim() && apiKey.trim() !== "placeholder"),
  };
}

async function dispatchEmail(options: {
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
}): Promise<EmailNotificationResult> {
  const config = getEmailConfig();

  if (!config.isConfigured) {
    return {
      success: false,
      skipped: true,
      reason: "PROVIDER_UNCONFIGURED: Email API key is not set in environment.",
    };
  }

  // Prevent sending external network requests during test runs unless explicitly testing provider
  if (process.env.NODE_ENV === "test" && !process.env.TEST_LIVE_EMAIL) {
    return {
      success: true,
      skipped: false,
      messageId: "mock_msg_" + Math.random().toString(36).substring(2, 9),
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    };

    if (options.idempotencyKey) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({
        from: config.fromEmail,
        to: [config.toEmail],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const statusText = res.statusText || `HTTP_${res.status}`;
      console.warn(
        `[Email Notification Warning] Provider rejected message (Status: ${res.status} ${statusText}). Persistence unaffected.`
      );
      return {
        success: false,
        skipped: false,
        error: `PROVIDER_ERROR: ${statusText}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      skipped: false,
      messageId: data.id || "delivered",
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errName = (err as Error)?.name || "NetworkError";
    console.warn(
      `[Email Notification Warning] Failed to reach email provider (${errName}). Persistence unaffected.`
    );
    return {
      success: false,
      skipped: false,
      error: `NETWORK_ERROR: ${errName}`,
    };
  }
}

/**
 * Notify team about a new contact or business inquiry.
 */
export async function sendInquiryNotification(inquiry: {
  id: string;
  type: string;
  name: string;
  email: string;
  organization?: string | null;
  message: string;
}): Promise<EmailNotificationResult> {
  const subject = `[${brandConfig.shortName}] New ${inquiry.type} Inquiry from ${inquiry.name}`;
  const text = `New inquiry received on ${brandConfig.companyName} portal.
Reference ID: ${inquiry.id}
Type: ${inquiry.type}
Name: ${inquiry.name}
Email: ${inquiry.email}
Organization: ${inquiry.organization || "N/A"}
Message:
${inquiry.message}
`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
        New ${inquiry.type} Inquiry Received
      </h2>
      <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
        A new submission was received on the <strong>${brandConfig.companyName}</strong> portal.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Reference ID:</td>
          <td style="padding: 8px 0; font-family: monospace; color: #0284c7;">${inquiry.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Inquiry Type:</td>
          <td style="padding: 8px 0;">${inquiry.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Full Name:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${inquiry.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Sender Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${inquiry.email}" style="color: #0284c7;">${inquiry.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Organization:</td>
          <td style="padding: 8px 0;">${inquiry.organization || "None specified"}</td>
        </tr>
      </table>
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message Content:</h4>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${inquiry.message}</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        This automated notification was generated by ${brandConfig.companyName} system.
      </p>
    </div>
  `;

  return dispatchEmail({
    subject,
    html,
    text,
    idempotencyKey: `inquiry_${inquiry.id}`,
  });
}

/**
 * Notify team about a new student internship application.
 */
export async function sendInternshipNotification(application: {
  id: string;
  opportunityId: string;
  fullName: string;
  email: string;
  education: string;
  skills: string;
  motivationStatement: string;
  portfolioUrl?: string | null;
  linkedInUrl?: string | null;
}): Promise<EmailNotificationResult> {
  const subject = `[${brandConfig.shortName}] New Internship Application: ${application.fullName} (${application.opportunityId})`;
  const text = `New internship application received on ${brandConfig.companyName}.
Application ID: ${application.id}
Opportunity: ${application.opportunityId}
Candidate: ${application.fullName}
Email: ${application.email}
Education: ${application.education}
Skills: ${application.skills}
Portfolio: ${application.portfolioUrl || "N/A"}
LinkedIn: ${application.linkedInUrl || "N/A"}

Motivation Statement:
${application.motivationStatement}
`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
        New Internship Application Received
      </h2>
      <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
        Candidate application submitted for cohort review.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Application ID:</td>
          <td style="padding: 8px 0; font-family: monospace; color: #0284c7;">${application.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Opportunity ID:</td>
          <td style="padding: 8px 0; font-weight: 600;">${application.opportunityId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Candidate:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${application.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${application.email}" style="color: #0284c7;">${application.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Education:</td>
          <td style="padding: 8px 0;">${application.education}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Skills:</td>
          <td style="padding: 8px 0;">${application.skills}</td>
        </tr>
        ${
          application.portfolioUrl
            ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Portfolio:</td>
                <td style="padding: 8px 0;"><a href="${application.portfolioUrl}" target="_blank" style="color: #0284c7;">${application.portfolioUrl}</a></td>
              </tr>`
            : ""
        }
        ${
          application.linkedInUrl
            ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">LinkedIn:</td>
                <td style="padding: 8px 0;"><a href="${application.linkedInUrl}" target="_blank" style="color: #0284c7;">${application.linkedInUrl}</a></td>
              </tr>`
            : ""
        }
      </table>
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; text-transform: uppercase;">Motivation Statement:</h4>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${application.motivationStatement}</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        Automated application triage notification from ${brandConfig.companyName}.
      </p>
    </div>
  `;

  return dispatchEmail({
    subject,
    html,
    text,
    idempotencyKey: `internship_${application.id}`,
  });
}

/**
 * Notify team about a new industry expert or mentor inquiry.
 */
export async function sendMentorNotification(inquiry: {
  id: string;
  fullName: string;
  email: string;
  areaOfExpertise: string;
  collaborationPreference: string;
  linkedInOrWebsiteUrl?: string | null;
  introduction: string;
}): Promise<EmailNotificationResult> {
  const subject = `[${brandConfig.shortName}] Mentor / Expert Proposal: ${inquiry.fullName}`;
  const text = `New mentor/expert inquiry received on ${brandConfig.companyName}.
Inquiry ID: ${inquiry.id}
Name: ${inquiry.fullName}
Email: ${inquiry.email}
Area of Expertise: ${inquiry.areaOfExpertise}
Preference: ${inquiry.collaborationPreference}
Profile: ${inquiry.linkedInOrWebsiteUrl || "N/A"}

Introduction:
${inquiry.introduction}
`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background: #ffffff;">
      <h2 style="color: #0f172a; margin-top: 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
        New Mentor / Expert Proposal Received
      </h2>
      <p style="font-size: 14px; color: #64748b; margin-bottom: 20px;">
        An industry specialist has expressed interest in collaborating with ${brandConfig.companyName}.
      </p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 140px; font-weight: 600;">Inquiry ID:</td>
          <td style="padding: 8px 0; font-family: monospace; color: #0284c7;">${inquiry.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Full Name:</td>
          <td style="padding: 8px 0; font-weight: 600; color: #0f172a;">${inquiry.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Email:</td>
          <td style="padding: 8px 0;"><a href="mailto:${inquiry.email}" style="color: #0284c7;">${inquiry.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Expertise Area:</td>
          <td style="padding: 8px 0;">${inquiry.areaOfExpertise}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Collaboration:</td>
          <td style="padding: 8px 0;">${inquiry.collaborationPreference}</td>
        </tr>
        ${
          inquiry.linkedInOrWebsiteUrl
            ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Profile URL:</td>
                <td style="padding: 8px 0;"><a href="${inquiry.linkedInOrWebsiteUrl}" target="_blank" style="color: #0284c7;">${inquiry.linkedInOrWebsiteUrl}</a></td>
              </tr>`
            : ""
        }
      </table>
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; text-transform: uppercase;">Introduction:</h4>
        <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #334155;">${inquiry.introduction}</p>
      </div>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        Automated partner notification generated by ${brandConfig.companyName}.
      </p>
    </div>
  `;

  return dispatchEmail({
    subject,
    html,
    text,
    idempotencyKey: `mentor_${inquiry.id}`,
  });
}
