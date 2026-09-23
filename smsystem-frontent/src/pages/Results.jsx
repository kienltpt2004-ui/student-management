import { useState } from 'react'
import { Search, Trophy, RefreshCw } from 'lucide-react'
import { resultsApi } from '../api/school'
import { apiError } from '../api/client'

export default function Results(){
 const [studentId,setStudentId]=useState(''),[items,setItems]=useState([]),[performance,setPerformance]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState('')
 async function load(){
  if(!studentId)return setError('Nhập Student ID trước.')
  setLoading(true);setError('')
  try{const [r,p]=await Promise.all([resultsApi.byStudent(studentId),resultsApi.performance(studentId)]);setItems(Array.isArray(r)?r:[]);setPerformance(p)}catch(e){setError(apiError(e))}finally{setLoading(false)}
 }
 return <><div className="page-head"><div><span className="eyebrow">PERFORMANCE</span><h1>Kết quả học tập</h1><p>Tra cứu điểm thi và hiệu suất tổng thể của học sinh.</p></div></div>
 {error&&<div className="alert error">{error}</div>}
 <section className="panel filter-panel"><div className="filter-grid"><label><span>Student ID</span><div className="search-box"><Search size={17}/><input type="number" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Ví dụ: 1"/></div></label><button className="secondary-btn align-end" onClick={load}><RefreshCw size={17}/> Tra cứu</button></div></section>
 {performance&&<div className="stats-grid compact">{Object.entries(performance).slice(0,4).map(([k,v],i)=><div className="stat-card" key={k}><div className={`stat-icon ${['blue','violet','green','amber'][i]}`}><Trophy size={20}/></div><div className="stat-copy"><span>{pretty(k)}</span><strong>{String(v)}</strong></div></div>)}</div>}
 <section className="panel"><div className="panel-head"><div><h2>Bảng điểm</h2><p>{studentId?`Student #${studentId}`:'Chưa chọn học sinh'}</p></div></div><div className="table-wrap"><table><thead><tr><th>Kỳ thi</th><th>Môn</th><th>Điểm</th><th>%</th><th>Hạng</th><th>Trạng thái</th></tr></thead><tbody>{loading?<tr><td colSpan="6"><div className="table-loading">Đang tải...</div></td></tr>:items.length===0?<tr><td colSpan="6"><div className="empty">Chưa có kết quả.</div></td></tr>:items.map(r=><tr key={r.resultId}><td><strong>{r.examName||r.examId||'—'}</strong><small>{r.evaluationDate||'—'}</small></td><td>{r.subjectName||'—'}</td><td><strong>{r.marksObtained??'—'}</strong> / {r.totalMarks??'—'}</td><td>{r.percentage!=null?`${r.percentage}%`:'—'}</td><td><span className="grade">{r.grade||'—'}</span></td><td><span className={`badge ${String(r.resultStatus||'').toLowerCase()}`}>{r.resultStatus||'—'}</span></td></tr>)}</tbody></table></div></section>
 </>}
function pretty(k){return k.replace(/([A-Z])/g,' $1').replace(/^./,x=>x.toUpperCase())}
