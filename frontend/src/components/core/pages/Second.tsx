import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface SecondPageProps {
	ref?: React.RefObject<HTMLDivElement | null>;
}

export default function Second({ ref }: SecondPageProps) {
	return (
		<div ref={ref} className="flex flex-col w-full h-full p-5">
			<Card className="border-none bg-background hover:bg-card transition-all duration-300">
				<CardHeader>
					<div className="flex justify-center">
						<Image
							height={1000}
							width={1000}
							src="/people.png"
							alt="People working together."
							className="rounded-lg"
						/>
					</div>
					<CardTitle className="text-xl">
						We&apos;re Linux users but not just !
					</CardTitle>
				</CardHeader>
			</Card>
		</div>
	);
}
