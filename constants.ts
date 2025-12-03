
import { Section, QuizQuestion } from './types';

export const APP_METADATA = {
  title: "RAD SAFE PRO",
  subtitle: "Your Smart Radiology Learning & Safety Assistant",
  version: "2.0.0",
  downloads: [
    { label: "Download RAD SAFE PRO – Android APK", url: "https://example.com/radsafe.apk", icon: "Smartphone" },
    { label: "Download RAD SAFE PRO – Windows EXE", url: "https://example.com/radsafe.exe", icon: "Monitor" },
    { label: "Download RAD SAFE PRO – MacOS App", url: "https://example.com/radsafe.dmg", icon: "Command" },
    { label: "Download Source Code – ZIP", url: "https://example.com/radsafe.zip", icon: "FileCode" }
  ]
};

export const CONTENT_SECTIONS: Section[] = [
  // Student Zone
  {
    id: 'intro',
    title: '1. Rad Physics (Zero to Hero)',
    category: 'core',
    icon: 'Atom',
    subsections: [
      {
        title: 'Atomic Structure & EMR',
        body: 'To understand radiology, we must start with the atom.\n\n**The Atom:**\n• **Protons (+):** Determine the element (Z number).\n• **Neutrons (0):** Stability.\n• **Electrons (-):** Orbit in shells (K, L, M...). Binding energy is highest at the K-shell.\n\n**Electromagnetic Radiation (EMR):**\nX-rays are high-energy photons with no mass and no charge. They travel at the speed of light ($$c = 3 \\times 10^8 m/s$$).\n\n**Wave-Particle Duality:** X-rays behave like waves (wavelength) and particles (photons).'
      },
      {
        title: 'X-Ray Production',
        body: 'X-rays are produced in the X-ray tube.\n\n**Requirements:**\n1. **Source of Electrons:** Heated filament (Cathode).\n2. **Acceleration:** High voltage (kVp).\n3. **Target:** Tungsten anode.\n\n**The Process:**\nElectrons slam into the target. 99% of energy becomes **HEAT**, 1% becomes **X-RAYS**.\n\n**Types of Production:**\n• **Bremsstrahlung (Braking):** Electron slows down near nucleus, emits photon.\n• **Characteristic:** Electron knocks out a K-shell electron. Cascade effect creates photon.'
      },
      {
        title: 'Interactions with Matter',
        body: 'What happens when X-rays hit the patient?\n\n1. **Photoelectric Effect:** Total absorption. Good for image contrast, but increases patient dose.\n2. **Compton Scatter:** Photon hits outer shell electron and changes direction. Reduces image quality (fog) and irradiates staff.\n3. **Coherent Scatter:** Low energy, vibrates atom, no ionization. Negligible in diagnostic ranges.'
      }
    ]
  },
  {
    id: 'positioning',
    title: '2. Positioning & Anatomy',
    category: 'core',
    icon: 'Move',
    subsections: [
      {
        title: 'General Principles',
        body: '• **View:** The path of the beam (e.g., AP, PA).\n• **Position:** How the patient is placed (e.g., Supine, Prone).\n• **Marker:** Always place R/L marker on the cassette, never digitally add later if possible.\n• **Rule of Two:** 2 views at 90° to each other (AP/Lat) to see depth.'
      },
      {
        title: 'Upper Limb',
        body: '**Hand:**\n• PA, Oblique, Lateral (Fan fingers).\n• Center at 3rd MCP joint.\n\n**Wrist:**\n• PA, Lateral, Scaphoid view (Ulnar deviation).\n• Center mid-carpals.\n\n**Elbow:**\n• AP (Fully extended), Lateral (Flex 90°).\n• Check for fat pad signs in trauma.'
      },
      {
        title: 'Chest X-Ray (CXR)',
        body: 'The most common exam.\n\n**PA View:**\n• Patient erect, chest against bucky.\n• Roll shoulders forward (move scapulae out of lung fields).\n• Deep inspiration (depress diaphragm).\n• **Why PA?** Reduces heart magnification (Heart is closer to film).\n\n**Lateral:**\n• Left side against bucky (Left lateral) to reduce heart mag.'
      },
      {
        title: 'Spine',
        body: '**C-Spine:**\n• AP Open Mouth (Odontoid).\n• AP Axial (15° cephalad).\n• Lateral (Must see C7-T1 junction).\n\n**L-Spine:**\n• AP, Lateral (Spot L5-S1).\n• Check for "Scottie Dog" on Obliques (Pars interarticularis).'
      }
    ]
  },
  {
    id: 'safety',
    title: '3. Radiobiology & Protection',
    category: 'safety',
    icon: 'ShieldAlert',
    subsections: [
      {
        title: 'Biological Effects',
        body: 'Ionizing radiation damages DNA.\n\n**Direct Effect:** Photon hits DNA directly.\n**Indirect Effect:** Photon hits water ($$H_2O$$), creates free radicals (Radiolysis of water), which damage DNA. This is more common.\n\n**Stochastic Effects:** Probability increases with dose (Cancer, Genetic). No threshold.\n**Deterministic Effects:** Severity increases with dose (Skin burns, Cataracts). Has a threshold.'
      },
      {
        title: 'The ALARA Principle',
        body: '**As Low As Reasonably Achievable**\n\n1. **Time:** Minimize beam-on time. (Fluoroscopy: use pulsed mode).\n2. **Distance:** The most effective tool. Inverse Square Law ($$I \\propto 1/d^2$$).\n3. **Shielding:** Lead aprons, thyroid collars, structural barriers.'
      },
      {
        title: 'Dose Limits (ICRP)',
        body: '• **Occupational:** 20 mSv/year (avg over 5 years), max 50 mSv in one year.\n• **Public:** 1 mSv/year.\n• **Fetus:** 1 mSv total gestation.\n• **Lens of Eye:** 20 mSv/year.'
      }
    ]
  },
  {
    id: 'modalities',
    title: '4. Advanced Modalities',
    category: 'advanced',
    icon: 'Scan',
    subsections: [
      {
        title: 'Computed Tomography (CT)',
        body: '**Concept:** X-ray tube rotates around patient. Detectors measure attenuation. Computer reconstructs slice.\n\n**Generations:** Modern scanners are "Helical/Spiral" (Continuous table movement + continuous rotation).\n\n**Hounsfield Units (HU):**\n• Air: -1000\n• Water: 0\n• Bone: +400 to +1000\n\n**Windowing:** Adjusting contrast (Window Width) and brightness (Window Level) to see specific tissues.'
      },
      {
        title: 'MRI (Magnetic Resonance)',
        body: '**No Ionizing Radiation.** Uses strong magnetic fields and Radiofrequency (RF) pulses.\n\n**Physics:**\n1. Protons align with $B_0$ field.\n2. RF pulse flips protons.\n3. RF off -> Protons relax, emitting signal.\n\n**Weighting:**\n• **T1:** Fluid is dark. Good for Anatomy.\n• **T2:** Fluid is bright. Good for Pathology.\n\n**Safety:** PROJECTILE HAZARD. No ferromagnetic objects.'
      },
      {
        title: 'Ultrasound (USG)',
        body: '**Piezoelectric Effect:** Crystals in transducer convert electricity to sound waves and vice versa.\n\n**Frequency:**\n• High Freq (Linear probe): Better resolution, less penetration (Thyroid, Vascular).\n• Low Freq (Curved probe): Better penetration, less resolution (Abdomen, OBGYN).\n\n**Echogenicity:**\n• Anechoic (Black): Fluid.\n• Hyperechoic (White): Bone/Stones.'
      }
    ]
  },
  {
    id: 'procedures',
    title: '5. Contrast & Procedures',
    category: 'advanced',
    icon: 'FlaskConical',
    subsections: [
      {
        title: 'Contrast Media',
        body: '**Negative Contrast:** Air/Gas (appears black).\n**Positive Contrast:** Barium, Iodine (appears white).\n\n**Iodinated Contrast:**\n• Used in CT/IVU.\n• **Risk:** Contrast Induced Nephropathy (CIN) and Anaphylaxis.\n• **Check:** Creatinine levels before injection.'
      },
      {
        title: 'Common Procedures',
        body: '• **IVU (Intravenous Urogram):** Kidney function/stones.\n• **RGU/MCU:** Urethra/Bladder.\n• **Barium Swallow:** Esophagus.\n• **Angiography:** Blood vessels (Interventional).'
      }
    ]
  },
  // Public Awareness Division
  {
    id: 'awareness',
    title: 'Public Awareness & Safety',
    category: 'public',
    icon: 'HeartHandshake',
    subsections: [
      {
        title: 'What is Radiation?',
        body: 'Radiation is energy that travels as waves or particles. It is part of our natural world.\n\n**Natural Sources:**\n• The Sun (Cosmic radiation)\n• The Earth (Radon gas in soil)\n• Food (Bananas contain Potassium-40!)\n\n**Medical Radiation:**\nDoctors use X-rays to see inside your body. The amount used is very small and carefully controlled.'
      },
      {
        title: 'Is Medical Imaging Safe?',
        body: '**Benefit vs. Risk:**\nThe risk of not finding a serious illness (like pneumonia or a fracture) is usually much higher than the tiny risk from an X-ray.\n\n**Comparison:**\n• A Chest X-ray = ~3 days of natural background radiation (the radiation you get just by living on Earth).\n• A CT Scan = ~1-3 years of natural radiation.\n\nDoctors follow the **ALARA** principle: As Low As Reasonably Achievable. We only use radiation when necessary.'
      },
      {
        title: 'Myths vs Facts',
        body: '**Myth:** X-rays make me radioactive.\n**Fact:** No. Once the machine stops beeping, the radiation is gone instantly. You do not glow or carry radiation home.\n\n**Myth:** MRI uses high radiation.\n**Fact:** MRI uses NO radiation. It uses magnets and radio waves.\n\n**Myth:** I should refuse X-rays to stay safe.\n**Fact:** Refusing a necessary X-ray can delay diagnosis and treatment, which is far more dangerous.'
      },
      {
        title: 'Pregnancy & Children',
        body: '**Pregnancy:**\nAlways tell your technologist if you might be pregnant. We can often use Ultrasound or MRI instead. If an X-ray is needed, we use lead shielding to protect the baby.\n\n**Image Gently:**\nFor children, we use special "pediatric protocols" to use much less radiation because kids are more sensitive. We "kid-size" the dose.'
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Basics - Beginner
  {
    id: 1,
    question: "Which component of the X-ray tube produces electrons?",
    options: ["Anode", "Cathode", "Vacuum", "Rotor"],
    correctIndex: 1,
    explanation: "The Cathode filament creates an electron cloud via thermionic emission.",
    category: 'Radiology Basics',
    difficulty: 'Beginner'
  },
  {
    id: 2,
    question: "What is the primary function of the collimator?",
    options: ["Filter low energy x-rays", "Restrict the x-ray beam size", "Increase beam intensity", "Reduce scatter radiation reaching the film"],
    correctIndex: 1,
    explanation: "Collimators restrict the beam size, reducing patient dose and scatter production.",
    category: 'Radiology Basics',
    difficulty: 'Beginner'
  },
  
  // Physics - Intermediate/Advanced
  {
    id: 3,
    question: "According to the Inverse Square Law, doubling the distance reduces intensity to:",
    options: ["1/2", "1/4", "1/8", "1/10"],
    correctIndex: 1,
    explanation: "Intensity is inversely proportional to the square of distance. (1/2)² = 1/4.",
    category: 'Physics',
    difficulty: 'Intermediate'
  },
  {
    id: 4,
    question: "Which interaction is responsible for the majority of occupational exposure?",
    options: ["Photoelectric Effect", "Compton Scattering", "Pair Production", "Coherent Scattering"],
    correctIndex: 1,
    explanation: "Compton scattering changes the direction of the photon, directing it towards staff.",
    category: 'Physics',
    difficulty: 'Intermediate'
  },
  {
    id: 13,
    question: "At what energy level does Pair Production predominately occur?",
    options: ["10 keV", "500 keV", "1.02 MeV", "10 MeV"],
    correctIndex: 2,
    explanation: "Pair production requires an incident photon energy of at least 1.02 MeV.",
    category: 'Physics',
    difficulty: 'Advanced'
  },

  // Safety - Beginner/Intermediate
  {
    id: 5,
    question: "What is the annual whole-body dose limit for a radiographer?",
    options: ["5 mSv", "20 mSv", "50 mSv", "100 mSv"],
    correctIndex: 1,
    explanation: "20 mSv per year averaged over 5 consecutive years.",
    category: 'Safety & ALARA',
    difficulty: 'Intermediate'
  },
  {
    id: 6,
    question: "What is the minimum lead equivalence for a lead apron?",
    options: ["0.1 mm Pb", "0.25 mm Pb", "1.0 mm Pb", "2.0 mm Pb"],
    correctIndex: 1,
    explanation: "0.25mm is the minimum, though 0.5mm is standard for higher energy procedures like fluoro.",
    category: 'Safety & ALARA',
    difficulty: 'Beginner'
  },

  // Spotters / Anatomy - Beginner
  {
    id: 7,
    question: "On a PA Chest X-ray, which hemidiaphragm is usually higher?",
    options: ["Left", "Right", "Both are equal", "Variable"],
    correctIndex: 1,
    explanation: "The Right hemidiaphragm is higher due to the liver underneath it.",
    category: 'Anatomy Spotters',
    difficulty: 'Beginner'
  },

  // Modalities - Intermediate/Advanced
  {
    id: 8,
    question: "Which unit measures density in CT scans?",
    options: ["Tesla", "Hounsfield Unit (HU)", "Sievert", "Gray"],
    correctIndex: 1,
    explanation: "Hounsfield Units quantify radiodensity (Water = 0 HU).",
    category: 'Modalities',
    difficulty: 'Beginner'
  },
  {
    id: 11,
    question: "MRI safety: What happens to ferromagnetic objects in the scan room?",
    options: ["They melt", "They become radioactive", "They become projectiles", "Nothing"],
    correctIndex: 2,
    explanation: "The strong magnetic field pulls ferromagnetic objects violently towards the bore.",
    category: 'Modalities',
    difficulty: 'Intermediate'
  },
  {
    id: 12,
    question: "Which contrast agent is commonly used in MRI?",
    options: ["Barium", "Iodine", "Gadolinium", "Technetium"],
    correctIndex: 2,
    explanation: "Gadolinium-based contrast agents are used in MRI.",
    category: 'Modalities',
    difficulty: 'Intermediate'
  },
  {
    id: 14,
    question: "What is the Larmor Frequency of Hydrogen at 1.5 Tesla?",
    options: ["21.3 MHz", "42.58 MHz", "63.87 MHz", "127.7 MHz"],
    correctIndex: 2,
    explanation: "The gyromagnetic ratio of Hydrogen is ~42.58 MHz/T. At 1.5T: 42.58 * 1.5 ≈ 63.87 MHz.",
    category: 'Modalities',
    difficulty: 'Advanced'
  },

  // Positioning - Intermediate
  {
    id: 9,
    question: "For a lateral projection of the wrist, the elbow should be flexed at:",
    options: ["45 degrees", "90 degrees", "180 degrees", "0 degrees"],
    correctIndex: 1,
    explanation: "90 degree flexion ensures true lateral alignment of the radius and ulna.",
    category: 'Positioning',
    difficulty: 'Intermediate'
  },
  {
    id: 10,
    question: "Which projection is best for visualizing the apices of the lungs?",
    options: ["PA Chest", "Lateral Chest", "Apical Lordotic", "Decubitus"],
    correctIndex: 2,
    explanation: "The Apical Lordotic view projects the clavicles above the apices.",
    category: 'Positioning',
    difficulty: 'Intermediate'
  },
  {
    id: 15,
    question: "What is the recommended focal spot size for mammography?",
    options: ["1.0 - 2.0 mm", "0.6 - 1.2 mm", "0.3 - 0.4 mm", "0.1 - 0.3 mm"],
    correctIndex: 3,
    explanation: "Mammography requires high spatial resolution, using very small focal spots (0.1mm for mag, 0.3mm for routine).",
    category: 'Modalities',
    difficulty: 'Advanced'
  }
];

export const SPOTTERS_DATA = [
  {
    id: 1,
    title: "Chest X-Ray (PA View)",
    labels: [
      { x: 50, y: 30, text: "Trachea" },
      { x: 35, y: 50, text: "Right Atrium" },
      { x: 65, y: 55, text: "Left Ventricle" },
      { x: 25, y: 70, text: "R. Costophrenic Angle" }
    ],
    imageUrl: "https://picsum.photos/seed/cxr/800/600"
  },
  {
    id: 2,
    title: "Hand X-Ray (AP)",
    labels: [
      { x: 50, y: 60, text: "Metacarpals" },
      { x: 50, y: 80, text: "Carpal Bones" },
      { x: 50, y: 40, text: "Proximal Phalanx" }
    ],
    imageUrl: "https://picsum.photos/seed/handxray/800/600"
  },
  {
    id: 3,
    title: "Knee X-Ray (Lateral)",
    labels: [
      { x: 50, y: 30, text: "Patella" },
      { x: 50, y: 50, text: "Femoral Condyles" },
      { x: 50, y: 70, text: "Tibial Plateau" }
    ],
    imageUrl: "https://picsum.photos/seed/knee/800/600"
  }
];

export const USER_GUIDE = `
# RAD SAFE PRO: Complete User Manual

Welcome to **RAD SAFE PRO**. This application is designed to take you from a **Beginner (Zero)** to an **Expert (Hero)** in Radiology and Allied Health Sciences.

---

## 📚 1. Learning Hub (The Zero to Hero Path)
The Learning Hub is the core of your education.
1.  **Navigation:** Tap on 'Learning Hub' in the dashboard.
2.  **Modules:** Content is divided into chapters (Physics, Anatomy, Safety, Modalities).
3.  **Subsections:** Click a chapter to reveal detailed subsections.
4.  **AI Integration:** Inside any lesson, look for the **"AI Tutor"** button. This opens a dedicated chat bot that knows *exactly* what you are reading. Ask it to "Explain this simply" or "Give me a mnemonic".

---

## 🌎 2. Public Awareness Division
A dedicated section for general public education.
*   **Safety Myths:** Learn the truth about radiation.
*   **Pregnancy:** Guidelines for expecting mothers.
*   **Risks:** Understanding natural vs medical radiation.

---

## 🧮 3. Radiation Calculators
Practical tools for labs and clinics.
*   **Inverse Square Law:** Enter initial intensity and distances to find the new intensity.
*   **mAs Reciprocity:** Calculate total mAs from mA and Time.
*   **Exposure Time:** Find how long to expose based on required mAs.
*   **Shielding:** Estimate dose reduction based on Half Value Layers (HVL).

---

## 🤖 4. AI Assistant (RAD AI)
There are two ways to use AI:
1.  **AI Dose Predictor:** In the main menu. Enter patient age, weight, and scan type to simulate a dose report. *Educational use only.*
2.  **Context Tutor:** Inside Learning Hub. Chats with you about specific topics.

---

## 🏆 5. Quiz Zone & Profile
Track your progress.
1.  **Setup:** Choose Difficulty (Beginner/Intermediate/Advanced), Category, and Question Count.
2.  **Scoring:** 
    *   Beginner: 1x XP
    *   Intermediate: 1.5x XP
    *   Advanced: 2.5x XP
3.  **Level Up:** Earn XP to increase your User Level. Check your stats in the Quiz Setup screen.

---

## 🦴 6. Anatomy Spotters
Interactive labeling practice.
1.  Select an image (CXR, Hand, Knee).
2.  Tap "Show Labels" to reveal anatomical landmarks.
3.  Tap "Hide Labels" to test yourself.

---

## 📲 7. Installation & Offline Use
*   **Android/iOS:** Open in browser -> Share Menu -> "Add to Home Screen".
*   **Offline:** The static content (Lessons, Quiz, Calculators) works offline. AI features require internet.

---

**Disclaimer:** This app is for educational purposes for AHS students. Do not use for clinical diagnosis or actual patient dosimetry.
`;