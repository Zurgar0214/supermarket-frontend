const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Confirm Action</h3>
          <button className="modal-close" onClick={onCancel} aria-label="Close">×</button>
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="secondary" onClick={onCancel}>Cancel</button>
          <button className="danger" onClick={onConfirm}>Confirm Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
