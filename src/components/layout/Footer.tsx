import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import blandLogo from "@/app/bland.png";

export default function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center mb-4">
              <Image src={blandLogo} alt="Logo" width={40} height={40} />
            </Link>
            <p className="text-sm text-muted-foreground">
              Building the future, one line of code at a time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Client Area</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Follow Us</h4>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AcodyBros Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
