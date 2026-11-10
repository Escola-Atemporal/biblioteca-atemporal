import type { Metadata } from "next";
import "./globals.css";
import "./editorial-design.css";
import "./school-backgrounds.css";
import "./design-finish.css";
import "./emocoes-trilha.css";
import "./habitos-trilha.css";
import "./editorial-balance.css";
import "./confianca-trilha.css";
import "./paradoxos-trilha.css";

export const metadata: Metadata = {
  title: "Biblioteca Atemporal | Escola Atemporal",
  description: "Acervo de desenvolvimento humano e jornadas de aprendizagem da Escola Atemporal.",
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "https://escolaatemporal.com.br/wp-content/uploads/2025/03/cropped-Screenshot_12-2-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://escolaatemporal.com.br/wp-content/uploads/2025/03/cropped-Screenshot_12-2-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "https://escolaatemporal.com.br/wp-content/uploads/2025/03/cropped-Screenshot_12-2-180x180.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><head><link rel="preconnect" href="https://escolaatemporal.com.br" /><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
