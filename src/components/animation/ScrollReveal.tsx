import React, { useEffect, useRef } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface ScrollRevealProps {
    children: React.ReactNode;
    threshold?: number;
    delay?: number;
    className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    threshold = 0.2,
    delay = 0.15,
    className = "",
}) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        }
    }, [controls, inView]);

    const variants: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                delay,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial='hidden'
            animate={controls}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
