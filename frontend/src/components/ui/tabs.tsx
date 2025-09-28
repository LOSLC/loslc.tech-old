"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	onValueChange?: (value: string) => void;
	children: React.ReactNode;
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

interface TabsTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	value: string;
	children: React.ReactNode;
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
	value: string;
	children: React.ReactNode;
}

const TabsContext = React.createContext<{
	value: string;
	onValueChange?: (value: string) => void;
} | null>(null);

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
	({ className, value, onValueChange, children, ...props }, ref) => (
		<TabsContext.Provider value={{ value, onValueChange }}>
			<div ref={ref} className={cn("w-full", className)} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	),
);
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
	({ className, children, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	),
);
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
	({ className, value, children, ...props }, ref) => {
		const context = React.useContext(TabsContext);
		const isActive = context?.value === value;

		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
					isActive
						? "bg-background text-foreground shadow-sm"
						: "hover:bg-muted",
					className,
				)}
				onClick={() => context?.onValueChange?.(value)}
				{...props}
			>
				{children}
			</button>
		);
	},
);
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
	({ className, value, children, ...props }, ref) => {
		const context = React.useContext(TabsContext);
		const isActive = context?.value === value;

		if (!isActive) return null;

		return (
			<div
				ref={ref}
				className={cn(
					"mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		);
	},
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
