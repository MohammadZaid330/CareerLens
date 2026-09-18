import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerLens — Resume Analyzer & Career Guidance Platform',
  description: 'Deterministic 100-point ATS resume scoring engine, qualitative career recommendations, skill gap analysis, personalized roadmaps, and recruiter portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('careerlens-theme') || 'cyber';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
