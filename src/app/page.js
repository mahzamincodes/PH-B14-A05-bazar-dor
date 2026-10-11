import AllProducts from "../components/AllProducts";
import Hero from "../components/Hero";
import PriceFallers from "../components/PriceFallers";
import PriceRisers from "../components/PriceRisers";

export default function Home() {
  return (
    <div className="bg-[#F0F5F0]">
       <Hero/>

       <PriceRisers/>
       <PriceFallers/>
       <AllProducts/>
       
    </div>
  );
}
