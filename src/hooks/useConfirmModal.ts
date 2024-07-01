import { create } from "zustand";

interface ConfirmModalStore {
  isLoading: boolean;
  isOpen: boolean;
  onConfirm: () => void | Promise<void>;
  onLoading: () => void;
  onOpen: (onConfirmFn: () => void | Promise<void>) => void;
  onClose: () => void;
}

const noopFunction = (): void => {}; // Define a noop function

const useConfirmModal = create<ConfirmModalStore>((set) => ({
  isLoading: false,
  isOpen: false,
  onConfirm: noopFunction,
  onLoading: () => set({ isLoading: true }),
  onOpen: (onConfirmFn) =>
    set({ isOpen: true, onConfirm: onConfirmFn || noopFunction }),
  onClose: () => set({ isOpen: false, onConfirm: noopFunction, isLoading: false })
}));

export default useConfirmModal;
