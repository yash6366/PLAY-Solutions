import { NextResponse } from "next/server";
import { internshipApplicationSchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { createInternshipApplication } from "@/server/repositories/internship.repository";
import { sendInternshipNotification } from "@/server/notifications/email.service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`intern_apply_${ip}`, { limit: 3, windowMs: 120000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait before submitting another application.",
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

    // Bot trap
    if (body.applicantMiddleName && body.applicantMiddleName.length > 0) {
      return NextResponse.json(
        { success: false, error: "Automated submission rejected." },
        { status: 400 }
      );
    }

    const validation = internshipApplicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete all required fields correctly",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await createInternshipApplication(validation.data);

    if (!result.configured) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          setupGuide:
            "Set DATABASE_URL in your server environment variables to enable live application submissions.",
        },
        { status: 503 }
      );
    }

    if (!result.success) {
      const status = result.isConnectionError ? 503 : 500;
      return NextResponse.json(
        { success: false, error: result.error || "Unable to save application at this time." },
        { status }
      );
    }

    // Dispatch notification to committee; errors never invalidate candidate submission
    sendInternshipNotification({
      id: result.id || "app_ref",
      opportunityId: validation.data.opportunityId,
      fullName: validation.data.fullName,
      email: validation.data.email,
      education: validation.data.education,
      skills: validation.data.relevantSkills,
      motivationStatement: validation.data.motivationStatement,
      portfolioUrl: validation.data.portfolioUrl,
      linkedInUrl: validation.data.linkedInUrl,
    }).catch((err) => {
      console.warn("[Internship Apply API] Async notification warning:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been received. Our review committee will contact qualified candidates.",
        applicationId: result.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Internship Apply API Error]", err);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
