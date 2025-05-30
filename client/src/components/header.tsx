import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth();
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/examples", label: "Examples" },
  ];
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <i className="ri-quill-pen-line text-primary text-3xl"></i>
          <Link href="/">
            <h1 className="font-heading text-2xl font-bold text-foreground cursor-pointer">StoryCanvas</h1>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <span className={`font-body hover:text-primary transition-colors ${location === link.href ? 'text-primary font-semibold' : 'text-foreground'}`}>
                {link.label}
              </span>
            </Link>
          ))}
          {isAuthenticated ? (
            <Button asChild variant="outline">
              <a href="/api/logout">Log Out</a>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </nav>
        
        {/* Mobile Navigation */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col mt-6 space-y-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}>
                  <span 
                    className={`font-body text-lg py-2 hover:text-primary transition-colors ${location === link.href ? 'text-primary font-semibold' : 'text-foreground'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              {isAuthenticated ? (
                <Button asChild variant="outline" className="mt-4">
                  <a href="/api/logout">Log Out</a>
                </Button>
              ) : (
                <Button asChild className="mt-4">
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
