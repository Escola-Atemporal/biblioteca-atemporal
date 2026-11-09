import type { Metadata } from "next";
import "./globals.css";
import "./editorial-design.css";
import "./school-backgrounds.css";

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
  return <html lang="pt-BR"><body>{children}</body></html>;
}
