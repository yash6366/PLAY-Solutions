import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Staff Portal | PLAYQ Solutions",
    template: "%s | PLAYQ Solutions Staff Portal",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col font-sans">
      {children}
    </div>
  );
}
