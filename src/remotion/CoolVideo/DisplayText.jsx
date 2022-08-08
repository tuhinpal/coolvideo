import {spring, useCurrentFrame, useVideoConfig} from 'remotion';

export default function DisplayText({heading, subheading, textColor, bgColor}) {
	const videoConfig = useVideoConfig();
	const frame = useCurrentFrame();
	const headingText = heading.split(' ').map((t) => ` ${t} `);

	let subheadingText = [];
	if (subheading) {
		subheadingText = subheading.split(' ').map((t) => ` ${t} `);
	}

	return (
		<div
			style={{
				backgroundColor: bgColor,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
			}}
		>
			<h1
				style={{
					fontFamily: 'SF Pro Text, Helvetica, Arial',
					fontWeight: 'bold',
					fontSize: 100,
					textAlign: 'center',
				}}
			>
				{headingText.map((t, i) => {
					return (
						<span
							key={t}
							style={{
								color: textColor,
								marginLeft: 10,
								marginRight: 10,
								transform: `scale(${spring({
									fps: videoConfig.fps,
									frame: frame - i * 5,
									config: {
										damping: 100,
										stiffness: 200,
										mass: 0.5,
									},
								})})`,
								display: 'inline-block',
							}}
						>
							{t}
						</span>
					);
				})}
			</h1>

			{subheadingText.length > 0 && headingText.length * 6 < frame && (
				<h2
					style={{
						fontFamily: 'SF Pro Text, Helvetica, Arial',
						fontSize: 60,
						textAlign: 'center',
						marginTop: -45,
					}}
				>
					{subheadingText.map((t, i) => {
						return (
							<span
								key={t}
								style={{
									color: textColor,
									marginLeft: 10,
									marginRight: 10,
									transform: `scale(${spring({
										fps: videoConfig.fps,
										frame: frame - i * 5,
										config: {
											damping: 100,
											stiffness: 200,
											mass: 0.5,
										},
									})})`,
									display: 'inline-block',
								}}
							>
								{t}
							</span>
						);
					})}
				</h2>
			)}
		</div>
	);
}
