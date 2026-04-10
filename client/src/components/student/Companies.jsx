import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const logos = [
  { src: assets.microsoft_logo, alt: "microsoft" },
  { src: assets.walmart_logo, alt: "walmart" },
  { src: assets.accenture_logo, alt: "accenture" },
  { src: assets.adobe_logo, alt: "adobe" },
  { src: assets.paypal_logo, alt: "paypal" },
];

const Companies = () => {
  return (
    <div className="py-10 w-full text-center">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5 }}
        className="text-base text-gray-500 text-center"
      >
        Trusted by learners from
      </motion.p>
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-16 md:mt-10 mt-5">
        {logos.map((logo, i) => (
          <motion.img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            className="w-20 md:w-28"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;
