import { Sequence, Audio } from "remotion";
import DisplayText from "./CoolVideo/DisplayText";
import coolAudio from "./coolAudio.mp3";

export default function CoolVideo({
  config,
  titleHeading,
  titleSubheading,
  endHeading,
  endDuration,
  sequenceBased,
}) {
  let lastSequence = sequenceBased[sequenceBased.length - 1];

  return (
    <div style={{ flex: 1 }}>
      <Sequence from={0} durationInFrames={config.titleDuration}>
        <DisplayText
          heading={titleHeading}
          bgColor={"black"}
          textColor={"white"}
          subheading={titleSubheading}
        />
      </Sequence>

      {sequenceBased.map((seq) => (
        <Sequence from={seq.from} durationInFrames={seq.durationInFrames}>
          <DisplayText
            heading={seq.heading}
            bgColor={seq.bgColor}
            textColor={seq.textColor}
          />
        </Sequence>
      ))}

      <Sequence
        from={lastSequence.from + lastSequence.durationInFrames}
        durationInFrames={config.endDuration}
      >
        <DisplayText
          heading={endHeading}
          bgColor={lastSequence.bgColor === "white" ? "black" : "white"}
          textColor={lastSequence.bgColor === "white" ? "white" : "black"}
        />
      </Sequence>

      <Audio src={coolAudio} startFrom={0} endAt={endDuration} />
    </div>
  );
}
