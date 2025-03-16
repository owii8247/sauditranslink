"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Home, FileText, PlusCircle, CreditCard, ChevronDown, ChevronUp, LogOut } from "lucide-react";


export default function Sidebar() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.role === "admin";
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isCashflowOpen, setIsCashflowOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
        <aside className={`h-screen bg-gray-800 text-white p-4 transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"}`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between">
                {!isCollapsed && <h2 className="text-xl font-bold">Saudi Trans Link</h2>}
                <button onClick={toggleSidebar} className="p-2 hover:bg-gray-700 rounded">
                    {isCollapsed ? '➡️' : '⬅️'}
                </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4 space-y-2">
                {isAdmin && (
                    <Link href="/dashboard" className="flex items-center p-2 bg-gray-700 rounded">
                        <Home className="w-5 h-5" />
                        {!isCollapsed && <span className="ml-2">Dashboard</span>}
                    </Link>
                )}

                <Link href="/view-order" className="flex items-center p-2 bg-gray-700 rounded">
                    <FileText className="w-5 h-5" />
                    {!isCollapsed && <span className="ml-2">Orders</span>}
                </Link>

                {isAdmin && (
                    <Link href="/create-order" className="flex items-center p-2 bg-gray-700 rounded">
                        <PlusCircle className="w-5 h-5" />
                        {!isCollapsed && <span className="ml-2">Create Order</span>}
                    </Link>
                )}

                {/* Cashflow Section */}
                {isAdmin && (
                    <div>
                        <button
                            onClick={() => setIsCashflowOpen(!isCashflowOpen)}
                            className="flex items-center w-full text-left p-2 bg-gray-700 rounded"
                        >
                            <CreditCard className="w-5 h-5" />
                            {!isCollapsed && <span className="ml-2">Cashflow</span>}
                            {!isCollapsed && (
                                <span className="ml-auto">{isCashflowOpen ? <ChevronUp /> : <ChevronDown />}</span>
                            )}
                        </button>

                        {isCashflowOpen && !isCollapsed && (
                            <ul className="ml-4 mt-2 space-y-1">
                                <li>
                                    <Link href="/transactions" className="block p-2 hover:bg-gray-600 rounded">
                                        Transactions
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/create-voucher" className="block p-2 hover:bg-gray-600 rounded">
                                        Create Voucher
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </nav>

            {/* Sign Out Button */}
            <button
                onClick={() => signOut()}
                className="flex items-center w-full p-4 hover:bg-red-700 mt-auto"
            >
                <LogOut className="w-5 h-5" />
                {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </button>
        </aside>
    );
}

