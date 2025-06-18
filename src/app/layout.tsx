import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL("https://tooldeck.app"),
    title: {
        default: "ToolDeck - Your Ultimate Utility Suite",
        template: "%s | ToolDeck",
    },
    description:
        "ToolDeck is a collection of essential tools designed to enhance your productivity and simplify everyday tasks. From calculators to converters, find everything you need in one place. Get started now!",
    keywords: ["tooldeck", "utilities", "productivity", "tools", "life hacks"],
    openGraph: {
        title: "ToolDeck - Your Ultimate Utility Suite",
        description:
            "ToolDeck is a collection of essential tools designed to enhance your productivity and simplify everyday tasks. From calculators to converters, find everything you need in one place. Get started now!",
        url: "https://tooldeck.app",
        siteName: "ToolDeck",
        type: "website",
    },
    alternates: {
        canonical: "./",
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
                                <h1 className="font-bold text-xl">ToolDeck</h1>
                                <p className="text-sm text-muted-foreground">
                                    Essential tools for everyday life
                                </p>
                            </div>
                        </Link>
                    </div>
                </header>
                <main className="px-2 sm:px-14 py-6">{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
