import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/server/auth/session";
import { getInquiryStats } from "@/server/repositories/inquiry.repository";
import { getApplicationStats } from "@/server/repositories/internship.repository";
import { getMentorStats } from "@/server/repositories/mentor.repository";

export async function GET(req: Request) {
  try {
    await requireAdminAuth(undefined, req);

    const [inquiries, applications, mentors] = await Promise.all([
      getInquiryStats(),
      getApplicationStats(),
      getMentorStats(),
    ]);

    const inquiriesData = {
      total: inquiries.total,
      new: inquiries.newCount,
      newCount: inquiries.newCount,
      inProgress: inquiries.inReviewCount,
      inReviewCount: inquiries.inReviewCount,
      contacted: inquiries.contactedCount,
      contactedCount: inquiries.contactedCount,
      closed: inquiries.closedCount,
      closedCount: inquiries.closedCount,
    };

    const internshipsData = {
      total: applications.total,
      pending: applications.submittedCount,
      submittedCount: applications.submittedCount,
      underReview: applications.underReviewCount,
      underReviewCount: applications.underReviewCount,
      shortlisted: applications.shortlistedCount,
      shortlistedCount: applications.shortlistedCount,
      accepted: applications.acceptedCount,
      acceptedCount: applications.acceptedCount,
      rejected: applications.declinedCount,
      declinedCount: applications.declinedCount,
    };

    const expertsData = {
      total: mentors.total,
      new: mentors.newCount,
      newCount: mentors.newCount,
      underReview: mentors.inReviewCount,
      inReviewCount: mentors.inReviewCount,
      contacted: mentors.contactedCount,
      contactedCount: mentors.contactedCount,
      active: mentors.inReviewCount,
      declined: mentors.closedCount,
      closedCount: mentors.closedCount,
    };

    return NextResponse.json({
      success: true,
      stats: {
        inquiries: inquiriesData,
        internships: internshipsData,
        applications: internshipsData,
        experts: expertsData,
        mentors: expertsData,
      },
    });
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; statusCode?: number };
    if (error.name === "AuthError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode || 401 }
      );
    }
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
