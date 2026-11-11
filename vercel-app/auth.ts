import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { roleForEmailAsync } from "./lib/access";
import { autenticarComSenha, senhaConfigurada } from "./lib/password-login";

const oauthReady = Boolean(
  process.env.AUTH_SECRET && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);
export const passwordReady = senhaConfigurada();
export const googleReady = oauthReady;
export const authConfigured = Boolean(process.env.AUTH_SECRET && (oauthReady || passwordReady));

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    ...(oauthReady ? [Google] : []),
    ...(passwordReady ? [
      Credentials({
        name: "E-mail e senha",
        credentials: {
          email: { label: "E-mail", type: "email" },
          password: { label: "Senha", type: "password" },
        },
        async authorize(credentials) {
          return autenticarComSenha(credentials?.email, credentials?.password);
        },
      }),
    ] : []),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!(await roleForEmailAsync(user.email))) return false;
      if (account?.provider === "credentials") return passwordReady;
      if (account?.provider === "google") return profile?.email_verified === true;
      return false;
    },
    async session({ session }) {
      // /painel and /api/private/status recheck roleForEmail for every request.
      return session;
    },
  },
  pages: { signIn: "/entrar", error: "/entrar" },
  trustHost: true,
});
