import React, { useState, useEffect } from "react";
import "./WorkoutTemplate.css";
import { Exercise } from "./TrainerForm";
import Image from "next/image";

interface WorkoutTemplateProps {
  exercises: Exercise[];
  clientInfo?: {
    name?: string;
    age?: number;
    weight?: number;
    height?: number;
    goals?: string;
    medicalConditions?: string;
  };
}

const WorkoutTemplate: React.FC<WorkoutTemplateProps> = ({
  exercises,
  clientInfo,
}) => {
  const [thumbnailBase64, setThumbnailBase64] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const loadThumbnails = async () => {
      const newThumbnails: { [key: string]: string } = {};
      for (const exercise of exercises) {
        if (exercise.videoUrl) {
          const base64 = await convertImageToBase64(
            getThumbnailUrl(exercise.videoUrl)
          );
          newThumbnails[exercise.videoUrl] = base64;
        }
      }
      setThumbnailBase64(newThumbnails);
    };

    loadThumbnails();
  }, [exercises]);

  return (
    <div>
      <div className="header">
        <h1>🏋️‍♀️ Guida Completa Workout Casa</h1>
        <p>Circuito personalizzato per {clientInfo?.name}</p>
      </div>

      {clientInfo?.name && (
        <div className="client-info">
          <h2 className="section-title">👤 Informazioni Cliente</h2>
          <div className="client-details">
            {clientInfo.name && (
              <div>
                <strong>Nome:</strong> {clientInfo.name}
              </div>
            )}
            {clientInfo.age && (
              <div>
                <strong>Età:</strong> {clientInfo.age} anni
              </div>
            )}
            {clientInfo.weight && (
              <div>
                <strong>Peso:</strong> {clientInfo.weight} kg
              </div>
            )}
            {clientInfo.height && (
              <div>
                <strong>Altezza:</strong> {clientInfo.height} cm
              </div>
            )}
          </div>
          {(clientInfo?.goals || clientInfo?.medicalConditions) && (
            <div className="full-width-info">
              {clientInfo.goals && (
                <div>
                  <strong>Obiettivi:</strong>
                  <p>{clientInfo.goals}</p>
                </div>
              )}
              {clientInfo.medicalConditions && (
                <div>
                  <strong>Condizioni Mediche:</strong>
                  <p>{clientInfo.medicalConditions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Schema Circuito */}
      <div className="section">
        <h2 className="section-title">📋 Schema del Circuito</h2>
        <div className="circuit-grid">
          {exercises.map((exercise, index) => (
            <div key={index} className="exercise-card">
              <div className="exercise-number">{index + 1}</div>
              <div className="exercise-name">{exercise.name}</div>
            </div>
          ))}
        </div>

        <div className="highlight">
          ⏱ Recupero tra esercizi: 1 minuto e 30 secondi
        </div>
      </div>

      {/* Progressione */}
      <div className="section">
        <h2 className="section-title">📊 Progressione Settimanale</h2>
        <div className="progression-table">
          <div className="table-header">
            <span>Settimana</span>
            <span>Serie</span>
            <span>Ripetizioni</span>
            <span>Note</span>
          </div>
          <div className="table-row">
            <span>
              <strong>1-2</strong>
            </span>
            <span>2</span>
            <span>10</span>
            <span>Focus sulla tecnica corretta</span>
          </div>
          <div className="table-row">
            <span>
              <strong>3</strong>
            </span>
            <span>2</span>
            <span>15</span>
            <span>Aumenta le ripetizioni</span>
          </div>
          <div className="table-row">
            <span>
              <strong>4+</strong>
            </span>
            <span>3</span>
            <span>15</span>
            <span>Aggiunge una serie extra</span>
          </div>
        </div>
      </div>

      {/* Esercizi Dettagliati */}
      <div className="section">
        <h2 className="section-title">🎥 Esercizi con Video Tutorial</h2>

        {exercises.map((exercise, index) => (
          <div key={index} className="exercise-detail">
            <div className="exercise-header">
              <div className="exercise-icon">{index + 1}</div>
              <div className="exercise-title">{exercise.name}</div>
            </div>
            {(exercise.sets || exercise.reps || exercise.rest) && (
              <div className="exercise-details">
                {exercise.sets && <span>Serie: {exercise.sets}</span>}
                {exercise.reps && <span>Ripetizioni: {exercise.reps}</span>}
                {exercise.rest && <span>Recupero: {exercise.rest}</span>}
              </div>
            )}

            {exercise.videoUrl && (
              <div className="video-section">
                <div className="video-title">📺 Video di riferimento:</div>
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-thumbnail-container"
                >
                  <Image
                    src={
                      thumbnailBase64[exercise.videoUrl] ||
                      "/images/video-placeholder.jpg"
                    }
                    alt={exercise.name}
                    width={480}
                    height={360}
                    style={{
                      width: "100%",
                      maxWidth: "480px",
                      borderRadius: "8px",
                      height: "auto",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/video-placeholder.jpg";
                    }}
                  />
                  <div className="play-button">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z" fill="#FFFFFF" />
                    </svg>
                  </div>
                </a>
              </div>
            )}

            {exercise.notes && (
              <div className="execution-section">
                <div className="execution-title">Note:</div>
                <p>{exercise.notes}</p>
              </div>
            )}

            {exercise.muscleGroup && (
              <div className="muscles">💪 {exercise.muscleGroup}</div>
            )}
          </div>
        ))}
      </div>

      {/* Sicurezza */}
      <div className="safety-section">
        <h3 className="safety-title">⚠️ Note Importanti sulla Sicurezza</h3>
        <div className="safety-grid">
          {safetyItems.map((item, index) => (
            <div key={index} className="safety-item">
              <h4>{item.title}</h4>
              <ul>
                {item.points.map((point, pointIndex) => (
                  <li key={pointIndex}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Piano di Progressione */}
      <div className="progression-plan">
        <h3 className="progression-title">
          🏆 Piano di Progressione a Lungo Termine
        </h3>

        {progressionItems.map((item, index) => (
          <div key={index} className="progression-item">
            <h4>{item.title}</h4>
            <ul>
              {item.points.map((point, pointIndex) => (
                <li key={pointIndex}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Camminate Veloce */}
      <div className="progression-plan">
        <h3 className="progression-title">
          🚶‍♀️ Attività Complementare: Camminata Veloce
        </h3>

        {walkingItems.map((item, index) => (
          <div key={index} className="progression-item">
            <h4>{item.title}</h4>
            <ul>
              {item.points.map((point, pointIndex) => (
                <li key={pointIndex}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="highlight">
        🏆 Ricorda: la costanza è la chiave del successo! Programma di
        allenamento per circuito casalingo.
      </div>
    </div>
  );
};

// Helper function to get YouTube thumbnail URL
const getThumbnailUrl = (videoUrl: string): string => {
  const videoId = videoUrl.split("v=")[1]?.split("&")[0];
  if (!videoId) return "/images/video-placeholder.jpg";
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return "/images/video-placeholder.jpg";
  }
};

// Safety items data
const safetyItems = [
  {
    title: "🔥 Prima di Iniziare:",
    points: [
      "Riscaldamento: 5-10 minuti di marcia sul posto",
      "Idratazione: Bevi acqua prima, durante e dopo",
      "Respirazione: Non trattenere mai il respiro",
    ],
  },
  {
    title: "💯 Durante l'Esercizio:",
    points: [
      "Forma prima di tutto: Tecnica corretta sempre",
      "Dolore vs. Fatica: Fermati se senti dolore acuto",
      "Progressione graduale: Aumenta intensità gradualmente",
    ],
  },
  {
    title: "🧘‍♀️ Dopo l'Allenamento:",
    points: [
      "Stretching: 5-10 minuti di allungamento",
      "Recupero: Rispetta i giorni di riposo",
      "Monitoraggio: Tieni traccia dei progressi",
    ],
  },
];

// Progression items data
const progressionItems = [
  {
    title: "Mesi 1-2: Fondamenta",
    points: [
      "Focus sulla tecnica corretta",
      "Costruzione della resistenza base",
      "Abitudine all'allenamento regolare",
    ],
  },
  {
    title: "Mesi 3-4: Sviluppo",
    points: [
      "Aumento delle ripetizioni",
      "Introduzione di varianti più impegnative",
      "Miglioramento della forza",
    ],
  },
  {
    title: "Mesi 5+: Perfezionamento",
    points: [
      "Combinazioni di esercizi più complesse",
      "Tempi di recupero ridotti",
      "Introduzione di nuove sfide",
    ],
  },
];

// Walking items data
const walkingItems = [
  {
    title: "Programma Settimanale",
    points: [
      "3 giorni a settimana nei giorni di riposo dall'allenamento",
      "Durata: 50 minuti per sessione",
      "Velocità: 5-6 km/h (passo sostenuto)",
      "Orario consigliato: mattina o tardo pomeriggio",
    ],
  },
  {
    title: "Benefici",
    points: [
      "Migliora la circolazione e la salute cardiovascolare",
      "Aiuta il recupero muscolare",
      "Mantiene attivo il metabolismo",
      "Supporta la perdita di peso",
    ],
  },
  {
    title: "Consigli",
    points: [
      "Indossa scarpe comode e adatte alla camminata",
      "Mantieni una postura corretta durante la camminata",
      "Idratati prima, durante e dopo l'attività",
      "Usa un'app o un contapassi per monitorare la velocità",
    ],
  },
];

export default WorkoutTemplate;
