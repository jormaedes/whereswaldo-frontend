import Link from "next/link";

export default function Header() {

	return (
		<header className="site-header">
			<div className="site-header__inner">
				<Link className="brand-lockup" href="/" aria-label="Where's Waldo home">
					<span className="brand-mark" aria-hidden="true">W</span>
					<span>
						<span className="brand-name">Where&apos;s Waldo?</span>
						<span className="brand-caption">The great search</span>
					</span>
				</Link>
				<span className="header-note">Keep your eyes open</span>
			</div>
		</header>
	)
}