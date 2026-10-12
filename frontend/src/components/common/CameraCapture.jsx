import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiX, FiRefreshCw, FiCheck, FiAlertCircle, FiZap } from "react-icons/fi";
import { Button } from "../ui";

const CameraCapture = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (isOpen) startCamera();
    return () => stopCamera();
    // eslint-disable-next-line
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Camera error:", err);
      setError("Unable to access camera. Please allow camera permission in your browser settings.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    // Flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    setTimeout(() => setCapturedImage(dataUrl), 100);
  };

  const handleRetake = () => setCapturedImage(null);

  const handleConfirm = () => {
    if (!capturedImage) return;
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `capture_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        onCapture(file, capturedImage);
        stopCamera();
        onClose();
      });
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #0F3C82 0%, #0a1929 60%, #060e1e 100%)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Top gradient stripe */}
            <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-royal-500 via-flame-500 to-flame-400" />

            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-flame-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-royal-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-flame-500 rounded-xl blur-md opacity-50" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-flame-500 to-flame-600 flex items-center justify-center shadow-lg shadow-flame-500/40">
                    <FiCamera className="text-white" size={16} />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-black text-base">Take Photo</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                    Camera Capture
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300 transition-all cursor-pointer"
                aria-label="Close"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="relative p-5">
              {error ? (
                <div className="p-6 rounded-2xl bg-red-500/10 border border-red-400/30 text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/20 border border-red-400/30 flex items-center justify-center mb-3">
                    <FiAlertCircle className="text-red-400" size={20} />
                  </div>
                  <p className="text-sm font-bold text-red-200">{error}</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] border border-white/10">
                  {/* Video / Image */}
                  {!capturedImage ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.img
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Face guide overlay (only when previewing) */}
                  {!capturedImage && !error && (
                    <>
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Corner brackets */}
                        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-flame-400 rounded-tl-lg" />
                        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-flame-400 rounded-tr-lg" />
                        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-flame-400 rounded-bl-lg" />
                        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-flame-400 rounded-br-lg" />

                        {/* Live indicator */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/80 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="text-[9px] font-black text-white uppercase tracking-widest">
                            Live
                          </span>
                        </div>

                        {/* Hint */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                          <p className="text-[10px] font-bold text-white/80">
                            Position face inside frame
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Flash effect */}
                  <AnimatePresence>
                    {flash && (
                      <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 bg-white pointer-events-none"
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              {/* Controls */}
              {!error && (
                <div className="flex items-center justify-center gap-3 mt-5">
                  {!capturedImage ? (
                    <Button
                      onClick={handleCapture}
                      variant="primary"
                      size="lg"
                      icon={<FiZap />}
                    >
                      Capture Photo
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleRetake}
                        variant="ghost"
                        size="md"
                        icon={<FiRefreshCw />}
                      >
                        Retake
                      </Button>
                      <Button
                        onClick={handleConfirm}
                        variant="success"
                        size="md"
                        icon={<FiCheck />}
                      >
                        Use Photo
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CameraCapture;