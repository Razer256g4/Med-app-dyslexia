import { motion } from 'framer-motion';

export default function FeatureCard({ title, icon }: { title: string; icon: string }) {
  return (
    <motion.div 
      className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </motion.div>
  );
}