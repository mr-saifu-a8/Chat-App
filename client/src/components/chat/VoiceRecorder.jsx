// import React, { useState, useEffect, useRef } from "react";
// import { Mic, Square, Send, X } from "lucide-react";

// const VoiceRecorder = ({ onSend, onCancel }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [isStopping, setIsStopping] = useState(false);
//   const [recorder, setRecorder] = useState(null);
//   const timerRef = useRef(null);

//   const startRecording = async () => {
//     try {
//       const context = new (window.AudioContext || window.webkitAudioContext)();
//       await context.resume();
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const source = context.createMediaStreamSource(stream);
//       const processor = context.createScriptProcessor(4096, 1, 1);
//       const audioChunks = [];
//       processor.onaudioprocess = (e) => {
//         const input = e.inputBuffer.getChannelData(0);
//         audioChunks.push(...input);
//       };
//       source.connect(processor);
//       processor.connect(context.destination);
//       setRecorder({ source, processor, stream, audioChunks, context });
//       setIsRecording(true);
//       timerRef.current = setInterval(() => {
//         setDuration((prev) => prev + 1);
//       }, 1000);
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       onCancel();
//     }
//   };

//   const stopRecording = () => {
//     if (recorder) {
//       recorder.source.disconnect();
//       recorder.processor.disconnect();
//       recorder.stream.getTracks().forEach((track) => track.stop());
//       recorder.context.close();
//     }
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//     }
//     setIsRecording(false);
//   };

//   const handleSend = () => {
//     setIsStopping(true);
//     stopRecording();
//     setTimeout(() => {
//       if (recorder && recorder.audioChunks.length > 0) {
//         const wavBlob = audioBufferToWav(
//           recorder.audioChunks,
//           recorder.context.sampleRate,
//         );
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const audioData = reader.result;
//           console.log(
//             "Audio data prepared:",
//             !!audioData,
//             audioData.substring(0, 50),
//           );
//           onSend({
//             audio: audioData,
//             audioDuration: duration,
//           });
//         };
//         reader.onerror = () => {
//           console.error("FileReader error");
//           onCancel();
//         };
//         reader.readAsDataURL(wavBlob);
//       } else {
//         console.error("No audio data available");
//         onCancel();
//       }
//     }, 100);
//   };

//   const handleCancel = () => {
//     stopRecording();
//     onCancel();
//   };

//   useEffect(() => {
//     startRecording();
//     return () => {
//       stopRecording();
//     };
//   }, []);

//   const formatDuration = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   // Function to convert audio buffer to WAV blob
//   const audioBufferToWav = (buffer, sampleRate) => {
//     const length = buffer.length;
//     const arrayBuffer = new ArrayBuffer(44 + length * 2);
//     const view = new DataView(arrayBuffer);
//     const channels = 1;
//     const bitsPerSample = 16;

//     // WAV header
//     const writeString = (offset, string) => {
//       for (let i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i));
//       }
//     };

//     writeString(0, "RIFF");
//     view.setUint32(4, 36 + length * 2, true);
//     writeString(8, "WAVE");
//     writeString(12, "fmt ");
//     view.setUint32(16, 16, true);
//     view.setUint16(20, 1, true);
//     view.setUint16(22, channels, true);
//     view.setUint32(24, sampleRate, true);
//     view.setUint32(28, (sampleRate * channels * bitsPerSample) / 8, true);
//     view.setUint16(32, (channels * bitsPerSample) / 8, true);
//     view.setUint16(34, bitsPerSample, true);
//     writeString(36, "data");
//     view.setUint32(40, length * 2, true);

//     // Convert float to 16-bit PCM
//     let offset = 44;
//     for (let i = 0; i < length; i++) {
//       const sample = Math.max(-1, Math.min(1, buffer[i]));
//       view.setInt16(
//         offset,
//         sample < 0 ? sample * 0x8000 : sample * 0x7fff,
//         true,
//       );
//       offset += 2;
//     }

//     return new Blob([arrayBuffer], { type: "audio/wav" });
//   };

//   return (
//     <div className="flex items-center gap-4 bg-gradient-to-r from-red-500 to-red-600 border border-red-400/50 rounded-2xl px-6 py-4 shadow-lg">
//       <div className="flex items-center gap-3">
//         <div className="flex items-end gap-1">
//           <div
//             className="w-1 bg-white animate-pulse"
//             style={{ height: "10px", animationDelay: "0s" }}
//           ></div>
//           <div
//             className="w-1 bg-white animate-pulse"
//             style={{ height: "20px", animationDelay: "0.1s" }}
//           ></div>
//           <div
//             className="w-1 bg-white animate-pulse"
//             style={{ height: "15px", animationDelay: "0.2s" }}
//           ></div>
//           <div
//             className="w-1 bg-white animate-pulse"
//             style={{ height: "25px", animationDelay: "0.3s" }}
//           ></div>
//           <div
//             className="w-1 bg-white animate-pulse"
//             style={{ height: "18px", animationDelay: "0.4s" }}
//           ></div>
//         </div>
//         <Mic className="w-5 h-5 text-white" />
//         <span className="text-white text-sm font-medium">Recording...</span>
//         <span className="text-white/80 text-sm font-mono">
//           {formatDuration(duration)}
//         </span>
//       </div>

//       <div className="flex items-center gap-3 ml-auto">
//         <button
//           onClick={handleCancel}
//           className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-medium transition-colors flex items-center gap-2"
//         >
//           <X className="w-4 h-4" />
//           Cancel
//         </button>

//         <button
//           onClick={handleSend}
//           className="px-4 py-2 rounded-lg bg-white hover:bg-gray-100 text-red-600 font-medium transition-colors flex items-center gap-2"
//         >
//           <Send className="w-4 h-4" />
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default VoiceRecorder;

