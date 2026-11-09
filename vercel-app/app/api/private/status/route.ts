import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { roleForEmail } from "../../../../lib/access";

export const dynamic = "force-dynamic";
export async function GET() {
  const session = await auth();
  const role = roleForEmail(session?.user?.email);
  if (!session?.user?.email) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (!role) return NextResponse.json({ error: "Access denied" }, { status: 403 });
  return NextResponse.json({ status: "authorized", role }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
