# HearMeNow 🎙️

**Emotion → Voice. Not just words, but feeling.**

HearMeNow is an accessibility-first web application that helps deaf and mute individuals communicate with natural emotion and clarity. Instead of robotic text-to-speech, HearMeNow translates emotion into voice, allowing listeners to feel the intent behind the words.

> *"For the first time, people can not only hear my words — they can feel my tone."*

---

## 🧩 The Problem

Deaf and speech-impaired individuals often rely on text or monotone TTS systems, which strip away:

- **Emotion**
- **Emphasis**  
- **Human intent**

This makes everyday interactions—classrooms, workplaces, social settings—feel distant and misunderstood.

---

## 💡 The Solution

HearMeNow enables expressive communication by combining emotion detection, user-controlled tone selection, and real-time voice synthesis.

### How it works:

1. User types a message
2. User selects an emotion or lets the system detect it automatically
3. ElevenLabs instantly speaks the message in a realistic, expressive voice

---

## ✨ Key Features

### 🗨️ Simple Chat-Style Interface
- Clean, distraction-free UI
- Designed for fast, repeatable communication

### 🎭 Emotion Selection
- Manually choose emotions (e.g., happy, calm, serious, apologetic)
- Or enable **Smart Emotion Detection**

### 🧠 Smart Emotion Detection
- Uses an OpenAI model to classify emotional tone directly from text
- Automatically maps tone → voice parameters

### 🔊 Real-Time Speech Output
- WebSocket streaming from ElevenLabs
- Natural timing, pacing, and expressive flow

### ⚡ Quick Phrases
- Save frequently used emotional phrases
- Examples:
  - *"Thank you!"*
  - *"I'm sorry"*
  - *"I need help"*
- Caret-aware insertion for fast reuse

---

## ♿ Accessibility Impact

- **Accessibility**: Gives speech-impaired users an emotional voice
- **Empathy**: Helps listeners understand *how* something is said, not just *what*
- **Inclusion**: Supports expressive communication in classrooms, workplaces, and daily life
- **Human Connection**: Bridges the gap between words and feelings

---

## 🏗️ Architecture Overview

### Frontend
- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Chat-style UI with emotion controls

### Backend
- Node.js server
- WebSocket connection to ElevenLabs API

### Voice Engine
- ElevenLabs converts text into emotion-controlled speech in real time

### AI Layer
- OpenAI model classifies emotional tone from user input

---

## 📁 Repository Structure

```
├── src/                 # Frontend application
├── server/              # Backend WebSocket server
├── public/              # Static assets
├── README-TTS.md        # TTS documentation
├── package.json
├── vite.config.ts
└── .gitignore           # Ignores .env.local
```

---

## 🔐 Environment Setup

Create a `.env.local` file (ignored by git):

```env
OPENAI_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
```

---

## 🚀 Getting Started

### Install dependencies:

```bash
npm install
```

### Start the frontend:

```bash
npm run dev
```

### Start the backend server separately:

```bash
node server/index.js
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, WebSockets |
| **Voice Synthesis** | ElevenLabs API |
| **AI/ML** | OpenAI API |

---

## 📊 Impact By The Numbers

- **466M** people worldwide with hearing loss
- **7M** speech-impaired individuals in the US
- **$8.2B** assistive technology market by 2028
- Traditional AAC devices cost **$2,000-$15,000** — HearMeNow democratizes access

---

## 🎯 Use Cases

- **Education**: Students expressing themselves in class discussions
- **Healthcare**: Patients communicating urgency and concern to doctors
- **Workplace**: Professionals participating fully in meetings and presentations
- **Social**: Everyday conversations with family, friends, and strangers
- **Emergency**: Critical situations where emotional tone matters

---

## 🔮 Future Roadmap

- [ ] Multi-language support
- [ ] Voice customization (pitch, speed, accent)
- [ ] Mobile app (iOS & Android)
- [ ] Offline mode with cached phrases
- [ ] Integration with AAC devices
- [ ] Community phrase library
- [ ] Real-time conversation mode (two-way communication)

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help makes HearMeNow better for everyone.

### How to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Hamzah Khan**  
Computer Science Student @ Queens College (CUNY)  
Focused on accessibility, AI-powered products, and human-centered design.

---

## 🙏 Acknowledgments

- **ElevenLabs** for industry-leading voice synthesis technology
- **OpenAI** for emotion detection capabilities
- The **deaf and hard-of-hearing community** for inspiration and feedback
- **Accessibility advocates** working to make technology inclusive for all
