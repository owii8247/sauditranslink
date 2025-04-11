"use client";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import Image from 'next/image';
export default function Navbar() {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">

            <h1 className="text-lg font-bold">Saudi Trans Link</h1>
            <div className="flex items-center gap-4">
                
                {session?.user?.image ? (
                    <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                        priority
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300" />
                )}

                <span>{session?.user?.name}</span>
                <button onClick={() => signOut()} className="text-red-500">Logout</button>
                {/* <button
                    onClick={toggleTheme}
                    className="p-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
                >
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button> */}
            </div>
        </header>
    );
}
