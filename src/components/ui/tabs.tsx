import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

/**
 * Context to propagate the variant chosen on TabsList down to TabsTrigger
 * without requiring the consumer to annotate each trigger individually.
 */
const TabsVariantContext = React.createContext<"primary" | "secondary">("primary");

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  /**
   * Visual variant:
   * - `primary` (default): pill track with white/card active pill — for page-level tabs (PageHeader).
   * - `secondary`: underline track with border-bottom active indicator — for intra-page tabs (detail pages).
   */
  variant?: "primary" | "secondary";
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = "primary", ...props }, ref) => (
  <TabsVariantContext.Provider value={variant}>
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        variant === "primary" &&
          "inline-flex h-10 items-center justify-start gap-1 overflow-x-auto rounded-xl bg-muted/30 p-1 text-muted-foreground",
        variant === "secondary" &&
          "inline-flex h-auto w-full items-center justify-start gap-0 overflow-x-auto rounded-none border-b border-border bg-transparent p-0 text-muted-foreground",
        className
      )}
      {...props}
    />
  </TabsVariantContext.Provider>
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const variant = React.useContext(TabsVariantContext);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        // Shared base styles
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors duration-micro ease-micro hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        // Primary: white/card pill
        variant === "primary" &&
          "gap-2 rounded-md px-3 py-1.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:font-semibold data-[state=active]:shadow-sm",
        // Secondary: underline with icon support
        variant === "secondary" &&
          "gap-2 rounded-none border-b-2 border-transparent px-5 py-3 text-[13px] font-semibold data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none",
        className
      )}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
