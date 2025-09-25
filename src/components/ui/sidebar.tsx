import React from "react"
import cn from "classnames"
import { Button } from "./button"

type SidebarProps = {
  side?: "left" | "right"
  variant?: "floating" | "inset" | "default"
  collapsible?: "icon" | "offcanvas" | null
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export const Sidebar: React.FC<SidebarProps> = ({
  side = "left", // revert to left by default
  variant = "default",
  collapsible = "icon",
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "group peer hidden md:block text-sidebar-foreground",
        className
      )}
      data-side={side}
      data-variant={variant}
      data-collapsible={collapsible}
      {...props}
    >
      {/* Sidebar gap handler */}
      <div className="duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear" />

      {/* Sidebar rail — fixed left/right placement */}
      <div
        className={cn(
          "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
          side === "left" ? "left-0" : "right-0",
          variant === "floating" || variant === "inset"
            ? "p-2"
            : "border-r border-sidebar-border"
        )}
      >
        <div
          data-sidebar="sidebar"
          className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
        >
          <div className="flex-1 overflow-y-auto py-2">
            {/* Icon rail and items (preserve children + behavior) */}
            {children}
          </div>

          {/* Expanded bottom area (replacing System/Resolution) */}
          <div className="sidebar-creator p-3 border-t border-sidebar-border bg-black/80 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-sidebar-accent-foreground">CREATOR</div>
                <div className="text-sm font-mono mt-1">quazfenton</div>
              </div>
              <div className="flex space-x-2">
                <a href="https://twitter.com/quazfenton" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center bg-black text-white rounded">
                  T
                </a>
                <a href="https://github.com/quazfenton" target="_blank" rel="noreferrer" className="w-6 h-6 flex items-center justify-center bg-black text-white rounded">
                  G
                </a>
                <a href="mailto:hello@quazfenton.com" className="w-6 h-6 flex items-center justify-center bg-black text-white rounded">
                  @
                </a>
              </div>
            </div>
            <div className="text-xs text-steel/60 mt-2">© {new Date().getFullYear()}</div>
          </div>
        </div>
      </div>
      {/* Sidebar toggle rail (small clickable edge) */}
      <SidebarRail side={side} />
    </div>
  )
}

const SidebarRail: React.FC<{ side: "left" | "right" }> = ({ side }) => {
  // The toggle behavior remains the same; style updated to black.
  return (
    <button
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-6 -translate-x-1/2 transition-all ease-linear sm:flex items-center justify-center",
        side === "left" ? "right-0" : "left-0",
        "bg-black text-white rounded-full shadow-sm"
      )}
    />
  )
}

export default Sidebar