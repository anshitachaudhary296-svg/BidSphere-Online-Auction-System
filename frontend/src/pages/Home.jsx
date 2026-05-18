import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FeaturedAuctions from "./home-sub-components/FeaturedAuctions";
import UpcomingAuctions from "./home-sub-components/UpcomingAuctions";
import Leaderboard from "./home-sub-components/Leaderboard";
import Spinner from "@/custom-components/Spinner";

const Home = () => {
  const howItWorks = [
    { title: "Post Items", description: "Auctioneer posts items for bidding." },
    { title: "Place Bids", description: "Bidders place bids on listed items." },
    {
      title: "Win Notification",
      description: "Highest bidder receives a winning email.",
    },
    {
      title: "Payment & Fees",
      description: "Bidder pays; auctioneer pays 5% fee.",
    },
  ];

  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <div>
          <p className="text-blue-500 font-bold text-xl mb-8 tracking-wide uppercase">
            Transparency Leads to Your Victory
          </p>
          <h1
            className={`text-slate-900 text-3xl font-extrabold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl tracking-tight`}
          >
            Transparent Auctions
          </h1>
          <h1
            className={`gradient-text text-3xl font-extrabold mb-6 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl tracking-tight`}
          >
            Be The Winner
          </h1>
          <div className="flex gap-4 my-8">
            {!isAuthenticated && (
              <>
                <Link
                  to="/sign-up"
                  className="gradient-bg rounded-md px-8 flex items-center py-3 font-semibold text-lg"
                >
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="text-blue-600 bg-transparent border-2 border-blue-600 hover:bg-blue-50 font-bold text-lg rounded-md px-8 flex items-center py-3 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-12 mb-16">
          <h3 className="text-slate-900 text-xl font-bold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl">How it works</h3>
          <div className="flex flex-col gap-6 md:flex-row md:flex-wrap w-full">
            {howItWorks.map((element) => {
              return (
                <div
                  key={element.title}
                  className="glass flex flex-col gap-2 p-6 rounded-2xl justify-center md:w-[47%] 2xl:w-[23%] hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <h5 className="font-bold text-lg text-slate-900">{element.title}</h5>
                  <p className="text-slate-600">{element.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        <FeaturedAuctions />
        <UpcomingAuctions />
        <Leaderboard />
      </section>
    </>
  );
};

export default Home;
