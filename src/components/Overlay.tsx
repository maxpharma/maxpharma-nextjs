import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ isOpen, onClose, children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle animations when isOpen changes
  useEffect(() => {
    if (!overlayRef.current || !backdropRef.current || !contentRef.current)
      return;

    // First mount setup
    if (!mounted && isOpen) {
      setMounted(true);

      // Initial backdrop state
      gsap.set(backdropRef.current, { opacity: 0 });

      // Initial content state based on device
      if (isMobile) {
        // For mobile: start from bottom, no scaling
        gsap.set(contentRef.current, { y: "100%", opacity: 0 });
      } else {
        // For desktop: start with scale 0
        gsap.set(contentRef.current, { scale: 0, opacity: 0 });
      }

      // Animate in
      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.3 });

      if (isMobile) {
        // Mobile animation: slide up from bottom
        tl.to(
          contentRef.current,
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.1"
        );
      } else {
        // Desktop animation: scale up
        tl.to(
          contentRef.current,
          { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.1"
        );
      }

      return;
    }

    // Handle open/close animations
    if (isOpen) {
      // Animate in
      const tl = gsap.timeline();
      tl.to(backdropRef.current, { opacity: 1, duration: 0.3 });

      if (isMobile) {
        // Mobile animation: slide up from bottom
        tl.to(
          contentRef.current,
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.1"
        );
      } else {
        // Desktop animation: scale up
        tl.to(
          contentRef.current,
          { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.1"
        );
      }
    } else if (mounted) {
      // Animate out
      const tl = gsap.timeline({
        onComplete: () => {
          setMounted(false);
        },
      });

      if (isMobile) {
        // Mobile exit animation: slide down to bottom
        tl.to(contentRef.current, {
          y: "100%",
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      } else {
        // Desktop exit animation: scale down
        tl.to(contentRef.current, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }

      tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, "-=0.1");
    }
  }, [isOpen, isMobile, mounted]);

  // Don't render anything if not open and not mounted
  if (!isOpen && !mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Backdrop/Background overlay */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Content container */}
      <div
        ref={contentRef}
        className={`relative z-10 bg-light-primary overflow-hidden w-full sm:w-11/12 sm:max-w-2xl
                  ${
                    isMobile
                      ? "max-h-[90vh] rounded-t-xl"
                      : "rounded-lg shadow-xl"
                  }`}
        style={
          isMobile
            ? { transform: "translateY(100%)", opacity: 0 } // Initial mobile style
            : { transform: "scale(0)", opacity: 0 } // Initial desktop style
        }
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-label="Close overlay"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Overlay;
