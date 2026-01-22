
# RAD SAFE PRO ☢️

**Your Smart Radiology Learning & Safety Assistant**

RAD SAFE PRO is a comprehensive, mobile-first educational platform designed for Allied Health Science (AHS) Radiology students. It combines learning modules, safety calculators, and AI-powered assistance into a clean, professional interface.

## 📱 Features

- **Learning Hub:** Core radiology concepts, physics, and positioning.
- **Sensor Dosimetry Lab:** Experimental radiation detection simulator using CMOS and Motion sensors.
- **Dynamic Quiz Zone:** Customizable quizzes with randomization and explanations.
- **Radiation Calculators:** Inverse Square Law, mAs, Exposure Time, Shielding.
- **AI Assistant:** "Rad AI" for instant safety tips and dose prediction.
- **Anatomy Spotters:** Interactive image labeling.

## 🔬 Sensor Dosimetry Lab (Technical Manual)

The **Sensor Dosimetry Lab** is an advanced educational simulator that utilizes mobile hardware to demonstrate the principles of radiation physics.

### 1. CMOS Interaction Theory
Smartphone camera sensors are made of silicon. When high-energy photons (X-rays/Gamma) strike a silicon pixel, they displace electrons, creating "noise" or "hot pixels". 
- **Method:** The app analyzes the raw camera feed in real-time, scanning for pixel intensities that exceed a defined ionizing threshold.
- **Masking:** For best results in demonstration, cover the camera lens with black electrical tape. This blocks visible light while allowing high-energy particles to penetrate the phone casing and strike the sensor.

### 2. Sensor Fusion (Motion & Gyro)
Radiation detection in a clinical field is sensitive to movement.
- **Accelerometer Integration:** The app captures `DeviceMotionEvent` to simulate the volatility of a mobile dosimeter. Movement increases the "reading" noise to teach students about the importance of device stability during field surveys.
- **Gyroscope Calibration:** Used to determine the angle of the "scatter cloud" in AR mode.

### 3. AR Heatmap Simulation
Using the **Compton Scatter** principle, the app overlays a live heatmap on the human body.
- **Scatter Cloud:** Visualizes the 90-degree scatter originating from the center of the patient (the primary source of occupational dose).
- **Inverse Square Law:** The visual flux intensity decreases exponentially as the user moves the device physically further from the simulated source.

## 🚀 Installation

### Web / Desktop
1. Clone the repository.
2. Run `npm install`.
3. Set your `API_KEY` in environment variables.
4. Run `npm start`.

### Permissions Required
- **Camera:** Required for CMOS noise analysis and AR Heatmap.
- **Motion/Accelerometer:** Required for Sensor Fusion dosimetry.

## 📄 License
Educational Use Only. Not for clinical diagnostic purposes. Smartphone sensors are not professional safety equipment.
