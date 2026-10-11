
import MarqueeLinks from "./MarqueeLinks";
import "react-marquee-text/dist/styles.css";

const Marquee = async () => {
    const res = await fetch(
        "https://api.abcz.workers.dev/api/bazardor/products",
        {
            cache: "force-cache",
        },
    );

    if (!res.ok) {
        throw new Error("পণ্যের তথ্য লোড করা যায়নি");
    }

    const data = await res.json();

    return (
        <div className="px-4">
            <MarqueeLinks products={data} />
        </div>
    );
};

export default Marquee;