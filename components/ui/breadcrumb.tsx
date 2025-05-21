import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    label: string
  }[]
  separator?: React.ReactNode
  homeLink?: boolean
}

export function Breadcrumb({
  items,
  separator = <ChevronRight className="h-4 w-4" />,
  homeLink = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center space-x-2">
        {homeLink && (
          <li className="flex items-center">
            <Link
              href="/"
              className="flex items-center hover:text-primary transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        )}

        {homeLink && items.length > 0 && (
          <li className="flex items-center">{separator}</li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <React.Fragment key={item.href}>
              <li>
                {isLast ? (
                  <span className="font-medium text-foreground">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
              {!isLast && <li>{separator}</li>}
            </React.Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
