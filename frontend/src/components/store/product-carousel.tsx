"use client";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface ProductCarouselProps {
	imageIds: string[] | undefined;
	className?: string;
	aspect?: string; // e.g. 'aspect-video'
	showDots?: boolean;
	autoHeight?: boolean;
	placeholderIcon?: React.ReactNode;
}

export function ProductCarousel({
	imageIds,
	className,
	aspect = "aspect-video",
	showDots = true,
	autoHeight = false,
	placeholderIcon,
}: ProductCarouselProps) {
	const images = imageIds && imageIds.length ? imageIds : [];
	const [index, setIndex] = React.useState(0);
	const trackRef = React.useRef<HTMLDivElement | null>(null);
	const touch = React.useRef<{
		startX: number;
		deltaX: number;
		dragging: boolean;
	}>({ startX: 0, deltaX: 0, dragging: false });

	const atStart = index === 0;
	const atEnd = index === Math.max(0, images.length - 1);

	const prev = React.useCallback(() => {
		if (!atStart) setIndex((i) => i - 1);
	}, [atStart]);
	const next = React.useCallback(() => {
		if (!atEnd) setIndex((i) => i + 1);
	}, [atEnd]);

	// Keyboard navigation
	React.useEffect(() => {
		function handler(e: KeyboardEvent) {
			if (e.key === "ArrowLeft") prev();
			if (e.key === "ArrowRight") next();
		}
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [prev, next]);

	// Touch handlers
	function onTouchStart(e: React.TouchEvent) {
		if (images.length < 2) return;
		touch.current.startX = e.touches[0].clientX;
		touch.current.deltaX = 0;
		touch.current.dragging = true;
	}
	function onTouchMove(e: React.TouchEvent) {
		if (!touch.current.dragging) return;
		touch.current.deltaX = e.touches[0].clientX - touch.current.startX;
		if (trackRef.current) {
			trackRef.current.style.transition = "none";
			const offset =
				-index * 100 +
				(touch.current.deltaX / (trackRef.current.clientWidth || 1)) * 100;
			trackRef.current.style.transform = `translateX(${offset}%)`;
		}
	}
	function onTouchEnd() {
		if (!touch.current.dragging) return;
		touch.current.dragging = false;
		const threshold = 50; // px
		if (touch.current.deltaX > threshold && !atStart) {
			setIndex((i) => i - 1);
		} else if (touch.current.deltaX < -threshold && !atEnd) {
			setIndex((i) => i + 1);
		} else {
			// snap back
			if (trackRef.current) {
				trackRef.current.style.transition = "transform 300ms";
				trackRef.current.style.transform = `translateX(-${index * 100}%)`;
			}
		}
	}

	React.useEffect(() => {
		if (trackRef.current) {
			trackRef.current.style.transition =
				"transform 350ms cubic-bezier(.4,.1,.2,1)";
			trackRef.current.style.transform = `translateX(-${index * 100}%)`;
		}
	}, [index]);

	if (images.length === 0) {
		return (
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-md border border-border/50 bg-gradient-to-br from-muted/30 via-muted/10 to-background/10 flex items-center justify-center text-muted-foreground/40",
					aspect,
					className,
				)}
			>
				{placeholderIcon || <ImageIcon className="w-10 h-10" />}
			</div>
		);
	}

	if (images.length === 1) {
		return (
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-md",
					aspect,
					className,
				)}
			>
				<img
					src={`/api/files/${images[0]}/download`}
					alt="product image"
					className="object-cover w-full h-full"
					loading="lazy"
				/>
			</div>
		);
	}

	return (
		<div className={cn("relative group", className)}>
			<div
				className={cn(
					"relative w-full overflow-hidden rounded-md border border-border/50 bg-background/40 backdrop-blur",
					aspect,
					autoHeight && "aspect-auto",
				)}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				<div ref={trackRef} className="flex w-full h-full">
					{images.map((id, i) => (
						<div key={id} className="w-full h-full shrink-0">
							<img
								src={`/api/files/${id}/download`}
								alt={`product image ${i + 1}`}
								className="object-cover w-full h-full"
								draggable={false}
								loading={i === 0 ? "eager" : "lazy"}
							/>
						</div>
					))}
				</div>
				{/* Arrows */}
				<button
					type="button"
					aria-label="Previous image"
					onClick={prev}
					disabled={atStart}
					className={cn(
						"absolute top-1/2 -translate-y-1/2 left-2 z-10 p-1.5 rounded-full bg-background/60 backdrop-blur border border-border/50 text-foreground/70 hover:text-foreground transition opacity-0 group-hover:opacity-100 focus:opacity-100",
						atStart && "opacity-40 cursor-not-allowed",
					)}
				>
					<ChevronLeft className="w-4 h-4" />
				</button>
				<button
					type="button"
					aria-label="Next image"
					onClick={next}
					disabled={atEnd}
					className={cn(
						"absolute top-1/2 -translate-y-1/2 right-2 z-10 p-1.5 rounded-full bg-background/60 backdrop-blur border border-border/50 text-foreground/70 hover:text-foreground transition opacity-0 group-hover:opacity-100 focus:opacity-100",
						atEnd && "opacity-40 cursor-not-allowed",
					)}
				>
					<ChevronRight className="w-4 h-4" />
				</button>
			</div>
			{showDots && (
				<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
					{images.map((_, i) => (
						<button
							key={i}
							aria-label={`Go to image ${i + 1}`}
							onClick={() => setIndex(i)}
							className={cn(
								"w-2 h-2 rounded-full transition",
								i === index
									? "bg-primary scale-110"
									: "bg-border/70 hover:bg-border",
							)}
						/>
					))}
				</div>
			)}
		</div>
	);
}
