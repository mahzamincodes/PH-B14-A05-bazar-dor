
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import MarqueeText from "react-marquee-text";

const formatNumber = (value) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

const MarqueeLinks = ({ products }) => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const handleProductClick = (e) => {
        if (isPending) {
            e.preventDefault();
            return;
        }

        if (!user) {
            e.preventDefault();
            router.push("/sign-in");
        }
    };

    return (
        <MarqueeText direction="right" duration="15">
            {products.map((x) => (
                <Link
                    key={x.id}
                    href={`/product/${x.slug}`}
                    onClick={handleProductClick}
                    className="inline-block border-r border-gray-200 px-4 py-3 transition-colors hover:bg-gray-100"
                >
                    <span>
                        {x.categoryIcon} {x.nameBn}
                    </span>

                    <span className="mx-3 font-semibold">
                        {formatNumber(x.today)} টাকা/{x.unit}
                    </span>

                    <span
                        className={
                            x.change?.dir === "up"
                                ? "font-bold text-red-600"
                                : x.change?.dir === "down"
                                  ? "font-bold text-green-600"
                                  : "font-bold text-gray-500"
                        }
                    >
                        {x.change?.dir === "up"
                            ? "▲"
                            : x.change?.dir === "down"
                              ? "▼"
                              : "—"}{" "}
                        {formatNumber(
                            Math.abs(Number(x.change?.pct) || 0),
                        )}
                        %
                    </span>
                </Link>
            ))}
        </MarqueeText>
    );
};

export default MarqueeLinks;