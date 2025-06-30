"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Code, Menu, Briefcase, User, Wrench } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/dashboard", label: "Client Area", icon: <Briefcase className="h-4 w-4" /> },
  { href: "/admin", label: "Admin", icon: <Wrench className="h-4 w-4" /> },
];

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold">AcodyBros Connect</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <Link href="/" className="mr-6 flex items-center space-x-2 mb-6" onClick={() => setSheetOpen(false)}>
                  <Code className="h-6 w-6 text-primary" />
                  <span className="font-bold">AcodyBros Connect</span>
                </Link>
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold">AcodyBros</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link href="/dashboard">
                <Briefcase className="mr-2 h-4 w-4" />
                Client Area
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin">
                <Wrench className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Register</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
