import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { roleForEmailAsync } from "../../../../../lib/access";
import { databaseConfigured, dbQuery } from "../../../../../lib/database";
export const dynamic="force-dynamic";
type PresenceRow={email:string;name:string;role:string;section:string;last_seen_at:string;online:boolean};
export async function GET(){
  const headers={"Cache-Control":"private, no-store"};
  const session=await auth();
  if(!session?.user?.email || await roleForEmailAsync(session.user.email)!=="administrador")
    return NextResponse.json({error:"Forbidden"},{status:403,headers});
  if(!databaseConfigured)return NextResponse.json({error:"Unavailable"},{status:503,headers});
  try{
    const people=await dbQuery<PresenceRow>(`SELECT p.email,
      COALESCE(a.display_name,split_part(p.email,'@',1)) AS name,
      p.role,p.section,p.last_seen_at::text AS last_seen_at,
      (p.last_seen_at > now() - interval '3 minutes') AS online
      FROM biblioteca_user_presence p
      LEFT JOIN biblioteca_access_accounts a ON a.email=p.email
      WHERE p.last_seen_at > now() - interval '24 hours'
        AND (a.email IS NULL OR a.active = true)
      ORDER BY p.last_seen_at DESC LIMIT 300`);
    return NextResponse.json({people:people.map(p=>({email:p.email,name:p.name,role:p.role,section:p.section,lastSeen:p.last_seen_at,online:p.online})),onlineCount:people.filter(p=>p.online).length,recentCount:people.length,asOf:new Date().toISOString()},{headers});
  }catch{return NextResponse.json({error:"Unavailable"},{status:503,headers});}
}
