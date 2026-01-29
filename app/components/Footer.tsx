"use client";

import Image from "next/image";
import bumpsLogoSmall from "@/public/BUMPS-logo-small-arrow.svg";
import bumpsHills from "@/public/footerhills.svg";

export function Footer() {
  return (
    <footer>
      <div className="flex flex-col justify-end items-center text-center">
        <div className="flex items-center flex-col gap-4">
          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <Image
              src={bumpsLogoSmall}
              alt="BUMPS logo"
              width={48}
              height={48}
            />
          </button>
          <div className="uppercase font-bold">since 2013</div>
        </div>

        <Image
          src={bumpsHills}
          alt="BUMPS logo"
          style={{
            width: "100%",
            height: "auto",
          }}
          height={505}
          width={1145}
        />
      </div>
    </footer>
  );
}
