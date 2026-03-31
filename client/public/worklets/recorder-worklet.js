class RecorderWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffers = [];
    this.port.onmessage = (e) => {
      if (e.data === "stop") {
        this.port.postMessage(this.buffers);
        this.buffers = [];
      }
    };
  }

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0) {
      const channelData = input[0];
      this.buffers.push(new Float32Array(channelData));
    }
    return true;
  }
}

registerProcessor("recorder-worklet", RecorderWorklet);
