"use client";

import {FunctionComponent, useEffect, useState} from "react";
import Image from "next/image";
import bumpsLogoLetters from "../../public/bumps-logo-letters.svg";

import {Navigation} from "./Navigation";
import {RiderName} from "./RiderName";

interface Champion {
  name: string;
  gender: string;
  photoCredit: string;
  riderId: string;
}

const josh: Champion = {
  name: "Joshua McDougal",
  gender: "Men's",
  photoCredit: "Photo by Jeff Fowler Photography",
  riderId: "363520",
};

const kristen: Champion = {
  name: "Kristen Kulchinsky",
  gender: "Womens'",
  photoCredit: "Photo by Joe Viger Photography",
  riderId: "280019",
};

export const Header: FunctionComponent = () => {
  const [rando, setRando] = useState<number | null>(null);

  let champ: Champion;

  useEffect(() => {
    setRando(Math.round(Math.random()));
  }, []);

  if (rando === 0) {
    champ = josh;
  } else {
    champ = kristen;
  }

  return (
    <header
      className={`bumps-main-header full-height flex flex-col items-center relative bumps-main-header-champ-${rando}`}
    >
      <div className="z-10" style={{width: "100%", alignSelf: "self-start"}}>
        <Navigation />
      </div>
      <div
        className="z-1"
        style={{
          padding: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1 className="section-heading italic bold pb-4 text-center">
          Bike Up the Mountain Points Series
        </h1>

        <Image
          src={bumpsLogoLetters}
          alt="Bike up Mountain Point Series Logo"
          width={450}
          priority
        />

        <div className="heading-splash">Hill Climb Championship</div>

        <p
          style={{maxWidth: "500px", margin: "1rem auto", textAlign: "center"}}
        >
          A yearlong competition featuring some of the most challenging hill
          climb events in the United States.
        </p>
      </div>
      <div className="credits z-10">
        <div className="champion-header">
          <RiderName name={champ.name} rider_id={champ.riderId} />
        </div>
        <div className="">2025 {champ.gender} Overall Winner</div>
        <div className="text-xs mt-2">{champ.photoCredit}</div>
      </div>
    </header>
  );
};
