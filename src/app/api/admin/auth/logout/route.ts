import { NextResponse } from "next/server";
import { getAdminSession, ADMIN_COOKIE_NAME } from "@/server/auth/session";
import { logAudit } from "@/server/repositories/admin.repository";

export async function POST(req: Request) {
  const session = await getAdminSession(req);

  if (session) {
    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "AUTH_LOGOUT",
      resource: "admin_portal",
    });
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully." });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
