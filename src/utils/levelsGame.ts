const levelsGame = [
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

function getLevel(id: number) {
	return (
		levelsGame[id]
	);
}

export {levelsGame, getLevel};