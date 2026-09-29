const API_URL: string | undefined = process.env.NEXT_PUBLIC_API_URL;

export interface GuessType {
    gameId: number;
    characterName: string;
    x: number;
    y: number;
}

interface GuessResponse {
    correct: boolean;
    x: number | undefined;
    y: number | undefined;
}

export async function guess({ gameId, characterName, x, y }: GuessType): Promise<GuessResponse> {
    const response = await fetch(`${API_URL}/guess`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            levelId: gameId,
            name: characterName,
            x: x,
            y: y,
        }),
    });

    if (!response.ok) {
        return { correct: false, x, y };
    }

    const data: GuessResponse = await response.json();

    return data;
}

export interface RegisterWinnerType {
    name: string;
    scene: number;
    timeMs: number;
}

export interface Winner {
    id: number;
    name: string;
    scene: number;
    timeMs: number;
    createdAt: string;
}

export async function registerWinner({ name, scene, timeMs }: RegisterWinnerType): Promise<Winner | null> {
    const response = await fetch(`${API_URL}/winner`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, scene, timeMs }),
    });

    if (!response.ok) {
        return null;
    }

    const data: Winner = await response.json();

    return data;
}

export async function getWinners(scene: number): Promise<Winner[]> {
    const response = await fetch(`${API_URL}/levels/${scene}/winners`);

    if (!response.ok) {
        return [];
    }

    const data: Winner[] = await response.json();

    return data;
}