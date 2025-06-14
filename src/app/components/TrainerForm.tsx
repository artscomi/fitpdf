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
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Informazioni Cliente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Esercizi</h2>
              <div className="space-y-6">
                {formData.exercises.map((exercise, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">
                      Esercizio {index + 1}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className={`bg-[#7159b5] text-white px-6 py-2 rounded-lg transition-colors ${
                  isGenerating
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#5a4a8f]"
                }`}
              >
                {isGenerating ? "Generazione PDF..." : "Genera PDF"}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <h2 className="text-2xl font-bold mb-4">Anteprima</h2>
            <div
              className="overflow-y-auto h-[calc(100%-4rem)]"
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
