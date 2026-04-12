# 🛡️ True Trace Forge (Kavach AI)

**True Trace Forge** is a next-generation specialized digital forensics and deepfake detection platform designed for law enforcement and cybersecurity agencies. It provides real-time, mathematically authentic analysis of manipulated media using advanced computer vision and signal processing algorithms.

![Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070)

## 🚀 Key Features

### 🔍 Genuine ML Forensic Engine
Unlike shallow detection tools, True Trace Forge utilizes a multi-layered mathematical approach to identify synthetic artifacts:
- **Spatial Entropy Mapping:** Detects unnatural pixel distributions andGAN-generated noise patterns.
- **Error Level Analysis (ELA):** Identifies image splicing and manipulation by analyzing JPEG compression differentials.
- **Audio Signal Forensics:** Uses Zero-Crossing Rate (ZCR) and spectral analysis to distinguish human vocal tract resonance from AI voice cloning.

### 🚔 Police Command Center
- **Live Triage:** Real-time feed of flagged media from the analysis engine.
- **Action Protocols:** Automated severity classification (Critical, Suspicious, Authentic) with built-in enforcement toolkits.
- **Dynamic Analytics:** Real-time crime category tracking and hotspot mapping using persistent database syncing.

### 🧬 Advanced Forensic Modules
- **Forensic Lab:** Deep-dive analysis with spectrograms, temporal consistency checks, and metadata extraction.
- **Propagation Tracker:** Maps how manipulated content spreads across social platforms.
- **Courtroom Evidence:** Generates cryptographically sealed chain-of-custody reports for legal admissibility.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18 & Vite** (High-performance UI)
- **Tailwind CSS** (Premium Dark Tech aesthetics)
- **Shadcn/UI & Lucide** (Component library & iconography)
- **Recharts** (Dynamic forensic data visualization)

### **Backend**
- **FastAPI (Python)** (Async high-concurrency API)
- **SQLAlchemy & PostgreSQL** (Persistent evidence logging)
- **OpenCV & NumPy** (Computer Vision & mathematical forensics)
- **SciPy & Pillow** (Signal processing & image ELA)

---

## 📦 Installation & Setup

### **1. Backend Setup**
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python main.py
```

### **2. Frontend Setup**
Navigate to the frontend directory and start the dev server:
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment on Render

### **Database (PostgreSQL)**
1. Create a new **PostgreSQL** instance on Render.
2. Copy the **Internal Database URL**.

### **Backend (Python Web Service)**
1. Create a new **Web Service** pointing to the `/backend` root directory.
2. **Build Command:** `pip install -r requirements.txt`
3. **Start Command:** `python main.py`
4. **Env Var:** Add `DATABASE_URL` with your Render Postgres URL.

### **Frontend (Static Site)**
1. Point to the `/frontend` root directory.
2. **Build Command:** `npm run build`
3. **Publish Directory:** `dist`
4. **Env Var:** Add `VITE_API_URL` pointing to your deployed backend URL.

---

## ⚖️ Legal & Ethical Use
This tool is designed for investigative assistance. All analysis should be verified by a certified forensic expert before being used as primary evidence in legal proceedings.

**Developed for the ISB Hackathon on Cybersecurity & AI Safety 2025–26.**
