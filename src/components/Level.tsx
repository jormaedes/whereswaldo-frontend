"use client"

import Link from "next/link";

interface Character {
	name: string;
	imgSrc: string;
}

interface LevelProps {
	imgSrc: string;
	characters: Character[];
	gameId: number;
}

function CharacterElement({ imgSrc, name }: Character) {
	return (
		<div className="w-10 h-10 rounded-full bg-amber-50 z-2 relative">
			<img
				src={imgSrc}
				alt={name}
			/>
		</div>
	)
}

export default function Level({ imgSrc, characters, gameId }: LevelProps) {

	return (
		<div
			className="w-75 h-62.5 bg-amber-900 relative"
		>
			<img
				src={imgSrc}
				alt="level 1"
				style={{
					objectFit: 'cover',
				}}
				className="w-75 h-62.5 absolute top-0 left-0 z-1"
			/>
			<div>
				{
					characters.map((char, index) =>
						<CharacterElement
							key={index}
							name={char.name}
							imgSrc={char.imgSrc}
						/>
					)
				}
			</div>
			<Link
				className="relative z-2 bg-amber-400"
				href={`/games/${gameId}`}
			> Play this level </Link>
		</div>
	)
}