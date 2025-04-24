import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import SvgIcon from "../SvgIcon";
import { successIcon } from "@/assets/commonSvg";
import Button from "../Button";

interface SuccessModalProps {
    message: string;
    buttonText?: string;
    onClick?: () => void;
    autoDisappear?: boolean;
    autoDisappearTime?: number; // Time in milliseconds
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    message,
    onClick,
    buttonText = "OK",
    autoDisappear = false,
    autoDisappearTime = 3000,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Check if the screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle open/close animations
    useEffect(() => {
        if (!overlayRef.current || !backdropRef.current || !contentRef.current)
            return;

        // First mount setup
        if (!mounted && isOpen) {
            setMounted(true);
            gsap.set(backdropRef.current, { opacity: 0 });
            if (isMobile) {
                gsap.set(contentRef.current, { y: "100%", opacity: 0 });
            } else {
                gsap.set(contentRef.current, { scale: 0, opacity: 0 });
            }
            const tl = gsap.timeline();
            tl.to(backdropRef.current, { opacity: 1, duration: 0.3 });
            if (isMobile) {
                tl.to(
                    contentRef.current,
                    { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                    "-=0.1"
                );
            } else {
                tl.to(
                    contentRef.current,
                    { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
                    "-=0.1"
                );
            }
            return;
        }

        if (isOpen) {
            const tl = gsap.timeline();
            tl.to(backdropRef.current, { opacity: 1, duration: 0.3 });
            if (isMobile) {
                tl.to(
                    contentRef.current,
                    { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
                    "-=0.1"
                );
            } else {
                tl.to(
                    contentRef.current,
                    { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" },
                    "-=0.1"
                );
            }
        } else if (mounted) {
            const tl = gsap.timeline({
                onComplete: () => setMounted(false),
            });
            if (isMobile) {
                tl.to(contentRef.current, {
                    y: "100%",
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.in",
                });
            } else {
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

    // Progress bar for autoDisappear (smooth with GSAP)
    useEffect(() => {
        if (autoDisappear && progressBarRef.current) {
            gsap.set(progressBarRef.current, { width: "0%" });
            const tween = gsap.to(progressBarRef.current, {
                width: "100%",
                duration: autoDisappearTime / 1000,
                ease: "linear",
                onComplete: () => setIsOpen(false),
            });
            return () => {
                tween.kill();
                gsap.set(progressBarRef.current, { width: "0%" });
            };
        }
    }, [autoDisappear, autoDisappearTime]);

    // Don't render anything if not open and not mounted
    if (!isOpen && !mounted) return null;

    return (
        <div
            ref={overlayRef}
            className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'
        >
            {/* Backdrop */}
            <div ref={backdropRef} className='absolute inset-0 bg-black/50' />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className={`relative z-10 bg-light-primary overflow-y-auto w-full ${"sm:max-w-md sm:w-11/12"} ${
                    isMobile
                        ? "max-h-[90vh] rounded-t-xl"
                        : "max-h-[90vh] rounded-lg shadow-xl"
                }`}
                style={
                    isMobile
                        ? { transform: "translateY(100%)", opacity: 0 }
                        : { transform: "scale(0)", opacity: 0 }
                }
            >
                {/* Close button */}

                {/* Progress bar */}
                {autoDisappear && (
                    <div className='absolute top-0 left-0 h-1 bg-white w-full rounded-t-lg overflow-hidden'>
                        <div
                            ref={progressBarRef}
                            className='h-full bg-green-500'
                            style={{ width: "0%" }}
                        />
                    </div>
                )}

                <div className='flex flex-col gap-4  items-center justify-center w-full max-w-md mx-auto p-6 relative'>
                    <div className='mb-4 text-primary'>
                        <SvgIcon src={successIcon} />
                    </div>
                    <p className=' text-lg text-center mb-4'>{message}</p>
                    {onClick && (
                        <Button variant='submit' onClick={onClick}>
                            {buttonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
