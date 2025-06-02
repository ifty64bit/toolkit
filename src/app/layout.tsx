import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "ToolKit - Your Ultimate Utility Suite",
    description: "Essential tools for everyday life",
    keywords: ["toolkit", "utilities", "productivity", "tools", "life hacks"],
    verification: {
        google: "hwCWQ7ip2HL7AoqJKUWqCvfeCSkQnJWmsCB6RXE0zLs",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistMono.variable} antialiased min-h-dvh`}>
                <header className="px-12 py-4 border-b bg-white">
                    <div>
                        <Link href="/" className="flex items-center gap-4">
                            <span className="text-xl flex items-center justify-center bg-primary rounded-xl text-primary-foreground w-10 h-10">
                                T
                            </span>
                            <div>
                                <h1 className="font-bold text-xl">ToolKit</h1>
                                <p className="text-sm text-muted-foreground">
                                    Essential tools for everyday life
                                </p>
                            </div>
                        </Link>
                    </div>
                </header>
                <main className="px-2 sm:px-14 py-6">{children}</main>
            </body>
        </html>
    );
}
