export default function Modal({
  title,
  children,
  onClose,
}) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        background: "rgba(0,0,0,.5)",
        zIndex: 3000,
      }}
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-4"
        style={{
          width: 500,
          maxWidth: "95%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between mb-3">
          <h5 className="fw-bold">{title}</h5>

          <button
            className="btn btn-sm btn-light"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}