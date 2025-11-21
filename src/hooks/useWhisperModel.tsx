import { useState, useEffect, useRef } from 'react';
import { pipeline, env } from '@huggingface/transformers';
import { toast } from 'sonner';

// Global model instance shared across all components
let globalTranscriber: any = null;
let loadingPromise: Promise<any> | null = null;

export function useWhisperModel() {
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const transcriberRef = useRef<any>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // If model is already loaded globally, use it
        if (globalTranscriber) {
          transcriberRef.current = globalTranscriber;
          setIsLoadingModel(false);
          console.log('Usando modelo Whisper já carregado do cache global');
          return;
        }

        // If loading is in progress, wait for it
        if (loadingPromise) {
          transcriberRef.current = await loadingPromise;
          globalTranscriber = transcriberRef.current;
          setIsLoadingModel(false);
          console.log('Modelo Whisper carregado da promise em andamento');
          return;
        }

        // Configure transformers.js for optimal caching
        env.allowLocalModels = false;
        env.useBrowserCache = true;
        env.cacheDir = 'whisper-cache';

        // Check if model was downloaded before
        const modelCached = localStorage.getItem('whisper_model_cached');
        if (modelCached) {
          console.log('Carregando modelo Whisper do cache do navegador...');
        } else {
          console.log('Baixando modelo Whisper pela primeira vez (será cacheado)...');
          toast.info('Baixando modelo de transcrição (apenas na primeira vez)');
        }

        // Start loading and store the promise
        loadingPromise = pipeline(
          "automatic-speech-recognition",
          "onnx-community/whisper-tiny",
          { 
            device: "webgpu",
            dtype: "fp16"
          }
        );

        transcriberRef.current = await loadingPromise;
        globalTranscriber = transcriberRef.current;

        // Mark model as cached
        localStorage.setItem('whisper_model_cached', 'true');
        localStorage.setItem('whisper_model_cached_at', new Date().toISOString());

        console.log('Modelo Whisper carregado e cacheado com sucesso!');
        setIsLoadingModel(false);
        loadingPromise = null;

      } catch (error) {
        console.error('Erro ao carregar modelo:', error);
        setModelError('Erro ao carregar modelo de transcrição');
        toast.error("Erro ao carregar modelo de transcrição");
        setIsLoadingModel(false);
        loadingPromise = null;
      }
    };

    loadModel();
  }, []);

  return {
    transcriber: transcriberRef.current,
    isLoadingModel,
    modelError
  };
}
