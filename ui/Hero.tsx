import { Button } from "@/components/ui/button";
import Image from "next/image";

import React from "react";

export default function Hero() {
  return (
    <div className="relative mt-4 px-5 flex justify-between gap-2 ">
      <div className="flex flex-col gap-5 w-1/2">
        <div className="md:text-2xl text-xl xl:4xl font-semibold">
          Best Tutoring Platform For Home Tuitions
        </div>
        <div className="md:text-base text-xs xl:text-lg  ">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur
          vel porro perferendis et hic illum laborum enim, quam culpa facere?
        </div>
        <div className="flex md:gap-4 gap-2 ">
          <Button variant="default" size="sm">
            Find Tutor
          </Button>
          <Button variant="default" size="sm">
            Become A Tutor
          </Button>
        </div>
        <div className="flex gap-1 text-sm md:text-base">
          <div className="border-r md:px-3 px-1 text-sm md:text-base">
            <div>1234+</div>
            <div>Tutors</div>
          </div>
          <div className="border-r md:px-3 px-1 text-sm md:text-base">
            <div>1234+</div>
            <div>Students</div>
          </div>
          <div className=" md:px-3 px-1 text-sm md:text-base">
            <div>4.8</div>
            <div>Tutor Rating</div>
          </div>
        </div>
      </div>
      <div className="px-4 mx-auto">
        <Image
          width={300}
          height={300}
          src="/images.jpg"
          alt="Picture of the author"
          className="rounded-lg  md:w-[400px] md:h-[300px] mt-10"
        />
      </div>
    </div>
  );
}
