import React, {Suspense} from "react";
import {uniteaSans} from "@/app/fonts";
import leaderboardBanner from "@/public/leaderboard_banner.svg";
import {Navigation} from "@/app/components/Navigation";
import {Footer} from "@/app/components/Footer";
import {LeaderboardContent} from "./leaderboard";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "BUMPS Leaderboard",
  description: "Official standings for the Bike Up the Mountain Point Series.",
};

export default function LeadersPage() {
  return (
    <div className={uniteaSans.className}>
      <header
        style={{
          backgroundImage: `url(${leaderboardBanner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="page-header flex flex-col"
      >
        <Navigation inverse={true} showLogo={true} />
        <h1 className="h1-heading text-center">Leaderboard</h1>
      </header>

      <main className="p-4 lg:p-0 lg:pt-8 max-w-5xl mx-auto">
        <Suspense fallback={<div></div>}>
          <LeaderboardContent />
        </Suspense>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
