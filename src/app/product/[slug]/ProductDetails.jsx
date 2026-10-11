"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const BASE_URL = "https://api.abcz.workers.dev/api/bazardor";

const formatNumber = (value) =>
    new Intl.NumberFormat("bn-BD", {
        maximumFractionDigits: 2,
    }).format(Number(value) || 0);

const getUnit = (unit) => {
    const units = {
        kg: "কেজি",
        liter: "লিটার",
        litre: "লিটার",
        piece: "পিস",
        pcs: "পিস",
        dozen: "ডজন",
    };

    return units[unit?.toLowerCase()] || unit || "একক";
};

const ProductDetails = ({ slug }) => {
    const router = useRouter();

    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/sign-in");
        }
    }, [isPending, user, router]);

    useEffect(() => {
        let ignore = false;

        if (isPending || !user) {
            return () => {
                ignore = true;
            };
        }

        const fetchProductData = async () => {
            setLoading(true);
            setError("");
            setProduct(null);

            try {
                const response = await fetch(`${BASE_URL}/products`);

                if (!response.ok) {
                    throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
                }

                const data = await response.json();

                const products = Array.isArray(data)
                    ? data
                    : data?.products || data?.data || [];

                const foundProduct = products.find(
                    (item) => item.slug === slug,
                );

                if (!foundProduct) {
                    throw new Error("এই পণ্যটি খুঁজে পাওয়া যায়নি।");
                }

                if (!ignore) {
                    setProduct(foundProduct);
                }
            } catch (err) {
                if (!ignore) {
                    setError(
                        err.message || "একটি সমস্যা হয়েছে। আবার চেষ্টা করো।",
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        if (slug) {
            fetchProductData();
        }

        return () => {
            ignore = true;
        };
    }, [slug, isPending, user]);

    // Session যাচাই বা redirect চলাকালে loading দেখাবে
    if (isPending || !user || loading) {
        return (
            <main className="min-h-[60vh] bg-[#F7F9F7] px-4 py-10">
                <div className="mx-auto max-w-6xl animate-pulse space-y-5">
                    <div className="h-28 rounded-2xl bg-white" />

                    <div className="grid gap-4 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-32 rounded-2xl bg-white"
                            />
                        ))}
                    </div>

                    <div className="h-48 rounded-2xl bg-white" />
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center bg-[#F7F9F7] px-4 py-10">
                <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">
                    <p className="text-4xl">🔎</p>

                    <h1 className="mt-3 text-xl font-bold text-slate-900">
                        পণ্য পাওয়া যায়নি!
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        {error || "এই পণ্যের তথ্য পাওয়া যায়নি।"}
                    </p>

                    <Link
                        href="/"
                        className="mt-5 inline-flex rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white hover:bg-green-800"
                    >
                        হোম পেজে ফিরে যান
                    </Link>
                </div>
            </main>
        );
    }

    const markets = Array.isArray(product.markets)
        ? product.markets.filter(
              (market) =>
                  Number.isFinite(Number(market.min)) &&
                  Number.isFinite(Number(market.max)),
          )
        : [];

    const minPriceOverall =
        markets.length > 0
            ? Math.min(...markets.map((market) => Number(market.min)))
            : null;

    const maxPriceOverall =
        markets.length > 0
            ? Math.max(...markets.map((market) => Number(market.max)))
            : null;

    const averagePrice =
        markets.length > 0
            ? markets.reduce(
                  (total, market) =>
                      total + (Number(market.min) + Number(market.max)) / 2,
                  0,
              ) / markets.length
            : Number(product.today) || 0;

    const today = Number(product.today) || 0;
    const yesterday = Number(product.yesterday) || 0;
    const priceDiff = Math.abs(today - yesterday);

    const changeDirection = product.change?.dir;
    const isUp = changeDirection === "up";
    const isDown = changeDirection === "down";

    return (
        <main className="min-h-screen bg-[#F0F5F0] px-3 py-5 text-slate-800 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-6xl space-y-6">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm"
                >
                    <Link
                        href="/"
                        className="hover:text-green-700 hover:underline"
                    >
                        হোম
                    </Link>

                    <span aria-hidden="true">›</span>

                    <Link
                        href={`/category/${product.category}`}
                        className="hover:text-green-700 hover:underline"
                    >
                        {product.categoryNameBn || "ক্যাটাগরি"}
                    </Link>

                    <span aria-hidden="true">›</span>

                    <span className="font-medium text-slate-700">
                        {product.nameBn}
                    </span>
                </nav>

                {/* Product header */}
                <section className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-3xl sm:h-16 sm:w-16">
                            {product.image || product.categoryIcon || "🛒"}
                        </div>

                        <div className="min-w-0">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                {product.nameBn}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                প্রতি {getUnit(product.unit)} ·{" "}
                                {product.categoryNameBn || "পণ্য"}
                            </p>

                            <p className="mt-3 inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-50 px-3 py-2 text-xs text-gray-600 sm:text-sm">
                                গতকালের তুলনায় আজ দাম{" "}
                                <span
                                    className={`font-semibold ${
                                        isUp
                                            ? "text-rose-600"
                                            : isDown
                                              ? "text-emerald-600"
                                              : "text-slate-700"
                                    }`}
                                >
                                    {isUp
                                        ? "বেড়েছে"
                                        : isDown
                                          ? "কমেছে"
                                          : "অপরিবর্তিত"}
                                </span>
                                {changeDirection === "flat" ? null : (
                                    <>— {formatNumber(priceDiff)} টাকা</>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Today's price */}
                    <div className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4 text-center sm:p-5 md:w-auto md:min-w-44 md:text-right">
                        <span className="block text-xs font-semibold text-gray-500">
                            আজকের দাম
                        </span>

                        <span className="my-1 block text-3xl font-extrabold text-slate-950 sm:text-4xl">
                            {formatNumber(today)}
                        </span>

                        <span className="block text-xs text-gray-500">
                            টাকা / {getUnit(product.unit)}
                        </span>

                        <span
                            className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-bold ${
                                isUp
                                    ? "bg-rose-50 text-rose-600"
                                    : isDown
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                            {formatNumber(
                                Math.abs(Number(product.change?.pct) || 0),
                            )}
                            %
                        </span>
                    </div>
                </section>

                <div className="rounded-2xl bg-[#FAFCFA] p-5">
                    {/* Price summary */}
                    <section>
                        <h2 className="mb-3 pl-1 text-base font-bold text-slate-900 sm:text-lg">
                            দামের সারসংক্ষেপ
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <span className="block text-xs font-medium text-gray-500">
                                    সর্বনিম্ন দাম
                                </span>

                                <span className="mt-1 block text-2xl font-bold text-emerald-600">
                                    {minPriceOverall === null
                                        ? "তথ্য নেই"
                                        : `${formatNumber(minPriceOverall)} টাকা`}
                                </span>

                                <span className="mt-2 block text-xs font-bold">
                                    সবচেয়ে কম দামের বাজার
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                <span className="block text-xs font-medium text-gray-500">
                                    সর্বাধিক দাম
                                </span>

                                <span className="mt-1 block text-2xl font-bold text-rose-600">
                                    {maxPriceOverall === null
                                        ? "তথ্য নেই"
                                        : `${formatNumber(maxPriceOverall)} টাকা`}
                                </span>

                                <span className="mt-2 block text-xs font-bold">
                                    সবচেয়ে বেশি দামের বাজার
                                </span>
                            </div>

                            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                                <span className="block text-xs font-medium text-gray-500">
                                    গড় দাম
                                </span>

                                <span className="mt-1 block text-2xl font-bold text-slate-700">
                                    {formatNumber(averagePrice)} টাকা
                                </span>

                                <span className="mt-2 block text-xs font-bold">
                                    প্রতি একক হিসাবে
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Market prices */}
                    <section className="mt-10">
                        <h2 className="mb-3 pl-1 text-base font-bold text-slate-900 sm:text-lg">
                            বাজারভিত্তিক আজকের দাম
                        </h2>

                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            {markets.length === 0 ? (
                                <p className="p-6 text-center text-sm text-gray-500">
                                    এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া
                                    যায়নি।
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-155 border-collapse text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-400 bg-[#FAFCFA] text-gray-500">
                                                <th className="p-4 text-left font-bold">
                                                    বাজার
                                                </th>

                                                <th className="p-4 text-left font-semibold">
                                                    বিভাগ
                                                </th>

                                                <th className="p-4 text-right font-semibold">
                                                    সর্বনিম্ন
                                                </th>

                                                <th className="p-4 text-right font-semibold">
                                                    সর্বাধিক
                                                </th>

                                                <th className="p-4 text-right font-semibold">
                                                    গড়
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y-2 divide-gray-500">
                                            {markets.map((market, index) => {
                                                const marketAverage =
                                                    (Number(market.min) +
                                                        Number(market.max)) /
                                                    2;

                                                return (
                                                    <tr
                                                        key={`${market.market}-${index}`}
                                                        className="transition-colors hover:bg-[#F0F5F0]"
                                                    >
                                                        <td className="p-4 font-semibold text-slate-900">
                                                            {market.market}
                                                        </td>

                                                        <td className="p-5">
                                                            {market.division ||
                                                                "—"}
                                                        </td>

                                                        <td className="p-4 text-right">
                                                            {formatNumber(
                                                                market.min,
                                                            )}{" "}
                                                            টাকা
                                                        </td>

                                                        <td className="p-4 text-right">
                                                            {formatNumber(
                                                                market.max,
                                                            )}{" "}
                                                            টাকা
                                                        </td>

                                                        <td className="p-4 text-right font-bold text-slate-900">
                                                            {formatNumber(
                                                                marketAverage,
                                                            )}{" "}
                                                            টাকা
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default ProductDetails;
