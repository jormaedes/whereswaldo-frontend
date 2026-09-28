'use client'

import { useParams } from "next/navigation";
import { getLevel } from "@/utils/levelsGame";
import { useState, type MouseEvent } from "react";

type ClickPoint = { x: number; y: number }; // valores entre 0 e 1

export default function Game() {
	const { gameId } = useParams<{ gameId: string }>();
	const [click, setClick] = useState<ClickPoint | null>(null);
	const [started, setStarted] = useState<boolean>(false);

	const level = getLevel(Number(gameId));

	function handleClick(event: MouseEvent<HTMLImageElement>) {
		const rect = event.currentTarget.getBoundingClientRect();

		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		setClick({ x, y });
		console.log(x.toFixed(4), y.toFixed(4));
	}

	function handleChose(name: string) {
		console.log(`Escolheu: ${name}`);
		setClick(null);
	}

	if (!started) return (
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
				<p>Can you find all?</p>
			</div>
			<button onClick={() => setStarted(true)}>Start</button>
		</section>
	)

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

			<div className="flex justify-center w-full">
				<div className="relative w-fit">
					<img
						onClick={handleClick}
						className="max-w-full h-auto"
						src={level.imgSrc}
						alt={`level ${gameId}`}
					/>
					{click && (
						<>
						
							<div
								className="absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/60  pointer-events-none"
								style={{ left: `${click.x * 100}%`, top: `${click.y * 100}%` }}
							/>

							<div
								className={`z-10 bg-black absolute`}
								style={{ left: `${click.x * 100 + 2}%`, top: `${click.y * 100}%`}}
							>

								{level.characters.map((char) =>
									<div
										key={char.name}
										
									>
										<button
											onClick={() => handleChose(char.name)} 
											className="cursor-pointer w-20 hover:bg-white hover:text-black bg-black text-white flex items-center p-2 gap-2">
											<div className="">
												<img src={char.imgSrc} alt={char.name} />
											</div>
											<span>{char.name}</span>
										</button>
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>
		</section>
	);
}