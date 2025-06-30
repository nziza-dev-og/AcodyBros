
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Code, Menu, Briefcase, User, Wrench, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Logout error", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred during logout.",
      });
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/about", label: "About Us", icon: null },
  ];
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold">AcodyBros Connect</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
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
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
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
                      className="p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Separator className="my-2" />
                      <Link
                        href={user.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {user.role === 'admin' ? <Wrench className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />}
                        {user.role === 'admin' ? "Admin Panel" : "Dashboard"}
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setSheetOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          setSheetOpen(false);
                        }}
                        className="justify-start gap-2 p-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Separator className="my-2" />
                      <Button asChild onClick={() => setSheetOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button asChild variant="outline" onClick={() => setSheetOpen(false)}>
                        <Link href="/register">Register</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold">AcodyBros</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-2">
            {!loading && (
              user ? (
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={`https://placehold.co/100x100.png?text=${user.name.charAt(0).toUpperCase()}`} 
                            alt={user.name} 
                            data-ai-hint="user avatar"
                          />
                          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href={user.role === 'admin' ? "/admin" : "/dashboard"}>
                            {user.role === 'admin' ? <Wrench className="mr-2 h-4 w-4" /> : <Briefcase className="mr-2 h-4 w-4" />}
                            <span>{user.role === 'admin' ? "Admin Panel" : "Dashboard"}</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              ) : (
                <>
                  <Button asChild>
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
