import React, { useState, useEffect, useRef } from 'react';

interface GPTBuilderProps {
  userType: 'admin' | 'medical';
}

const GPTBuilder: React.FC<GPTBuilderProps> = ({ userType }) => {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setVideoStream(stream);
        setAudioStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Erro ao acessar câmera e microfone:', error);
      }
    };

    getMediaDevices();
  }, []);

  const handleDocumentCreation = () => {
    console.log('Iniciando criação de documentos...');
    // Lógica para criação de documentos
  };

  const handleExamAnalysis = () => {
    console.log('Iniciando análise de exames por IA...');
    // Lógica para análise de exames
  };

  const handleResearchProject = () => {
    console.log('Iniciando projeto de pesquisa...');
    // Lógica para gestão de projetos de pesquisa
  };

  return (
    <div>
      <h1>GPT Builder - {userType === 'admin' ? 'Administrador' : 'Médico'}</h1>
      <p>Configure e utilize ferramentas avançadas da Nôa Esperanza.</p>

      {userType === 'medical' && (
        <div>
          <h2>Ferramentas Médicas</h2>
          <button onClick={handleDocumentCreation}>Elaborar Documentos</button>
          <button onClick={handleExamAnalysis}>Análise de Exames</button>
          <button onClick={handleResearchProject}>Projeto de Pesquisa</button>
        </div>
      )}

      {videoStream && (
        <div>
          <h3>Visualização da Câmera</h3>
          <video autoPlay playsInline muted ref={videoRef}></video>
        </div>
      )}

      {audioStream && (
        <div>
          <h3>Áudio Ativo</h3>
          <p>Microfone está ativo.</p>
        </div>
      )}
    </div>
  );
};

export default GPTBuilder;