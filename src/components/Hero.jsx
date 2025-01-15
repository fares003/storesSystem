import React from 'react';
import Center from './Center';
import shoppingImg from '@/assets/shopping-removebg-preview.png';
import { motion } from 'framer-motion';

const Hero = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const floatingImageVariants = {
    animate: {
      y: [0, -20, 0], // يتحرك لأعلى وأسفل
      transition: {
        duration: 3, // مدة دورة الحركة
        repeat: Infinity, // التكرار اللانهائي
        ease: 'easeInOut', // حركة سلسة
      },
    },
  };

  return (
    <Center>
      <motion.div
        className="w-[90%] flex flex-col md:flex-row items-start gap-4 justify-around"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div className="w-[50%] flex flex-col gap-6" variants={textVariants}>
          <h2 className="text-slate-200 text-6xl">Stores System</h2>
          <p className="text-gray-400 font-semibold">
            A management store system helps organize inventory, track orders, manage customers, and
            improve daily operations efficiency.
          </p>
        </motion.div>
        <motion.div
          className="w-[40%]"
          variants={floatingImageVariants}
          animate="animate"
        >
          <img className="h-full" src={shoppingImg} alt="Shopping" />
        </motion.div>
      </motion.div>
    </Center>
  );
};

export default Hero;
