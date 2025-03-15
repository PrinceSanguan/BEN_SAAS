"use client";

import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import { Activity, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  auth: any; // adjust your auth type accordingly
}

const Header: React.FC<HeaderProps> = ({ auth }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="text-xl font-bold">AthleteTrack</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li>
                <a
                  href="#features"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#ranking"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Rankings
                </a>
              </li>
              <li>
                <a
                  href="#testimonials"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Testimonials
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center space-x-4">
            {auth.user ? (
              <Link href={window.route("dashboard")} className="text-sm font-medium text-white">
                <Button className="shadow-lg transition-all hover:shadow-blue-500/20">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link
                  href={window.route("login")}
                  className="hidden text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 md:block"
                >
                  Log in
                </Link>
                <Link href={window.route("register")} className="text-sm font-medium text-white">
                  <Button className="shadow-lg transition-all hover:shadow-blue-500/20">Get Started</Button>
                </Link>
              </>
            )}

            <button
              className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-800">
            <ul className="space-y-3">
              {["Features", "How It Works", "Rankings", "Testimonials", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={window.route("login")}
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
