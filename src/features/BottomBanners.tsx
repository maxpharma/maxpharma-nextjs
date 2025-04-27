"use client";

import CustomImage from "@/components/CustomImage";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

const BottomBanners = () => {
  const data = [
    "/images/bottom-banner.png",
    "/images/bottom-banner-1.png",
    "/images/bottom-banner-2.png",
    "/images/bottom-banner-3.png",
    "/images/bottom-banner-4.png",
    "/images/bottom-banner-5.png",
    "/images/bottom-banner-6.png",
  ];

  // Duplicate the array for seamless looping
  const images = [...data, ...data];

  // Width of a single image (adjust as needed)
  const IMAGE_WIDTH = 600; // px, adjust to match your image width
  const totalWidth = IMAGE_WIDTH * data.length;

  // Animation controls
  const controls = useAnimation();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const animate = async () => {
      if (!isMounted.current) return;

      await controls.start({
        x: -totalWidth,
        transition: { duration: 15, ease: "linear" },
      });

      if (!isMounted.current) return;

      await controls.set({ x: 0 });

      if (!isMounted.current) return;

      animate();
    };

    animate();

    return () => {
      isMounted.current = false;
    };
  }, [controls, totalWidth]);

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div className="flex gap-4" style={{ x: 0 }} animate={controls}>
        {images.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: IMAGE_WIDTH }}
          >
            <CustomImage
              src={item}
              className="min-w-xl min-h-100"
              fit="cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BottomBanners;
