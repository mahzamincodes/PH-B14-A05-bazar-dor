"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

const SignOut = ({ onSignOut }) => {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const { error } = await authClient.signOut();

            if (error) {
                toast.error(error.message || "সাইন আউট করা যায়নি।");
                return;
            }

            onSignOut?.();
            toast.success("সাইন আউট সফল হয়েছে!");

            router.push("/");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "সাইন আউট করতে সমস্যা হয়েছে।");
        }
    };

    return (
        <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-700 cursor-pointer"
        >
            <span>↩</span>
            সাইন আউট
        </button>
    );
};

export default SignOut;
