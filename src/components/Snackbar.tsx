import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

export type SnackbarVariant = "added" | "removed";

interface SnackbarProps {
  open: boolean;
  message: string;
  variant?: SnackbarVariant;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
}

const DEFAULT_DURATION = 2200;

export function Snackbar({
  open,
  message,
  variant = "added",
  actionLabel,
  onAction,
  onClose,
  duration = DEFAULT_DURATION,
}: SnackbarProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!open || !duration) return;
    const t = setTimeout(() => setExiting(true), duration);
    return () => clearTimeout(t);
  }, [open, duration]);

  useEffect(() => {
    if (!open) setExiting(false);
  }, [open]);

  const handleExitComplete = () => {
    setExiting(false);
    onClose();
  };

  const handleAction = () => {
    onAction?.();
    setExiting(true);
  };

  const showToast = open && !exiting;
  const isAdded = variant === "added";
  const iconSrc = isAdded ? "/Asset%2011.png" : "/Asset%2010.png";
  const showAction = actionLabel && onAction;

  return (
    <div
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[100] p-4 max-w-lg w-full pointer-events-none flex justify-center"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence onExitComplete={handleExitComplete}>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 120 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`rounded-2xl shadow-2xl flex items-center gap-4 min-h-[64px] lg:min-h-[72px] px-4 py-3 border-2 max-w-lg w-full pointer-events-auto ${
              isAdded
                ? "bg-brand-yellow text-gray-900 border-amber-400"
                : "bg-brand-red text-white border-red-800"
            }`}
          >
            <img
              src={iconSrc}
              alt=""
              className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 object-contain"
              aria-hidden
            />
            <span className="flex-1 text-sm lg:text-base font-bold min-w-0">
              {message}
            </span>
            {showAction && (
              <button
                type="button"
                onClick={handleAction}
                className={`flex-shrink-0 flex items-center gap-1 text-xs font-medium underline underline-offset-2 hover:no-underline ${
                  isAdded
                    ? "text-gray-700 hover:text-gray-900"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {actionLabel}
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
