import { NextResponse } from "next/server";
import { requireAdminAuth } from "@/server/auth/session";
import { getInquiries } from "@/server/repositories/inquiry.repository";
import { logAudit } from "@/server/repositories/admin.repository";
import { getClientIp } from "@/lib/rate-limit/limiter";

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  let str = String(field);
  // Neutralize CSV / Spreadsheet Formula Injection (CWE-1236)
  // Prefix dangerous trigger characters with single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function GET(req: Request) {
  try {
    const session = await requireAdminAuth(["SUPER_ADMIN", "ADMIN"], req);
    const ip = getClientIp(req);

    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const type = url.searchParams.get("type") || "";

    // Fetch up to 1000 matching records for export
    const result = await getInquiries({
      page: 1,
      pageSize: 1000,
      search,
      status,
      type,
    });

    const headers = [
      "Inquiry ID",
      "Created At",
      "Name",
      "Email",
      "Organization",
      "Inquiry Type",
      "Status",
      "Budget Range",
      "Timeline",
      "Message",
      "Internal Notes",
    ];

    const rows = result.items.map((item) => [
      escapeCsvField(item.id),
      escapeCsvField(item.createdAt.toISOString()),
      escapeCsvField(item.name),
      escapeCsvField(item.email),
      escapeCsvField(item.organization || ""),
      escapeCsvField(item.type || ""),
      escapeCsvField(item.status),
      escapeCsvField(item.budgetRange || ""),
      escapeCsvField(item.timeline || ""),
      escapeCsvField(item.message),
      escapeCsvField(item.internalNotes || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    await logAudit({
      adminId: session.userId,
      adminEmail: session.email,
      action: "EXPORT_INQUIRIES_CSV",
      resource: "inquiries",
      ipAddress: ip,
      metadata: { recordCount: result.items.length },
    });

    const filename = `playq-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, max-age=0",
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
    return NextResponse.json(
      { success: false, error: "Failed to export inquiries CSV." },
      { status: 500 }
    );
  }
}
