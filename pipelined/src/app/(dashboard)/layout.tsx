import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="h-screen flex">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </body>
        </html>
    );
}