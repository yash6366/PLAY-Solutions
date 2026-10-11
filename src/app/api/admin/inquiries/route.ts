import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/server/auth/session";
import { getInquiries } from "@/server/repositories/inquiry.repository";

export async function GET(req: Request) {
  try {
    await requireAdminAuth(undefined, req);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") || url.searchParams.get("limit") || "10", 10);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const type = url.searchParams.get("type") || "";

    const result = await getInquiries({ page, pageSize, search, status, type });

    return NextResponse.json({
      success: true,
      items: result.items,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
        totalPages: result.totalPages,
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
    return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
