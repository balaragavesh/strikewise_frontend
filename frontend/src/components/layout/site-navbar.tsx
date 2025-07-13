"use client";

import {
  Navbar,
  NavBody,
  NavItems,
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
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

import { useState } from "react";

export default function SiteNavbar() {
  const navItems = [
    { name: "Tools", link: "#tools" },
    { name: "AI Assistant", link: "#assistant" },
    { name: "About", link: "#about" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                  {/* <li>
            <NavigationMenuLink
              href="#option2"
              className="block p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <div className="text-sm font-semibold text-black dark:text-white">
                Option 2
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                Short description of Option 2’s purpose.
              </p>
            </NavigationMenuLink>
          </li> */}
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
          <NavbarButton variant="secondary">Sign up</NavbarButton>
          <NavbarButton variant="primary">Login</NavbarButton>
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
            >
              Login
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
