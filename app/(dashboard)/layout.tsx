import Sidebar from "../../components/layout/sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="h-screen flex">

            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>

        </div>
    );
}