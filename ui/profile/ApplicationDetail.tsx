import React from "react";

export default function ApplicationDetail() {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-bold">Apply Status</div>
      <div className="flex gap-2 ">
        <div className="w-[250px] h-[100px] ">Applied Job</div>
        <div className="w-[250px] h-[100px] ">Assigned Job </div>
        <div className="w-[250px] h-[100px] ">Confirmed Job</div>
        <div className="w-[250px] h-[100px] ">Canceled Job</div>
      </div>
    </div>
  );
}