import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, X } from "lucide-react";

const VoiceRecorder = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isStopping, setIsStopping] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [barHeights, setBarHeights] = useState(Array(28).fill(3));
  const timerRef = useRef(null);
  const animRef = useRef(null);

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
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
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
          onSend({ audio: audioData, audioDuration: duration });
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

  // Animate waveform bars
  useEffect(() => {
    let frame = 0;
    const animate = () => {
      frame++;
      setBarHeights((prev) =>
        prev.map((_, i) => {
          const wave =
            Math.sin(frame * 0.08 + i * 0.6) * 10 +
            Math.sin(frame * 0.13 + i * 0.4) * 8 +
            Math.random() * 6 +
            4;
          return Math.max(3, Math.min(32, wave));
        }),
      );
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    startRecording();
    return () => stopRecording();
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const audioBufferToWav = (buffer, sampleRate) => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channels = 1;
    const bitsPerSample = 16;
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++)
        view.setUint8(offset + i, string.charCodeAt(i));
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        /* ── Base (mobile-first) ── */
        .vr-root {
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
          background: linear-gradient(135deg, #0f0f14 0%, #1a1a24 100%);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 11px 13px;
          box-shadow:
            0 0 0 1px rgba(239,68,68,0.15),
            0 8px 32px rgba(0,0,0,0.45),
            inset 0 1px 0 rgba(255,255,255,0.05);
          position: relative;
          overflow: hidden;
        }

        .vr-root::before {
          content: '';
          position: absolute;
          top: -40px; left: -40px;
          width: 120px; height: 120px;
          background: radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Pulse dot */
        .vr-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 0 0 rgba(239,68,68,0.6);
          animation: vr-pulse-ring 1.4s ease-out infinite;
          flex-shrink: 0;
        }

        @keyframes vr-pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
          70%  { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }

        /* REC label — hidden on xs, shown on sm+ */
        .vr-label {
          display: none;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #ef4444;
          opacity: 0.9;
          flex-shrink: 0;
        }

        /* Timer */
        .vr-timer {
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          font-weight: 500;
          color: #f5f5f5;
          letter-spacing: 0.04em;
          min-width: 34px;
          text-align: center;
          flex-shrink: 0;
        }

        /* Waveform — fills remaining space, clips gracefully */
        .vr-waveform {
          display: flex;
          align-items: center;
          gap: 2px;
          height: 34px;
          flex: 1;
          min-width: 0;
          overflow: hidden;
        }

        .vr-bar {
          width: 3px;
          min-width: 3px;
          border-radius: 2px;
          background: linear-gradient(to top, rgba(239,68,68,0.9), rgba(251,113,133,0.6));
          transition: height 0.07s ease;
          flex-shrink: 0;
        }

        /* Divider */
        .vr-divider {
          width: 1px;
          height: 26px;
          background: rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        /* Buttons — icon-only on mobile */
        .vr-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 9px;
          border-radius: 11px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          flex-shrink: 0;
          letter-spacing: 0.01em;
          /* Minimum tap target */
          min-width: 38px;
          min-height: 38px;
        }

        .vr-btn-text {
          display: none;
        }

        .vr-btn-cancel {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.55);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .vr-btn-cancel:hover {
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          border-color: rgba(255,255,255,0.15);
        }
        .vr-btn-cancel:active {
          background: rgba(255,255,255,0.14);
        }

        .vr-btn-send {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 4px 14px rgba(239,68,68,0.35);
        }
        .vr-btn-send:hover {
          background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
          box-shadow: 0 4px 20px rgba(239,68,68,0.55);
          transform: translateY(-1px);
        }
        .vr-btn-send:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(239,68,68,0.3);
        }

        /* ── Small phones and up (≥360px) ── */
        @media (min-width: 360px) {
          .vr-root { gap: 11px; padding: 12px 14px; }
        }

        /* ── Tablets / large phones landscape (≥520px) ── */
        @media (min-width: 520px) {
          .vr-root { gap: 14px; padding: 13px 16px; border-radius: 20px; }
          .vr-label { display: inline; }
          .vr-timer { font-size: 15px; }
          .vr-waveform { gap: 2.5px; height: 36px; }
          .vr-btn { gap: 7px; padding: 9px 15px; }
          .vr-btn-text { display: inline; }
        }

        /* ── Desktop (≥768px) ── */
        @media (min-width: 768px) {
          .vr-root { gap: 16px; padding: 14px 18px; }
          .vr-btn { padding: 9px 16px; }
        }
      `}</style>

      <div className="vr-root">
        {/* Pulse dot + REC label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            flexShrink: 0,
          }}
        >
          <div className="vr-pulse-dot" />
          <span className="vr-label">Rec</span>
        </div>

        {/* Timer */}
        <span className="vr-timer">{formatDuration(duration)}</span>

        {/* Waveform — bars render but overflow is hidden on small screens */}
        <div className="vr-waveform">
          {barHeights.map((h, i) => (
            <div key={i} className="vr-bar" style={{ height: `${h}px` }} />
          ))}
        </div>

        <div className="vr-divider" />

        {/* Cancel — icon on mobile, icon+text on ≥520px */}
        <button className="vr-btn vr-btn-cancel" onClick={handleCancel}>
          <X size={14} strokeWidth={2.5} />
          <span className="vr-btn-text">Cancel</span>
        </button>

        {/* Send — icon on mobile, icon+text on ≥520px */}
        <button className="vr-btn vr-btn-send" onClick={handleSend}>
          <Send size={14} strokeWidth={2.5} />
          <span className="vr-btn-text">Send</span>
        </button>
      </div>
    </>
  );
};

export default VoiceRecorder;