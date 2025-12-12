# RAD SAFE PRO ☢️

**Your Smart Radiology Learning & Safety Assistant**

RAD SAFE PRO is a comprehensive, mobile-first educational platform designed for Allied Health Science (AHS) Radiology students. It combines learning modules, safety calculators, and AI-powered assistance into a clean, professional interface.

## 📱 Features

- **Learning Hub:** Core radiology concepts, physics, and physics.
- **Dynamic Quiz Zone:** Customizable quizzes with randomization and explanations.
- **Radiation Calculators:** Inverse Square Law, mAs, Exposure Time, Shielding.
- **AI Assistant:** "Rad AI" for instant safety tips and dose prediction.
- **Anatomy Spotters:** Interactive image labeling.
- **Mobile First Design:** Optimized for touch devices.

## 🛠 Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** Google Gemini API

## 🚀 Installation

### Web / Desktop
1. Clone the repository.
2. Run `npm install`.
3. Set your `API_KEY` in environment variables.
4. Run `npm start`.

### Android (via Capacitor)
1. `npm install @capacitor/core @capacitor/cli @capacitor/android`
2. `npx cap init`
3. `npx cap add android`
4. `npm run build`
5. `npx cap sync`
6. `npx cap open android` (Build APK in Android Studio)

### Windows (via Electron)
1. Install Electron Forge.
2. Configure `main.js` to load the React build.
3. Run `npm run make`.

## 📂 Folder Structure

- `src/components`: UI Components (Quiz, Calculator, Dashboard)
- `src/services`: Gemini AI integration
- `src/constants.ts`: Static content (Questions, Lessons)
- `src/types.ts`: TypeScript interfaces

Project by 
SARVEPALLI AUDI SIVA BHANUVARDHAN,

DHANALAKSHMI SRINIVASAN UNIVERSITY, SAMAYAPURAM, TIRUCHIRAPALLI, TAMILNADU, 621 112

## 📄 License
Educational Use Only. Not for clinical diagnostic purposes.
