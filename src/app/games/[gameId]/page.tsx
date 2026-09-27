'use client'

import { useParams } from "next/navigation";
import { getLevel } from "@/utils/levelsGame";

export default function Game() {
	const { gameId } = useParams<{ gameId: string }>();

	const level = getLevel(Number(gameId));

	return (
		<section>
			<div className="flex items-center gap-2">
				<h2>You must find</h2>
				<div className="flex">

					{level.characters.map((char) =>
						<div
							key={char.name}
							className="w-20 p-2 "
						>
							<div className="bg-white">
								<img src={char.imgSrc} alt={char.name} />
							</div>
							<span>{char.name}</span>
						</div>
					)}
				</div>

			</div>
			<div className="text-white">
				<img src={level.imgSrc} alt={`level ${gameId}`} />
			</div>

		</section>

	);
}
