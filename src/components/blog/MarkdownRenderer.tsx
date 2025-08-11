"use client";

import React, { useCallback } from "react";
import Markdown from "markdown-to-jsx";

function CopyButton({ text }: { text: string }) {
  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }, [text]);
  return (
    <button
      onClick={onCopy}
      className="absolute top-2 right-2 text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded-md border border-white/20"
      aria-label="Copy code"
      title="Copy"
    >
      Copy
    </button>
  );
}

export function MarkdownRenderer({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={
        "prose prose-invert max-w-none text-white/80 space-y-6 " +
        "prose-headings:text-white prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:font-extrabold " +
        "prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:font-bold " +
        "prose-h3:text-xl prose-h3:font-semibold " +
        "prose-a:text-[#07D9D9] hover:prose-a:text-[#0596A6] prose-a:no-underline hover:prose-a:underline underline-offset-4 " +
        "prose-strong:text-white prose-em:text-white/90 prose-ul:marker:text-[#07D9D9] prose-ol:marker:text-white/60 " +
        "prose-blockquote:border-l-4 prose-blockquote:border-[#07D9D9] prose-blockquote:text-white/80 prose-blockquote:pl-4 " +
        "prose-img:rounded-xl prose-hr:border-white/10 " +
        className
      }
    >
      <Markdown
        options={{
          forceBlock: true,
          overrides: {
            h1: {
              props: {
                className:
                  "scroll-mt-24 text-3xl md:text-4xl font-extrabold text-white tracking-tight",
              },
            },
            h2: {
              props: {
                className:
                  "scroll-mt-24 text-2xl md:text-3xl font-bold text-white mt-6",
              },
            },
            h3: {
              props: {
                className:
                  "scroll-mt-24 text-xl md:text-2xl font-semibold text-white mt-4",
              },
            },
            h4: {
              props: {
                className:
                  "scroll-mt-24 text-lg md:text-xl font-semibold text-white mt-3",
              },
            },
            p: {
              props: {
                className: "text-sm md:text-base leading-relaxed text-white/80",
              },
            },
            strong: {
              component: (props: any) => (
                <strong className="text-white font-semibold" {...props} />
              ),
            },
            em: {
              component: (props: any) => (
                <em className="text-white/90 italic" {...props} />
              ),
            },
            ul: {
              props: {
                className: "list-disc pl-6 space-y-2 marker:text-[#07D9D9]",
              },
            },
            ol: {
              props: {
                className: "list-decimal pl-6 space-y-2 marker:text-white/60",
              },
            },
            li: {
              props: { className: "leading-relaxed" },
            },
            code: {
              component: ({ className, children, ...props }: any) => {
                const isBlock =
                  (className || "").includes("lang-") ||
                  (children as any)?.props?.className?.includes("language-");
                if (isBlock) return <code {...props}>{children}</code>;
                return (
                  <code
                    className="bg-white/10 text-[#07D9D9] px-1.5 py-0.5 rounded-md border border-white/10"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            },
            pre: {
              component: ({ children, ...props }: any) => {
                const text =
                  typeof children === "string"
                    ? children
                    : children?.props?.children ?? "";
                return (
                  <div className="relative">
                    <pre
                      className="bg-white/5 border border-white/10 rounded-xl p-4 overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </pre>
                    <CopyButton text={typeof text === "string" ? text : ""} />
                  </div>
                );
              },
            },
            table: {
              component: ({ children, ...props }: any) => (
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="min-w-full text-sm" {...props}>
                    {children}
                  </table>
                </div>
              ),
            },
            th: {
              props: { className: "text-left px-3 py-2 bg-white/5 text-white" },
            },
            td: { props: { className: "px-3 py-2 border-t border-white/10" } },
            hr: { props: { className: "my-10 border-white/10" } },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}

export default MarkdownRenderer;
