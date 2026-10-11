
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

const SignUpPage = () => {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            toast.error("সবগুলো ঘর পূরণ করো।");
            return;
        }

        if (password.length < 8) {
            toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("দুটি পাসওয়ার্ড মিলছে না!");
            return;
        }

        try {
            setLoading(true);

            const { error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
            });

            if (error) {
                toast.error(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
                return;
            }

            toast.success("Account successfully created!");

            setTimeout(() => {
                router.push("/sign-in");
            }, 1000);
        } catch (error) {
            toast.error(error.message || "কিছু একটা সমস্যা হয়েছে।");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignUp = async (provider) => {
        try {
            setSocialLoading(provider);

            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: "/",
            });

            if (error) {
                toast.error(error.message || "Social sign up ব্যর্থ হয়েছে।");
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
                    অ্যাকাউন্ট তৈরি করুন
                </h2>

                <p className="text-center text-sm text-gray-500 mb-6">
                    বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
                </p>

                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            নাম
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="যেমন: রহিম উদ্দিন"
                            autoComplete="name"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

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
                            placeholder="কমপক্ষে ৮ অক্ষর"
                            autoComplete="new-password"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            পাসওয়ার্ড নিশ্চিত করুন
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="আবার লিখুন"
                            autoComplete="new-password"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-green-600 transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !!socialLoading}
                        className="w-full mt-2 bg-[#008744] hover:bg-[#007038] disabled:opacity-60 text-white py-2.5 rounded-md font-semibold text-base transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {loading
                            ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                            : "অ্যাকাউন্ট তৈরি করুন"}
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
                        onClick={() => handleSocialSignUp("google")}
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
                        onClick={() => handleSocialSignUp("github")}
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
                    অ্যাকাউন্ট আছে?
                    <Link
                        href="/sign-in"
                        className="text-[#008744] hover:underline font-medium ml-1"
                    >
                        সাইন ইন করুন
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

export default SignUpPage;