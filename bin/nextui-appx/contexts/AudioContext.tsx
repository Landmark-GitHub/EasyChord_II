const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
let analyser = audioCtx.createAnalyser();
analyser.fftSize = 2048;

const AudioContext = {
  getAudioContext(): AudioContext {
    return audioCtx;
  },

  getAnalyser(): AnalyserNode {
    return analyser;
  },

  resetAnalyser(): void {
    analyser = audioCtx.createAnalyser();
  },

  decodeAudioData(audioData: ArrayBuffer): Promise<AudioBuffer> {
    return audioCtx.decodeAudioData(audioData);
  },
};

export default AudioContext;

