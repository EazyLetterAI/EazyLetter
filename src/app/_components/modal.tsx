export default function Modal(props: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
}) {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`fixed inset-0 z-40 ${props.isOpen ? "" : "hidden"}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.1)", overflow: "hidden" }}
      onClick={props.onClose}
    >
      <div className="absolute inset-0 z-50 m-auto flex h-fit items-center justify-center">
        <div className={props.className} onClick={stopPropagation}>{props.children}</div>
      </div>
    </div>
  );
}
