"use client";

import { useState, useRef } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import WorkoutTemplate from "./WorkoutTemplate";
import { generatePDF } from "../utils/pdfGenerator";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

interface FormData {
  clientName: string;
  clientAge: string;
  clientWeight: string;
  clientHeight: string;
  clientGoals: string;
  medicalConditions: string;
  exercises: Exercise[];
}

export default function TrainerForm() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    clientAge: "",
    clientWeight: "",
    clientHeight: "",
    clientGoals: "",
    medicalConditions: "",
    exercises: [
      { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
      { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
      { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
      { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
      { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
      { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExerciseChange = (
    index: number,
    field: keyof Exercise,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, i) =>
        i === index ? { ...exercise, [field]: value } : exercise
      ),
    }));
  };

  const addExercise = () => {
    setFormData((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", sets: 3, reps: "10", rest: "1'30", notes: "" },
      ],
    }));
  };

  const removeExercise = (index: number) => {
    if (formData.exercises.length <= 1) {
      alert("Deve esserci almeno un esercizio nel programma");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!previewRef.current) {
      console.error("Preview element not found");
      return;
    }

    if (!formData.clientName) {
      alert("Per favore, inserisci il nome del cliente");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Starting PDF generation process...");
      const filename = `workout-program-${formData.clientName
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      // Aspetta un momento per assicurarsi che il DOM sia completamente renderizzato
      await new Promise((resolve) => setTimeout(resolve, 100));

      const success = await generatePDF(previewRef.current, filename);

      if (!success) {
        throw new Error("PDF generation failed");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert(
        "Si è verificato un errore durante la generazione del PDF. Riprova più tardi."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
        {/* Form Section */}
        <div className="space-y-4 lg:space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Informazioni Cliente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <TextInput
                  label="Nome Cliente"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
                <TextInput
                  label="Età"
                  name="clientAge"
                  type="number"
                  value={formData.clientAge}
                  onChange={handleInputChange}
                  required
                />
                <TextInput
                  label="Peso (kg)"
                  name="clientWeight"
                  type="number"
                  value={formData.clientWeight}
                  onChange={handleInputChange}
                  required
                />
                <TextInput
                  label="Altezza (cm)"
                  name="clientHeight"
                  type="number"
                  value={formData.clientHeight}
                  onChange={handleInputChange}
                  required
                />
                <div className="md:col-span-2">
                  <TextArea
                    label="Obiettivi"
                    name="clientGoals"
                    value={formData.clientGoals}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <TextArea
                    label="Condizioni Mediche"
                    name="medicalConditions"
                    value={formData.medicalConditions}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Esercizi</h2>
              <div className="space-y-4 lg:space-y-6">
                {formData.exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="border p-3 sm:p-4 rounded-lg relative"
                  >
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <h3 className="text-base sm:text-lg font-semibold">
                        Esercizio {index + 1}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1 cursor-pointer"
                        title="Rimuovi esercizio"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <TextInput
                        label="Nome Esercizio"
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseChange(index, "name", e.target.value)
                        }
                        required
                      />
                      <TextInput
                        label="Serie"
                        type="number"
                        value={exercise.sets}
                        onChange={(e) =>
                          handleExerciseChange(
                            index,
                            "sets",
                            parseInt(e.target.value)
                          )
                        }
                        required
                      />
                      <TextInput
                        label="Ripetizioni"
                        value={exercise.reps}
                        onChange={(e) =>
                          handleExerciseChange(index, "reps", e.target.value)
                        }
                        required
                      />
                      <TextInput
                        label="Recupero"
                        value={exercise.rest}
                        onChange={(e) =>
                          handleExerciseChange(index, "rest", e.target.value)
                        }
                        required
                      />
                      <div className="md:col-span-2">
                        <TextArea
                          label="Note"
                          value={exercise.notes}
                          onChange={(e) =>
                            handleExerciseChange(index, "notes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addExercise}
                    className="bg-[#7159b5] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#5a4a8f] transition-colors border-2 border-dashed border-[#7159b5] hover:border-[#5a4a8f] cursor-pointer"
                  >
                    + Aggiungi Esercizio
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full bg-[#7159b5] text-white px-4 my-3 sm:px-6 py-3 rounded-lg transition-colors cursor-pointer text-sm sm:text-base ${
                isGenerating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#5a4a8f]"
              }`}
            >
              {isGenerating ? "Generazione PDF..." : "Genera PDF"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="bg-white p-2 sm:p-3 rounded-lg shadow-md h-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
              Anteprima
            </h2>
            <div
              className="overflow-y-auto h-[calc(100%-3rem)]"
              ref={previewRef}
              id="pdf-preview"
            >
              <WorkoutTemplate
                clientInfo={{
                  name: formData.clientName,
                  age: parseInt(formData.clientAge) || 0,
                  weight: parseInt(formData.clientWeight) || 0,
                  height: parseInt(formData.clientHeight) || 0,
                  goals: formData.clientGoals,
                  medicalConditions: formData.medicalConditions,
                }}
                workoutProgram={{
                  exercises: formData.exercises,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
