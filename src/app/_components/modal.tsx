import { useEffect } from "react";

export default function Modal(props: {
  isOpen: boolean;
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
        <div className={props.className} onClick={stopPropagation}>{props.children}</div>
      </div>
    </div>
  );
}
