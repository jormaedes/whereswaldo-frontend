'use client'

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getLevel } from "@/utils/levelsGame";
import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { guess, getWinners, registerWinner, type Winner } from "@/api/api";

type Point = { x: number; y: number }; // valores entre 0 e 1
type FoundChar = Point & { name: string };
type Message = { text: string; ok: boolean };

function formatTime(total: number) {
	const m = String(Math.floor(total / 60)).padStart(2, "0");
	const s = String(total % 60).padStart(2, "0");
	return `${m}:${s}`;
}

function formatDate(date: string) {
	return new Intl.DateTimeFormat("en", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(new Date(date));
}

function CharacterCard({ name, imgSrc, found = false }: { name: string; imgSrc: string; found?: boolean }) {
	return (
		<div className={`target-card ${found ? "is-found" : ""}`}>
			<div className="target-card__portrait">
				<img src={imgSrc} alt={name} />
				{found && (
					<span className="target-card__found" aria-label="Found">✓</span>
				)}
			</div>
			<span>{name}</span>
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
	const router = useRouter();
	const [winners, setWinners] = useState<Winner[]>([]);
	const [playerName, setPlayerName] = useState("");
	const [savingWinner, setSavingWinner] = useState(false);
	const [winnerError, setWinnerError] = useState<string | null>(null);

	const level = getLevel(Number(gameId));
	const total = level?.characters.length ?? 0;
	const finished = total > 0 && found.length === total;

	useEffect(() => {
		if (started) return;

		let cancelled = false;
		getWinners(parseInt(gameId, 10)).then((all) => {
			if (!cancelled) setWinners(all);
		});

		return () => {
			cancelled = true;
		};
	}, [gameId, started]);

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

	if (!level) return <p className="game-page">Scene not found.</p>;

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

		const result = await guess({
			gameId: Number(gameId),
			characterName: name,
			x: click.x,
			y: click.y,
		});
		
		if (result.correct) {
			markFound(name, {
				x: Number(result.x ?? click.x),
				y: Number(result.y ?? click.y),
			});
		} else {
			setMessage({ text: `${name} is not there. Try again!`, ok: false });
		}
		setClick(null);
	}

	async function handleRegisterWinner(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (savingWinner) return;
		if (!playerName.trim()) {
			setWinnerError("Enter your name to save your result.");
			return;
		}

		setSavingWinner(true);
		setWinnerError(null);

		try {
			const winner = await registerWinner({
				name: playerName.trim(),
				scene: Number(gameId),
				timeMs: seconds * 1000,
			});

			if (!winner) {
				setWinnerError("Could not save your result. Please try again.");
				return;
			}

			setWinners((current) => [winner, ...current.filter((item) => item.id !== winner.id)]);
			setPlayerName('');
			setStarted(false);
			setFound([]);
			setSeconds(0);
			setClick(null);
		} catch {
			setWinnerError("Could not save your result. Please try again.");
		} finally {
			setSavingWinner(false);
		}
	}

	if (!started) return (
		<section className="game-page">
			<div className="game-intro">
				<span className="eyebrow">Scene {String(Number(gameId) + 1).padStart(2, "0")}</span>
				<h2>Who are you looking for?</h2>
				<p className="game-intro__copy">Keep these faces in mind before the clock starts.</p>
				<div className="target-roster">
				{level.characters.map((char) => (
					<CharacterCard key={char.name} name={char.name} imgSrc={char.imgSrc} />
				))}
				</div>
				<div className="game-intro__actions">
				<button
					onClick={() => router.back()}
					className="button-secondary"
				>
					Back
				</button>
				<button
					onClick={() => setStarted(true)}
					className="button-primary"
				>
					Start searching
				</button>
				</div>
			</div>

			<div className="scoreboard">
				<div className="scoreboard__heading">
					<h3>Recent searches</h3>
					<span>Scene {String(Number(gameId) + 1).padStart(2, "0")}</span>
				</div>
				<div className="scoreboard__row scoreboard__row--head">
					<span>Player</span><span>Date</span><span>Time</span>
				</div>
				{winners.map((winner) => (
					<div className="scoreboard__row" key={winner.id}>
						<span>{winner.name}</span>
						<span>{formatDate(winner.createdAt)}</span>
						<span>{formatTime(Math.floor(winner.timeMs / 1000))}</span>
					</div>
				))}
				{winners.length === 0 && <p className="scoreboard__empty">No completed searches yet.</p>}
			</div>
		</section>
	);

	// menu vira para o lado/cima quando o clique está perto das bordas
	const flipX = click ? click.x > 0.6 : false;
	const flipY = click ? click.y > 0.6 : false;
	const remaining = level.characters.filter((c) => !isFound(c.name));

	return (
		<section className="game-page">
			<header className="game-toolbar">
				<div className="game-toolbar__left">
					<Link className="game-back" href="/">← Scenes</Link>
					<h2 className="game-scene-title">Scene {String(Number(gameId) + 1).padStart(2, "0")}</h2>
					<div className="target-roster">
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

				<div className="game-status" aria-live="polite">
					<span className="game-status__count">{found.length} / {total} found</span>
					<span className="game-status__time">{formatTime(seconds)}</span>
				</div>
			</header>

			<div className="flex w-full justify-center">
				<div className="game-board relative">
					<img
						onClick={handleClick}
						className="game-board__image"
						src={level.imgSrc}
						alt={`Scene ${Number(gameId) + 1}`}
					/>

					{/* marcadores dos personagens já encontrados */}
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
								className="character-menu"
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
									>
										<img src={char.imgSrc} alt="" />
										<span>{char.name}</span>
									</button>
								))}
							</div>
						</>
					)}
				</div>
			</div>

			{/* feedback (acertou / falhou) */}
			{message && (
				<div
					role="status"
					className={`game-toast ${message.ok ? "" : "is-error"}`}
				>
					{message.text}
				</div>
			)}

			{/* fim de jogo */}
			{finished && (
				<div className="game-finish">
					<div className="game-finish__content">
						<h2 className="text-xl font-bold">You found them all!</h2>
						<p className="game-finish__time">{formatTime(seconds)}</p>
						<form className="game-finish__form" onSubmit={handleRegisterWinner}>
							<label htmlFor="player-name">Your name</label>
							<input
								id="player-name"
								name="name"
								autoComplete="name"
								maxLength={80}
								required
								value={playerName}
								onChange={(event) => setPlayerName(event.target.value)}
								disabled={savingWinner}
							/>
							{winnerError && <p className="game-finish__error" role="alert">{winnerError}</p>}
							<button className="button-primary" type="submit" disabled={savingWinner}>
								{savingWinner ? "Saving..." : "Save result"}
							</button>
						</form>
					</div>
				</div>
			)}
		</section>
	);
}