import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";

const Auctions = () => {
  const { loading, allAuctions } = useSelector((state) => state.auction);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAuctionItems());
  }, [dispatch]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
          <section className="my-8">
            <h1 className="text-[#21a9cb] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Auctions
            </h1>

            <div className="flex flex-wrap gap-6">
              {allAuctions && allAuctions.map((element) => (
                <Card
                  key={element._id}
                  title={element.title}
                  startTime={element.startTime}
                  endTime={element.endTime}
                  imgSrc={element.image?.url}
                  startingBid={element.startingBid}
                  id={element._id}
                />
              ))}
            </div>
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;