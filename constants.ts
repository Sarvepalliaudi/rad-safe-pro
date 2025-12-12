
import { Section, QuizQuestion } from './types';

export const APP_METADATA = {
  title: "RAD SAFE PRO",
  subtitle: "Your Smart Radiology Learning & Safety Assistant",
  version: "3.1.0 (Public Edition)",
  downloads: [
    { label: "Download RAD SAFE PRO – Android APK", url: "https://example.com/radsafe.apk", icon: "Smartphone" },
    { label: "Download RAD SAFE PRO – Windows EXE", url: "https://example.com/radsafe.exe", icon: "Monitor" },
    { label: "Download RAD SAFE PRO – MacOS App", url: "https://example.com/radsafe.dmg", icon: "Command" },
    { label: "Download Source Code – ZIP", url: "https://example.com/radsafe.zip", icon: "FileCode" }
  ]
};

export const CONTENT_SECTIONS: Section[] = [
  // --- CORE PHYSICS ---
  {
    id: 'intro',
    title: '1. Rad Physics (Zero to Hero)',
    category: 'core',
    icon: 'Atom',
    subsections: [
      {
        title: 'Atomic Structure & EMR',
        body: '### The Fundamentals\nTo understand radiology, we must master the atom.\n\n**The Atom:**\n• **Protons (+):** Determine the element (Z number). Binding energy increases with Z.\n• **Neutrons (0):** Provide nuclear stability. Isotopes have different neutron counts.\n• **Electrons (-):** Orbit in shells (K, L, M...). K-shell has the highest binding energy (Tungsten K-shell: -69.5 keV).\n\n### Electromagnetic Radiation (EMR)\nX-rays are high-energy photons with no mass and no charge.\n\n**The Wave Equation:**\n$$c = \\lambda \\times \\nu$$\nWhere $c$ is speed of light ($3 \\times 10^8 m/s$), $\\lambda$ is wavelength, and $\\nu$ is frequency.\n\n**Energy Equation:**\n$$E = h \\times \\nu$$\nHigh frequency = High Energy = High Penetration.'
      },
      {
        title: 'The X-Ray Circuit & Tube',
        body: '### The X-Ray Tube Components\n1. **Cathode (-):** Contains the Tungsten filament. Uses **Thermionic Emission** to boil off electrons. The Focusing Cup (Nickel) keeps the electron cloud together.\n2. **Anode (+):** The target. Rotating anodes spread heat. Made of Tungsten-Rhenium alloy. The **Line Focus Principle** uses an angled target to maintain a large actual focal spot (for heat) but a small effective focal spot (for detail).\n3. **The Heel Effect:** X-ray intensity is higher on the Cathode side. Place the thickest part of the patient (e.g., Femur) under the Cathode.\n\n### The Circuit\n• **Rectification:** Converts AC to DC. High-frequency generators have <1% voltage ripple, providing constant X-ray production.'
      },
      {
        title: 'X-Ray Production',
        body: 'When electrons slam into the anode, two things happen:\n\n### 1. Bremsstrahlung ("Braking") Radiation (>85%)\n• The electron passes near the nucleus, slows down, and changes course.\n• The lost kinetic energy becomes an X-ray photon.\n• **Spectrum:** Continuous (0 to kVp Peak).\n\n### 2. Characteristic Radiation (<15%)\n• An incident electron knocks out an inner-shell (K-shell) electron.\n• An outer-shell electron drops to fill the void, releasing specific energy.\n• **Spectrum:** Discrete spike. (Occurs only above 69 kVp for Tungsten).'
      },
      {
        title: 'Interactions with Matter',
        body: 'What happens inside the patient?\n\n### 1. Photoelectric Effect (Absorption)\n• Photon strikes inner shell electron and is completely absorbed.\n• **Result:** Patient Dose + High Contrast (White on image).\n• Probability $\\propto Z^3 / E^3$. This is why bone (High Z) is white.\n\n### 2. Compton Scatter (Bad)\n• Photon hits outer shell electron, changes direction, and loses energy.\n• **Result:** Fog on image + Occupational Dose to staff.\n• **Prevention:** Collimation and Grids.\n\n### 3. Coherent Scatter\n• Low energy excitation. No ionization. Negligible in diagnostic imaging.'
      },
      {
        title: 'Image Quality Factors',
        body: '### 1. Receptor Exposure (Density)\nControlled by **mAs**. Too low = Quantum Mottle (Grainy). Too high = Saturation.\n\n### 2. Contrast\nControlled by **kVp** and Look-Up Tables (LUT). High kVp = Low Contrast (Long scale, many grays). Low kVp = High Contrast (Short scale, Black/White).\n\n### 3. Spatial Resolution (Detail)\n• **Focal Spot:** Small spot = Better detail.\n• **SID:** Long SID = Better detail.\n• **OID:** Short OID = Better detail.\n\n### 4. Distortion\n• **Magnification:** Caused by large OID or short SID.\n• **Elongation/Foreshortening:** Caused by tube or part misalignment.'
      }
    ]
  },
  
  // --- POSITIONING ---
  {
    id: 'positioning',
    title: '2. Positioning & Anatomy',
    category: 'core',
    icon: 'Move',
    subsections: [
      {
        title: 'General Principles',
        body: '### Terminology\n• **Projection:** Path of the beam (e.g., AP, PA).\n• **View:** How the image looks.\n• **Decubitus:** Patient lying down, beam horizontal (for air-fluid levels).\n\n### Golden Rules\n1. **Two Views:** Always take 2 views at 90° (AP & Lateral) to localize pathology.\n2. **Joints:** Include the joint nearest the injury. For long bones, include both joints.\n3. **Markers:** Physical L/R markers are mandatory legal requirements.'
      },
      {
        title: 'Chest & Abdomen',
        body: '### CXR (PA View)\n• **Tech:** 110-120 kVp, 72" SID.\n• **Position:** Chin up, shoulders rolled forward (scapula out), hands on hips.\n• **Breathing:** 2nd full inspiration (depress diaphragm).\n• **Critique:** 10 posterior ribs visible above diaphragm. Clavicles equidistant.\n\n### Abdomen (KUB)\n• **Tech:** 70-80 kVp, 40" SID.\n• **Landmark:** Iliac Crest.\n• **Must Include:** Symphysis pubis to upper kidney pole.\n• **Breathing:** Expiration (elevates diaphragm).'
      },
      {
        title: 'Upper Extremity',
        body: '### Hand\n• **Views:** PA, Oblique (fan fingers), Lateral (fan or extension).\n• **Center:** 3rd MCP joint.\n\n### Wrist\n• **Views:** PA, Lateral, Oblique.\n• **Scaphoid View:** Ulnar deviation to elongate scaphoid (most common #).\n\n### Elbow\n• **AP:** Arm fully extended. Condyles parallel to film.\n• **Lateral:** Flex 90°. Thumb up. Condyles perpendicular. Look for "Fat Pad Sign".'
      },
      {
        title: 'Lower Extremity',
        body: '### Foot\n• **AP:** Angling tube 10° toward heel (posteriorly) to open TMT joints.\n• **Oblique:** Medial rotation 30°.\n\n### Ankle\n• **Mortise View:** Internally rotate leg 15-20°. This opens the lateral and medial malleoli joint spaces.\n• **Lateral:** Include base of 5th metatarsal (Jones fracture).\n\n### Knee\n• **AP:** CR angle depends on ASIS measurement (<19cm: 5° caudad, >24cm: 5° cephalad).\n• **Lateral:** Flex knee 20-30°. CR 5-7° cephalad to superimpose condyles.'
      },
      {
        title: 'Spine Imaging',
        body: '### Cervical Spine\n• **Open Mouth (Odontoid):** "Ahh" to depress tongue. Visualizes C1-C2 dens.\n• **Lateral:** 72" SID to reduce magnification. Must see C7-T1 junction (Swimmer\'s view if needed).\n\n### Lumbar Spine\n• **AP:** Knees flexed to flatten lordosis.\n• **Oblique:** "Scottie Dog" sign. Nose = Transverse Process, Eye = Pedicle, Neck = Pars Interarticularis (Spondylolysis check).'
      }
    ]
  },

  // --- SAFETY ---
  {
    id: 'safety',
    title: '3. Radiobiology & Protection',
    category: 'safety',
    icon: 'ShieldAlert',
    subsections: [
      {
        title: 'Biological Effects',
        body: '### Direct vs Indirect\n• **Direct:** X-ray hits DNA. Rare.\n• **Indirect:** X-ray hits Water ($H_2O$) -> Radiolysis -> Free Radicals ($H_2O_2$) -> DNA damage. Most common.\n\n### Sensitivity (Law of Bergonie & Tribondeau)\nCells are most sensitive if they are:\n1. Rapidly dividing.\n2. Undifferentiated (Stem cells).\n3. Have a long mitotic future.\n**Most Sensitive:** Lymphocytes, Spermatogonia.\n**Least Sensitive:** Nerve, Muscle.'
      },
      {
        title: 'Dose Limits (NCRP)',
        body: '### Occupational Limits\n• **Annual:** 50 mSv (5 rem).\n• **Cumulative:** $10 \\text{ mSv} \\times \\text{Age}$.\n• **Lens of Eye:** 150 mSv.\n\n### Public Limits\n• **Annual:** 1 mSv (frequent exposure).\n\n### Embryo/Fetus\n• **Total Gestation:** 5 mSv.\n• **Monthly:** 0.5 mSv.'
      },
      {
        title: 'Monitoring Devices',
        body: '### OSL (Optically Stimulated Luminescence)\n• Uses Aluminum Oxide ($Al_2O_3$).\n• Read by Laser.\n• Can be re-read. Sensitive to 1 mrem.\n\n### TLD (Thermo-Luminescent Dosimeter)\n• Uses Lithium Fluoride (LiF).\n• Read by Heat.\n• Resembles tissue effective Z.'
      },
      {
        title: 'ALARA in Practice',
        body: '### 1. Time\nMinimize "beam-on" time. Use "Last Image Hold" in fluoro.\n\n### 2. Distance (Most Effective)\n**Inverse Square Law:** Doubling distance reduces dose to 1/4.\n$$I_1/I_2 = (D_2)^2 / (D_1)^2$$\n\n### 3. Shielding\n• **Aprons:** 0.5mm Pb eq usually.\n• **Primary Barrier:** Blocks direct beam (1/16" Pb).\n• **Secondary Barrier:** Blocks scatter/leakage (1/32" Pb).'
      }
    ]
  },

  // --- MODALITIES ---
  {
    id: 'modalities',
    title: '4. Advanced Modalities',
    category: 'advanced',
    icon: 'Scan',
    subsections: [
      {
        title: 'Computed Tomography (CT)',
        body: '### Principles\n• **Gantry:** Houses tube and detectors.\n• **Helical Scan:** Continuous table feed + slip-ring rotation.\n• **Pitch:** Table movement per rotation / Beam width. Pitch > 1 lowers dose but lowers resolution.\n\n### Image Data\n• **Voxel:** Volume element (3D).\n• **Hounsfield Units (HU):**\n  - Bone: +1000\n  - Water: 0\n  - Fat: -100\n  - Air: -1000\n• **Windowing:** "Window Width" controls contrast (gray scale). "Window Level" controls brightness (center HU).'
      },
      {
        title: 'MRI Physics',
        body: '### How it Works\n1. Strong magnet ($B_0$) aligns Hydrogen protons.\n2. RF pulse flips them.\n3. Proton relaxation emits signal.\n\n### Sequences\n• **T1 Weighted:** Fat is Bright. Water is Dark. Good for anatomy.\n• **T2 Weighted:** Water is Bright (WW2 - Water White T2). Good for pathology/edema.\n• **Safety:** The magnet is ALWAYS ON. No pacemakers, cochlear implants, or ferrous metal.'
      },
      {
        title: 'Fluoroscopy',
        body: '### Image Intensifier (II)\nConverts weak X-rays into bright visible light.\n1. **Input Phosphor (CsI):** X-ray -> Light.\n2. **Photocathode:** Light -> Electrons.\n3. **Electrostatic Lenses:** Focus electrons.\n4. **Output Phosphor (ZnCdS):** Electrons -> Bright Light.\n\n### Magnification Mode\nFocuses electrons on smaller input area. **Result:** Better resolution, but HIGHER patient dose.'
      }
    ]
  },

  // --- PROCEDURES ---
  {
    id: 'procedures',
    title: '5. Patient Care & Procedures',
    category: 'advanced',
    icon: 'FlaskConical',
    subsections: [
      {
        title: 'Vital Signs & Emergency',
        body: '### Normal Ranges (Adult)\n• **BP:** 120/80 mmHg.\n• **Pulse:** 60-100 bpm.\n• **Respiration:** 12-20 bpm.\n• **Temp:** 98.6°F (37°C).\n\n### Shock Types\n• **Hypovolemic:** Loss of blood/fluid.\n• **Anaphylactic:** Allergic reaction (Vasodilation).\n• **Cardiogenic:** Heart failure.\n• **Neurogenic:** Spinal cord injury.'
      },
      {
        title: 'Contrast Media',
        body: '### Iodinated Contrast\n• **Ionic:** High osmolality (dissociates). More reactions.\n• **Non-Ionic:** Low osmolality. Safer, costs more.\n\n### Reactions\n• **Mild:** Hives, warmth, metal taste. (Monitor).\n• **Moderate:** Tachycardia, swelling. (Medical assistance).\n• **Severe:** Anaphylaxis, cardiac arrest. (Code Blue, Epinephrine).\n• **Pre-check:** BUN (8-25) and Creatinine (0.6-1.5).'
      },
      {
        title: 'Aseptic Technique',
        body: '• **Medical Asepsis:** Reducing pathogens (Hand washing, sanitizing).\n• **Surgical Asepsis:** Removing ALL microorganisms (Sterile field).\n• **Sterile Field Rules:**\n  - Never turn your back on a sterile field.\n  - Only sterile items touch sterile items.\n  - 1-inch border is considered unsterile.'
      }
    ]
  },
  
  // --- PUBLIC AWARENESS (EXPANDED) ---
  {
    id: 'awareness',
    title: 'Public Awareness & Safety / பொது விழிப்புணர்வு',
    category: 'public',
    icon: 'HeartHandshake',
    subsections: [
      {
        title: '☢️ Understanding Radiation (English)',
        body: '### What is Radiation?\nRadiation is simply energy that travels as waves or particles. It is part of our natural environment.\n\n**Types:**\n1. **Non-Ionizing (Safe):** Radio waves, Microwaves, Visible light, Wi-Fi. These **cannot** damage DNA.\n2. **Ionizing (Use with Care):** X-rays, Gamma rays. These can remove electrons from atoms, so we use them carefully.\n\n### Daily Exposure\nYou are exposed to background radiation every day from:\n• The Sun (Cosmic radiation).\n• The Earth (Radon gas in soil).\n• Food (Bananas contain Potassium-40).\n\n**Comparison:**\n• 1 Chest X-ray $\\approx$ 10 days of natural background radiation.\n• 1 Flight (India to USA) $\\approx$ 5-8 Chest X-rays.'
      },
      {
        title: '☢️ கதிர்வீச்சு என்றால் என்ன? (Tamil)',
        body: '### அறிமுகம்\nகதிர்வீச்சு (Radiation) என்பது அலைகள் அல்லது துகள்களாக பயணிக்கும் ஆற்றல். இது நமது இயற்கையான சூழலின் ஒரு பகுதியாகும்.\n\n### கதிர்வீச்சு வகைகள்\n1. **அயனியாக்காத கதிர்வீச்சு (பாதுகாப்பானது):** ரேடியோ அலைகள், மைக்ரோவேவ், செல்போன், சாதாரண வெளிச்சம். இவை ஆபத்தானவை அல்ல.\n2. **அயனியாக்கும் கதிர்வீச்சு (கவனிக்க வேண்டியவை):** எக்ஸ்-கதிர்கள் (X-rays), காமா கதிர்கள். இவற்றை நாம் மருத்துவ தேவைக்கு மட்டுமே பயன்படுத்துகிறோம்.\n\n### அன்றாட வாழ்வில் கதிர்வீச்சு\nநாம் தினமும் இயற்கையிலிருந்து கதிர்வீச்சை பெறுகிறோம்:\n• சூரியன் (காஸ்மிக் கதிர்கள்)\n• பூமி (மண்ணில் உள்ள ரேடான்)\n• உணவு (வாழைப்பழத்தில் பொட்டாசியம்-40 உள்ளது)\n\n**ஒப்பீடு:**\n• ஒரு நெஞ்சு எக்ஸ்-ரே = 10 நாட்கள் இயற்கையான கதிர்வீச்சுக்கு சமம்.'
      },
      {
        title: '🚫 Myth Busters: Common Fears (English)',
        body: '### Myth 1: "I will be radioactive/glow after an X-ray."\n**Fact:** **FALSE.** X-rays are like light from a bulb. Once the switch is off, it is gone instantly. You do **not** carry any radiation. You can safely hug children or babies immediately.\n\n### Myth 2: "Technologists leave the room because it\'s deadly."\n**Fact:** **Context Matters.** You get an X-ray once a year. The technologist takes 50+ X-rays daily. They leave to avoid **cumulative** exposure over 30 years of work, not because a single X-ray is dangerous to you.\n\n### Myth 3: "MRI uses heavy radiation."\n**Fact:** **FALSE.** MRI uses **Magnets** and **Radio Waves**. It has ZERO radiation. It is completely safe, even for children.\n\n### Myth 4: "X-rays cause immediate hair loss."\n**Fact:** **FALSE.** Diagnostic X-rays (Chest, bone) are too weak for this. Only high-dose Radiation Therapy (for cancer treatment) causes hair loss.\n\n### Myth 5: "Mobile phones cause cancer like X-rays."\n**Fact:** **FALSE.** Mobiles use radio waves (non-ionizing). There is no proven link to DNA damage.'
      },
      {
        title: '🚫 கட்டுக்கதைகள் vs உண்மைகள் (Tamil)',
        body: '### கட்டுக்கதை 1: "எக்ஸ்-ரே எடுத்த பிறகு என் உடலில் கதிர்வீச்சு தங்கிவிடுமா?"\n**உண்மை:** **இல்லை.** எக்ஸ்-ரே என்பது கேமரா ஃபிளாஷ் போன்றது. சுவிட்சை அணைத்தவுடன் அது மறைந்துவிடும். உங்கள் உடலில் கதிர்வீச்சு தங்காது. பரிசோதனைக்குப் பிறகு நீங்கள் குழந்தைகளை தாராளமாக நெருங்கலாம்.\n\n### கட்டுக்கதை 2: "மருத்துவர்கள் ஏன் அறையை விட்டு வெளியேறுகிறார்கள்?"\n**உண்மை:** உங்களுக்கு எக்ஸ்-ரே எப்போதாவது ஒருமுறை தான் எடுக்கப்படுகிறது. ஆனால் மருத்துவர்கள் தினமும் நூற்றுக்கணக்கான எக்ஸ்-ரே எடுக்கிறார்கள். அவர்கள் தங்கள் வாழ்நாள் முழுவதும் சேரும் கதிர்வீச்சை தவிர்க்கவே வெளியேறுகிறார்கள்.\n\n### கட்டுக்கதை 3: "எம்.ஆர்.ஐ (MRI) ஸ்கேனில் அதிக கதிர்வீச்சு உள்ளதா?"\n**உண்மை:** **இல்லை.** எம்.ஆர்.ஐ காந்த அலைகளை (Magnets) பயன்படுத்துகிறது. இதில் கதிர்வீச்சு ஆபத்து இல்லை.\n\n### கட்டுக்கதை 4: "எக்ஸ்-ரே எடுத்தால் முடி கொட்டுமா?"\n**உண்மை:** **இல்லை.** சாதாரண எக்ஸ்-ரே கதிர்களால் முடி கொட்டாது. புற்றுநோய் சிகிச்சைக்கான கதிர்வீச்சு மட்டுமே அதிக சக்தி வாய்ந்தது.'
      },
      {
        title: '🚫 मिथक और सच्चाई (Hindi)',
        body: '### मिथक 1: "एक्स-रे के बाद मेरा शरीर रेडियोधर्मी हो जाएगा।"\n**सच्चाई:** गलत। एक्स-रे रोशनी की तरह होता है। मशीन बंद होते ही यह खत्म हो जाता है। आप तुरंत अपने परिवार के साथ रह सकते हैं।\n\n### मिथक 2: "डॉक्टर कमरे से बाहर क्यों जाते हैं?"\n**सच्चाई:** आपको साल में एक बार एक्स-रे कराना होता है, लेकिन डॉक्टर रोज 50+ एक्स-रे करते हैं। वे अपनी सुरक्षा के लिए बाहर जाते हैं ताकि उन्हें जीवन भर विकिरण न लगे।\n\n### मिथक 3: "MRI में बहुत विकिरण होता है।"\n**सच्चाई:** गलत। MRI चुंबक (Magnet) का उपयोग करता है। इसमें कोई विकिरण नहीं होता है।'
      },
      {
        title: '🤰 Pregnancy & Women\'s Safety',
        body: '### English Guide\n• **Inform First:** Always tell the technologist if there is **any chance** you might be pregnant.\n• **The 10-Day Rule:** Elective abdominal X-rays are best done in the first 10 days of your menstrual cycle (when pregnancy is least likely).\n• **Shielding:** If an X-ray is necessary (e.g., trauma), we cover the abdomen with a lead apron to protect the baby.\n• **Breastfeeding:** Diagnostic X-rays and CT scans do **not** affect breast milk. You can feed your baby immediately after.\n\n### தமிழ் வழிகாட்டி (Tamil Guide)\n• **தெரிவிக்கவும்:** நீங்கள் கர்ப்பமாக இருக்க வாய்ப்பு இருந்தால், உடனே மருத்துவரிடம் கூறவும்.\n• **பாதுகாப்பு:** அவசியம் எக்ஸ்-ரே எடுக்க நேர்ந்தால், குழந்தையின் பாதுகாப்பிற்கு "ஈய உடை" (Lead Apron) வழங்கப்படும்.\n• **தாய்ப்பால்:** எக்ஸ்-ரே மற்றும் சிடி ஸ்கேன் கதிர்கள் தாய்ப்பாலை பாதிக்காது. பரிசோதனை முடிந்தவுடன் நீங்கள் குழந்தைக்கு பாலூட்டலாம்.'
      },
      {
        title: '🛡️ Your Rights as a Patient',
        body: '### Always Ask For:\n1. **Lead Apron:** When getting a dental or extremity X-ray, ask for a shield for your body.\n2. **Thyroid Shield:** Protects your thyroid gland.\n3. **Justification:** Ask "Is this scan absolutely necessary?"\n\n### Avoid Repetition\nBring your old reports and X-ray films to new doctors. This stops them from ordering the same scan again!'
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
