import Spinner from "@/custom-components/Spinner";
import { getAuctionDetail } from "@/store/slices/auctionSlice";
import { placeBid } from "@/store/slices/bidSlice";
import React, { useEffect, useState } from "react";
import { FaGreaterThan } from "react-icons/fa";
import { RiAuctionFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

const AuctionItem = () => {
  const { id } = useParams();
  const { loading, auctionDetail, auctionBidders } = useSelector(
    (state) => state.auction
  );
  const { isAuthenticated } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const [amount, setAmount] = useState(0);
  const handleBid = () => {
    const formData = new FormData();
    formData.append("amount", amount);
    dispatch(placeBid(id, formData));
    dispatch(getAuctionDetail(id));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
    if (id) {
      dispatch(getAuctionDetail(id));
    }
  }, [isAuthenticated]);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
        <div className="text-[16px] flex flex-wrap gap-2 items-center">
          <Link
            to="/"
            className="font-semibold transition-all duration-300 hover:text-blue-600"
          >
            Home
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <Link
            to={"/auctions"}
            className="font-semibold transition-all duration-300 hover:text-blue-600"
          >
            Auctions
          </Link>
          <FaGreaterThan className="text-stone-400" />
          <p className="text-stone-600">{auctionDetail.title}</p>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex gap-4 flex-col lg:flex-row">
                <div className="glass w-[100%] lg:w-40 lg:h-40 flex justify-center items-center p-5 rounded-2xl shadow-sm">
                  <img
                    src={auctionDetail.image?.url}
                    alt={auctionDetail.title}
                    className="rounded-lg"
                  />
                </div>
                <div className="flex flex-col justify-around pb-4">
                  <h3 className="text-slate-900 text-2xl font-bold mb-2 min-[480px]:text-3xl md:text-4xl lg:text-5xl">
                    {auctionDetail.title}
                  </h3>
                  <p className="text-xl font-semibold text-slate-700">
                    Condition:{" "}
                    <span className="text-blue-600">
                      {auctionDetail.condition}
                    </span>
                  </p>
                  <p className="text-xl font-semibold text-slate-700">
                    Minimum Bid:{" "}
                    <span className="text-blue-600">
                      Rs.{auctionDetail.startingBid}
                    </span>
                  </p>
                </div>
              </div>
              <p className="text-xl w-fit font-bold text-slate-800 mt-6">
                Auction Item Description
              </p>
              <hr className="my-2 border-t-[1px] border-t-slate-300" />
              <ul className="list-disc pl-5">
              {auctionDetail.description &&
                auctionDetail.description.split(". ").map((element, index) => {
                  return (
                    <li key={index} className="text-[18px] my-2 text-slate-600">
                      {element}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex-1 glass rounded-2xl overflow-hidden shadow-lg shadow-blue-500/10 flex flex-col">
              <header className="bg-white/80 border-b border-slate-200 py-4 text-[24px] font-bold px-6">
                <span className="gradient-text">BIDS</span>
              </header>
              <div className="px-4 min-h-fit lg:min-h-[550px] overflow-y-auto bg-transparent">
                {auctionBidders &&
                new Date(auctionDetail.startTime) < Date.now() &&
                new Date(auctionDetail.endTime) > Date.now() ? (
                  auctionBidders.length > 0 ? (
                    auctionBidders.map((element, index) => {
                      return (
                        <div
                          key={index}
                          className="py-3 px-4 my-2 flex items-center justify-between bg-white/60 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={element.profileImage}
                              alt={element.userName}
                              className="w-12 h-12 rounded-full hidden md:block border-2 border-blue-100"
                            />
                            <p className="text-[18px] font-semibold text-slate-800">
                              {element.userName}
                            </p>
                          </div>
                          {index === 0 ? (
                            <p className="text-[20px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-lg">
                              1st
                            </p>
                          ) : index === 1 ? (
                            <p className="text-[20px] font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg">
                              2nd
                            </p>
                          ) : index === 2 ? (
                            <p className="text-[20px] font-bold text-yellow-500 bg-yellow-50 px-3 py-1 rounded-lg">
                              3rd
                            </p>
                          ) : (
                            <p className="text-[18px] font-semibold text-slate-500">
                              {index + 1}th
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-full items-center justify-center py-20">
                      <p className="text-center text-slate-500 text-lg font-medium">
                        No bids for this auction yet. Be the first!
                      </p>
                    </div>
                  )
                ) : Date.now() < new Date(auctionDetail.startTime) ? (
                  <img
                    src="/notStarted.png"
                    alt="not-started"
                    className="w-full max-h-[550px] object-contain opacity-80"
                  />
                ) : (
                  <img
                    src="/auctionEnded.png"
                    alt="ended"
                    className="w-full max-h-[550px] object-contain opacity-80"
                  />
                )}
              </div>

              <div className="gradient-bg py-5 px-6 flex items-center justify-between mt-auto">
                {Date.now() >= new Date(auctionDetail.startTime) &&
                Date.now() <= new Date(auctionDetail.endTime) ? (
                  <>
                    <div className="flex gap-4 flex-col sm:flex-row sm:items-center w-full">
                      <p className="text-white font-bold text-lg whitespace-nowrap">Place Bid</p>
                      <div className="relative flex-1 max-w-[200px]">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rs.</span>
                        <input
                          type="number"
                          className="w-full focus:outline-none focus:ring-2 focus:ring-white rounded-xl text-lg p-2 pl-10 text-slate-800 font-semibold shadow-inner bg-white/90"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      className="p-3 ml-4 text-blue-600 bg-white rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-md flex items-center justify-center"
                      onClick={handleBid}
                    >
                      <RiAuctionFill size={24} />
                    </button>
                  </>
                ) : new Date(auctionDetail.startTime) > Date.now() ? (
                  <p className="text-white font-semibold text-xl w-full text-center">
                    Auction has not started yet!
                  </p>
                ) : (
                  <p className="text-white font-semibold text-xl w-full text-center">
                    Auction has ended!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AuctionItem;
