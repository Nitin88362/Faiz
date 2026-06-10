# Language Translator MERN App

A full-stack MERN application for translating text, voice, video, documents, and live camera input across 100+ languages.

## Features

- **Text Translation**: Translate text instantly with auto language detection
- **Voice Translation**: Speak in one language, get translation and audio output
- **Video Translation**: Upload videos, extract speech, translate subtitles, and generate dubbed audio
- **Document Translation**: Translate PDF, DOCX, TXT files while preserving formatting
- **Live Camera Translation**: Use camera to translate text from real world
- **Chat Translation**: Real-time bilingual chat
- **User Authentication**: Register, login, JWT auth
- **Dashboard**: Clean UI with drag & drop uploads, progress tracking, history
- **Admin Panel**: User management and statistics

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **APIs**: Google Translate, OpenAI Whisper, ElevenLabs TTS, FFmpeg, Tesseract OCR

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables in `server/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/translator
   JWT_SECRET=your_jwt_secret
   GOOGLE_TRANSLATE_API_KEY=your_key
   OPENAI_API_KEY=your_key
   ELEVENLABS_API_KEY=your_key
   AZURE_TTS_KEY=your_key
   AZURE_REGION=your_region
   ```
4. Start MongoDB
5. Run the app:
   ```bash
   npm run dev
   ```

## Usage

- Visit `http://localhost:3000` for the client
- Server runs on `http://localhost:5000`

## Project Structure

```
translater/
├── client/          # React frontend
├── server/          # Node.js backend
├── .github/         # Copilot instructions
└── package.json     # Root scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License