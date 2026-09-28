import Level from "@/components/Level";
import { levelsGame } from "@/utils/levelsGame";



export default function Home() {
  return (
    <main className="home-page">
      <div className="home-shell">
        <section className="home-hero" aria-labelledby="home-title">
          <div>
            <span className="eyebrow">The great search</span>
            <h1 className="home-title" id="home-title">
              Where&apos;s <span>Waldo?</span>
            </h1>
          </div>
          <p className="home-deck">
            A busy scene, a few familiar faces, and a sharp eye. Pick a scene and let the search begin.
          </p>
        </section>

        <section className="scene-section" aria-labelledby="scene-heading">
          <div className="scene-section__heading">
            <h2 id="scene-heading">Choose your scene</h2>
            <span>{String(levelsGame.length).padStart(2, "0")} scenes</span>
          </div>
          <div className="scene-grid">
            {levelsGame.map((level, index) => (
              <Level
                key={index}
                imgSrc={level.imgSrc}
                characters={level.characters}
                gameId={index}
              />
            ))}
          </div>
          </section>
      </div>
    </main >
  );
}
