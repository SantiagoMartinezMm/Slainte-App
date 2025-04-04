"use client"

import * as React from "react"
import { LayoutGrid, List } from "lucide-react"
import { Toggle } from "./toggle"
import { cn } from "@/lib/utils"

interface ViewToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ 
  view, 
  onViewChange,
  className,
  ...props 
}: ViewToggleProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Toggle
        pressed={view === "list"}
        onPressedChange={() => onViewChange("list")}
        aria-label="Vista de lista"
        className={cn(
          "data-[state=on]:bg-muted data-[state=on]:text-muted-foreground",
          view === "list" ? "bg-muted text-muted-foreground" : ""
        )}
      >
        <List className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Lista</span>
      </Toggle>
      <Toggle
        pressed={view === "grid"}
        onPressedChange={() => onViewChange("grid")}
        aria-label="Vista de tarjetas"
        className={cn(
          "data-[state=on]:bg-muted data-[state=on]:text-muted-foreground",
          view === "grid" ? "bg-muted text-muted-foreground" : ""
        )}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:ml-2">Tarjetas</span>
      </Toggle>
    </div>
  )
}
