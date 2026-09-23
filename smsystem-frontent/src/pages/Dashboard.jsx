import { useEffect, useMemo, useState } from 'react'
import { Users, GraduationCap, ClipboardCheck, CalendarDays, ArrowUpRight, RefreshCw } from 'lucide-react'
import { studentsApi, teachersApi, examsApi } from '../api/school'
import { apiError } from '../api/client'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true); setError('')
    try {
      const [s, t, e] = await Promise.all([
        studentsApi.list(), teachersApi.list(), examsApi.list()
      ])
      setStudents(Array.isArray(s) ? s : [])
      setTeachers(Array.isArray(t) ? t : [])
      setExams(Array.isArray(e) ? e : [])
    } catch (err) {
      setError(apiError(err))
    } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  const upcoming = useMemo(() => [...exams].sort((a,b)=>String(a.examDate).localeCompare(String(b.examDate))).slice(0,5), [exams])

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Tổng quan</h1>
          <p>Chào mừng bạn trở lại. Đây là tình hình hệ thống hiện tại.</p>
        </div>
        <button className="secondary-btn" onClick={load}><RefreshCw size={17}/> Làm mới</button>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="stats-grid">
        <StatCard icon={Users} label="Học sinh" value={loading ? '—' : students.length} hint="Tổng hồ sơ" tone="blue"/>
        <StatCard icon={GraduationCap} label="Giáo viên" value={loading ? '—' : teachers.length} hint="Đang quản lý" tone="violet"/>
        <StatCard icon={CalendarDays} label="Kỳ thi" value={loading ? '—' : exams.length} hint="Đã tạo" tone="amber"/>
        <StatCard icon={ClipboardCheck} label="Trạng thái API" value={error ? 'Lỗi' : loading ? '...' : 'Online'} hint="localhost:8080" tone={error ? 'red' : 'green'}/>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div><h2>Kỳ thi sắp tới</h2><p>Danh sách theo ngày thi</p></div>
            <a href="/exams" className="text-link">Xem tất cả <ArrowUpRight size={15}/></a>
          </div>
          {upcoming.length === 0 ? <Empty text="Chưa có kỳ thi."/> : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Kỳ thi</th><th>Môn</th><th>Ngày</th><th>Trạng thái</th></tr></thead>
                <tbody>{upcoming.map(x=>(
                  <tr key={x.examId}>
                    <td><strong>{x.examName || '—'}</strong><small>{x.className || 'Chưa có lớp'}</small></td>
                    <td>{x.subjectName || x.subjectId || '—'}</td>
                    <td>{x.examDate || '—'}</td>
                    <td><span className={`badge ${String(x.status||'').toLowerCase()}`}>{x.status || '—'}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head"><div><h2>Học sinh mới nhất</h2><p>Hồ sơ trong hệ thống</p></div></div>
          {students.length === 0 ? <Empty text="Chưa có dữ liệu học sinh."/> : (
            <div className="student-list">
              {students.slice(0,6).map(s=>(
                <div className="student-row" key={s.studentID}>
                  <div className="avatar">{(s.firstName || '?').slice(0,1)}{(s.lastName || '').slice(0,1)}</div>
                  <div><strong>{s.firstName} {s.lastName}</strong><span>{s.email || 'Chưa có email'}</span></div>
                  <small>{s.className || '—'}</small>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}

function Empty({text}) { return <div className="empty">{text}</div> }
