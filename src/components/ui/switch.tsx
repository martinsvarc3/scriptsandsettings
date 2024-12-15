"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  className?: string;
}

const Switch = React.forwardRef
  React.ElementRef<typeof SwitchPrimitives.Root>, 
  SwitchProps
>(({ className, ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      {...props}
    >
      <SwitchPrimitives.Thumb />
    </SwitchPrimitives.Root>
  );
});

Switch.displayName = "Switch"

export { Switch }
