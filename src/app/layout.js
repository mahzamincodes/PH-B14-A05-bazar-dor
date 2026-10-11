import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

import "./globals.css";

import NavbarPage from "@/components/Navbar";
import FooterPage from "@/components/Footer";
import Marquee from "../components/Marquee";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Bazar Dor",
    description: "Bazar Dor - Online Grocery Shopping",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="bn"
            data-theme="light"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-full flex-col">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    theme="light"
                />

                <Suspense fallback={null}>
                    <NavbarPage />
                </Suspense>

                <Suspense fallback={<div className="h-10" />}>
                    <Marquee />
                </Suspense>

                {children}

                <FooterPage />
            </body>
        </html>
    );
}
