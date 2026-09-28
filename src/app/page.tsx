import Level from "@/components/Level";
import { levelsGame } from "@/utils/levelsGame";



export default function Home() {
  return (
    <section className="py-4 px-2 sm:px-0">
      <div className="container mx-auto flex flex-col gap-4">

        <div className="text-center">
          <h2>
            WHERE IS WALDO?
          </h2>
          <p>
            Try to find waldo, wizard and odlaw as soon as possible
          </p>
        </div>


        <div className="grid grid-cols-4">

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
      </div>

    </section>
  );
}
