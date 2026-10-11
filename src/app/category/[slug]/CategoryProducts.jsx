"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

const formatNumber = (value) => {
    return new Intl.NumberFormat("bn-BD").format(Number(value) || 0);
};

const getUnit = (unit) => {
    const units = {
        kg: "কেজি",
        liter: "লিটার",
        litre: "লিটার",
        piece: "পিস",
        pcs: "পিস",
        dozen: "ডজন",
    };

    return units[unit?.toLowerCase()] || unit || "কেজি";
};

const CategoryProducts = ({ slug }) => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState("default");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // লগইন না থাকলে sign-in পেজে পাঠাবে
    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/sign-in");
        }
    }, [isPending, user, router]);

    // Session যাচাই হওয়ার পর category ও products fetch হবে
    useEffect(() => {
        let ignore = false;

        if (isPending || !user) {
            return () => {
                ignore = true;
            };
        }

        const fetchProducts = async () => {
            setLoading(true);
            setError("");
            setCategory(null);
            setProducts([]);
            setSortType("default");

            try {
                const [categoryRes, productsRes] = await Promise.all([
                    fetch(`${BASE_URL}/categories/${encodeURIComponent(slug)}`),
                    fetch(
                        `${BASE_URL}/products?category=${encodeURIComponent(slug)}`,
                    ),
                ]);

                if (!categoryRes.ok || !productsRes.ok) {
                    if (!ignore) {
                        setCategory(null);
                        setProducts([]);
                    }
                    return;
                }

                const [categoryData, productsData] = await Promise.all([
                    categoryRes.json(),
                    productsRes.json(),
                ]);

                if (ignore) return;

                const categoryInfo =
                    categoryData?.category ||
                    categoryData?.data ||
                    categoryData;

                const productsList = Array.isArray(productsData)
                    ? productsData
                    : productsData?.products || productsData?.data || [];

                setCategory(categoryInfo);
                setProducts(productsList);
            } catch (err) {
                if (ignore) return;

                console.error("Error fetching category products:", err);
                setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করো।");
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        if (slug) {
            fetchProducts();
        }

        return () => {
            ignore = true;
        };
    }, [slug, isPending, user]);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortType === "lowToHigh") {
            return Number(a.today) - Number(b.today);
        }

        if (sortType === "highToLow") {
            return Number(b.today) - Number(a.today);
        }

        return 0;
    });

    const handleSortChange = (type) => {
        setSortType(type);
        setIsDropdownOpen(false);
    };

    const sortOptions = [
        { value: "default", label: "ডিফল্ট" },
        { value: "lowToHigh", label: "দাম: কম থেকে বেশি" },
        { value: "highToLow", label: "দাম: বেশি থেকে কম" },
    ];

    const currentSortLabel =
        sortOptions.find((option) => option.value === sortType)?.label ||
        "ডিফল্ট";

    // Session check ও redirect চলাকালে loading দেখাবে
    if (isPending || !user || loading) {
        return (
            <main className="min-h-screen bg-[#F0F5F0] px-3 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto max-w-6xl animate-pulse space-y-6">
                    <div className="h-24 rounded-xl bg-white" />

                    <div className="flex justify-end">
                        <div className="h-11 w-48 rounded-lg bg-white" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div
                                key={index}
                                className="min-h-37.5 rounded-2xl border border-gray-100 bg-white p-5"
                            >
                                <div className="mb-5 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gray-200" />

                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-2/3 rounded bg-gray-200" />
                                        <div className="h-3 w-1/3 rounded bg-gray-100" />
                                    </div>
                                </div>

                                <div className="h-5 w-1/2 rounded bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#F0F5F0] px-4 py-10">
                <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
                    <p className="mb-3 text-4xl">⚠️</p>

                    <h1 className="text-xl font-bold text-gray-800">
                        তথ্য লোড করা যায়নি
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">{error}</p>

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-5 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                    >
                        আবার চেষ্টা করো
                    </button>
                </div>
            </main>
        );
    }

    if (!category || products.length === 0) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#F0F5F0] px-4 py-10">
                <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
                    <p className="mb-3 text-5xl">🔎</p>

                    <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                        ক্যাটাগরি পাওয়া যায়নি!
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        এই ক্যাটাগরিতে কোনো পণ্য নেই অথবা ঠিকানা সঠিক নয়।
                    </p>

                    <Link
                        href="/"
                        className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F0F5F0] px-3 py-5 font-sans sm:px-4 sm:py-6 md:px-6 md:py-8">
            <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5 md:space-y-6">
                {/* Category heading */}
                <section className="flex items-center gap-3 rounded-xl border border-[#EAECF0] bg-white p-4 sm:gap-4 sm:p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F2F4F7] text-2xl sm:h-14 sm:w-14">
                        {category?.icon || products[0]?.categoryIcon || "🛒"}
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-lg font-bold text-[#1D2939] sm:text-2xl">
                            {category?.nameBn ||
                                category?.name ||
                                products[0]?.categoryNameBn ||
                                "পণ্যের ক্যাটাগরি"}
                        </h1>

                        <p className="mt-1 text-xs text-[#667085] sm:text-sm">
                            {formatNumber(products.length)}টি পণ্যের আজকের দাম ও
                            পরিবর্তন
                        </p>
                    </div>
                </section>

                {/* Sorting */}
                <section className="flex justify-end rounded-xl border border-[#EAECF0] bg-white p-3 sm:p-4">
                    <div className="relative flex items-center gap-2">
                        <label className="text-xs text-[#475467] sm:text-sm">
                            সাজান:
                        </label>

                        <button
                            type="button"
                            aria-expanded={isDropdownOpen}
                            onClick={() =>
                                setIsDropdownOpen((previous) => !previous)
                            }
                            className="flex items-center gap-2 rounded-lg border border-[#D0D5DD] bg-white px-3 py-2 text-xs font-medium text-[#344054] transition hover:bg-gray-50 sm:text-sm"
                        >
                            <span>{currentSortLabel}</span>

                            <svg
                                className={`h-4 w-4 transition-transform ${
                                    isDropdownOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 9-7 7-7-7"
                                />
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full z-20 mt-2 w-52 overflow-hidden rounded-lg border border-[#EAECF0] bg-white py-1 text-sm shadow-lg">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            handleSortChange(option.value)
                                        }
                                        className={`w-full px-4 py-3 text-left transition hover:bg-gray-50 ${
                                            sortType === option.value
                                                ? "bg-green-50 font-semibold text-green-700"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {sortType === option.value ? "✓ " : ""}
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <p className="px-1 text-xs font-medium text-[#667085] sm:text-sm">
                    মোট {formatNumber(sortedProducts.length)}টি পণ্য দেখানো
                    হচ্ছে
                </p>

                {/* Product cards */}
                <section
                    aria-label="ক্যাটাগরির পণ্যসমূহ"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5"
                >
                    {sortedProducts.map((product) => {
                        const isUp = product.change?.dir === "up";
                        const isDown = product.change?.dir === "down";

                        return (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="flex min-h-37.5 flex-col justify-between rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 sm:p-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F2F4F7] bg-[#F9FAFB] text-xl">
                                        {product.image ||
                                            product.categoryIcon ||
                                            "🛒"}
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="truncate text-sm font-bold text-[#1D2939] sm:text-base">
                                            {product.nameBn}
                                        </h2>

                                        <p className="mt-1 text-xs text-[#667085]">
                                            প্রতি {getUnit(product.unit)}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-end justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-[#667085]">
                                            আজকের দাম
                                        </p>

                                        <p className="mt-1 text-lg font-extrabold text-[#1D2939] sm:text-xl">
                                            {formatNumber(product.today)} টাকা
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-md px-2 py-1 text-xs font-bold ${
                                            isUp
                                                ? "bg-red-50 text-red-600"
                                                : isDown
                                                  ? "bg-green-50 text-green-600"
                                                  : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                                        {formatNumber(
                                            Math.abs(
                                                Number(product.change?.pct) ||
                                                    0,
                                            ),
                                        )}
                                        %
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </section>
            </div>
        </main>
    );
};

export default CategoryProducts;
