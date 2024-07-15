import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import React from "react";

export default function Hero() {
  return (
    <div className=" relative mt-4 mx-10 ">
      <div className="flex flex-col gap-5 w-1/2">
        <div className="text-4xl font-semibold">
          Best Tutoring Platform For Home Tuitions
        </div>
        <div className="text-lg ">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consectetur
          vel porro perferendis et hic illum laborum enim, quam culpa facere?
        </div>
        <div className="flex gap-4">
          <Button
            variant="default"
            className=" border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink "
          >
            Find Tutor
          </Button>
          <Button
            className=" border border-yellow hover:bg-gradient-to-r hover:from-yellow hover:via-red hover:to-pink "
            variant="default"
          >
            Become A Tutor
          </Button>
        </div>
        <div className="flex gap-1">
          <div className="border-r px-3">
            <div>1234+</div>
            <div>Tutors</div>
          </div>
          <div className="border-r px-3">
            <div>1234+</div>
            <div>Students</div>
          </div>
          <div className=" px-3">
            <div>4.8</div>
            <div>Tutor Rating</div>
          </div>
        </div>
      </div>
      <Image
        width={200}
        height={200}
        src="/images.jpg"
        alt="Picture of the author"
        className="absolute top-3 right-40 rounded-lg"
      />
      <Image
        width={200}
        height={200}
        src="/images.jpg"
        alt="Picture of the author"
        className="absolute top-20 right-[400px] rounded-lg"
      />
      <Carousel className="w-[200px] h-[100px]  right-40  top-[200px] absolute">
        <CarouselContent>
          <CarouselItem>
            {" "}
            <Card>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>{" "}
          </CarouselItem>
          <CarouselItem>
            {" "}
            <Card>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>{" "}
          </CarouselItem>
          <CarouselItem>
            {" "}
            <Card>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>{" "}
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
