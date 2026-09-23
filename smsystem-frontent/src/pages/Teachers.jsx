import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { teachersApi } from '../api/school'
import { apiError } from '../api/client'
import Modal from '../components/Modal'

const blank={firstName:'',lastName:'',email:'',phoneNumber:'',qualification:'',experience:'',joiningDate:'',salary:'',salaryStatus:'',imageLink:'',address:'',nationality:''}

export default function Teachers(){
 const [items,setItems]=useState([]),[q,setQ]=useState(''),[loading,setLoading]=useState(true),[error,setError]=useState(''),[modal,setModal]=useState(false),[editing,setEditing]=useState(null),[form,setForm]=useState(blank),[saving,setSaving]=useState(false)
 async function load(){setLoading(true);setError('');try{const d=await teachersApi.list();setItems(Array.isArray(d)?d:[])}catch(e){setError(apiError(e))}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 const filtered=useMemo(()=>items.filter(t=>`${t.firstName} ${t.lastName} ${t.email} ${t.qualification}`.toLowerCase().includes(q.toLowerCase())),[items,q])
 function edit(t){setEditing(t);setForm({...blank,...t});setModal(true)}
 async function save(e){e.preventDefault();setSaving(true);const p={...form,experience:Number(form.experience)||0,salary:Number(form.salary)||0};try{editing?await teachersApi.update(editing.teacherID,p):await teachersApi.create(p);setModal(false);await load()}catch(e){setError(apiError(e))}finally{setSaving(false)}}
 async function remove(id){if(!confirm('Xóa giáo viên này?'))return;try{await teachersApi.remove(id);await load()}catch(e){setError(apiError(e))}}
 return <><div className="page-head"><div><span className="eyebrow">PEOPLE</span><h1>Giáo viên</h1><p>Quản lý hồ sơ, chuyên môn và thông tin liên hệ.</p></div><div className="head-actions"><button className="secondary-btn" onClick={load}><RefreshCw size={17}/> Làm mới</button><button className="primary-btn" onClick={()=>{setEditing(null);setForm(blank);setModal(true)}}><Plus size={18}/> Thêm giáo viên</button></div></div>
 {error&&<div className="alert error">{error}</div>}
 <section className="panel"><div className="toolbar"><div className="search-box"><Search size={17}/><input placeholder="Tìm giáo viên..." value={q} onChange={e=>setQ(e.target.value)}/></div><span className="count-label">{filtered.length} giáo viên</span></div>
 <div className="table-wrap"><table><thead><tr><th>Giáo viên</th><th>Chuyên môn</th><th>Kinh nghiệm</th><th>Ngày vào</th><th>Lương</th><th></th></tr></thead><tbody>
 {loading?<tr><td colSpan="6"><div className="table-loading">Đang tải...</div></td></tr>:filtered.length===0?<tr><td colSpan="6"><div className="empty">Không có dữ liệu.</div></td></tr>:filtered.map(t=><tr key={t.teacherID}><td><div className="person-cell"><div className="avatar violet">{(t.firstName||'?').slice(0,1)}{(t.lastName||'').slice(0,1)}</div><div><strong>{t.firstName} {t.lastName}</strong><small>{t.email||'—'}</small></div></div></td><td>{t.qualification||'—'}</td><td>{t.experience||0} năm</td><td>{t.joiningDate||'—'}</td><td>{Number(t.salary||0).toLocaleString('vi-VN')} đ</td><td><div className="row-actions"><button className="icon-btn" onClick={()=>edit(t)}><Pencil size={16}/></button><button className="icon-btn danger" onClick={()=>remove(t.teacherID)}><Trash2 size={16}/></button></div></td></tr>)}
 </tbody></table></div></section>
 <Modal open={modal} onClose={()=>setModal(false)} title={editing?'Chỉnh sửa giáo viên':'Thêm giáo viên'} wide><form className="form-grid" onSubmit={save}>
 <Field label="Tên" value={form.firstName} onChange={v=>setForm({...form,firstName:v})} required/><Field label="Họ" value={form.lastName} onChange={v=>setForm({...form,lastName:v})} required/><Field label="Email" value={form.email} onChange={v=>setForm({...form,email:v})}/><Field label="Điện thoại" value={form.phoneNumber} onChange={v=>setForm({...form,phoneNumber:v})}/><Field label="Chuyên môn" value={form.qualification} onChange={v=>setForm({...form,qualification:v})}/><Field label="Kinh nghiệm (năm)" type="number" value={form.experience} onChange={v=>setForm({...form,experience:v})}/><Field label="Ngày vào" type="date" value={form.joiningDate} onChange={v=>setForm({...form,joiningDate:v})}/><Field label="Lương" type="number" value={form.salary} onChange={v=>setForm({...form,salary:v})}/><Field label="Trạng thái lương" value={form.salaryStatus} onChange={v=>setForm({...form,salaryStatus:v})}/><Field label="Quốc tịch" value={form.nationality} onChange={v=>setForm({...form,nationality:v})}/><Field label="Địa chỉ" value={form.address} onChange={v=>setForm({...form,address:v})} wide/><div className="modal-footer"><button type="button" className="secondary-btn" onClick={()=>setModal(false)}>Hủy</button><button className="primary-btn" disabled={saving}>{saving?'Đang lưu...':'Lưu giáo viên'}</button></div>
 </form></Modal></>
}
function Field({label,value,onChange,type='text',wide=false,...rest}){return <label className={wide?'field wide':''}><span>{label}</span><input type={type} value={value??''} onChange={e=>onChange(e.target.value)} {...rest}/></label>}
