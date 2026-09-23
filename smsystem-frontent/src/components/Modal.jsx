import { X } from 'lucide-react'

export default function Modal({open, title, onClose, children, wide=false}) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${wide ? 'modal-wide' : ''}`} onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  )
}
