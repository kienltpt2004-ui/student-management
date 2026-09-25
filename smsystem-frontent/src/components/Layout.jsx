import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, GraduationCap, ClipboardCheck, CalendarDays,
  Trophy, LogOut, Menu, X, School, Bell, Search
} from 'lucide-react'
import { useState } from 'react'

const nav = [
  { to: '/', label: 'Tổng quan', icon: LayoutDashboard },
  { to: '/students', label: 'Học sinh', icon: Users },
  { to: '/teachers', label: 'Giáo viên', icon: GraduationCap },
  { to: '/attendance', label: 'Điểm danh', icon: ClipboardCheck },
  { to: '/subjects', label: 'Môn học', icon: BookOpen },
  { to: '/classes', label: 'Lớp', icon: School },
  { to: '/exams', label: 'Kỳ thi', icon: CalendarDays },
  { to: '/results', label: 'Kết quả', icon: Trophy },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('sms_user') || 'null')
  const roles = Array.isArray(user?.roles) ? user.roles : []

  function logout() {
    localStorage.removeItem('sms_token')
    localStorage.removeItem('sms_user')
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><School size={21} /></div>
          <div>
            <strong>SchoolOS</strong>
            <span>Management</span>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}><X size={20}/></button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map(({to, label, icon: Icon}) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-user">
            <div className="avatar">{(user?.name || 'A').slice(0,1).toUpperCase()}</div>
            <div className="mini-user-text">
              <strong>{user?.name || 'Administrator'}</strong>
              <span>{roles.join(', ') || 'User'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}><LogOut size={17}/> Đăng xuất</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen(true)}><Menu size={21}/></button>
          <div className="topbar-search"><Search size={17}/><span>Tìm kiếm nhanh...</span></div>
          <div className="topbar-actions">
            <button className="icon-btn" title="Thông báo"><Bell size={18}/></button>
            <div className="top-avatar">{(user?.name || 'A').slice(0,1).toUpperCase()}</div>
          </div>
        </header>
        <div className="content">
          <Outlet />
        </div>
      </main>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </div>
  )
}
