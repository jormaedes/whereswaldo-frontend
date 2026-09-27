import Level from "@/components/Level";

const levels = [
  {
    imgSrc: '/assets/img1.webp',
    characters: [
      {
        name: 'waldo',
        imgSrc: '/assets/waldo.webp'
      },
      {
        name: 'wizard',
        imgSrc: '/assets/wizard.webp'
      },
      {
        name: 'odlaw',
        imgSrc: '/assets/odlaw.webp'
      },
    ]
  }
]

export default function Home() {
  return (
    <div>

      {levels.map((level, index) =>
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
