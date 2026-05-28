"use client";

import { motion } from "framer-motion";

export default function WhatsAppButton() {
  const phoneNumber = "919028833275";
  const message = encodeURIComponent("Hello, ShubDeep I want to discuss my academic project.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center group font-marker">
      {/* Interactive text badge on hover */}
      <div className="mr-3 scale-0 group-hover:scale-100 origin-right transition-transform duration-200 pointer-events-none hidden sm:block">
        <div className="bg-[#FAF6EE] text-[#2C2C2C] px-3.5 py-1.5 rounded-xl text-sm font-semibold shadow-md whitespace-nowrap border-2 border-[#2C2C2C]">
          Chat on WhatsApp!
        </div>
      </div>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        className="w-12 h-12 sm:w-14 sm:h-14 bg-[#A5D6A7] rounded-full flex items-center justify-center text-[#2C2C2C] shadow-[3px_4px_0_#2C2C2C] hover:bg-[#81C784] hover:shadow-[4px_5px_0_#2C2C2C] transition-all duration-200 border-2.5 border-[#2C2C2C]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -6, 0] 
        }}
        transition={{
          scale: { delay: 1, duration: 0.3 },
          opacity: { delay: 1, duration: 0.3 },
          y: {
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
          }
        }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 sm:w-7 sm:h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.462 3.473 1.336 4.988L2 22l5.176-1.359a9.924 9.924 0 004.836 1.247h.005c5.502 0 9.983-4.482 9.983-9.988 0-2.662-1.036-5.163-2.92-7.051C17.195 3.038 14.69 2 12.012 2zM12 20.334c-1.583 0-3.13-.418-4.49-1.209l-.322-.191-3.336.875.89-3.255-.21-.334A8.307 8.307 0 013.33 12c0-4.6 3.743-8.343 8.346-8.343 2.228 0 4.323.868 5.898 2.443a8.275 8.275 0 012.444 5.903c-.002 4.6-3.746 8.331-8.348 8.331zm4.566-6.242c-.25-.124-1.477-.729-1.705-.811-.228-.083-.393-.124-.559.124-.166.249-.642.811-.787.977-.145.166-.29.186-.54.062-.25-.124-1.055-.389-2.01-1.242-.743-.662-1.245-1.48-1.39-1.73-.145-.25-.015-.385.11-.509.112-.112.25-.29.375-.436.124-.145.166-.25.25-.415.083-.166.042-.311-.02-.436-.063-.124-.559-1.349-.766-1.848-.201-.483-.404-.418-.559-.426-.145-.008-.31-.008-.476-.008a.916.916 0 00-.663.311c-.228.249-.871.851-.871 2.076 0 1.225.892 2.41 1.016 2.576.125.166 1.756 2.682 4.254 3.757.595.256 1.059.409 1.422.525.597.19 1.14.163 1.57.099.479-.071 1.477-.602 1.684-1.183.208-.582.208-1.08.146-1.183-.063-.105-.229-.166-.479-.29z" />
        </svg>
      </motion.a>
    </div>
  );
}
