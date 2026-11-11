import { NextResponse } from "next/server";
import { auth, authConfigured } from "../../../../auth";
import { roleForEmailAsync } from "../../../../lib/access";

export const dynamic = "force-dynamic";
export async function GET() {
  if (!authConfigured) return NextResponse.json({ error: "Login not configured" }, { status: 503 });
  const session = await auth();
  const role = await roleForEmailAsync(session?.user?.email);
  if (!session?.user?.email) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (!role) return NextResponse.json({ error: "Access denied" }, { status: 403 });
  return NextResponse.json({ status: "authorized", role }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
