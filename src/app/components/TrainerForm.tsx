"use client";

import { useState, useRef } from "react";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import WorkoutTemplate from "./WorkoutTemplate";
import { generatePDF } from "../utils/pdfGenerator";

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  rest?: string;
  notes?: string;
  videoUrl?: string;
  muscleGroup?: string;
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

interface FormErrors {
  clientName?: string;
  clientAge?: string;
  clientWeight?: string;
  clientHeight?: string;
  clientGoals?: string;
  exercises?: { [key: number]: { name?: string } };
}

export default function TrainerForm() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showMedicalConditions, setShowMedicalConditions] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    clientAge: "",
    clientWeight: "",
    clientHeight: "",
    clientGoals: "",
    medicalConditions: "",
    exercises: [
      {
        name: "Squat",
        sets: 3,
        reps: "10",
        rest: "1'30",
        notes:
          "Mantieni la schiena dritta e le ginocchia allineate con le punte dei piedi",
        videoUrl: "",
        muscleGroup: "Quadricipiti • Glutei • Femorali • Polpacci",
      },
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

    // Validazione immediata per i campi numerici
    const newErrors = { ...errors };

    if (name === "clientAge") {
      if (!value.trim()) {
        newErrors.clientAge = "L'età è obbligatoria";
      } else {
        const age = parseInt(value);
        if (isNaN(age)) {
          newErrors.clientAge = "L'età deve essere un numero";
        } else if (age < 16) {
          newErrors.clientAge = "L'età minima è 16 anni";
        } else if (age > 100) {
          newErrors.clientAge = "L'età massima è 100 anni";
        } else {
          delete newErrors.clientAge;
        }
      }
    }

    if (name === "clientWeight") {
      if (!value.trim()) {
        newErrors.clientWeight = "Il peso è obbligatorio";
      } else {
        const weight = parseInt(value);
        if (isNaN(weight)) {
          newErrors.clientWeight = "Il peso deve essere un numero";
        } else if (weight < 30) {
          newErrors.clientWeight = "Il peso minimo è 30 kg";
        } else if (weight > 300) {
          newErrors.clientWeight = "Il peso massimo è 300 kg";
        } else {
          delete newErrors.clientWeight;
        }
      }
    }

    if (name === "clientHeight") {
      if (!value.trim()) {
        newErrors.clientHeight = "L'altezza è obbligatoria";
      } else {
        const height = parseInt(value);
        if (isNaN(height)) {
          newErrors.clientHeight = "L'altezza deve essere un numero";
        } else if (height < 100) {
          newErrors.clientHeight = "L'altezza minima è 100 cm";
        } else if (height > 250) {
          newErrors.clientHeight = "L'altezza massima è 250 cm";
        } else {
          delete newErrors.clientHeight;
        }
      }
    }

    setErrors(newErrors);
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
        {
          name: "",
          sets: 3,
          reps: "10",
          rest: "1'30",
          notes: "",
          videoUrl: "",
          muscleGroup: "",
        },
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

  const handleGoalsToggle = (checked: boolean) => {
    setShowGoals(checked);
    if (!checked) {
      setFormData((prev) => ({
        ...prev,
        clientGoals: "",
      }));
    }
  };

  const handleMedicalConditionsToggle = (checked: boolean) => {
    setShowMedicalConditions(checked);
    if (!checked) {
      setFormData((prev) => ({
        ...prev,
        medicalConditions: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validazione campi cliente
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Il nome del cliente è obbligatorio";
      isValid = false;
    }
    if (!formData.clientAge.trim()) {
      newErrors.clientAge = "L'età è obbligatoria";
      isValid = false;
    } else {
      const age = parseInt(formData.clientAge);
      if (isNaN(age)) {
        newErrors.clientAge = "L'età deve essere un numero";
        isValid = false;
      } else if (age < 16) {
        newErrors.clientAge = "L'età minima è 16 anni";
        isValid = false;
      } else if (age > 100) {
        newErrors.clientAge = "L'età massima è 100 anni";
        isValid = false;
      }
    }
    if (!formData.clientWeight.trim()) {
      newErrors.clientWeight = "Il peso è obbligatorio";
      isValid = false;
    } else {
      const weight = parseInt(formData.clientWeight);
      if (isNaN(weight)) {
        newErrors.clientWeight = "Il peso deve essere un numero";
        isValid = false;
      } else if (weight < 30) {
        newErrors.clientWeight = "Il peso minimo è 30 kg";
        isValid = false;
      } else if (weight > 300) {
        newErrors.clientWeight = "Il peso massimo è 300 kg";
        isValid = false;
      }
    }
    if (!formData.clientHeight.trim()) {
      newErrors.clientHeight = "L'altezza è obbligatoria";
      isValid = false;
    } else {
      const height = parseInt(formData.clientHeight);
      if (isNaN(height)) {
        newErrors.clientHeight = "L'altezza deve essere un numero";
        isValid = false;
      } else if (height < 100) {
        newErrors.clientHeight = "L'altezza minima è 100 cm";
        isValid = false;
      } else if (height > 250) {
        newErrors.clientHeight = "L'altezza massima è 250 cm";
        isValid = false;
      }
    }

    // Validazione esercizi
    const exerciseErrors: { [key: number]: { name?: string } } = {};
    formData.exercises.forEach((exercise, index) => {
      if (!exercise.name.trim()) {
        exerciseErrors[index] = {
          name: "Il nome dell'esercizio è obbligatorio",
        };
        isValid = false;
      }
    });
    if (Object.keys(exerciseErrors).length > 0) {
      newErrors.exercises = exerciseErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!previewRef.current) {
      console.error("Preview element not found");
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Starting PDF generation process...");
      const filename = `workout-program-${formData.clientName
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

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
    <div className="mx-auto px-0 sm:px-4 py-2 sm:py-4 overflow-hidden">
      {/* Preview Toggle Button - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[9999]">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="w-full bg-primary text-white px-6 py-4 text-base hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-xl"
        >
          {showPreview ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Continua a Modificare
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Mostra Anteprima
            </>
          )}
        </button>
      </div>

      <div className="relative lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Form Section */}
        <div
          className={`space-y-4 lg:space-y-6 transition-all duration-300 ease-in-out lg:opacity-100 lg:translate-x-0 ${
            showPreview
              ? "opacity-0 -translate-x-full absolute lg:relative"
              : "opacity-100 translate-x-0"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-4 lg:space-y-6 pb-8 lg:pb-0"
          >
            <div className="bg-white dark:bg-input-bg p-4 sm:p-6 rounded-lg shadow-md">
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
                  error={errors.clientName}
                  data-error={!!errors.clientName}
                />
                <TextInput
                  label="Età"
                  name="clientAge"
                  type="number"
                  value={formData.clientAge}
                  onChange={handleInputChange}
                  required
                  error={errors.clientAge}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-error={!!errors.clientAge}
                />
                <TextInput
                  label="Peso (kg)"
                  name="clientWeight"
                  type="number"
                  value={formData.clientWeight}
                  onChange={handleInputChange}
                  required
                  error={errors.clientWeight}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-error={!!errors.clientWeight}
                />
                <TextInput
                  label="Altezza (cm)"
                  name="clientHeight"
                  type="number"
                  value={formData.clientHeight}
                  onChange={handleInputChange}
                  required
                  error={errors.clientHeight}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  data-error={!!errors.clientHeight}
                />
                <div className="md:col-span-2">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showGoals"
                        checked={showGoals}
                        onChange={(e) => handleGoalsToggle(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="showGoals"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Aggiungi obiettivi
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showMedicalConditions"
                        checked={showMedicalConditions}
                        onChange={(e) =>
                          handleMedicalConditionsToggle(e.target.checked)
                        }
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="showMedicalConditions"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Aggiungi condizioni mediche
                      </label>
                    </div>
                  </div>
                </div>
                {(showGoals || showMedicalConditions) && (
                  <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    {showGoals && (
                      <div className="mb-4">
                        <TextArea
                          label="Obiettivi"
                          name="clientGoals"
                          value={formData.clientGoals}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                    {showMedicalConditions && (
                      <div>
                        <TextArea
                          label="Condizioni Mediche"
                          name="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-input-bg p-4 sm:p-6 rounded-lg shadow-md">
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
                        className="text-error hover:text-error-light transition-colors p-1 cursor-pointer"
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
                        name={`exercise-${index}-name`}
                        value={exercise.name}
                        onChange={(e) =>
                          handleExerciseChange(index, "name", e.target.value)
                        }
                        required
                        error={errors.exercises?.[index]?.name}
                        placeholder={index === 0 ? undefined : "Affondi"}
                      />
                      <TextInput
                        label="Serie"
                        name={`exercise-${index}-sets`}
                        type="number"
                        value={exercise.sets?.toString() || ""}
                        onChange={(e) =>
                          handleExerciseChange(
                            index,
                            "sets",
                            parseInt(e.target.value)
                          )
                        }
                        className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder={index === 0 ? undefined : "3"}
                      />
                      <TextInput
                        label="Ripetizioni"
                        name={`exercise-${index}-reps`}
                        value={exercise.reps || ""}
                        onChange={(e) =>
                          handleExerciseChange(index, "reps", e.target.value)
                        }
                        placeholder={index === 0 ? undefined : "10"}
                      />
                      <TextInput
                        label="Recupero"
                        name={`exercise-${index}-rest`}
                        value={exercise.rest || ""}
                        onChange={(e) =>
                          handleExerciseChange(index, "rest", e.target.value)
                        }
                        placeholder={index === 0 ? undefined : "1'30"}
                      />
                      <div className="md:col-span-2">
                        <TextInput
                          label="URL Video YouTube"
                          name={`exercise-${index}-video`}
                          value={exercise.videoUrl || ""}
                          onChange={(e) =>
                            handleExerciseChange(
                              index,
                              "videoUrl",
                              e.target.value
                            )
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <div className="md:col-span-2">
                        <TextArea
                          label="Note"
                          name={`exercise-${index}-notes`}
                          value={exercise.notes || ""}
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
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark transition-colors border-2 border-dashed border-primary hover:border-primary-dark cursor-pointer"
                  >
                    + Aggiungi Esercizio
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full bg-primary text-white px-4 my-3 sm:px-6 py-3 rounded-lg transition-colors cursor-pointer text-sm sm:text-base ${
                isGenerating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-dark"
              }`}
            >
              {isGenerating ? "Generazione PDF..." : "Genera PDF"}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div
          className={`lg:sticky lg:top-4 transition-all duration-300 ease-in-out lg:opacity-100 lg:translate-x-0 ${
            showPreview
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full absolute lg:relative"
          }`}
        >
          <div className="bg-white dark:bg-input-bg p-2 sm:p-3 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-2 sm:mb-3"></div>
            <div className="overflow-y-auto" ref={previewRef} id="pdf-preview">
              <WorkoutTemplate
                clientInfo={{
                  name: formData.clientName,
                  age: parseInt(formData.clientAge) || undefined,
                  weight: parseInt(formData.clientWeight) || undefined,
                  height: parseInt(formData.clientHeight) || undefined,
                  goals: formData.clientGoals || undefined,
                  medicalConditions: formData.medicalConditions || undefined,
                }}
                exercises={formData.exercises}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
