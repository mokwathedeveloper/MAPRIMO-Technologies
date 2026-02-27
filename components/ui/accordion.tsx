"use client";

import * as React from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  trigger: string;
  children: React.ReactNode;
}

export function AccordionItem({ trigger, children }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn(
      "border-b border-border/50 transition-all duration-500 rounded-2xl mb-2",
      isOpen ? "bg-muted/30 border-primary/20 shadow-sm" : "bg-transparent hover:bg-muted/10"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left transition-all group"
      >
        <span className={cn(
          "text-lg md:text-xl font-bold tracking-tight transition-colors duration-300",
          isOpen ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
        )}>
          {trigger}
        </span>
        <div className={cn(
          "h-8 w-8 rounded-full border flex items-center justify-center transition-all duration-500",
          isOpen ? "bg-primary border-primary text-primary-foreground rotate-180" : "bg-background border-border text-muted-foreground"
        )}>
          <ChevronDown className="h-4 w-4" />
        </div>
      </button>
      
      <div className={cn(
        "grid transition-all duration-500 ease-in-out px-6",
        isOpen ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] pb-0 opacity-0 pointer-events-none"
      )}>
        <div className="overflow-hidden">
          <div className="text-lg text-muted-foreground leading-relaxed font-medium pt-2 border-t border-primary/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
