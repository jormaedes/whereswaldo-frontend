import Level from "@/components/Level";
import {levelsGame} from "@/utils/levelsGame";



export default function Home() {
  return (
    <div>

      {levelsGame.map((level, index) =>
        <Level
          key={index}
          imgSrc={level.imgSrc}
          characters={level.characters}
          gameId={index}
          />
      )
      }

    </div>
  );
}
