export default function Header() {

	return (
		<header className="border-b py-2 px-2 sm:px-0">
			<div className="container mx-auto">

				<h1
					className="flex items-center gap-1"
				>
					<span className="w-10 h-10 bg-white flex items-center justify-center text-black rounded-full font-bold">WW</span>
					<span className="text-xl font-bold">Where's Waldo</span>
				</h1>
			</div>
		</header>
	)
}