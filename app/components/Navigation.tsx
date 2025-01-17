import {FunctionComponent} from "react";
import Image from "next/image";
import facebookLogo from "../../public/facebook.svg";
import instagramLogo from "../../public/Instagram.svg";

export const Navigation: FunctionComponent = () => (
  <div
    style={{padding: "20px", display: "flex", justifyContent: "space-between"}}
  >
    <div></div>
    <div></div>
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
