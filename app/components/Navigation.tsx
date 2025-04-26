import {FunctionComponent} from "react";
import Image from "next/image";
import facebookLogo from "../../public/facebook.svg";
import instagramLogo from "../../public/instagram.svg";
import bumpsLogo from "../../public/bumps-log-badge.svg";

export const Navigation: FunctionComponent = () => (
  <div className="nav-wrapper">
    <div>
      <nav className="bumps-nav-2">
        <a href="#events" className="hidden md:inline">
          Events
        </a>
        <a href="#info" className="hidden md:inline">
          Info
        </a>

        <a
          target="_blank"
          rel="noopener"
          href="https://www.road-results.com/BUMPS"
        >
          Results
        </a>

        <a href="#involved" className="">
          Get Invovled
        </a>
      </nav>
    </div>
    <div className="flex gap-4 justify-center">
      <a
        href="https://www.facebook.com/BikeUpTheMountainPointSeries"
        target="_blank"
        rel="noopener"
      >
        <Image src={facebookLogo} alt="facebook logo" width={30} height={30} />
      </a>
      <a
        href="https://www.instagram.com/bumpshillclimb/"
        target="_blank"
        rel="noopener"
      >
        <Image
          src={instagramLogo}
          alt="instagram logo"
          width={30}
          height={30}
        />
      </a>
    </div>
  </div>
);
