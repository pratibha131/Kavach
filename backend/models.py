from sqlalchemy import Column, String, Float, Integer, Boolean, Text
from database import Base

class CaseDB(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True)
    fileName = Column(String)
    fileType = Column(String)
    fileSize = Column(String)
    timestamp = Column(String)
    verdict = Column(String)
    confidence = Column(Float)
    faceSwap = Column(Float)
    voiceClone = Column(Float)
    synthetic = Column(Float)
    fingerprint = Column(String)
    modelFamily = Column(String)
    severity = Column(String)
    action = Column(String)
    fileHash = Column(String)
    analysisHash = Column(String)
    crimeCategory = Column(String, default="Financial Fraud")
    
    transcript = Column(Text, nullable=True)
    scamMatchesStr = Column(Text, nullable=True)
    narrativeRisk = Column(Float, nullable=True)
    keywordsStr = Column(Text, nullable=True)
    
    platforms = Column(Integer)
    totalShares = Column(Integer)
    spreadStatus = Column(String)
    
    honeypotTriggered = Column(Boolean)
    honeypotTriggers = Column(Integer)
    kycFlagged = Column(Boolean)
    
    redTeamDetected = Column(Boolean)
    redTeamConfidence = Column(Float)
    
    tamperTimestampsStr = Column(Text)
    chainOfCustodyStr = Column(Text)
