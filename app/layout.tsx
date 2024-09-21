import type { Metadata } from "next";
import "./globals.css";
import DynamicNavbar from '@/components/dynamic-navbar';
import Nav from '@/components/nav'
import AuthStatus from "../components/authStatus"
import SessionProviderWrapper from '@/utils/sessionProviderWrapper'

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProviderWrapper>
            <html lang="en">
            <body className="antialiased">
            <DynamicNavbar />
            <AuthStatus />
            <Nav />
            {children}
            </body>
            </html>
        </SessionProviderWrapper>
    );
}
