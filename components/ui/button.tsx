import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {

      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
      
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
      
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
      
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
      
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
      
        link: "text-primary underline-offset-4 hover:underline",
      
        // Colores adicionales
        blue:
          "bg-blue-700 text-white hover:bg-blue-900 focus-visible:ring-blue-500/50",
      
        sky:
          "bg-sky-500 text-white hover:bg-sky-600 focus-visible:ring-sky-500/50",
      
        green:
          "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500/50",
      
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500/50",
      
        lime:
          "bg-lime-500 text-lime-950 hover:bg-lime-600 focus-visible:ring-lime-500/50",
      
        yellow:
          "bg-yellow-400 text-yellow-950 hover:bg-yellow-500 focus-visible:ring-yellow-500/50",
      
        warning:
          "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500/50",
      
        orange:
          "bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500/50",
      
        red:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/50",
      
        purple:
          "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500/50",
      
        violet:
          "bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-500/50",
      
        pink:
          "bg-pink-600 text-white hover:bg-pink-700 focus-visible:ring-pink-500/50",
      
        rose:
          "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500/50",
      
        teal:
          "bg-teal-600 text-white hover:bg-teal-700 focus-visible:ring-teal-500/50",
      
        cyan:
          "bg-cyan-500 text-white hover:bg-cyan-600 focus-visible:ring-cyan-500/50",
      
        indigo:
          "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500/50",
      
        slate:
          "bg-slate-700 text-white hover:bg-slate-800 focus-visible:ring-slate-500/50",
      },      
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
