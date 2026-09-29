const API_URL:string | undefined = process.env.NEXT_PUBLIC_API_URL;

export interface guessType {
	gameId: Number;
    characterName: string;
    x: Number;
    y: Number;
}

interface GuessResponse {
    correct: boolean,
    x: Number | undefined;
    y: Number | undefined;
}

export async function guess({gameId, characterName, x, y} : guessType) : Promise<GuessResponse> {
    console.log(API_URL)
    const response = await fetch(`${API_URL}/guess`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            levelId: gameId,
            name: characterName,
            x: x,
            y: y
        })
    })

    if (!response.ok) {
        return {correct: false, x, y}
    }

    const data:GuessResponse = await response.json();
    
    return data;
}