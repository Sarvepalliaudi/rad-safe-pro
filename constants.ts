
import { Section, QuizQuestion } from './types';

export const APP_METADATA = {
  title: "RAD SAFE PRO",
  subtitle: "Your Smart Radiology Learning & Safety Assistant",
  version: "3.0.0 (Pro)",
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
        title: 'Radiation in Daily Life',
        body: 'You might be surprised to learn that radiation is a natural part of our world. It is not just in hospitals.\n\n**The Banana Analogy:**\nDid you know bananas contain Potassium-40, a radioactive isotope? Eating one banana exposes you to about **0.1 micro-Sieverts (µSv)** of radiation. This is completely harmless!\n\n**Flight Analogy:**\nA flight from New York to London exposes passengers to about **80 µSv** of cosmic radiation from space. This is roughly the same dose as a standard Chest X-ray.\n\n$$ \\text{1 Chest X-Ray} \\approx \\text{1 Transatlantic Flight} \\approx \\text{800 Bananas} $$\n\n**Conclusion:**\nThe small amounts of radiation used in X-rays are comparable to risks we accept in everyday life.'
      },
      {
        title: 'X-ray Myths vs. Facts',
        body: '**Myth 1: "I will be radioactive after an X-ray."**\n**Fact:** FALSE. X-rays are like light bulbs. When the switch is off, the light (radiation) is gone. You are **not** radioactive and can safely hug your children immediately.\n\n**Myth 2: "Lead aprons are 100% impenetrable."**\n**Fact:** Lead aprons drastically reduce exposure (by ~90-95%) but do not block 100%. This is why we also use distance and time to keep you safe.\n\n**Myth 3: "I will set off metal detectors at the airport."**\n**Fact:** No. Medical radiation does not linger in your body. Only nuclear medicine (which involves injections) might trigger sensitive detectors for a short time.'
      },
      {
        title: 'Pregnancy & Children Safety',
        body: '**"Image Gently" Campaign:**\nRadiologists follow strict protocols for children. We "child-size" the dose, meaning we use much less electricity for a small child than for an adult.\n\n**If You Are Pregnant:**\n1. **Tell us first:** We might switch to Ultrasound or MRI (no radiation).\n2. **Shielding:** If an X-ray is necessary, we place a lead apron over your abdomen to protect the baby.\n3. **Risk:** The risk to the fetus from a diagnostic X-ray (like a wrist or ankle) is extremely low, but we avoid abdominal shots whenever possible.\n\n**Visual Tip:**\nImagine a "Shield" icon. That is what we do—we shield the parts of the body that do not need to be imaged.'
      },
      {
        title: 'What to Expect During Your Scan',
        body: 'Feeling nervous? Here is a simple walkthrough of your visit:\n\n**Step 1: Preparation**\nYou may be asked to change into a gown and remove jewelry or metal (zippers, bras with wires). Metal shows up as white streaks on X-rays.\n\n**Step 2: Positioning**\nThe technologist will place you in a specific pose. It might feel firm or uncomfortable, but it only lasts seconds. "Hold your breath" helps stop motion blur.\n\n**Step 3: The Exposure**\nYou will hear a **"Beep"** or whirring sound. You won\'t feel anything. It is completely painless.\n\n**Step 4: Done!**\nThe technologist checks the image quality. You can usually leave immediately. The radiologist (doctor) will review the pictures and send a report to your physician.'
      }
    ]
  }
];

