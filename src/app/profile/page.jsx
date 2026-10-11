
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import Image from "next/image";

const ProfileForm = ({ user, router }) => {
    const [name, setName] = useState(user.name || "");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSignOut = async () => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                console.error("Sign out failed:", error.message);
                return;
            }

            router.replace("/sign-in");
            router.refresh();
        } catch (error) {
            console.error("Sign out failed:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedName = name.trim();

        if (!updatedName) {
            toast.error("নাম লিখুন।");
            return;
        }

        if (updatedName === user.name) {
            toast.info("নামে কোনো পরিবর্তন করা হয়নি।");
            return;
        }

        try {
            setIsUpdating(true);

            const { error } = await authClient.updateUser({
                name: updatedName,
            });

            if (error) {
                toast.error(error.message || "নাম আপডেট করা যায়নি।");
                return;
            }

            toast.success("নাম সফলভাবে আপডেট হয়েছে!");
        } catch (error) {
            toast.error(error.message || "নাম আপডেট করতে সমস্যা হয়েছে।");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F5F0] flex flex-col items-center py-12 px-4 font-sans">
            <div className="w-full max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#1E291B]">
                        আমার প্রোফাইল
                    </h1>
                    <p className="text-sm text-[#5C6B5A] mt-1">
                        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
                    </p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-[#E5EAE5] shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name || "Profile"}
                                    width={64}
                                    height={64}
                                    unoptimized
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-green-800">
                                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-[#1E291B] wrap-break-word">
                                {user.name || "নাম দেওয়া হয়নি"}
                            </h2>
                            <p className="text-sm text-[#7A8B78] break-all">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center gap-2 border border-red-400 text-[#D93838] px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer"
                    >
                        সাইন আউট
                    </button>
                </div>

                <div className="bg-white rounded-xl p-6 border border-[#E5EAE5] shadow-sm">
                    <h3 className="text-lg font-bold text-[#1E291B] mb-6">
                        তথ্য
                    </h3>

                    <form className="space-y-6" onSubmit={handleUpdate}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-semibold text-[#1E291B] mb-2"
                            >
                                নাম
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-[#E5EAE5] rounded-lg focus:outline-none focus:border-green-600 text-[#1E291B]"
                                placeholder="আপনার নাম"
                                disabled={isUpdating}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full bg-[#008744] hover:bg-[#007038] text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/sign-in");
        }
    }, [isPending, user, router]);

    if (isPending || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F0F5F0]">
                <p className="text-[#5C6B5A]">লোড হচ্ছে...</p>
            </div>
        );
    }

    return <ProfileForm key={user.id} user={user} router={router} />;
};

export default ProfilePage;