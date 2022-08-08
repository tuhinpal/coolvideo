import {Composition, getInputProps} from 'remotion';
import CoolVideo from './CoolVideo';

const inputProps = getInputProps();

export const RemotionVideo = () => {
	let dynamicProps = {
		titleHeading: inputProps?.titleHeading || 'Hi 👋',
		titleSubheading: inputProps?.titleSubheading || "I'm Tuhin Kanti Pal",
		otherTexts: inputProps?.otherTexts || [
			'I am a software engineer',
			'I am a cool lover',
			'I love to code',
		],
		endHeading: inputProps?.endHeading || 'Now Bye!',
	};

	let config = {
		titleDuration: 35,
		otherTextPlusDuration: 10, // extra frame add after otherText's token count
		endDuration: 35,
	};

	let beforeSequenceFrame = config.titleDuration;
	let sequenceBased = dynamicProps.otherTexts.map((text, i) => {
		let thisDuration = text.split(' ').length * 6;
		let toSequenceFrame =
			beforeSequenceFrame + thisDuration + config.otherTextPlusDuration;

		let textConfig = {
			from: beforeSequenceFrame,
			bgColor: i % 2 === 0 ? 'white' : 'black',
			textColor: i % 2 === 0 ? 'black' : 'white',
			heading: text,
			durationInFrames: thisDuration + config.otherTextPlusDuration,
		};
		beforeSequenceFrame = toSequenceFrame;
		return textConfig;
	});

	let endDuration =
		config.titleDuration +
		sequenceBased.reduce((acc, cur) => acc + cur.durationInFrames, 0) +
		config.endDuration;

	return (
		<>
			<Composition
				id="CoolVideo"
				component={CoolVideo}
				durationInFrames={endDuration}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					...dynamicProps,
					config,
					endDuration,
					sequenceBased,
				}}
			/>
		</>
	);
};
