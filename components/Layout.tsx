"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="p-4 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
