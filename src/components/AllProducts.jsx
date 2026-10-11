"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(
                    "https://api.abcz.workers.dev/api/bazardor/products",
                );

                if (!res.ok) {
                    throw new Error("পণ্যের তথ্য লোড করা যায়নি");
                }

                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Error fetching bazar data:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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

    const toBanglaNumber = (num) => {
        if (num === undefined || num === null) return "";

        return new Intl.NumberFormat("bn-BD", {
            maximumFractionDigits: 2,
        }).format(Number(num));
    };

    const getBanglaUnit = (unit) => {
        const units = {
            kg: "প্রতি কেজি",
            piece: "প্রতি পিস",
            dozen: "প্রতি ডজন",
            liter: "প্রতি লিটার",
            gram: "প্রতি গ্রাম",
            bundle: "প্রতি আঁটি",
        };

        return units[unit] || `প্রতি ${unit || "একক"}`;
    };

    if (loading) {
        return (
            <section id="all-products" className="container mx-auto px-4 py-8">
                <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
                    সব পণ্য
                </h2>

                <div className="mb-5 h-5 w-56 animate-pulse rounded bg-gray-200" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-36 animate-pulse rounded-2xl bg-gray-200"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container mx-auto px-4 py-8 text-center text-red-600">
                পণ্যের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করো।
            </section>
        );
    }

    return (
        <section id="all-products" className="w-full">
            <div className="container mx-auto px-4 py-8">
                <h2 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
                    সব পণ্য
                </h2>

                <p className="mb-6 text-sm text-gray-500">
                    মোট {toBanglaNumber(products.length)}টি পণ্য দেখানো হচ্ছে
                </p>

                {products.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                        কোনো পণ্য পাওয়া যায়নি।
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <Link
                                href={`/product/${product.slug}`}
                                key={product.id}
                                onClick={handleProductClick}
                                className="flex min-h-36.25 flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f4f6f3] text-3xl">
                                        {product.image}
                                    </div>

                                    <div className="min-w-0 space-y-1">
                                        <h3 className="text-lg leading-tight font-bold text-gray-800">
                                            {product.nameBn}
                                        </h3>

                                        <p className="text-sm font-medium text-gray-400">
                                            {getBanglaUnit(product.unit)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-end justify-between gap-3">
                                    <div>
                                        <span className="mb-0.5 block text-xs font-medium text-gray-400">
                                            আজকের দাম
                                        </span>

                                        <span className="text-xl font-extrabold text-gray-900">
                                            {toBanglaNumber(product.today)} টাকা
                                        </span>
                                    </div>

                                    <div
                                        className={`flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold ${
                                            product.change?.dir === "down"
                                                ? "border-green-100 bg-green-50 text-green-600"
                                                : product.change?.dir === "up"
                                                  ? "border-red-100 bg-red-50 text-red-600"
                                                  : "border-gray-100 bg-gray-50 text-gray-500"
                                        }`}
                                    >
                                        <span>
                                            {product.change?.dir === "down"
                                                ? "▼"
                                                : product.change?.dir === "up"
                                                  ? "▲"
                                                  : "—"}
                                        </span>

                                        <span>
                                            {toBanglaNumber(
                                                Math.abs(
                                                    Number(
                                                        product.change?.pct ||
                                                            0,
                                                    ),
                                                ),
                                            )}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AllProducts;
