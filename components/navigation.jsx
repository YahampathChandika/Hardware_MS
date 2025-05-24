// components/navigation.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-2 lg:px-4">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Champika Hardware</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 lg:space-x-4">
          <Button
            variant={pathname === "/" ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/" className="flex items-center space-x-2 border">
              <Home className="h-4 w-4" />
              <span className="hidden lg:inline">Home</span>
            </Link>
          </Button>

          <Button
            variant={pathname === "/admin" ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/admin" className="flex items-center space-x-2 border">
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          </Button>
        </nav>

        {/* Theme Toggle */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
