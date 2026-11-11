import { NextRequest, NextResponse } from "next/server";
import { auth, authConfigured } from "../../../../auth";
import { roleForEmailAsync } from "../../../../lib/access";
import { databaseConfigured, dbQuery } from "../../../../lib/database";

export const dynamic = "force-dynamic";
export async function POST(request:NextRequest) {
  const noCache = {"Cache-Control":"private, no-store"};
  if (!authConfigured || !databaseConfigured) return NextResponse.json({error:"Unavailable"},{status:503,headers:noCache});
  const session=await auth();
  if(!session?.user?.email) return NextResponse.json({error:"Unauthorized"},{status:401,headers:noCache});
  const email=session.user.email.toLowerCase().trim();
  const role=await roleForEmailAsync(email);
  if(!role) return NextResponse.json({error:"Forbidden"},{status:403,headers:noCache});
  const origin=request.headers.get("origin");
  if(origin && new URL(origin).host !== request.headers.get("host"))
    return NextResponse.json({error:"Origin forbidden"},{status:403,headers:noCache});
  let section="Biblioteca";
  try {
    const data=await request.json() as {section?:unknown};
    if (typeof data.section==="string") section=data.section.slice(0,80).replace(/[^a-zA-ZÀ-ÿ0-9 .—-]/g,"").trim() || "Biblioteca";
  } catch { /* default */ }
  try {
    await dbQuery(`INSERT INTO biblioteca_user_presence(email,role,section,last_seen_at,updated_at)
      VALUES($1,$2,$3,now(),now())
      ON CONFLICT(email) DO UPDATE SET role=EXCLUDED.role,section=EXCLUDED.section,
      last_seen_at=now(),updated_at=now()`,[email,role,section]);
    return NextResponse.json({ok:true},{headers:noCache});
  } catch { return NextResponse.json({error:"Unavailable"},{status:503,headers:noCache}); }
}
