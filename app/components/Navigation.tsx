import {FunctionComponent} from "react";
import Image from "next/image";
import facebookLogo from "../../public/facebook.svg";
import instagramLogo from "../../public/instagram.svg";
import bumpsLogo from "../../public/bumps-log-badge.svg";

interface NavigationProps {
  inverse?: boolean;
}

export const Navigation: FunctionComponent<NavigationProps> = ({
  inverse = false,
}) => {
  const linkColor = inverse ? "#1E1E1E" : undefined;
  const linkClass = inverse ? "" : "";

  return (
    <div className="nav-wrapper" style={inverse ? {color: linkColor} : {}}>
      <div>
        <nav className="bumps-nav-2">
          <a
            href="/#events"
            className="hidden md:inline"
            style={inverse ? {color: linkColor} : {}}
          >
            Events
          </a>
          <a
            href="/#info"
            className="hidden md:inline"
            style={inverse ? {color: linkColor} : {}}
          >
            Info
          </a>

          <a href="/leaderboard" style={inverse ? {color: linkColor} : {}}>
            Leaderboard
          </a>
        </nav>
      </div>
      <div className="flex gap-4 justify-center">
        <a
          href="https://www.facebook.com/BikeUpTheMountainPointSeries"
          target="_blank"
          rel="noopener"
          style={inverse ? {filter: "invert(1)"} : {}}
        >
          <Image
            src={facebookLogo}
            alt="facebook logo"
            width={30}
            height={30}
          />
        </a>
        <a
          href="https://www.instagram.com/bumpshillclimb/"
          target="_blank"
          rel="noopener"
          style={inverse ? {filter: "invert(1)"} : {}}
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
};
