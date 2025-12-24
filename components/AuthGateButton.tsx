"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { GraduationCap, Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthGateButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const MODAL_TITLE = "Join the Club";
const MODAL_MESSAGE =
  "Unlock the power to create, like, and save course playlists. It's free and takes two seconds.";

export function AuthGateButton({
  href,
  children,
  variant = "default",
  size = "default",
  className,
}: AuthGateButtonProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (loading) return;
    if (user) {
      router.push(href);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
      >
        {children}
      </Button>
      <AuthPromptModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function AuthPromptModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />

            <div className="relative px-6 pt-12 pb-6">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white/50">
                <GraduationCap className="h-10 w-10 text-indigo-600" />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                  {MODAL_TITLE} <Sparkles className="h-5 w-5 text-yellow-500" />
                </h3>
                <p className="mt-3 text-slate-600 leading-relaxed">
                  {MODAL_MESSAGE}
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <Button
                  size="lg"
                  className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
                  onClick={async () => {
                    await signInWithGoogle();
                    onClose();
                  }}
                >
                  <Lock className="h-4 w-4" />
                  Sign in with Google
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full text-slate-500 hover:text-slate-700"
                  onClick={onClose}
                >
                  Nah, just browsing
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
