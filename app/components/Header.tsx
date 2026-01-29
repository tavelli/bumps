"use client";

import {FunctionComponent, useEffect, useState} from "react";
import Image from "next/image";
import bumpsLogoLetters from "../../public/bumps-logo-letters.svg";
import mavicLogo from "../../public/mavic-white.png";
import {Navigation} from "./Navigation";

interface Champion {
  name: string;
  photoCredit: string;
}

const cogburn: Champion = {
  name: "Cameron Cogburn",
  photoCredit: "Joe Viger Photography (JoeViger.com)",
};

const kristen: Champion = {
  name: "Kristen Kulchinsky",
  photoCredit: "Photo by Joe Viger Photography",
};

export const Header: FunctionComponent = () => {
  const [rando, setRando] = useState<number | null>(null);

  let champ: Champion;

  useEffect(() => {
    setRando(Math.round(Math.random()));
  }, []);

  if (rando === 0) {
    champ = cogburn;
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
        {/* <div className="pt-8 text-center">
          <div className="uppercase text-sm">presented by</div>
          <a href="https://www.mavic.com/en-us" target="_blank" rel="noopener">
            <Image
              src={mavicLogo}
              alt="Mavic"
              width={175}
              className="pt-2"
              priority
            />
          </a>
        </div> */}
      </div>
      <div className="credits z-10">
        <div className="champion-header">2024 Winner</div>
        <div className="text-sm">{champ.name}</div>
        <div className="text-sm">
          Photo by{" "}
          <a href="https://www.joeviger.com/" target="_blank">
            Joe Viger
          </a>
        </div>
      </div>
    </header>
  );
};
