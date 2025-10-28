// third party
import { motion } from 'framer-motion';

// TypeScript interface
interface NavMotionProps {
  readonly children?: React.ReactNode;
}

// ==============================|| ANIMATION FOR CONTENT ||============================== //

export default function NavMotion({ children }: NavMotionProps): React.JSX.Element {
  const motionVariants = {
    initial: {
      opacity: 0,
      scale: 0.99
    },
    in: {
      opacity: 1,
      scale: 1
    },
    out: {
      opacity: 0,
      scale: 1.01
    }
  };

  // Note: default framer-motion transition is sufficient; explicit typing can conflict with local deps

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={motionVariants}>
      {children}
    </motion.div>
  );
}
