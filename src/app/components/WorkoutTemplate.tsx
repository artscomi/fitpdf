"use client";

interface ClientInfo {
  name: string;
  age: number;
  weight: number;
  height: number;
  goals: string;
  medicalConditions: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

interface WorkoutProgram {
  exercises: Exercise[];
}

interface WorkoutTemplateProps {
  clientInfo: ClientInfo;
  workoutProgram: WorkoutProgram;
}

export default function WorkoutTemplate({
  clientInfo,
  workoutProgram,
}: WorkoutTemplateProps) {
  return (
    <div className="container mx-auto max-w-[210mm] p-5 bg-white">
      <div className="header bg-[#7159b5] text-white p-8 rounded-[15px] text-center mb-8">
        <h1 className="text-[1.5rem] font-bold mb-2">
          🏋️‍♀️ Programma di Allenamento Personalizzato
        </h1>
        <p className="text-[1.1rem] opacity-90 font-light">
          Creato per {clientInfo.name}
        </p>
      </div>

      {/* Informazioni Cliente */}
      <div className="section mb-10">
        <h2 className="section-title text-[1.5rem] font-semibold mb-5 pb-2 border-b-3 border-[#7159b5]">
          📋 Informazioni Cliente
        </h2>
        <div className="grid grid-cols-2 gap-4 bg-[#f8f9fa] p-5 rounded-[10px]">
          <div>
            <p>
              <strong>Nome:</strong> {clientInfo.name}
            </p>
            <p>
              <strong>Età:</strong> {clientInfo.age} anni
            </p>
            <p>
              <strong>Peso:</strong> {clientInfo.weight} kg
            </p>
            <p>
              <strong>Altezza:</strong> {clientInfo.height} cm
            </p>
          </div>
          <div>
            <p>
              <strong>Obiettivi:</strong>
            </p>
            <p className="text-sm">{clientInfo.goals}</p>
            {clientInfo.medicalConditions && (
              <>
                <p className="mt-2">
                  <strong>Condizioni Mediche:</strong>
                </p>
                <p className="text-sm">{clientInfo.medicalConditions}</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Schema Circuito */}
      <div className="section mb-10">
        <h2 className="section-title text-[1.5rem] font-semibold mb-5 pb-2 border-b-3 border-[#7159b5]">
          📋 Schema del Circuito
        </h2>
        <div className="grid grid-cols-5 gap-3 mb-5">
          {workoutProgram.exercises.map((exercise, index) => (
            <div
              key={index}
              className="bg-[#f8f9fa] rounded-[10px] p-4 text-center border-2 border-[#e9ecef]"
            >
              <div className="bg-[#7159b5] text-white w-[25px] h-[25px] rounded-full flex items-center justify-center font-semibold mx-auto mb-2">
                {index + 1}
              </div>
              <div className="font-medium text-sm">{exercise.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dettagli Esercizi */}
      <div className="section mb-10">
        <h2 className="section-title text-[1.5rem] font-semibold mb-5 pb-2 border-b-3 border-[#7159b5]">
          🎥 Dettagli Esercizi
        </h2>
        {workoutProgram.exercises.map((exercise, index) => (
          <div
            key={index}
            className="bg-[#f8f9fa] rounded-[10px] p-5 mb-5 border-l-4 border-[#7159b5]"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-[#7159b5] text-white w-[40px] h-[40px] rounded-full flex items-center justify-center font-semibold text-lg">
                {index + 1}
              </div>
              <div className="font-semibold text-lg">{exercise.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p>
                  <strong>Serie:</strong> {exercise.sets}
                </p>
                <p>
                  <strong>Ripetizioni:</strong> {exercise.reps}
                </p>
                <p>
                  <strong>Recupero:</strong> {exercise.rest}
                </p>
              </div>
              {exercise.notes && (
                <div>
                  <p>
                    <strong>Note:</strong>
                  </p>
                  <p className="text-sm">{exercise.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Note sulla Sicurezza */}
      <div className="bg-[#7159b5] rounded-[10px] p-5 mb-10">
        <h3 className="text-white text-xl font-semibold mb-4">
          ⚠️ Note Importanti sulla Sicurezza
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-[8px]">
            <h4 className="font-semibold mb-2">🔥 Prima di Iniziare:</h4>
            <ul className="list-none pl-5">
              <li className="mb-1">
                • Riscaldamento: 5-10 minuti di marcia sul posto
              </li>
              <li className="mb-1">
                • Idratazione: Bevi acqua prima, durante e dopo
              </li>
              <li className="mb-1">
                • Respirazione: Non trattenere mai il respiro
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-[8px]">
            <h4 className="font-semibold mb-2">💯 Durante l'Esercizio:</h4>
            <ul className="list-none pl-5">
              <li className="mb-1">
                • Forma prima di tutto: Tecnica corretta sempre
              </li>
              <li className="mb-1">
                • Dolore vs. Fatica: Fermati se senti dolore acuto
              </li>
              <li className="mb-1">
                • Progressione graduale: Aumenta intensità gradualmente
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#7159b5] text-white p-5 rounded-[10px] text-center">
        <p className="text-lg">
          🏆 Ricorda: la costanza è la chiave del successo!
        </p>
      </div>
    </div>
  );
}
