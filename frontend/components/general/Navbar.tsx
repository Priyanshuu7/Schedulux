"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import supabase from "@/utils/supabaseClient"; // your client import

export default function Navbar() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data?.user?.email ?? null);
    };

    getUser(); // Initial check on mount

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const email = session?.user?.email ?? null;
        setUserEmail(email);
      }
    );

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b shadow-sm">
      {/* Left Side - Nav Links */}
      <NavigationMenu>
        <NavigationMenuList className="flex flex-row gap-8">
          <NavigationMenuItem>
            <Link href="/" className="text-xl font-semibold hover:cursor-pointer">
              SaaSApp
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" className="text-xl hover:underline hover:cursor-pointer">
              Docs
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/services" className="text-xl hover:underline hover:cursor-pointer">
              Services
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Right Side - Auth Buttons */}
      <div className="flex items-center gap-4">
        {userEmail ? (
          <>
            <span className="text-lg font-medium">{userEmail}</span>
            <Link href="/auth/logout">
              <Button variant="secondary" className="text-xl">Logout</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <Button className="text-xl">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="text-xl">SignUp</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
