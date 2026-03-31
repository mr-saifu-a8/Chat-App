import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, Square, Send, X } from "lucide-react";

const VoiceRecorder = ({ onSend, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isStoppingForSend, setIsStoppingForSend] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Try different MIME types for better compatibility
      const mimeTypes = ["audio/webm", "audio/mp4", "audio/wav", "audio/ogg"];
      let selectedMimeType = "";
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: selectedMimeType || undefined,
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: selectedMimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (isStoppingForSend) {
          setIsStoppingForSend(false);
          if (blob && blob.size > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const audioData = reader.result;
              console.log(
                "Audio data prepared:",
                !!audioData,
                audioData?.substring(0, 50),
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
            reader.readAsDataURL(blob);
          } else {
            console.error("No audio data available", blob);
            onCancel();
          }
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      onCancel();
    }
  }, [onCancel]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  }, []);

  const handleSend = () => {
    setIsStoppingForSend(true);
    stopRecording();
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
  }, [startRecording, stopRecording]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