// --- GENERATING 120+ QUESTIONS ---
const generateQuestions = (): QuizQuestion[] => {
  const q: QuizQuestion[] = [];
  let id = 1;

  // Helper to add questions
  const add = (qText: string, opts: string[], corr: number, exp: string, cat: any, diff: any) => {
    q.push({ id: id++, question: qText, options: opts, correctIndex: corr, explanation: exp, category: cat, difficulty: diff });
  };

  // --- BASIC RADIOLOGY ---
  add("Who discovered X-rays?", ["Curie", "Roentgen", "Tesla", "Edison"], 1, "Wilhelm Roentgen discovered X-rays in 1895.", 'Radiology Basics', 'Beginner');
  add("What year were X-rays discovered?", ["1890", "1895", "1901", "1920"], 1, "Nov 8, 1895.", 'Radiology Basics', 'Beginner');
  add("X-rays travel at the speed of...?", ["Sound", "Light", "Ultrasound", "Electron"], 1, "Speed of light (c).", 'Radiology Basics', 'Beginner');
  add("Which is NOT a property of X-rays?", ["Invisible", "Travel in straight lines", "Have mass", "Cause fluorescence"], 2, "Photons have no mass.", 'Radiology Basics', 'Beginner');
  add("The negative electrode in the tube is?", ["Anode", "Cathode", "Target", "Rotor"], 1, "Cathode is negative.", 'Radiology Basics', 'Beginner');
  add("The positive electrode in the tube is?", ["Anode", "Cathode", "Filament", "Focus"], 0, "Anode is positive.", 'Radiology Basics', 'Beginner');
  add("Filaments are made of?", ["Copper", "Lead", "Tungsten", "Gold"], 2, "Tungsten (high melting point).", 'Radiology Basics', 'Beginner');
  add("The source of electrons is?", ["Target", "Filament", "Window", "Stator"], 1, "Thermionic emission occurs at filament.", 'Radiology Basics', 'Beginner');
  add("Most energy in the tube becomes?", ["X-rays", "Light", "Heat", "Sound"], 2, "99% is Heat.", 'Radiology Basics', 'Beginner');
  add("What does kVp control?", ["Quantity", "Quality/Penetration", "Time", "Distance"], 1, "kVp controls energy (Quality).", 'Radiology Basics', 'Intermediate');
  add("What does mAs control?", ["Density/Quantity", "Contrast", "Penetration", "Sharpness"], 0, "mAs controls quantity (Density).", 'Radiology Basics', 'Intermediate');
  add("Which creates image contrast?", ["Photoelectric", "Compton", "Coherent", "Pair Production"], 0, "Photoelectric effect creates white/black contrast.", 'Radiology Basics', 'Intermediate');
  add("Which creates scatter?", ["Photoelectric", "Compton", "Coherent", "Characteristic"], 1, "Compton scatter degrades image.", 'Radiology Basics', 'Intermediate');
  add("Grid ratio is?", ["H/D", "D/H", "W/H", "H/W"], 0, "Height divided by Distance.", 'Radiology Basics', 'Advanced');
  add("Air gap technique works like a?", ["Filter", "Grid", "Screen", "Collimator"], 1, "Reduces scatter reaching film.", 'Radiology Basics', 'Advanced');
  add("What is the active layer of a CR plate?", ["PSP", "Selenium", "Silicon", "Silver"], 0, "Photostimulable Phosphor.", 'Radiology Basics', 'Advanced');
  add("Direct DR uses?", ["Cesium Iodide", "Amorphous Selenium", "Gadolinium", "Zinc"], 1, "Amorphous Selenium converts X-ray to signal directly.", 'Radiology Basics', 'Advanced');
  add("What is the heel effect?", ["Uniform intensity", "More intensity at Cathode", "More at Anode", "None"], 1, "Cathode side is stronger.", 'Radiology Basics', 'Advanced');
  add("Filtration removes?", ["High energy photons", "Low energy photons", "All photons", "Scatter"], 1, "Hardens the beam by removing soft x-rays.", 'Radiology Basics', 'Intermediate');
  add("Total filtration required above 70 kVp?", ["1.5mm Al", "2.0mm Al", "2.5mm Al", "0.5mm Al"], 2, "2.5mm Al eq.", 'Radiology Basics', 'Advanced');

  // --- SAFETY ---
  add("ALARA means?", ["Always Low Radiation Area", "As Low As Reasonably Achievable", "Allow Low Annual Rads", "None"], 1, "Basic safety principle.", 'Safety & ALARA', 'Beginner');
  add("Occupational dose limit?", ["5 mSv", "20 mSv", "50 mSv", "1 mSv"], 1, "20 mSv/yr averaged over 5 years.", 'Safety & ALARA', 'Intermediate');
  add("Public dose limit?", ["1 mSv", "5 mSv", "10 mSv", "0.1 mSv"], 0, "1 mSv per year.", 'Safety & ALARA', 'Beginner');
  add("Fetal dose limit?", ["5 mSv", "1 mSv", "10 mSv", "20 mSv"], 1, "1 mSv for entire gestation.", 'Safety & ALARA', 'Intermediate');
  add("Lead apron minimum?", ["0.1mm", "0.25mm", "0.5mm", "1mm"], 1, "0.25mm Pb is minimum.", 'Safety & ALARA', 'Beginner');
  add("Thyroid shield thickness?", ["0.25mm", "0.5mm", "1mm", "0.1mm"], 1, "0.5mm Pb is standard.", 'Safety & ALARA', 'Intermediate');
  add("Best protection method?", ["Time", "Distance", "Shielding", "Monitoring"], 1, "Distance (Inverse Square Law).", 'Safety & ALARA', 'Beginner');
  add("Inverse square law: double distance?", ["1/2 dose", "1/4 dose", "1/8 dose", "Double dose"], 1, "Intensity drops to 1/4.", 'Safety & ALARA', 'Intermediate');
  add("10-Day rule applies to?", ["Chest", "Skull", "Abdomen/Pelvis", "Extremities"], 2, "Females of childbearing age.", 'Safety & ALARA', 'Intermediate');
  add("Stochastic effects?", ["Have threshold", "No threshold", "Severity increases with dose", "Skin burns"], 1, "Probabilistic (Cancer), no threshold.", 'Safety & ALARA', 'Advanced');
  add("Deterministic effects?", ["Cancer", "Genetic", "Cataracts", "None"], 2, "Have a threshold (Cataracts, burns).", 'Safety & ALARA', 'Advanced');
  add("Dosimeter worn where?", ["Under apron", "Collar (outside)", "Waist", "Pocket"], 1, "Collar level outside apron.", 'Safety & ALARA', 'Beginner');
  add("Pregnant staff dose limit?", ["1 mSv", "5 mSv", "2 mSv", "0.5 mSv/mo"], 3, "0.5 mSv per month.", 'Safety & ALARA', 'Advanced');
  add("Gonadal shielding reduces dose by?", ["10%", "50%", "95%", "100%"], 2, "Up to 95% if placed correctly.", 'Safety & ALARA', 'Intermediate');
  add("Unit of absorbed dose?", ["Sievert", "Gray", "Becquerel", "Curie"], 1, "Gray (Gy).", 'Safety & ALARA', 'Intermediate');
  add("Unit of equivalent dose?", ["Sievert", "Gray", "Roentgen", "Rad"], 0, "Sievert (Sv).", 'Safety & ALARA', 'Intermediate');
  add("Lead gloves thickness?", ["0.1mm", "0.25mm", "0.5mm", "1mm"], 1, "0.25mm Pb.", 'Safety & ALARA', 'Advanced');
  add("Leakage radiation limit?", ["1 mGy/hr", "10 mGy/hr", "100 mR/hr", "0"], 2, "1 mGy/hr (100 mR/hr) at 1 meter.", 'Safety & ALARA', 'Advanced');
  add("Controlled area limit?", ["1 mSv/wk", "0.1 mSv/wk", "20 mSv/wk", "5 mSv/wk"], 0, "Can exceed public limits.", 'Safety & ALARA', 'Advanced');
  add("Which is most radiosensitive?", ["Bone", "Muscle", "Lymphocytes", "Nerve"], 2, "White blood cells/Bone marrow.", 'Safety & ALARA', 'Advanced');

  // --- ANATOMY ---
  add("Carpal bones count?", ["5", "7", "8", "10"], 2, "8 carpals.", 'Anatomy Spotters', 'Beginner');
  add("Largest tarsal bone?", ["Talus", "Calcaneus", "Navicular", "Cuboid"], 1, "Calcaneus (Heel).", 'Anatomy Spotters', 'Beginner');
  add("C1 vertebra is called?", ["Axis", "Atlas", "Dens", "Prominens"], 1, "Atlas holds the head.", 'Anatomy Spotters', 'Beginner');
  add("C2 vertebra is called?", ["Axis", "Atlas", "Vertebra Prominens", "Sacrum"], 0, "Axis has the dens.", 'Anatomy Spotters', 'Beginner');
  add("How many ribs?", ["10 pairs", "11 pairs", "12 pairs", "14 pairs"], 2, "12 pairs.", 'Anatomy Spotters', 'Beginner');
  add("Odontoid process is on?", ["C1", "C2", "C3", "C7"], 1, "On the Axis (C2).", 'Anatomy Spotters', 'Intermediate');
  add("Acetabulum is part of?", ["Shoulder", "Hip", "Knee", "Elbow"], 1, "Hip socket.", 'Anatomy Spotters', 'Intermediate');
  add("Glenoid fossa is part of?", ["Shoulder", "Hip", "Ankle", "Wrist"], 0, "Shoulder joint.", 'Anatomy Spotters', 'Intermediate');
  add("Olecranon is part of?", ["Radius", "Ulna", "Humerus", "Femur"], 1, "Proximal Ulna (Elbow).", 'Anatomy Spotters', 'Intermediate');
  add("Lateral malleolus is on?", ["Tibia", "Fibula", "Femur", "Talus"], 1, "Distal Fibula.", 'Anatomy Spotters', 'Intermediate');
  add("Medial malleolus is on?", ["Tibia", "Fibula", "Femur", "Calcaneus"], 0, "Distal Tibia.", 'Anatomy Spotters', 'Intermediate');
  add("Sella Turcica holds?", ["Pineal", "Pituitary", "Thyroid", "Adrenal"], 1, "Pituitary Gland.", 'Anatomy Spotters', 'Advanced');
  add("Zygomatic arch is in?", ["Foot", "Hand", "Skull", "Pelvis"], 2, "Cheek bone.", 'Anatomy Spotters', 'Beginner');
  add("Foramen Magnum is in?", ["Frontal", "Parietal", "Occipital", "Temporal"], 2, "Base of skull.", 'Anatomy Spotters', 'Intermediate');
  add("Xiphoid process is part of?", ["Sternum", "Scapula", "Clavicle", "Pelvis"], 0, "Distal Sternum.", 'Anatomy Spotters', 'Intermediate');
  add("Greater Trochanter is on?", ["Humerus", "Femur", "Tibia", "Radius"], 1, "Proximal Femur.", 'Anatomy Spotters', 'Intermediate');
  add("Tibial Tuberosity is insertion for?", ["Achilles", "Patellar lig", "ACL", "PCL"], 1, "Patellar ligament.", 'Anatomy Spotters', 'Advanced');
  add("Scaphoid is also called?", ["Lunate", "Navicular", "Hamate", "Pisiform"], 1, "Navicular (of hand).", 'Anatomy Spotters', 'Advanced');
  add("Which kidney is lower?", ["Left", "Right", "Same", "None"], 1, "Right (due to liver).", 'Anatomy Spotters', 'Intermediate');
  add("Carina is at level?", ["T2", "T4-T5", "T10", "L1"], 1, "Tracheal bifurcation.", 'Anatomy Spotters', 'Advanced');

  // --- MODALITIES ---
  add("CT density unit?", ["Pixel", "Voxel", "Hounsfield Unit", "Tesla"], 2, "HU.", 'Modalities', 'Beginner');
  add("Water HU value?", ["-1000", "0", "100", "1000"], 1, "Zero.", 'Modalities', 'Beginner');
  add("Air HU value?", ["-1000", "0", "1000", "50"], 0, "-1000.", 'Modalities', 'Intermediate');
  add("Bone HU value?", ["0", "50", "100", "+1000"], 3, "Dense bone is high HU.", 'Modalities', 'Intermediate');
  add("MRI uses?", ["X-rays", "Sound", "Magnets/RF", "Isotopes"], 2, "Magnetic fields.", 'Modalities', 'Beginner');
  add("T1 fluid is?", ["Bright", "Dark", "Grey", "Invisible"], 1, "Dark on T1.", 'Modalities', 'Intermediate');
  add("T2 fluid is?", ["Bright", "Dark", "Grey", "Invisible"], 0, "Bright on T2.", 'Modalities', 'Intermediate');
  add("MRI Contrast?", ["Iodine", "Barium", "Gadolinium", "Air"], 2, "Gadolinium.", 'Modalities', 'Intermediate');
  add("USG uses?", ["Sound", "X-ray", "Heat", "Magnet"], 0, "Sound waves.", 'Modalities', 'Beginner');
  add("Frequency for deep USG?", ["High", "Low", "Medium", "Zero"], 1, "Low freq penetrates deeper.", 'Modalities', 'Intermediate');
  add("Piezoelectric effect is in?", ["CT", "MRI", "USG", "Mammo"], 2, "USG crystals.", 'Modalities', 'Advanced');
  add("PET scan isotope?", ["I-131", "Tc-99m", "FDG (F-18)", "Co-60"], 2, "Fluorodeoxyglucose.", 'Modalities', 'Advanced');
  add("Gamma camera is for?", ["CT", "MRI", "Nuc Med", "USG"], 2, "Nuclear Medicine.", 'Modalities', 'Intermediate');
  add("Mammo target material?", ["Tungsten", "Molybdenum", "Copper", "Gold"], 1, "Molybdenum/Rhodium.", 'Modalities', 'Advanced');
  add("Mammo kVp range?", ["50-70", "25-30", "80-100", "10-15"], 1, "Low kVp for contrast.", 'Modalities', 'Advanced');
  add("CT Pitch > 1 means?", ["Gaps", "Overlap", "Perfect", "Slow"], 0, "Faster scan, less dose, lower res.", 'Modalities', 'Advanced');
  add("Window Width controls?", ["Brightness", "Contrast", "Size", "Noise"], 1, "Contrast.", 'Modalities', 'Advanced');
  add("Window Level controls?", ["Brightness", "Contrast", "Sharpness", "Dose"], 0, "Brightness.", 'Modalities', 'Advanced');
  add("Contraindication for MRI?", ["Pacemaker", "Pregnancy", "Obesity", "Claustrophobia"], 0, "Pacemaker (Absolute).", 'Modalities', 'Intermediate');
  add("Doppler USG measures?", ["Density", "Flow/Velocity", "Temperature", "Hardness"], 1, "Blood flow.", 'Modalities', 'Intermediate');

  // --- POSITIONING ---
  add("PA Chest SID?", ["40 inch", "72 inch", "30 inch", "100 inch"], 1, "72 inches (180cm) to reduce mag.", 'Positioning', 'Beginner');
  add("Chest rotation check?", ["Ribs", "Clavicles", "Spine", "Diaphragm"], 1, "Clavicle ends equidistant from spine.", 'Positioning', 'Intermediate');
  add("Inspiration ribs visible?", ["5-6", "8-9", "10", "12"], 2, "10 posterior ribs.", 'Positioning', 'Intermediate');
  add("KUB includes?", ["Kidney Ureter Bladder", "Knee Ulna Bone", "Kidney Upper Bowel", "None"], 0, "Abdomen plain film.", 'Positioning', 'Beginner');
  add("Hand centering point?", ["Wrist", "3rd MCP", "Palm", "Thumb"], 1, "3rd Metacarpophalangeal joint.", 'Positioning', 'Beginner');
  add("Wrist Scaphoid view angle?", ["Ulnar dev", "Radial dev", "Flexion", "Extension"], 0, "Ulnar deviation.", 'Positioning', 'Intermediate');
  add("Elbow lateral flexion?", ["45", "90", "180", "0"], 1, "90 degrees.", 'Positioning', 'Beginner');
  add("Shoulder ext rotation shows?", ["Lesser tuberosity", "Greater tuberosity", "Glenoid", "Scapula"], 1, "Greater Tuberosity in profile.", 'Positioning', 'Advanced');
  add("Y-view shoulder for?", ["Fracture", "Dislocation", "Arthritis", "Tumor"], 1, "Dislocation.", 'Positioning', 'Intermediate');
  add("AP Pelvis foot rotation?", ["External 15", "Internal 15", "Neutral", "Flexed"], 1, "Internal 15 deg to elongate neck.", 'Positioning', 'Intermediate');
  add("Frog leg is for?", ["Knee", "Hip", "Ankle", "Wrist"], 1, "Lateral Hip.", 'Positioning', 'Beginner');
  add("Sunrise view is for?", ["Skull", "Patella", "Heel", "Shoulder"], 1, "Patella (Skyline).", 'Positioning', 'Intermediate');
  add("Mortise view is for?", ["Wrist", "Ankle", "Elbow", "Knee"], 1, "Ankle joint space.", 'Positioning', 'Intermediate');
  add("Waters view usually shows?", ["Orbits", "Sinuses", "Mandible", "Ear"], 1, "Maxillary sinuses.", 'Positioning', 'Intermediate');
  add("Townes view angle?", ["30 Caudal", "30 Cephalic", "15 Caudal", "0"], 0, "30 degrees Caudal.", 'Positioning', 'Advanced');
  add("Swimmers view region?", ["C1-C2", "C7-T1", "L5-S1", "T12-L1"], 1, "Cervicothoracic junction.", 'Positioning', 'Advanced');
  add("Decubitus abdomen for?", ["Stones", "Air-Fluid levels", "Mass", "Spine"], 1, "Free air or fluid.", 'Positioning', 'Intermediate');
  add("Lordotic chest for?", ["Heart", "Apices", "Ribs", "Diaphragm"], 1, "Lung apices (Clavicles moved up).", 'Positioning', 'Intermediate');
  add("Lateral C-spine distance?", ["40 inch", "72 inch", "30 inch", "60 inch"], 1, "72 inches to reduce OID mag.", 'Positioning', 'Intermediate');
  add("Spot L5-S1 angle?", ["0", "5-8 Caudal", "20 Cephalic", "45 Oblique"], 1, "5-8 deg Caudal usually.", 'Positioning', 'Advanced');

  return q;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = generateQuestions();

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

Welcome to **RAD SAFE PRO**. This application is designed to take you from a **Beginner (Zero)** to an **Expert (Hero)** in Radiology.

---

## 📚 1. Learning Hub
The Learning Hub is the core of your education.
1.  **Modules:** Physics, Anatomy, Safety, Modalities.
2.  **AI Tutor:** Chat with "RAD AI" to explain concepts.

## 🎨 2. AI Image Lab (Pro Feature)
Generate custom radiology diagrams for study.
*   **Requires Pro:** Sign in with Google to unlock.
*   **Offline Mode:** Simulates image generation if no internet is available.

## 🏆 3. Quiz Zone
Test your knowledge.
*   **100+ Questions:** We now support massive quizzes.
*   **Dynamic:** Questions are randomized every time.

## 🌎 4. Public Awareness
Safety guides for patients.
*   **Myths:** Truth about radiation.
*   **Pregnancy:** Safety protocols.

## 🔧 5. Troubleshooting
*   **No Image?** Check your internet connection.
*   **Quiz stuck?** Refresh the page.
`;
