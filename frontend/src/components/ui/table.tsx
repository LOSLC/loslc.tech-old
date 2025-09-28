import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({
	className,
	...props
}: React.HTMLAttributes<HTMLTableElement>) {
	return (
		<table
			className={cn("w-full caption-bottom text-sm", className)}
			{...props}
		/>
	);
}
export function TableHeader({
	className,
	...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
	return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}
export function TableBody({
	className,
	...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
	return (
		<tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
	);
}
export function TableFooter({
	className,
	...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
	return <tfoot className={cn("bg-muted font-medium", className)} {...props} />;
}
export function TableRow({
	className,
	...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
	return (
		<tr
			className={cn("border-b transition-colors hover:bg-muted/40", className)}
			{...props}
		/>
	);
}
export function TableHead({
	className,
	...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
	return (
		<th
			className={cn(
				"h-10 px-2 text-left align-middle font-medium text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
export function TableCell({
	className,
	...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
	return <td className={cn("p-2 align-middle", className)} {...props} />;
}
export function TableCaption({
	className,
	...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
	return (
		<caption
			className={cn("mt-4 text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}
