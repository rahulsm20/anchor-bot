"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpotifySession } from "@/hooks/SpotifySessionProvider";
import { Tabs } from "@/lib/tabs";
import { Anchor, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ModeToggle } from "../mode-toggle";
import TwitchLogin from "./TwitchLogin";

const Navbar = () => {
  const { status } = useSession();
  useSpotifySession();
  const pathname = usePathname();
  const isAuthenticated = status == "authenticated";
  return (
    <ul className="flex items-center justify-center p-4 gap-5 backdrop-blur-lg sticky w-full z-20 top-0 text-xs bg-background/60 border-b">
      <li className="hidden md:block">
        <Anchor />
      </li>
      {Tabs(isAuthenticated).map((p, index) => {
        const page = p.metadata;
        return (
          <NavbarLink
            key={index}
            href={page.href}
            type={page.type}
            title={page.label}
            active={pathname == page.href}
          />
        );
      })}
      <li>
        <ModeToggle />
      </li>
      <TwitchLogin />
      <li className="block md:hidden">
        <DropdownVersion />
      </li>
    </ul>
  );
};

const DropdownVersion = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();

  const isAuthenticated = status == "authenticated";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Tabs(isAuthenticated).map((p, index) => {
          const page = p.metadata;
          return (
            <DropdownMenuItem
              key={index}
              onClick={() => router.push(page.href)}
            >
              <NavbarLink
                key={index}
                href={page.href}
                isListItem={false}
                title={page.label}
                active={pathname == page.href}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NavbarLink = ({
  href,
  title,
  type,
  active,
  isListItem = true,
}: {
  href: string;
  type?: string;
  title: string | ReactNode;
  active?: boolean;
  isListItem?: boolean;
}) => {
  if (!isListItem) {
    return <div>{title}</div>;
  }
  return (
    <li
      className={
        active
          ? "underline underline-offset-8 hidden md:block"
          : "hidden md:block"
      }
    >
      <Link href={href} target={type == "external" ? "_blank" : "_self"}>
        {title}
      </Link>
    </li>
  );
};

export default Navbar;
