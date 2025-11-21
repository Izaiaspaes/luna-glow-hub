import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useWhisperModel } from "@/hooks/useWhisperModel";

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscription, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  // Use the cached Whisper model
  const { transcriber, isLoadingModel, modelError } = useWhisperModel();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Gravação iniciada. Fale agora!");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Erro ao acessar o microfone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      if (!transcriber) {
        throw new Error('Modelo de transcrição não carregado');
      }

      console.log('Processando áudio localmente...');
      
      // Convert blob to URL for the transcriber
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Transcribe using local Whisper model
      const output = await transcriber(audioUrl, {
        language: 'portuguese',
        task: 'transcribe'
      });

      // Clean up the blob URL
      URL.revokeObjectURL(audioUrl);

      if (output?.text) {
        onTranscription(output.text);
        toast.success("Áudio transcrito com sucesso!");
      } else {
        throw new Error('Nenhuma transcrição retornada');
      }
    } catch (error) {
      console.error('Erro ao processar áudio:', error);
      toast.error("Erro ao processar áudio");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-2">
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={startRecording}
          disabled={disabled || isProcessing || isLoadingModel}
        >
          {isProcessing || isLoadingModel ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          <span className="ml-2">
            {isLoadingModel ? 'Carregando modelo...' : 'Gravar'}
          </span>
        </Button>
      ) : (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={stopRecording}
        >
          <Square className="h-4 w-4" />
          <span className="ml-2">Parar</span>
        </Button>
      )}
    </div>
  );
}
