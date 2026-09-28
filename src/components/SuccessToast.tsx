interface SuccessToastProps {
  message: string;
  onClose: () => void;
}

export default function SuccessToast({ message, onClose }: SuccessToastProps) {
  return (
    <div
      className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center gap-3 rounded-2xl bg-stone-800 px-5 py-3.5 text-sm text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      <span>✅</span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 text-stone-400 transition-colors hover:text-white"
        aria-label="닫기"
      >
        ✕
      </button>
    </div>
  );
}
