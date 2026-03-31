import React, { useState, useEffect, useRef } from "react";
import { Mic, Square, Send, X } from "lucide-react";

const VoiceRecorder = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      await context.resume();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(4096, 1, 1);
      const audioChunks = [];
      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        audioChunks.push(...input);
      };
      source.connect(processor);
      processor.connect(context.destination);
      setRecorder({ source, processor, stream, audioChunks, context });
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      onCancel();
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.source.disconnect();
      recorder.processor.disconnect();
      recorder.stream.getTracks().forEach((track) => track.stop());
      recorder.context.close();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const handleSend = () => {
    setIsStopping(true);
    stopRecording();
    setTimeout(() => {
      if (recorder && recorder.audioChunks.length > 0) {
        const wavBlob = audioBufferToWav(
          recorder.audioChunks,
          recorder.context.sampleRate,
        );
        const reader = new FileReader();
        reader.onloadend = () => {
          const audioData = reader.result;
          console.log(
            "Audio data prepared:",
            !!audioData,
            audioData.substring(0, 50),
          );
          onSend({
            audio: audioData,
            audioDuration: duration,
          });
        };
        reader.onerror = () => {
          console.error("FileReader error");
          onCancel();
        };
        reader.readAsDataURL(wavBlob);
      } else {
        console.error("No audio data available");
        onCancel();
      }
    }, 100);
  };

  const handleCancel = () => {
    stopRecording();
    onCancel();
  };

  useEffect(() => {
    startRecording();
    return () => {
      stopRecording();
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Function to convert audio buffer to WAV blob
  const audioBufferToWav = (buffer, sampleRate) => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channels = 1;
    const bitsPerSample = 16;

    // WAV header
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, (sampleRate * channels * bitsPerSample) / 8, true);
    view.setUint16(32, (channels * bitsPerSample) / 8, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, "data");
    view.setUint32(40, length * 2, true);

    // Convert float to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true,
      );
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: "audio/wav" });
  };

  return (
    <div className="flex-1 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <Mic className="w-4 h-4 text-red-400" />
        <span className="text-white/70 text-sm font-mono">
          {formatDuration(duration)}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={handleCancel}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-white/70" />
        </button>

        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VoiceRecorder;
