"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaChevronDown } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";
import SignOut from "@/components/auth/SignOut";
import NavLinksPage from "./NavLinks";

const UserMenu = ({
    user,
    mobile = false,
    isDropdownOpen,
    setIsDropdownOpen,
    setIsMenuOpen,
}) => {
    return (
        <div className={`relative ${mobile ? "w-full" : ""}`}>
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                className={`flex items-center gap-2 rounded-lg p-2 ${
                    mobile ? "w-full" : ""
                }`}
            >
                {user?.image ? (
                    <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={36}
                        height={36}
                        unoptimized
                        className="h-9 w-9 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-800">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                )}

                <span className="max-w-32 truncate font-semibold text-gray-800">
                    {user?.name || "User"}
                </span>

                <FaChevronDown
                    className={`shrink-0 text-sm text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isDropdownOpen && (
                <div
                    className={`z-50 rounded-xl border border-gray-200 bg-white p-4 shadow-lg ${
                        mobile
                            ? "relative mt-2 w-full"
                            : "absolute right-0 top-full mt-2 w-72"
                    }`}
                >
                    <p className="wrap-break font-bold text-gray-800">
                        {user?.name}
                    </p>

                    <p className="mt-1 break-all text-sm text-gray-500">
                        {user?.email}
                    </p>

                    <div className="my-3 border-t border-gray-100" />

                    <Link
                        href="/profile"
                        onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700"
                    >
                        <span>👤</span>
                        আমার প্রোফাইল
                    </Link>

                    <SignOut
                        onSignOut={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

const AuthLinks = ({ mobile = false, pathname, setIsMenuOpen }) => {
    return (
        <>
            <Link
                href="/sign-in"
                onClick={() => mobile && setIsMenuOpen(false)}
                className={`rounded-lg px-4 py-2 font-bold ${
                    pathname === "/sign-in"
                        ? "bg-green-700 text-white"
                        : "bg-transparent text-black"
                } ${mobile ? "w-fit" : ""}`}
            >
                সাইন ইন
            </Link>

            <Link
                href="/sign-up"
                onClick={() => mobile && setIsMenuOpen(false)}
                className={`rounded-lg px-4 py-2 font-bold ${
                    pathname === "/sign-up"
                        ? "bg-green-700 text-white"
                        : "bg-transparent text-black"
                } ${mobile ? "w-fit" : ""}`}
            >
                সাইন আপ
            </Link>
        </>
    );
};

const NavbarPage = () => {
    const [date, setDate] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const pathname = usePathname();
    const { data: session, isPending } = authClient.useSession();
    console.log("Current session user:", session?.user);
    const user = session?.user;

    // Temporary debugging: check the image URL returned by the session.
    useEffect(() => {
        if (user) {
            console.log("Logged-in user image:", user.image);
        }
    }, [user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const today = new Date().toLocaleDateString("bn-BD", {
                dateStyle: "full",
            });

            setDate(today);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const userMenuProps = {
        user,
        isDropdownOpen,
        setIsDropdownOpen,
        setIsMenuOpen,
    };

    return (
        <div>
            <nav className="border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex min-h-20 items-center justify-between gap-4">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/logo-icon.png"
                                alt="Logo"
                                height={50}
                                width={50}
                                className="rounded-[13px] bg-green-700 p-3"
                            />

                            <div>
                                <h1 className="text-xl font-bold md:text-2xl">
                                    বাজার দর
                                </h1>
                                <p className="text-sm">{date}</p>
                            </div>
                        </Link>

                        <div className="hidden items-center gap-4 md:flex md:gap-8">
                            {!isPending &&
                                (user ? (
                                    <UserMenu {...userMenuProps} />
                                ) : (
                                    <AuthLinks
                                        pathname={pathname}
                                        setIsMenuOpen={setIsMenuOpen}
                                    />
                                ))}
                        </div>

                        <button
                            type="button"
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-2xl md:hidden"
                        >
                            ☰
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="flex flex-col gap-3 border-t border-gray-200 py-4 md:hidden">
                            {!isPending &&
                                (user ? (
                                    <UserMenu
                                        {...userMenuProps}
                                        mobile={true}
                                    />
                                ) : (
                                    <AuthLinks
                                        mobile={true}
                                        pathname={pathname}
                                        setIsMenuOpen={setIsMenuOpen}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </nav>

            <NavLinksPage />
        </div>
    );
};

export default NavbarPage;
