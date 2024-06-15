import ChatsPanel from "@/src/components/ChatsPanel";
import Navbar from "@/src/components/Navbar";
import { ReactHTML, ReactHTMLElement } from "react";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="">
            {children}
        </main>
    );
}