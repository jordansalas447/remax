import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",

        // New color variants
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        yellow: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100",
        amber: "bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
        violet: "bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-violet-100",
        indigo: "bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-100",
        orange: "bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100",
        teal: "bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-100",
        gray: "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
