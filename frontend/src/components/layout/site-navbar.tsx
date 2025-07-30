// frontend/src/components/layout/site-navbar.tsx
"use client";

import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SiteNavbar() {
  const router = useRouter();
  const navItems = [
    { name: "Tools", link: "#tools" },
    { name: "AI Assistant", link: "#assistant" },
    { name: "About", link: "#about" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
    setUserEmail(localStorage.getItem('userEmail'));

    const handleStorageChange = () => {
      setUserName(localStorage.getItem('userName'));
      setUserEmail(localStorage.getItem('userEmail'));
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Update state to immediately reflect the logout in the UI
    setUserName(null);
    setUserEmail(null);

    // CHANGE: Use the Next.js router for client-side navigation
    router.push('/'); 
  };

  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <NavigationMenu>
          <NavigationMenuList className="space-x-4">
            {/* Dropdown for Tools */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-white dark:bg-neutral-900 rounded-md p-4 shadow-md w-80 min-w-[300px]">
                <ul className="flex flex-col space-y-2">
                  <li>
                    <NavigationMenuLink
                      href="strikewiseSelector"
                      className="block p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                    >
                      <div className="text-sm font-semibold text-black dark:text-white">
                        StrikeWise Selector
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Helps option buyers choose the most suitable strike contract using risk-reward analysis.
                      </p>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Regular links */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#assistant"
                className="text-sm px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
              >
                AI Assistant
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="#about"
                className="text-sm px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
              >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {/* Conditional rendering based on userName presence */}
          {userName ? (
            <>
              <span className="text-neutral-700 dark:text-neutral-300 text-sm font-medium">
                Hello, {userName.split(' ')[0]}!
              </span>
              <NavbarButton onClick={handleLogout} variant="primary">
                Logout
              </NavbarButton>
            </>
          ) : (
            <>
              <NavbarButton variant="secondary">Sign up</NavbarButton>
              <NavbarButton href="/login" as="a" variant="primary">Login</NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            {userName ? (
              <>
                <span className="text-neutral-600 dark:text-neutral-300 text-base font-medium text-center">
                  Hello, {userName.split(' ')[0]}!
                </span>
                <NavbarButton
                  onClick={handleLogout}
                  variant="primary"
                  className="w-full"
                >
                  Logout
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Sign up
                </NavbarButton>
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                  href="/login"
                  as="a"
                >
                  Login
                </NavbarButton>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}