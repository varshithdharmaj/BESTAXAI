import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/ui/logo";

export default function Navigation() {
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = isAuthenticated ? [
    { label: "Dashboard", href: "/dashboard" },
    { label: "ITR Filing", href: "/itr-filing" },
    { label: "GST", href: "/gst-management" },
    { label: "TDS", href: "/tds-services" },
    { label: "Experts", href: "/experts" },
    { label: "Pricing", href: "/pricing" },
  ] : [
    { label: "ITR Filing", href: "#itr-filing" },
    { label: "GST", href: "#gst" },
    { label: "TDS", href: "#tds" },
    { label: "Calculators", href: "#calculators" },
    { label: "Pricing", href: "#pricing" },
  ];

  const isActiveLink = (href: string) => {
    return location === href;
  };

  const handleSignOut = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <Logo size="lg" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActiveLink(item.href)
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-500 hover:text-primary"
                    }`}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu-trigger">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                      <AvatarFallback data-testid="user-avatar-fallback">
                        {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal" data-testid="user-menu-label">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild data-testid="menu-item-dashboard">
                    <Link href="/dashboard">
                      <i className="fas fa-tachometer-alt mr-2"></i>
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-testid="menu-item-profile">
                    <Link href="/profile">
                      <i className="fas fa-user mr-2"></i>
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild data-testid="menu-item-settings">
                    <Link href="/settings">
                      <i className="fas fa-cog mr-2"></i>
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} data-testid="menu-item-logout">
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => window.location.href = "/api/login"} data-testid="button-signin">
                  Sign In
                </Button>
                <Button onClick={() => window.location.href = "/api/login"} data-testid="button-get-started">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                  <i className="fas fa-bars"></i>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]" data-testid="mobile-menu-sheet">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                        isActiveLink(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-gray-700 hover:text-primary hover:bg-primary/5"
                      }`}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center px-3 py-2" data-testid="mobile-user-info">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                            <AvatarFallback>
                              {user?.firstName?.[0] || "U"}{user?.lastName?.[0] || ""}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleSignOut}
                          data-testid="mobile-button-logout"
                        >
                          <i className="fas fa-sign-out-alt mr-2"></i>
                          Log out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => window.location.href = "/api/login"}
                          data-testid="mobile-button-signin"
                        >
                          Sign In
                        </Button>
                        <Button
                          className="w-full"
                          onClick={() => window.location.href = "/api/login"}
                          data-testid="mobile-button-get-started"
                        >
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
