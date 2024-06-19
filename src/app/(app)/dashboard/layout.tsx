
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