import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, School, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { login } from '../api/auth'
import { apiError } from '../api/client'

export default function Login() {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await login(form)
      if (!res?.accessToken) throw new Error('Backend không trả về access token.')
      localStorage.setItem('sms_token', res.accessToken)
      localStorage.setItem('sms_user', JSON.stringify({
        name: form.usernameOrEmail,
        roles: []
      }))
      navigate('/', { replace: true })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-glow glow-one"/>
      <div className="login-glow glow-two"/>
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-mark large"><School size={25}/></div>
          <div><strong>SchoolOS</strong><span>School Management</span></div>
        </div>
        <div className="login-heading">
          <span className="eyebrow">WELCOME BACK</span>
          <h1>Đăng nhập hệ thống</h1>
          <p>Quản lý học sinh, giáo viên, điểm danh và kết quả trong một nơi.</p>
        </div>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={submit} className="form-stack">
          <label>Tài khoản hoặc email</label>
          <div className="input-icon">
            <Mail size={18}/>
            <input required value={form.usernameOrEmail} onChange={e=>setForm({...form, usernameOrEmail:e.target.value})} placeholder="admin hoặc email"/>
          </div>
          <label>Mật khẩu</label>
          <div className="input-icon">
            <LockKeyhole size={18}/>
            <input required type={show ? 'text' : 'password'} value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="••••••••"/>
            <button type="button" className="field-action" onClick={()=>setShow(!show)}>{show ? <EyeOff size={17}/> : <Eye size={17}/>}</button>
          </div>
          <button className="primary-btn login-btn" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : <>Đăng nhập <ArrowRight size={18}/></>}
          </button>
        </form>
        <div className="login-note">API: http://localhost:8080/api</div>
      </div>
    </div>
  )
}
