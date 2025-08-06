"use client"

import * as React from "react"
import {X} from "lucide-react"
import {cn} from "@/lib/utils"

interface DialogContextType {
    open: boolean
    setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | null>(null)

const Dialog = ({children}: React.PropsWithChildren) => {
    const [open, setOpen] = React.useState(false)

    return (
        <DialogContext.Provider value={{open, setOpen}}>
            {children}
        </DialogContext.Provider>
    )
}

const DialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({className, children, onClick, ...props}, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogTrigger must be used within Dialog")

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        context.setOpen(true)
    }

    return (
        <button
            ref={ref}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    )
})
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = ({children}: React.PropsWithChildren) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogPortal must be used within Dialog")

    if (!context.open) return null

    return (
        <div className="fixed inset-0 z-50">
            {children}
        </div>
    )
}

const DialogOverlay = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, ...props}, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogOverlay must be used within Dialog")

    return (
        <div
            ref={ref}
            className={cn(
                "fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in-0",
                className
            )}
            onClick={() => context.setOpen(false)}
            {...props}
    />
  )
})
DialogOverlay.displayName = "DialogOverlay"

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({className, children, ...props}, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogContent must be used within Dialog")

    return (
    <DialogPortal>
        <DialogOverlay/>
        <div
            ref={ref}
            className={cn(
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg",
                className
            )}
            onClick={(e) => e.stopPropagation()}
            {...props}
        >
            {children}
            <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={() => context.setOpen(false)}
        >
            <X className="h-4 w-4"/>
            <span className="sr-only">Close</span>
        </button>
      </div>
    </DialogPortal>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
                          className,
                          ...props
                      }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
            className
        )}
        {...props}
    />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({className, ...props}, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
DialogDescription.displayName = "DialogDescription"

const DialogClose = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({className, children, ...props}, ref) => {
    const context = React.useContext(DialogContext)
    if (!context) throw new Error("DialogClose must be used within Dialog")

    return (
        <button
            ref={ref}
            className={className}
            onClick={() => context.setOpen(false)}
            {...props}
        >
            {children}
        </button>
    )
})
DialogClose.displayName = "DialogClose"

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}