import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { roleForEmail } from "./lib/access";

const oauthReady = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: oauthReady ? [Google] : [],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return false;
      if (profile?.email_verified !== true) return false;
      return Boolean(roleForEmail(user.email));
    },
    async session({ session }) {
      // Recheck an allowlisted email on every privileged request via roleForEmail.
      return session;
    },
  },
  pages: { signIn: "/entrar", error: "/entrar" },
  trustHost: true,
});
export const authConfigured = oauthReady && Boolean(process.env.AUTH_SECRET);
