import { useEffect } from "react";

// This is a convenient Modal component that provides all the standard functionality you'd expect
// Passing in the styling is a bit awkward but should work without much hassle
export default function Modal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
}) {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    document.onkeydown = (e) => {
      if (e.key === "Escape" && props.isOpen) {
        props.onClose();
      }
    }
  }, [props]);  // might be some way to remove this dependency, should be harmless here

  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-150 ${props.isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", overflow: "hidden" }}
      onClick={props.onClose}
    >
      <div className="absolute inset-0 z-50 flex items-center justify-center m-auto h-fit">
        <div className={`${props.className} relative`} onClick={stopPropagation}>
          <button className="absolute font-bold top-1 right-3" onClick={() => props.setIsOpen(false)}>x</button>
          {props.children}
        </div>
      </div>
    </div>
  );
}
