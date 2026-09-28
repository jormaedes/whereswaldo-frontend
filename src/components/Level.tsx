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
		<div className="character-peek" title={name}>
			<img src={imgSrc} alt={name} />
		</div>
	)
}

export default function Level({ imgSrc, characters, gameId }: LevelProps) {
	return (
		<Link
			className="level-card"
			href={`/games/${gameId}`}
			aria-label={`Play scene ${String(gameId + 1).padStart(2, "0")}`}
		>
			<div className="level-card__image">
				<img src={imgSrc} alt={`Crowded hidden-object scene ${gameId + 1}`} />
				<span className="scene-number">SCENE {String(gameId + 1).padStart(2, "0")}</span>
				<span className="scene-arrow" aria-hidden="true">↗</span>
			</div>
			<div className="level-card__details">
				<div>
					<h3>Scene {String(gameId + 1).padStart(2, "0")}</h3>
					<p>{characters.length} {characters.length === 1 ? "character" : "characters"} to find</p>
				</div>
				<div className="character-peeks" aria-label={`Targets: ${characters.map((character) => character.name).join(", ")}`}>
					{characters.map((character) => (
						<CharacterElement key={character.name} {...character} />
					))}
				</div>
			</div>
		</Link>
	)
}