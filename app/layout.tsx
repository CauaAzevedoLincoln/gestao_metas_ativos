import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";

export const metadata: Metadata = {
  title: "Sistema de Gestão de Metas - Talita",
  description: "Sistema standalone de acompanhamento de metas e performance do time (Cauã, Mariana e Carlos)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`font-sans font-display min-h-screen bg-slate-50 dark:bg-[#002233] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
