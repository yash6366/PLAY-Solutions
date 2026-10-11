import { NextResponse } from "next/server";
import { mentorInquirySchema } from "@/lib/validation/schemas";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit/limiter";
import { createMentorInquiry } from "@/server/repositories/mentor.repository";
import { sendMentorNotification } from "@/server/notifications/email.service";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`mentor_inq_${ip}`, { limit: 4, windowMs: 60000 });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait before submitting another collaboration inquiry.",
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

    if (body.companyOfficeCode && body.companyOfficeCode.length > 0) {
      return NextResponse.json(
        { success: false, error: "Automated submission rejected." },
        { status: 400 }
      );
    }

    const validation = mentorInquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete the inquiry form correctly",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const result = await createMentorInquiry(validation.data);

    if (!result.configured) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          setupGuide:
            "Set DATABASE_URL in your server environment variables to activate mentor inquiry persistence.",
        },
        { status: 503 }
      );
    }

    if (!result.success) {
      const status = result.isConnectionError ? 503 : 500;
      return NextResponse.json(
        { success: false, error: result.error || "Unable to save inquiry." },
        { status }
      );
    }

    // Dispatch partner notification; errors never invalidate inquiry submission
    sendMentorNotification({
      id: result.id || "mnt_ref",
      fullName: validation.data.fullName,
      email: validation.data.email,
      areaOfExpertise: validation.data.areaOfExpertise,
      collaborationPreference: validation.data.collaborationPreference,
      linkedInOrWebsiteUrl: validation.data.linkedInOrWebsiteUrl,
      introduction: validation.data.introduction,
    }).catch((err) => {
      console.warn("[Mentor API] Async notification warning:", err);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out to collaborate. We look forward to connecting with you.",
        inquiryId: result.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Mentor API Error]", err);
    return NextResponse.json(
      { success: false, error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
