
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState("");

    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            toast.error("ইমেইল ও পাসওয়ার্ড দাও।");
            return;
        }

        try {
            setLoading(true);

            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
                return;
            }

            toast.success("Sign in successful!");

            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 800);
        } catch (error) {
            toast.error(error.message || "সাইন ইন করা যায়নি।");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignIn = async (provider) => {
        try {
            setSocialLoading(provider);

            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Social sign in ব্যর্থ হয়েছে।");
                setSocialLoading("");
            }
        } catch (error) {
            toast.error(error.message || "কিছু একটা সমস্যা হয়েছে।");
            setSocialLoading("");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F0F5F0] px-4 py-8">
            <div className="w-full max-w-120 p-6 sm:p-8 bg-white rounded-lg border border-gray-100 shadow-sm font-sans">
                <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
                    সাইন ইন
                </h2>

                <p className="text-center text-sm text-gray-500 mb-6">
                    বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে
                    ঢুকুন।
                </p>

                <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            ইমেইল
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            পাসওয়ার্ড
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="তোমার পাসওয়ার্ড"
                            autoComplete="current-password"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!socialLoading}
                        className="w-full mt-2 bg-[#008744] hover:bg-[#007038] disabled:opacity-60 text-white py-2.5 rounded-md font-semibold text-base transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
                    </button>
                </form>

                <div className="relative flex py-5 items-center justify-center">
                    <div className="grow border-t border-gray-200"></div>

                    <span className="shrink mx-4 text-sm text-gray-400 bg-white px-2">
                        অথবা
                    </span>

                    <div className="grow border-t border-gray-200"></div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    <button
                        type="button"
                        onClick={() => handleSocialSignIn("google")}
                        disabled={loading || !!socialLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                    >
                        <FaGoogle className="text-base" />
                        {socialLoading === "google"
                            ? "অপেক্ষা করো..."
                            : "Google দিয়ে চালিয়ে যান"}
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialSignIn("github")}
                        disabled={loading || !!socialLoading}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                    >
                        <FaGithub className="text-lg" />
                        {socialLoading === "github"
                            ? "অপেক্ষা করো..."
                            : "GitHub দিয়ে চালিয়ে যান"}
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600">
                    অ্যাকাউন্ট নেই?
                    <Link
                        href="/sign-up"
                        className="text-[#008744] hover:underline font-medium ml-1"
                    >
                        সাইন আপ করুন
                    </Link>
                </p>

                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        ← হোম পেজে ফিরে যান
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;