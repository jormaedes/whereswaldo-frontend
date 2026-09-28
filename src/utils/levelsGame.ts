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
  },
  {
	imgSrc: '/assets/img2.webp',
	characters: [
	  {
		name: 'waldo',
		imgSrc: '/assets/waldo.webp'
	  },
	]
  },
  {
	imgSrc: '/assets/img3.webp',
	characters: [
	  {
		name: 'waldo',
		imgSrc: '/assets/waldo.webp'
	  },
	]
  },
]

function getLevel(id: number) {
	return (
		levelsGame[id]
	);
}

export {levelsGame, getLevel};