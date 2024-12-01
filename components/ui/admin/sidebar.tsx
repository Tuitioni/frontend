import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen p-5 shadow-lg">
      <ul className="space-y-4">
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/dashboard"> Dashboard</Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/teacher"> Teacher </Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/student">Student</Link>
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/tuition"></Link>
          Tuition
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/payment"></Link>
          Payment
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/report"></Link>
          Report
        </li>
        <li className="px-4 py-2 hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
          <Link href="/app/(admin)/setting"></Link>
          Setting
        </li>
      </ul>
    </div>
  );
}
