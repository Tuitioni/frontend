import { Button } from "@/components/ui/button";
import { SectionWrapper } from "./SectionWrapper";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <SectionWrapper>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
        {/* Content Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
            Best Tutoring Platform For Home Tuitions
          </h1>

          <p className="text-base md:text-lg text-gray-700">
            Connect with experienced tutors for personalized learning
            experiences that help you achieve your academic goals from the
            comfort of your home.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/tutors">
              <Button variant="default" size="lg" className="font-semibold">
                Find Tutor
              </Button>
            </Link>

            <Link href="/register">
              <Button variant="outline" size="lg" className="font-semibold">
                Become A Tutor
              </Button>
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-video md:aspect-square max-w-[500px] mx-auto">
            <Image
              src="/images.jpg"
              alt="Online tutoring illustration"
              fill
              className="object-cover rounded-xl shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
