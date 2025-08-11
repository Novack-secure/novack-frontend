"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Link as LinkIcon, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { slugify } from "./slugify";

interface TocItem {
  id: string;
  text: string;
  level: number; // 1..4
}

export function ArticleLayout({
  title,
  category,
  author,
  date,
  minutes,
  children,
}: {
  title: string;
  category: string;
  author: string;
  date: string;
  minutes: number;
  children: React.ReactNode;
}) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const url = typeof window !== "undefined" ? window.location.href : "";
  const [shareLabel, setShareLabel] = useState<string>("Share");

  const flashLabel = (text: string) => {
    setShareLabel(text);
    if (typeof window !== "undefined") {
      window.setTimeout(() => setShareLabel("Share"), 1500);
    }
  };

  useEffect(() => {
    if (!articleRef.current) return;
    const headings = Array.from(
      articleRef.current.querySelectorAll("h1, h2, h3, h4")
    ) as HTMLHeadingElement[];
    const items: TocItem[] = headings.map((h) => {
      const text = h.innerText.trim();
      const id = h.id || slugify(text);
      h.id = id;
      const level = Number(h.tagName.substring(1));
      return { id, text, level };
    });
    setToc(items);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0.1 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [children]);

  const onShareNative = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: title, url });
        flashLabel("Shared!");
      } catch {}
    }
  };

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      flashLabel("Link copied");
    } catch {}
  };

  const openWindow = (href: string) => {
    if (typeof window !== "undefined")
      window.open(href, "_blank", "noopener,noreferrer");
  };

  const onShareTwitter = () => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    openWindow(shareUrl);
    flashLabel("Opened X");
  };
  const onShareLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    openWindow(shareUrl);
    flashLabel("Opened LinkedIn");
  };
  const onShareFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    openWindow(shareUrl);
    flashLabel("Opened Facebook");
  };

  return (
    <section className="w-full">
      <div className="mx-auto px-4 sm:px-6 max-w-7xl">
        <header className="pt-10 md:pt-14 pb-8 md:pb-10">
          <div className="mb-3">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-[#07D9D9] bg-[#07D9D9]/10 px-3 py-1 rounded-full border border-[#07D9D9]/30">
              {category}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-white/60 mt-4 text-xs md:text-sm">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs md:text-sm text-white/70 hover:text-white border border-white/15 hover:border-white/30 rounded-lg px-3 py-1.5 bg-white/5 backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <span>{author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span>
                {minutes} min{" "}
                {typeof window !== "undefined" &&
                navigator.language.startsWith("es")
                  ? "de lectura"
                  : "read"}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-auto text-white/70 hover:text-white inline-flex items-center gap-2 text-xs md:text-sm">
                  <Share2 className="h-4 w-4" />
                  {shareLabel}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black/80 backdrop-blur-xl border border-white/10 text-white"
              >
                <DropdownMenuItem
                  onClick={onShareNative}
                  className="focus:bg-white/10"
                >
                  Share...
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onCopyLink}
                  className="focus:bg-white/10"
                >
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onShareTwitter}
                  className="focus:bg-white/10"
                >
                  Share on X (Twitter)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onShareLinkedIn}
                  className="focus:bg-white/10"
                >
                  Share on LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onShareFacebook}
                  className="focus:bg-white/10"
                >
                  Share on Facebook
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mt-4 md:mt-6">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm p-3">
              <div className="text-white/80 text-xs md:text-sm font-semibold mb-2">
                On this page
              </div>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-xs md:text-sm transition-colors ${
                      activeId === item.id
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    } ${item.level === 2 ? "pl-2" : ""} ${
                      item.level === 3 ? "pl-4" : ""
                    } ${item.level === 4 ? "pl-6" : ""}`}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article ref={articleRef} className="lg:col-span-9">
            <div className="relative space-y-8 md:space-y-10">{children}</div>
          </article>
        </div>
      </div>
    </section>
  );
}

export default ArticleLayout;
