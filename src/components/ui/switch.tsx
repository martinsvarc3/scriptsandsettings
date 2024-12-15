// src/components/ui/switch.tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

const Switch = React.forwardRef
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>((props, ref) => (
  <SwitchPrimitives.Root {...props} ref={ref}>
    <SwitchPrimitives.Thumb />
  </SwitchPrimitives.Root>
))

Switch.displayName = "Switch"

export { Switch }
