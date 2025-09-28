"use client";
import React from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ImageUploadZoneProps {
	onFiles: (files: FileList) => void;
	disabled?: boolean;
	imagesCount: number;
	limit?: number;
	className?: string;
	label?: string;
}

export function ImageUploadZone({
	onFiles,
	disabled,
	imagesCount,
	limit = 5,
	className,
}: ImageUploadZoneProps) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const [drag, setDrag] = React.useState(false);

	function open() {
		if (disabled) return;
		inputRef.current?.click();
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (disabled) return;
		setDrag(false);
		if (e.dataTransfer.files?.length) onFiles(e.dataTransfer.files);
	}

	return (
		<div
			onClick={open}
			onDragOver={(e) => {
				e.preventDefault();
				if (!disabled) setDrag(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				setDrag(false);
			}}
			onDrop={handleDrop}
			className={cn(
				"flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-md px-4 py-6 text-center cursor-pointer transition relative focus:outline-none focus:ring-2 focus:ring-primary/50",
				drag
					? "border-primary/70 bg-primary/5"
					: "border-border/60 hover:border-primary/40",
				disabled && "opacity-50 cursor-not-allowed",
				className,
			)}
			aria-disabled={disabled}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					open();
				}
			}}
		>
			<UploadCloud className="w-5 h-5 opacity-70" />
			<div className="text-xs font-medium">
				{disabled ? "Image limit reached" : "Drag & drop or click to upload"}
			</div>
			<div className="text-[10px] text-muted-foreground">
				{imagesCount}/{limit}
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				multiple
				hidden
				onChange={(e) => e.target.files && onFiles(e.target.files)}
			/>
		</div>
	);
}
