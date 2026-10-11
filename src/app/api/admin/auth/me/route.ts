import { NextResponse } from "next/server";
import { getAdminSession } from "@/server/auth/session";

export async function GET(req: Request) {
  const session = await getAdminSession(req);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role,
      mfaVerified: !!session.mfaVerified,
    },
  });
}
