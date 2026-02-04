import React, {FunctionComponent} from "react";
import {CourseRecords} from "../lib/bumps/model";
import {RiderName} from "./RiderName";
import {Racetime} from "./RaceTIme";

type Props = {
  records: CourseRecords;
};

export const EventCourseRecords: FunctionComponent<Props> = ({
  records,
}: Props) => {
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Men's Record */}
        <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-5 right-5 p-4 group-hover:scale-110 transition-transform">
            <svg
              fill="#F6C95F"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
            >
              <g fill="">
                <path d="M8.619.568a.875.875 0 00-1.238 0L3.578 4.37 1.291 3.202A.875.875 0 00.049 4.214l1.866 6.744h12.17l1.866-6.744a.875.875 0 00-1.242-1.012l-2.287 1.169zM5.854 6.146l1.792-1.793a.5.5 0 01.708 0l1.792 1.793a.5.5 0 010 .707L8.354 8.646a.5.5 0 01-.708 0L5.854 6.853a.5.5 0 010-.707zM13.958 12.209H2.042v1.124c0 .897.727 1.625 1.625 1.625h8.666c.898 0 1.625-.728 1.625-1.625z"></path>
              </g>
            </svg>
          </div>

          <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Men's Record
          </p>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-white">
              <RiderName
                rider_id={records.male.rider_id}
                name={records.male.rider_name}
              />
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-black text-white">
                <Racetime time={records.male?.race_time} />
              </span>
              <span className="text-slate-400 text-lg">
                ({records.male?.year})
              </span>
            </div>
          </div>
        </div>

        {/* Women's Record */}
        <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-5 right-5 p-4 group-hover:scale-110 transition-transform">
            <svg
              fill="#F6C95F"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
            >
              <g fill="">
                <path d="M8.619.568a.875.875 0 00-1.238 0L3.578 4.37 1.291 3.202A.875.875 0 00.049 4.214l1.866 6.744h12.17l1.866-6.744a.875.875 0 00-1.242-1.012l-2.287 1.169zM5.854 6.146l1.792-1.793a.5.5 0 01.708 0l1.792 1.793a.5.5 0 010 .707L8.354 8.646a.5.5 0 01-.708 0L5.854 6.853a.5.5 0 010-.707zM13.958 12.209H2.042v1.124c0 .897.727 1.625 1.625 1.625h8.666c.898 0 1.625-.728 1.625-1.625z"></path>
              </g>
            </svg>
          </div>
          <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider">
            Women's Record
          </p>
          <div className="mt-2">
            <h3 className="text-xl font-bold text-white">
              <RiderName
                rider_id={records.female.rider_id}
                name={records.female.rider_name}
              />
            </h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-mono font-black text-white">
                <Racetime time={records.female?.race_time} />
              </span>
              <span className="text-slate-400 text-lg">
                ({records.female?.year})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
