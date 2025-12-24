"use client";

import { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/Button";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps extends ButtonProps {
  url?: string;
  title?: string;
}

export function ShareButton({
  url,
  title,
  className,
  variant = "outline",
  size = "sm",
  ...props
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let shareUrl = url || window.location.href;
    if (shareUrl.startsWith("/")) {
      shareUrl = window.location.origin + shareUrl;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for mobile/older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;

        // Ensure it's not visible but part of the DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
          throw err;
        }

        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={cn("gap-2", className)}
      {...props}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span className={cn(size === "icon" && "sr-only")}>Copied</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span className={cn(size === "icon" && "sr-only")}>Share</span>
        </>
      )}
    </Button>
  );
}
