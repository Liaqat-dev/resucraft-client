import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// ModalHeader Component
interface ModalHeaderProps {
  title?: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = memo(({ title, onClose }) => {
  return (
    <div className="modal-header">
      <h6>{title}</h6>
      <button onClick={onClose} className="link link-red">
        <X className="size-5" />
      </button>
    </div>
  );
});

ModalHeader.displayName = "ModalHeader";

// ModalContent Component
interface ModalContentProps {
  children?: React.ReactNode;
  contentClass?: string;
}

const ModalContent: React.FC<ModalContentProps> = memo(
  ({ children, contentClass }) => {
    return (
      <div className={`modal-content text-center ${contentClass ?? ""}`}>{children}</div>
    );
  },
);

ModalContent.displayName = "ModalContent";

// Action Button Config
interface ModalAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "danger" | "secondary";
}

// Main Modal Component
interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void; // generic submit/action handler
  position?:
    | "modal-center"
    | "modal-top"
    | "modal-topLeft"
    | "modal-tr"
    | "modal-left"
    | "modal-right"
    | "modal-tl"
    | "modal-br"
    | "modal-bl";
  size?:
    | "modal-xs"
    | "modal-sm"
    | "modal-md"
    | "modal-lg"
    | "modal-xl"
    | "modal-2xl";
  title?: string;
  content?: React.ReactNode | ((onClose: () => void) => React.ReactNode);
  footer?: React.ReactNode | ((onClose: () => void) => React.ReactNode);
  id?: string;
  contentClass?: string;
  actionButtonConfig: ModalAction; // config for primary button
}

const Modal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  onAction,
  position = "modal-center",
  size = "sm",
  title,
  content,
  id,
  contentClass,
  actionButtonConfig,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Handle overlay click to close the modal
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeWithAnimation();
    }
  }, []);

  // Close modal with animation
  const closeWithAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setIsVisible(false);
      onClose();
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }, [onClose]);

  // Handle modal open/close state
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.classList.add("overflow-hidden");

      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Don't render if the modal is not visible
  if (!isVisible) return null;

  return (
    <>
      <div>
        {/* Backdrop overlay */}
        <div
          className={`backdrop-overlay backdrop-blur-xs ${
            isAnimating ? "show" : ""
          }`}
          onClick={closeWithAnimation}
        />
        {/* Modal container */}
        <div
          className={`modal ${position} ${isAnimating ? "show" : ""}`}
          onClick={handleOverlayClick}
          id={id}
        >
          <div className={`modal-wrap ${size} ${position}`} ref={modalRef}>
            {/* Modal header */}
            {title && (
              <ModalHeader title={title} onClose={closeWithAnimation} />
            )}

            {/* Modal content */}
            <ModalContent contentClass={contentClass}>
              {typeof content === "function"
                ? content(closeWithAnimation)
                : content}
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeWithAnimation}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                {actionButtonConfig && (
                  <button
                    onClick={actionButtonConfig.onClick ?? onAction}
                    className={`px-3 flex flex-nowrap items-center justify-center gap-1 btn ${
                      actionButtonConfig.variant === "danger"
                        ? "btn-red"
                        : "btn-primary"
                    }`}
                  >
                    {actionButtonConfig.icon && (
                      <span className="mr-1">{actionButtonConfig.icon}</span>
                    )}
                    {actionButtonConfig.label}
                  </button>
                )}
              </div>
            </ModalContent>
          </div>
        </div>
      </div>
    </>
  );
};

export { ModalHeader, ModalContent, Modal };
