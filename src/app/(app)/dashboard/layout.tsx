
import { ReactHTML, ReactHTMLElement } from "react";
import { io } from 'socket.io-client'

const socket = io({
    path: "/api/socket",
});
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