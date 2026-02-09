"use client";

import {FunctionComponent, useState} from "react";
import Image from "next/image";
import facebookLogo from "../../public/facebook.svg";
import instagramLogo from "../../public/instagram.svg";
import substackLogo from "../../public/substack.svg";
import bumpsLogo from "../../public/bumps-logo-letters-2.svg";

interface NavigationProps {
  inverse?: boolean;
  showLogo?: boolean;
}

export const Navigation: FunctionComponent<NavigationProps> = ({
  inverse = false,
  showLogo = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const linkColor = inverse ? "#1E1E1E" : undefined;
  const linkClass = inverse ? "" : "";

  return (
    <>
      {/* Left Drawer Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Left Drawer */}
      <nav
        className={`fixed left-0 top-0 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 lg:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6 bumps-nav-mobile">
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            className="self-end text-2xl"
            style={inverse ? {color: linkColor} : {}}
          >
            ✕
          </button>
          <a
            href="/leaderboard"
            className="text-lg"
            style={inverse ? {color: linkColor} : {}}
            onClick={() => setIsMenuOpen(false)}
          >
            Leaderboard
          </a>
          <a
            href="/#events"
            className="text-lg"
            style={inverse ? {color: linkColor} : {}}
            onClick={() => setIsMenuOpen(false)}
          >
            Events
          </a>
          <a
            href="/#info"
            className="text-lg"
            style={inverse ? {color: linkColor} : {}}
            onClick={() => setIsMenuOpen(false)}
          >
            Info
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div>
        <div className="nav-wrapper" style={inverse ? {color: linkColor} : {}}>
          <div>
            <nav className="flex gap-8">
              <a href="/#events" className="hidden lg:inline">
                Events
              </a>
              <a
                href="/#info"
                className="hidden lg:inline"
                style={inverse ? {color: linkColor} : {}}
              >
                Info
              </a>

              <a
                href="/leaderboard"
                className="hidden lg:inline"
                style={inverse ? {color: linkColor} : {}}
              >
                Leaderboard
              </a>

              <button
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
                style={
                  inverse
                    ? {color: linkColor, fontSize: "28px"}
                    : {fontSize: "28px"}
                }
              >
                ☰
              </button>
            </nav>
          </div>

          {showLogo && (
            <div className="flex justify-center">
              <a href="/" style={inverse ? {color: linkColor} : {}}>
                <Image
                  src={bumpsLogo}
                  alt="Bumps logo"
                  width={128}
                  height={48}
                />
              </a>
            </div>
          )}
          <div className="flex gap-3 md:gap-6 justify-end">
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
            <a
              href="https://bumpshillclimb.substack.com/"
              target="_blank"
              rel="noopener"
              style={inverse ? {filter: "invert(1)"} : {}}
            >
              <Image
                src={substackLogo}
                alt="substack logo"
                width={27}
                height={30}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
