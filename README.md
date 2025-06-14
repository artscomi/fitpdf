# FitPDF

FitPDF è un'applicazione web moderna che permette ai personal trainer di creare programmi di allenamento personalizzati per i loro clienti e generare PDF professionali.

## Caratteristiche

- 🎯 Creazione di programmi di allenamento personalizzati
- 👤 Gestione delle informazioni dei clienti
- 📝 Editor intuitivo per gli esercizi
- 🎨 Template PDF professionali e moderni
- 📱 Design responsive
- ⚡ Sviluppato con Next.js e TypeScript

## Tecnologie Utilizzate

- Next.js 14
- TypeScript
- Tailwind CSS
- React
- HTML2PDF (per la generazione dei PDF)

## Installazione

1. Clona il repository:

```bash
git clone https://github.com/tuousername/fitpdf.git
cd fitpdf
```

2. Installa le dipendenze:

```bash
npm install
# oppure
yarn install
```

3. Avvia il server di sviluppo:

```bash
npm run dev
# oppure
yarn dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel tuo browser.

## Struttura del Progetto

```
fitpdf/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── TextInput.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── TrainerForm.tsx
│   │   │   └── WorkoutTemplate.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── styles/
│       └── globals.css
├── public/
├── package.json
└── README.md
```

## Contribuire

Le pull request sono benvenute. Per modifiche importanti, apri prima un issue per discutere cosa vorresti cambiare.

## Licenza

[MIT](https://choosealicense.com/licenses/mit/)
