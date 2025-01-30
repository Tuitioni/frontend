"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Wallet,
  LineChart,
  Settings,
  LogOut,
  Bell,
  Briefcase,
} from "lucide-react";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 w-64 min-h-screen shadow-xl">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin-dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/teacher"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <Users size={20} />
              Teacher
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/student"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <GraduationCap size={20} />
              Student
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/job"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <Briefcase size={20} />
              Job
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/tuition"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <BookOpen size={20} />
              Tuition
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/payment"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <Wallet size={20} />
              Payment
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/announcement"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <Bell size={20} />
              Announcement
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/report"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <LineChart size={20} />
              Report
            </Link>
          </li>
          <li>
            <Link
              href="/admin-dashboard/setting"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all"
            >
              <Settings size={20} />
              Setting
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-700/50 hover:text-white transition-all w-full"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
