import { motion } from "framer-motion"
import { fadeUp, stagger } from "../lib/motion"

export default function Hero() {
  return (
    <section className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white overflow-hidden relative">

      {/* Animated bubbles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 bg-blue-300 rounded-full opacity-30"
            animate={{ y: [-20, -250], opacity: [0.6, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: i * 0.2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              bottom: 0
            }}
          />
        ))}
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="text-center z-10"
      >
        <motion.h1 variants={fadeUp} className="text-5xl font-bold mb-6">
          Laundry, Reimagined
        </motion.h1>

        <motion.p variants={fadeUp} className="text-lg mb-8">
          Fast pickup. Premium cleaning. Doorstep delivery.
        </motion.p>

        <motion.button
          variants={fadeUp}
          className="px-6 py-3 bg-blue-500 text-white rounded-xl shadow-lg hover:scale-105 transition"
        >
          Book Pickup
        </motion.button>
      </motion.div>
    </section>
  )
}
