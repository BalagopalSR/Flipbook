"use client";

import { MessageCircle, Linkedin, Facebook, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/common/Button";
import { trackShare } from "@/lib/analytics/analyticsTracker";
import { getShareUrl } from "./EmbedCodeBox";

interface SocialShareButtonsProps {
  flipbookId: string;
  title: string;
}

export function SocialShareButtons({ flipbookId, title }: SocialShareButtonsProps) {
  const url = getShareUrl(flipbookId);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shares = [
    {
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    },
    {
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    },
    {
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      label: "X/Twitter",
      icon: <Twitter className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedTitle}`,
    },
    {
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
      href: `mailto:?subject=${encodedTitle}&body=${encoded}`,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {shares.map((share) => (
        <a
          key={share.label}
          href={share.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackShare(flipbookId, share.label)}
        >
          <Button variant="outline" size="sm" aria-label={`Share on ${share.label}`}>
            {share.icon}
            <span className="hidden sm:inline">{share.label}</span>
          </Button>
        </a>
      ))}
    </div>
  );
}
