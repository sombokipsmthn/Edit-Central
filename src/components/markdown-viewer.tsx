"use client";

import * as React from "react";
import Markdown from "react-markdown";
import { cn } from "@/lib/utils";

export function MarkdownViewer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "text-sm leading-7 text-foreground/90 [&_h1]:font-heading [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-foreground [&_h1]:mt-6 [&_h1]:mb-3 [&_h1:first-child]:mt-0",
        "[&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-6 [&_h2]:mb-2 [&_h2:first-child]:mt-0",
        "[&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-4 [&_h3]:mb-1.5",
        "[&_p]:mb-3 [&_p:last-child]:mb-0",
        "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5",
        "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5",
        "[&_li]:text-foreground/90",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground",
        "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-4",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-xs [&_pre_code]:leading-relaxed",
        "[&_blockquote]:mb-3 [&_blockquote]:rounded-xl [&_blockquote]:border [&_blockquote]:border-border [&_blockquote]:bg-muted/30 [&_blockquote]:px-4 [&_blockquote]:py-2.5 [&_blockquote]:text-muted-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_hr]:my-5 [&_hr]:border-border",
        className
      )}
    >
      <Markdown>{content}</Markdown>
    </div>
  );
}
