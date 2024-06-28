"use client";
import { title } from "@/components/primitives";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import { motion } from 'framer-motion';

// Uncomment these imports and implement their functionalities
import AudioContext from "../../contexts/AudioContext";
import autoCorrelate from "../../libs/AutoCorrelate";
import {
  noteFromPitch,
  centsOffFromPitch,
  getDetunePercent,
} from "../../libs/Helpers";

const audioCtx = AudioContext.getAudioContext();
const analyserNode = AudioContext.getAnalyser();
const buflen = 2048;
var buf = new Float32Array(buflen);

const noteStrings = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

var lineGuitar = {
  "D": false,
  "A": true,
  "E": false,
  "G": false,
  "B": false,
  "E": false,
}

export default function Turner() {
  const [source, setSource] = useState<MediaStreamAudioSourceNode | null>(null);
  const [started, setStart] = useState(false);
  const [pitchNote, setPitchNote] = useState("C");
  const [pitchScale, setPitchScale] = useState("4");
  const [pitch, setPitch] = useState("0 Hz");
  const [detune, setDetune] = useState("0");
  const [notification, setNotification] = useState(false);

  const updatePitch = (time:any) => {
    analyserNode.getFloatTimeDomainData(buf);
    var ac = autoCorrelate(buf, audioCtx.sampleRate);
    if (ac > -1) {
      let note = noteFromPitch(ac);
      let sym = noteStrings[note % 12];
      let scl = Math.floor(note / 12) - 1;
      let dtune = centsOffFromPitch(ac, note);
      setPitch(parseFloat(ac).toFixed(2) + " Hz");
      setPitchNote(sym);
      setPitchScale(scl);
      setDetune(dtune);
      setNotification(false);
      // console.log(note, sym, scl, dtune, ac);
    }
  };

  useEffect(() => {
    if (source != null) {
      source.connect(analyserNode);
    }
  }, [source]);

  setInterval(updatePitch, 1);

  const start = async () => {
    const input = await getMicInput();

    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    setStart(true);
    setNotification(true);
    setTimeout(() => setNotification(false), 5000);
    setSource(audioCtx.createMediaStreamSource(input));
  };

  const stop = () => {
    source.disconnect(analyserNode);
    setStart(false);
  };

  const getMicInput = () => {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0,
      },
    });
  };

  return (
    <motion.div 
      className="gap-4 mt-8"
      initial={{ opacity: 0,}}
      animate={{ opacity: 2,}}
      transition={{ duration: 0.5 }}
    >
      <h1 className={title()}>Pitch </h1>
      <br />
      <p className={`mt-12 text-7xl font-black`}>{pitchNote} .</p>
      <p>{pitch}</p>
      <div className="mt-8">
        <Tabs color="primary" radius="full" selectedKey={pitchNote}> 
          {Object.keys(lineGuitar).map((note, index) => (
            <Tab key={index} title={note}/>
          ))}
        </Tabs>
      </div>
      {!started ? (
          <button
            className="bg-red-600 text-white w-20 h-20 rounded-full shadow-xl transition-all mt-8"
            onClick={start}
          >
            Start
          </button>
        ) : (
          <button
            className="bg-red-800 text-white w-20 h-20 rounded-full shadow-xl transition-all mt-8"
            onClick={stop}
          >
            Stop
          </button>
        )}
    </motion.div>
  );
}
