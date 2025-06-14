import TrainerForm from "./components/TrainerForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Crea il tuo programma di allenamento
          </h1>
          <p className="text-lg text-gray-600">
            Inserisci le informazioni del cliente e crea un programma
            personalizzato
          </p>
        </div>
        <TrainerForm />
      </div>
    </div>
  );
}
