import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, authConfigured } from "../../auth";
import { roleForEmailAsync } from "../../lib/access";

// All six learning tracks and deep links are private. A URL hash (#biblioteca)
// is client-side navigation and cannot bypass this server-side check.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = {
  robots: { index: false, follow: false, noarchive: true },
};

export default async function ProtectedTracksLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!authConfigured) redirect("/entrar");
  const session = await auth();
  if (!session?.user?.email) redirect("/entrar");
  const role = await roleForEmailAsync(session.user.email);
  if (!role) redirect("/entrar");

  return <>{children}</>;
}
