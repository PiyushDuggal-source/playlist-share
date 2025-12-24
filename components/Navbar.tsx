"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle, signOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";
import { LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { OrgRestrictionModal } from "@/components/AuthGateButton";

export function Navbar() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showRestriction, setShowRestriction] = useState(false);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsOpen(false);
    } catch (error: any) {
      if (error.message?.includes("@ds.study.iitm.ac.in")) {
        setShowRestriction(true);
      }
    }
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-slate-900">
          PlaylistShare
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-slate-900">
            Home
          </Link>
          <Link href="/playlists" className="hover:text-slate-900">
            Playlists
          </Link>
          {user && (
            <Link href="/profile" className="hover:text-slate-900">
              My Stash
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="h-5 w-5" />
                )}
                <span>{user.displayName}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button onClick={handleSignIn}>Sign In</Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4">
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/playlists"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
              onClick={() => setIsOpen(false)}
            >
              Playlists
            </Link>
            {user && (
              <Link
                href="/profile"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
                onClick={() => setIsOpen(false)}
              >
                My Stash
              </Link>
            )}

            <div className="pt-4 border-t border-slate-100">
              {loading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200" />
              ) : user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <UserIcon className="h-5 w-5" />
                    )}
                    <span>{user.displayName}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="justify-start px-0"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSignIn} className="w-full">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      <OrgRestrictionModal
        open={showRestriction}
        onClose={() => setShowRestriction(false)}
      />
    </nav>
  );
}
