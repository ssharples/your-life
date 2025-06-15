
import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

// Core components
export { SidebarProvider, useSidebar } from "./sidebar/context"
export { Sidebar, SidebarInset } from "./sidebar/sidebar-core"

// Layout components
export {
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "./sidebar/sidebar-layout"

// Group components
export { SidebarGroupLabel, SidebarGroupAction } from "./sidebar/sidebar-group"

// Menu components
export {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
} from "./sidebar/sidebar-menu"

// Submenu components
export {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "./sidebar/sidebar-submenu"

// Trigger and input components
export { SidebarTrigger, SidebarRail } from "./sidebar/sidebar-trigger"
export { SidebarInput, SidebarSeparator } from "./sidebar/sidebar-input"

// Wrap provider with TooltipProvider for convenience
const SidebarProviderWithTooltip = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SidebarProvider>
>(({ children, ...props }, ref) => {
  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider ref={ref} {...props}>
        {children}
      </SidebarProvider>
    </TooltipProvider>
  )
})
SidebarProviderWithTooltip.displayName = "SidebarProviderWithTooltip"

// Export as default SidebarProvider for backward compatibility
export { SidebarProviderWithTooltip as SidebarProvider }
