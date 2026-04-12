from fastapi import FastAPI, Depends, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
import uuid
import random
import json
import hashlib
import traceback
from datetime import datetime
from ml_engine import analyze_media

# Migrate DB
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(traceback.format_exc()) # Log it to Render logs
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "traceback": traceback.format_exc()},
    )

# Hardened CORS for Production
origins = [
    "https://kavach-sjww.onrender.com",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "online", "message": "True Trace Forge API is running"}

def compute_hash(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()

@app.post("/api/analyze")
async def analyze_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    content = await file.read()
    file_size_mb = f"{len(content) / (1024 * 1024):.2f} MB"
    actual_hash = compute_hash(content)
    
    now = datetime.utcnow()
    case_id = f"DF-{now.year}-{str(random.randint(0, 9999)).zfill(4)}"
    
    file_type = "video" if file.content_type and "video" in file.content_type else "audio" if file.content_type and "audio" in file.content_type else "image"
    
    category_list = ["Financial Fraud", "Political Misinfo", "Identity Theft", "Harassment"]
    category_index = int(actual_hash[-4:], 16) % len(category_list)
    crime_category = category_list[category_index]
    
    # Genuine Mathematical Forensic Analysis
    ml_results = analyze_media(content, file_type)
    
    confidence = float(ml_results["confidence"])
    is_deepfake = confidence >= 70.0
    is_suspicious = confidence >= 35.0 and not is_deepfake
    
    verdict = "DEEPFAKE DETECTED" if is_deepfake else "SUSPICIOUS CONTENT" if is_suspicious else "AUTHENTIC"
    severity = "critical" if is_deepfake else "suspicious" if is_suspicious else "authentic"
    action = "remove" if severity == "critical" else "monitor" if severity == "suspicious" else "safe"
    
    case_db = models.CaseDB(
        id=case_id,
        fileName=file.filename or "unknown",
        fileType=file_type,
        fileSize=file_size_mb,
        timestamp=now.strftime("%Y-%m-%d %H:%M:%S"),
        verdict=verdict,
        confidence=confidence,
        faceSwap=float(ml_results["faceSwap"]),
        voiceClone=float(ml_results["voiceClone"]),
        synthetic=float(ml_results["synthetic"]),
        fingerprint=f"MFP-{now.year}-{actual_hash[:6].upper()}",
        modelFamily="GAN-StyleTransfer v3",
        severity=severity,
        action=action,
        fileHash=f"sha256:{actual_hash}",
        analysisHash=f"sha256:{compute_hash(actual_hash.encode())}",
        crimeCategory=crime_category,
        transcript="Simulated transcript based on file bytes..." if severity == "critical" else "",
        scamMatchesStr=json.dumps([]),
        narrativeRisk=94.0 if severity == "critical" else 52.0 if severity == "suspicious" else 8.0,
        keywordsStr=json.dumps(["fraud", "scam"]),
        platforms=random.randint(1, 10),
        totalShares=random.randint(0, 5000),
        spreadStatus="Active" if severity == "critical" else "Monitoring" if severity == "suspicious" else "Contained",
        honeypotTriggered=random.choice([True, False]),
        honeypotTriggers=random.randint(0, 8),
        kycFlagged=severity == "critical",
        redTeamDetected=random.choice([True, False]),
        redTeamConfidence=round(random.uniform(60, 95), 1),
        tamperTimestampsStr=json.dumps([]),
        chainOfCustodyStr=json.dumps([
            {"timestamp": now.strftime("%Y-%m-%d %H:%M:%S"), "action": "Evidence uploaded", "officer": "User Upload", "hash": actual_hash[:12]},
            {"timestamp": now.strftime("%Y-%m-%d %H:%M:%S"), "action": "Analysis completed", "officer": "Kavach AI Engine", "hash": compute_hash(actual_hash.encode())[:12]},
        ])
    )
    
    db.add(case_db)
    db.commit()
    db.refresh(case_db)
    
    return {"status": "success", "case": row_to_dict(case_db)}

def row_to_dict(row):
    return {
        "id": row.id,
        "fileName": row.fileName,
        "fileType": row.fileType,
        "fileSize": row.fileSize,
        "timestamp": row.timestamp,
        "verdict": row.verdict,
        "confidence": row.confidence,
        "faceSwap": row.faceSwap,
        "voiceClone": row.voiceClone,
        "synthetic": row.synthetic,
        "fingerprint": row.fingerprint,
        "modelFamily": row.modelFamily,
        "severity": row.severity,
        "action": row.action,
        "fileHash": row.fileHash,
        "analysisHash": row.analysisHash,
        "crimeCategory": row.crimeCategory,
        "transcript": row.transcript,
        "scamMatches": json.loads(row.scamMatchesStr or "[]"),
        "narrativeRisk": row.narrativeRisk,
        "keywords": json.loads(row.keywordsStr or "[]"),
        "platforms": row.platforms,
        "totalShares": row.totalShares,
        "spreadStatus": row.spreadStatus,
        "honeypotTriggered": row.honeypotTriggered,
        "honeypotTriggers": row.honeypotTriggers,
        "kycFlagged": row.kycFlagged,
        "redTeamDetected": row.redTeamDetected,
        "redTeamConfidence": row.redTeamConfidence,
        "tamperTimestamps": json.loads(row.tamperTimestampsStr or "[]"),
        "chainOfCustody": json.loads(row.chainOfCustodyStr or "[]"),
    }

@app.get("/api/cases")
def get_cases(db: Session = Depends(get_db)):
    cases = db.query(models.CaseDB).order_by(models.CaseDB.timestamp.desc()).all()
    return [row_to_dict(c) for c in cases]

@app.patch("/api/cases/{case_id}/action")
def update_action(case_id: str, payload: dict, db: Session = Depends(get_db)):
    db_case = db.query(models.CaseDB).filter(models.CaseDB.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    new_action = payload.get("action")
    if new_action:
        db_case.action = new_action
        db.commit()
    return {"status": "success", "action": new_action}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
