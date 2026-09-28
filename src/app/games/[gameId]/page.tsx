//app/games/[gameId]/page.tsx

'use client'

import Link from "next/link";
import { useParams } from "next/navigation";
import { getLevel } from "@/utils/levelsGame";
import { useEffect, useState, type MouseEvent } from "react";

type Point = { x: number; y: number }; // valores entre 0 e 1
type FoundChar = Point & { name: string };
type Message = { text: string; ok: boolean };

function formatTime(total: number) {
	const m = String(Math.floor(total / 60)).padStart(2, "0");
	const s = String(total % 60).padStart(2, "0");
	return `${m}:${s}`;
}

function CharacterCard({ name, imgSrc, found = false }: { name: string; imgSrc: string; found?: boolean }) {
	return (
		<div className={`w-14 sm:w-20 p-1 sm:p-2 text-center text-xs sm:text-sm ${found ? "opacity-60" : ""}`}>
			<div className="relative bg-white">
				<img src={imgSrc} alt={name} className="w-full h-auto" />
				{found && (
					<div className="absolute inset-0 flex items-center justify-center bg-green-500/60 text-xl sm:text-3xl font-bold text-white">
						✓
					</div>
				)}
			</div>
			<span className={found ? "line-through" : ""}>{name}</span>
		</div>
	);
}

export default function Game() {
	const { gameId } = useParams<{ gameId: string }>();
	const [click, setClick] = useState<Point | null>(null);
	const [started, setStarted] = useState<boolean>(false);
	const [found, setFound] = useState<FoundChar[]>([]);
	const [seconds, setSeconds] = useState<number>(0);
	const [message, setMessage] = useState<Message | null>(null);

	const level = getLevel(Number(gameId));
	const total = level?.characters.length ?? 0;
	const finished = total > 0 && found.length === total;

	// timer: corre só depois do Start e para quando encontrar todos
	useEffect(() => {
		if (!started || finished) return;
		const id = setInterval(() => setSeconds((s) => s + 1), 1000);
		return () => clearInterval(id);
	}, [started, finished]);

	// esconde a mensagem (toast) passados 2s
	useEffect(() => {
		if (!message) return;
		const id = setTimeout(() => setMessage(null), 2000);
		return () => clearTimeout(id);
	}, [message]);

	if (!level) return <p className="p-4">Level not found.</p>;

	const isFound = (name: string) => found.some((f) => f.name === name);

	function handleClick(event: MouseEvent<HTMLImageElement>) {
		if (finished) return;

		const rect = event.currentTarget.getBoundingClientRect();
		const x = (event.clientX - rect.left) / rect.width;
		const y = (event.clientY - rect.top) / rect.height;

		setClick({ x, y });
	}

	function markFound(name: string, point: Point) {
		setFound((prev) => (prev.some((f) => f.name === name) ? prev : [...prev, { name, ...point }]));
		setMessage({ text: `You found ${name}!`, ok: true });
	}

	async function handleChose(name: string) {
		if (!click) return;

		// const result = await anyfunctionfetchapi({
		// 	gameId: Number(gameId),
		// 	characterName: name,
		// 	x: click.x,
		// 	y: click.y,
		// });
		//
		// if (result.correct) {
		// 	// a API devolve as coordenadas certas, usamos essas para o marcador
		// 	markFound(name, { x: result.x, y: result.y });
		// } else {
		// 	setMessage({ text: `${name} is not there. Try again!`, ok: false });
		// }

		console.log(`anyfunctionfetchapi(${gameId}, ${name}, ${click.x.toFixed(4)}, ${click.y.toFixed(4)})`);
		setClick(null);
	}

	if (!started) return (
		<section className="mx-auto flex max-w-3xl flex-col items-center gap-4 p-4 text-center">
			<h2 className="text-xl sm:text-2xl">You must find</h2>
			<div className="flex flex-wrap justify-center">
				{level.characters.map((char) => (
					<CharacterCard key={char.name} name={char.name} imgSrc={char.imgSrc} />
				))}
			</div>
			<p>Can you find all?</p>
			<button
				onClick={() => setStarted(true)}
				className="cursor-pointer rounded bg-white px-6 py-2 text-black hover:bg-gray-200"
			>
				Start
			</button>

			{/* Talvez eu coloque aqui a imagem desfocada */}
		</section>
	);

	// menu vira para o lado/cima quando o clique está perto das bordas
	const flipX = click ? click.x > 0.6 : false;
	const flipY = click ? click.y > 0.6 : false;
	const remaining = level.characters.filter((c) => !isFound(c.name));

	return (
		<section className="mx-auto max-w-6xl p-2 sm:p-4">
			<header className="flex flex-wrap items-center justify-between gap-2">
				<div className="flex flex-wrap items-center gap-1 sm:gap-2">
					<h2 className="text-sm sm:text-base">You must find</h2>
					<div className="flex flex-wrap">
						{level.characters.map((char) => (
							<CharacterCard
								key={char.name}
								name={char.name}
								imgSrc={char.imgSrc}
								found={isFound(char.name)}
							/>
						))}
					</div>
				</div>

				<div className="flex items-center gap-4 font-mono text-lg sm:text-xl">
					<span>{found.length}/{total}</span>
					<span>{formatTime(seconds)}</span>
				</div>
			</header>

			<div className="mt-2 flex w-full justify-center">
				<div className="relative w-fit">
					<img
						onClick={handleClick}
						className="h-auto max-w-full cursor-crosshair"
						src={level.imgSrc}
						alt={`level ${gameId}`}
					/>

					{/* marcadores permanentes dos personagens já encontrados */}
					{found.map((f) => (
						<div
							key={f.name}
							className="pointer-events-none absolute aspect-square w-[5%] min-w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-green-500"
							style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
						/>
					))}

					{click && !finished && (
						<>
							<div
								className="pointer-events-none absolute aspect-square w-[4%] min-w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/60"
								style={{ left: `${click.x * 100}%`, top: `${click.y * 100}%` }}
							/>

							<div
								className="absolute z-10 w-max bg-black shadow-lg"
								style={{
									...(flipX
										? { right: `${(1 - click.x) * 100 + 2}%` }
										: { left: `${click.x * 100 + 2}%` }),
									...(flipY
										? { bottom: `${(1 - click.y) * 100}%` }
										: { top: `${click.y * 100}%` }),
								}}
							>
								{remaining.map((char) => (
									<button
										key={char.name}
										type="button"
										onClick={() => handleChose(char.name)}
										className="flex w-full cursor-pointer items-center gap-2 bg-black p-2 text-xs text-white hover:bg-white hover:text-black sm:text-sm"
									>
										<img src={char.imgSrc} alt={char.name} className="size-8 sm:size-12 object-contain" />
										<span>{char.name}</span>
									</button>
								))}
							</div>
						</>
					)}
				</div>
			</div>

			{/* feedback rápido (acertou / falhou) */}
			{message && (
				<div
					role="status"
					className={`fixed bottom-4 left-1/2 z-30 -translate-x-1/2 rounded px-4 py-2 text-white ${message.ok ? "bg-green-600" : "bg-red-600"}`}
				>
					{message.text}
				</div>
			)}

			{/* fim de jogo */}
			{finished && (
				<div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
					<div className="w-full max-w-sm rounded bg-white p-6 text-center text-black">
						<h2 className="text-xl font-bold">You found them all!</h2>
						<p className="mt-2 font-mono text-3xl">{formatTime(seconds)}</p>
						<Link href="/" className="mt-4 inline-block rounded bg-black px-4 py-2 text-white">
							Back to levels
						</Link>
					</div>
				</div>
			)}
		</section>
	);
}