import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Student } from '../types';
import { Camera, Save, RotateCcw, Play, CheckCircle2, AlertTriangle } from 'lucide-react';

interface RegistrationProps {
  onRegister: (student: Student) => void;
}

export const Registration: React.FC<RegistrationProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const captureIntervalRef = useRef<number | null>(null);

  const MAX_SAMPLES = 20;

  const handleStartCapture = useCallback(() => {
    if (!name || !studentId) return;
    setIsCapturing(true);
    setCaptureCount(0);
    setCapturedImages([]);

    // Simulate high-speed capture loop
    captureIntervalRef.current = window.setInterval(() => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          setCapturedImages(prev => {
            const newImages = [...prev, imageSrc];
            setCaptureCount(newImages.length);
            
            if (newImages.length >= MAX_SAMPLES) {
              clearInterval(captureIntervalRef.current!);
              setIsCapturing(false);
            }
            return newImages;
          });
        }
      }
    }, 200); // Capture every 200ms
  }, [name, studentId]);

  const handleStopCapture = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    setIsCapturing(false);
  }, []);

  const handleSave = () => {
    if (capturedImages.length === 0) return;

    const newStudent: Student = {
      id: crypto.randomUUID(),
      name,
      studentId,
      registrationDate: new Date().toISOString(),
      sampleCount: capturedImages.length,
      avatarUrl: capturedImages[0], // Use first frame as avatar
    };

    onRegister(newStudent);
    // Reset form
    setName('');
    setStudentId('');
    setCaptureCount(0);
    setCapturedImages([]);
    alert(`Successfully registered ${newStudent.name} and trained model.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Left Column: Input & Controls */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <UserIcon /> Student Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Doe"
                disabled={isCapturing || captureCount > 0}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 2024001"
                disabled={isCapturing || captureCount > 0}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-indigo-500" /> Data Collection
          </h3>
          
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Capture Progress</span>
                <span className="font-mono font-medium text-indigo-600">{captureCount} / {MAX_SAMPLES}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                  style={{ width: `${(captureCount / MAX_SAMPLES) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {!isCapturing && captureCount < MAX_SAMPLES && (
                <button
                  onClick={handleStartCapture}
                  disabled={!name || !studentId}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play size={18} /> Start Capture
                </button>
              )}
              
              {isCapturing && (
                <button
                  onClick={handleStopCapture}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                   Stop
                </button>
              )}

              {!isCapturing && captureCount > 0 && (
                <button
                  onClick={() => { setCaptureCount(0); setCapturedImages([]); }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              )}
            </div>

            {captureCount >= MAX_SAMPLES && (
               <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-emerald-800 font-medium text-sm">Data Collection Complete</p>
                    <p className="text-emerald-600 text-xs mt-1">20 Face embeddings extracted and ready for training.</p>
                  </div>
               </div>
            )}

            <button
              onClick={handleSave}
              disabled={captureCount < MAX_SAMPLES}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10"
            >
              <Save size={18} /> Train Model & Save Student
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Camera Feed & Preview */}
      <div className="space-y-6">
        <div className="bg-black rounded-2xl overflow-hidden shadow-lg aspect-video relative group">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ width: 640, height: 360, facingMode: "user" }}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay for detection box simulation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className={`w-48 h-48 border-2 rounded-lg transition-colors duration-300 ${isCapturing ? 'border-emerald-400 animate-pulse' : 'border-white/30'}`}>
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-inherit -mt-1 -ml-1"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-inherit -mt-1 -mr-1"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-inherit -mb-1 -ml-1"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-inherit -mb-1 -mr-1"></div>
               </div>
            </div>
            
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg text-white text-xs font-mono">
              STATUS: {isCapturing ? 'EXTRACTING FEATURES...' : 'IDLE'}
            </div>
        </div>

        {/* Image Grid Preview */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Captured Samples (Preprocessing: 160x160px)</h4>
            {capturedImages.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {capturedImages.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <img src={img} alt={`Sample ${idx}`} className="w-full h-full object-cover opacity-90" />
                    <div className="absolute inset-0 bg-indigo-500/10"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                 No samples captured yet
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

const UserIcon = () => (
  <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
