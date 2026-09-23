import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, Eye, RefreshCw } from 'lucide-react'
import { studentsApi } from '../api/school'
import { apiError } from '../api/client'
import Modal from '../components/Modal'

const blank = {
  firstName:'', lastName:'', email:'', roll:'', height:'', dateOfBirth:'',
  totalFees:'', feesPaid:'', phoneNumber:'', imageLink:'', address:'', city:'',
  classID:'', className:'', guardianFirstName:'', guardianLastName:'',
  guardianPhoneNumber:'', guardianEmail:'', relationship:''
}

export default function Students() {
  const [items,setItems]=useState([]), [loading,setLoading]=useState(true), [error,setError]=useState('')
  const [q,setQ]=useState(''), [modal,setModal]=useState(false), [detail,setDetail]=useState(null)
  const [editing,setEditing]=useState(null), [form,setForm]=useState(blank), [saving,setSaving]=useState(false)

  async function load() {
    setLoading(true); setError('')
    try { const data=await studentsApi.list(); setItems(Array.isArray(data)?data:[]) }
    catch(e){setError(apiError(e))} finally{setLoading(false)}
  }
  useEffect(()=>{load()},[])
  const filtered=useMemo(()=>items.filter(s=>`${s.firstName} ${s.lastName} ${s.email} ${s.className} ${s.roll}`.toLowerCase().includes(q.toLowerCase())),[items,q])

  function openCreate(){setEditing(null);setForm(blank);setModal(true)}
  function openEdit(s){setEditing(s);setForm({...blank,...s, roll:s.roll??'', classID:s.classID??'', dateOfBirth:s.dateOfBirth||''});setModal(true)}
  async function save(e){
    e.preventDefault();setSaving(true)
    const payload={...form, roll:Number(form.roll)||0,height:Number(form.height)||0,totalFees:Number(form.totalFees)||0,feesPaid:Number(form.feesPaid)||0,feesDue:Math.max(0,(Number(form.totalFees)||0)-(Number(form.feesPaid)||0)),classID:form.classID?Number(form.classID):null}
    try { editing ? await studentsApi.update(editing.studentID,payload) : await studentsApi.create(payload); setModal(false); await load() }
    catch(e){setError(apiError(e))} finally{setSaving(false)}
  }
  async function remove(id){
    if(!confirm('Bạn chắc chắn muốn xóa học sinh này?')) return
    try{await studentsApi.remove(id);await load()}catch(e){setError(apiError(e))}
  }
  async function showDetail(id){
    try{const d=await studentsApi.detailed(id);setDetail(d)}catch(e){setError(apiError(e))}
  }

  return <>
    <div className="page-head">
      <div><span className="eyebrow">ACADEMICS</span><h1>Học sinh</h1><p>Quản lý hồ sơ, lớp học và thông tin người giám hộ.</p></div>
      <div className="head-actions"><button className="secondary-btn" onClick={load}><RefreshCw size={17}/> Làm mới</button><button className="primary-btn" onClick={openCreate}><Plus size={18}/> Thêm học sinh</button></div>
    </div>
    {error&&<div className="alert error">{error}</div>}
    <section className="panel">
      <div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Tìm theo tên, email, lớp, roll..." value={q} onChange={e=>setQ(e.target.value)}/></div><span className="count-label">{filtered.length} hồ sơ</span></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Học sinh</th><th>Roll</th><th>Lớp</th><th>Liên hệ</th><th>Học phí</th><th></th></tr></thead>
          <tbody>
          {loading ? <tr><td colSpan="6"><div className="table-loading">Đang tải...</div></td></tr> :
          filtered.length===0 ? <tr><td colSpan="6"><div className="empty">Không tìm thấy học sinh.</div></td></tr> :
          filtered.map(s=><tr key={s.studentID}>
            <td><div className="person-cell"><div className="avatar">{(s.firstName||'?').slice(0,1)}{(s.lastName||'').slice(0,1)}</div><div><strong>{s.firstName} {s.lastName}</strong><small>{s.email||'—'}</small></div></div></td>
            <td>{s.roll||'—'}</td><td>{s.className||s.classID||'—'}</td><td>{s.phoneNumber||'—'}</td>
            <td><strong>{Number(s.feesDue||0).toLocaleString('vi-VN')} đ</strong><small>còn phải trả</small></td>
            <td><div className="row-actions"><button className="icon-btn" title="Chi tiết" onClick={()=>showDetail(s.studentID)}><Eye size={16}/></button><button className="icon-btn" title="Sửa" onClick={()=>openEdit(s)}><Pencil size={16}/></button><button className="icon-btn danger" title="Xóa" onClick={()=>remove(s.studentID)}><Trash2 size={16}/></button></div></td>
          </tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Chỉnh sửa học sinh':'Thêm học sinh'} wide>
      <form className="form-grid" onSubmit={save}>
        <Field label="Tên" value={form.firstName} onChange={v=>setForm({...form,firstName:v})} required/>
        <Field label="Họ" value={form.lastName} onChange={v=>setForm({...form,lastName:v})} required/>
        <Field label="Email" value={form.email} onChange={v=>setForm({...form,email:v})}/>
        <Field label="Roll" type="number" value={form.roll} onChange={v=>setForm({...form,roll:v})}/>
        <Field label="Ngày sinh" type="date" value={form.dateOfBirth} onChange={v=>setForm({...form,dateOfBirth:v})}/>
        <Field label="Chiều cao" type="number" step="0.1" value={form.height} onChange={v=>setForm({...form,height:v})}/>
        <Field label="Số điện thoại" value={form.phoneNumber} onChange={v=>setForm({...form,phoneNumber:v})}/>
        <Field label="Thành phố" value={form.city} onChange={v=>setForm({...form,city:v})}/>
        <Field label="Class ID" type="number" value={form.classID} onChange={v=>setForm({...form,classID:v})}/>
        <Field label="Tên lớp" value={form.className} onChange={v=>setForm({...form,className:v})}/>
        <Field label="Tổng học phí" type="number" value={form.totalFees} onChange={v=>setForm({...form,totalFees:v})}/>
        <Field label="Đã đóng" type="number" value={form.feesPaid} onChange={v=>setForm({...form,feesPaid:v})}/>
        <Field label="Địa chỉ" value={form.address} onChange={v=>setForm({...form,address:v})} wide/>
        <div className="form-section">Người giám hộ</div>
        <Field label="Tên" value={form.guardianFirstName} onChange={v=>setForm({...form,guardianFirstName:v})}/>
        <Field label="Họ" value={form.guardianLastName} onChange={v=>setForm({...form,guardianLastName:v})}/>
        <Field label="Điện thoại" value={form.guardianPhoneNumber} onChange={v=>setForm({...form,guardianPhoneNumber:v})}/>
        <Field label="Email" value={form.guardianEmail} onChange={v=>setForm({...form,guardianEmail:v})}/>
        <Field label="Quan hệ" value={form.relationship} onChange={v=>setForm({...form,relationship:v})}/>
        <div className="modal-footer"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Hủy</button><button className="primary-btn" disabled={saving}>{saving?'Đang lưu...':'Lưu học sinh'}</button></div>
      </form>
    </Modal>

    <Modal open={!!detail} onClose={()=>setDetail(null)} title="Chi tiết học sinh">
      {detail&&<div className="detail-grid">
        {Object.entries(detail).filter(([k])=>k!=='imageLink').map(([k,v])=><div key={k} className="detail-item"><span>{label(k)}</span><strong>{v===null||v===undefined||v===''?'—':String(v)}</strong></div>)}
      </div>}
    </Modal>
  </>
}

function Field({label,value,onChange,type='text',wide=false,...rest}){return <label className={wide?'field wide':''}><span>{label}</span><input type={type} value={value??''} onChange={e=>onChange(e.target.value)} {...rest}/></label>}
function label(k){return k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}
