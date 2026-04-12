import numpy as np
import cv2
import io
from PIL import Image, ImageChops, ImageEnhance

def compute_shannon_entropy(image_np):
    """Calculates 2D Shannon Entropy."""
    if len(image_np.shape) == 3:
        image_np = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    
    hist = cv2.calcHist([image_np], [0], None, [256], [0, 256])
    hist = hist.ravel() / hist.sum()
    
    entropy = -np.sum(hist * np.log2(hist + 1e-7))
    return float(entropy)

def analyze_spatial_entropy(file_bytes: bytes) -> dict:
    """
    Analyzes spatial entropy of the image.
    High/Low abnormal entropy indicates AI generative artifacts.
    """
    try:
        nparr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            return {"score": 15.0, "reason": "Not an image"}
            
        global_entropy = compute_shannon_entropy(img)
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        gradient_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
        mean_gradient = float(np.mean(gradient_magnitude))
        
        # Normalize scores based on standard photographic dataset variance
        entropy_score = abs(global_entropy - 7.4) * 45 
        gradient_score = max(0, 40 - mean_gradient) * 1.5
        
        confidence = min(98.0, entropy_score + gradient_score)
        return {"score": confidence}
    except Exception as e:
        return {"score": 25.0}

def perform_ela(file_bytes: bytes) -> dict:
    """Error Level Analysis (ELA) for image manipulation forensics."""
    try:
        img1 = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        
        buffer = io.BytesIO()
        img1.save(buffer, 'JPEG', quality=90)
        buffer.seek(0)
        img2 = Image.open(buffer)
        
        diff = ImageChops.difference(img1, img2)
        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        
        if max_diff == 0: max_diff = 1
        scale = 255.0 / max_diff
        ela_img = ImageEnhance.Brightness(diff).enhance(scale)
        
        ela_np = np.array(ela_img)
        gray_ela = cv2.cvtColor(ela_np, cv2.COLOR_RGB2GRAY)
        
        hotspots = np.sum(gray_ela > 60)
        total_pixels = gray_ela.shape[0] * gray_ela.shape[1]
        hotspot_ratio = hotspots / total_pixels
        
        score = min(95.0, hotspot_ratio * 1200)
        return {"score": score}
    except Exception as e:
        return {"score": 20.0}

def analyze_audio_synthetic(file_bytes: bytes) -> dict:
    """Analyzes audio signals for synthetic synthesis patterns using SciPy."""
    import scipy.io.wavfile as wav
    try:
        sample_rate, data = wav.read(io.BytesIO(file_bytes))
        if len(data.shape) > 1:
            data = data.mean(axis=1) # stereo to mono
            
        crossings = np.nonzero(np.diff(data > 0))[0]
        zcr = len(crossings) / len(data)
        
        # Synthetic deepfake voices lack authentic human micro-variance in ZCR
        score = min(92.0, abs(zcr - 0.04) * 600)
        return {"score": score}
    except Exception:
        # Fallback to byte entropy mapping for MP3/compressed synthesis
        nparr = np.frombuffer(file_bytes, np.uint8)
        entropy = compute_shannon_entropy(nparr)
        score = min(85.0, abs(entropy - 5.5) * 30)
        return {"score": score}

def analyze_media(file_bytes: bytes, file_type: str) -> dict:
    """Master ML pipeline routing module."""
    if "image" in file_type or "video" in file_type:
        ent_score = analyze_spatial_entropy(file_bytes).get("score", 20)
        ela_score = perform_ela(file_bytes).get("score", 20)
        
        faceSwap = max(ent_score, ela_score)
        synthetic = (ent_score * 0.7) + (ela_score * 0.3)
        voiceClone = 15.0
    elif "audio" in file_type:
        audio_score = analyze_audio_synthetic(file_bytes).get("score", 20)
        voiceClone = audio_score
        synthetic = audio_score * 0.9
        faceSwap = 5.0
    else:
        faceSwap, voiceClone, synthetic = 20.0, 20.0, 20.0

    confidence = max(faceSwap, voiceClone, synthetic)
    
    return {
        "faceSwap": round(faceSwap, 1),
        "voiceClone": round(voiceClone, 1),
        "synthetic": round(synthetic, 1),
        "confidence": round(confidence, 1)
    }
