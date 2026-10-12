import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { createInquiry } from "@/server/repositories/inquiry.repository";
import { sendInquiryNotification } from "@/server/notifications/email.service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`contact_${ip}`, { limit: 5, windowMs: 60000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait before submitting another inquiry.",
          retryAfterSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
          },
        }
      );
    }

    const body = await req.json();

    // Anti-spam bot trap
    if (body.companyWebsiteCheck && body.companyWebsiteCheck.length > 0) {
      return NextResponse.json(
        { success: false, error: "Automated submission rejected." },
        { status: 400 }
      );
    }

    const validation = contactFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await createInquiry(validation.data);

    if (!result.configured) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          setupGuide:
            "To activate persistent form submissions, set DATABASE_URL in your server environment variables and apply migrations via `npx prisma migrate deploy`.",
        },
        { status: 503 }
      );
    }

    if (!result.success) {
      const status = result.isConnectionError ? 503 : 500;
      return NextResponse.json(
        { success: false, error: result.error || "Internal server error occurred." },
        { status }
      );
    }

    // Dispatch transactional notification; errors never compromise successful record persistence
    sendInquiryNotification({
      id: result.id || "inq_ref",
      type: validation.data.inquiryType,
      name: validation.data.name,
      email: validation.data.email,
      organization: validation.data.organization,
      message: validation.data.message,
    }).catch((err) => {
      console.warn("[Contact API] Async email notification warning:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been received. Our team will review and respond shortly.",
        referenceId: result.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Contact API Error]", err);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
