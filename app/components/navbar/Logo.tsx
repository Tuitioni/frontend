import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="w-[50px] md:w-[100px] cursor-pointer">
      <Image
        src="/Logo.svg"
        alt="Logo"
        width={100}
        height={40}
        priority
        className="object-contain"
      />
    </Link>
  );
}
