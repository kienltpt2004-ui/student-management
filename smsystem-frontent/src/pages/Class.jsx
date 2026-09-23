import { useEffect, useState } from 'react'
import {
  Plus,
  Trash2,
  Eye,
  X,
  Users,
  School,
  RefreshCw
} from 'lucide-react'

import { classApi } from '../api/school'
import { apiError } from '../api/client'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [detail, setDetail] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    className: '',
    descriptions: '',
    teacherID: '',
    subjectIDs: ''
  })

  // =========================
  // USER / ROLE
  // =========================

//   const user = JSON.parse(
//     localStorage.getItem('sms_user') || 'null'
//   )

//   const roles = Array.isArray(user?.roles)
//     ? user.roles
//     : []

//   const isAdmin =
//     roles.includes('ROLE_ADMIN') ||
//     roles.includes('ADMIN') ||
//     user?.role === 'ADMIN' ||
//     user?.role === 'ROLE_ADMIN'
const user = JSON.parse(localStorage.getItem('sms_user') || 'null')

const roles = [
  ...(Array.isArray(user?.roles) ? user.roles : []),
  ...(Array.isArray(user?.authorities) ? user.authorities : []),
  user?.role,
  user?.authority
].filter(Boolean)

const isAdmin = roles.some(role =>
  String(role).replace('ROLE_', '').toUpperCase() === 'ADMIN'
)

  // =========================
  // LOAD CLASSES
  // =========================

  useEffect(() => {
    loadClasses()
  }, [])

  async function loadClasses() {
    try {
      setLoading(true)
      setError('')

      const data = await classApi.list()

      setClasses(
        Array.isArray(data)
          ? data
          : []
      )
    } catch (err) {
      console.error(err)
      setError(apiError(err))
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FORM
  // =========================

  function handleChange(e) {
    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function openCreate() {
    setError('')

    setForm({
      className: '',
      descriptions: '',
      teacherID: '',
      subjectIDs: ''
    })

    setShowModal(true)
  }

  // =========================
  // CREATE
  // =========================

  async function handleCreate(e) {
    e.preventDefault()

    if (!form.className.trim()) {
      setError('Vui lòng nhập tên lớp')
      return
    }

    if (!form.teacherID) {
      setError('Vui lòng nhập Teacher ID')
      return
    }

    try {
      setSaving(true)
      setError('')

      const subjectIDs = form.subjectIDs
        .split(',')
        .map(id => Number(id.trim()))
        .filter(id => !Number.isNaN(id))

      const payload = {
        className: form.className,
        descriptions: form.descriptions,
        teacherID: Number(form.teacherID),
        subjectIDs
      }

      console.log('Create class payload:', payload)

      await classApi.create(payload)

      setShowModal(false)

      await loadClasses()

    } catch (err) {
      console.error(err)
      setError(apiError(err))
    } finally {
      setSaving(false)
    }
  }

  // =========================
  // DELETE
  // =========================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Bạn có chắc muốn xóa lớp này không?'
    )

    if (!confirmed) return

    try {
      setError('')

      await classApi.remove(id)

      await loadClasses()

    } catch (err) {
      console.error(err)
      setError(apiError(err))
    }
  }

  // =========================
  // DETAIL
  // =========================

  async function handleView(id) {
    try {
      setError('')

      const data = await classApi.get(id)

      setDetail(data)

    } catch (err) {
      console.error(err)
      setError(apiError(err))
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <>
      {/* HEADER */}

      <div className="page-head">

        <div>
          <span className="eyebrow">
            ACADEMICS
          </span>

          <h1>Lớp học</h1>

          <p>
            Quản lý các lớp và thông tin lớp học trong trường.
          </p>
        </div>

        <div className="head-actions">

          <button
            className="secondary-btn"
            onClick={loadClasses}
          >
            <RefreshCw size={17} />
            Làm mới
          </button>

          {isAdmin && (
            <button
              className="primary-btn"
              onClick={openCreate}
            >
              <Plus size={18} />
              Thêm lớp
            </button>
          )}

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      {/* CONTENT */}

      <section className="panel">

        <div className="toolbar">

          <div>
            <strong>
              Danh sách lớp học
            </strong>
          </div>

          <span className="count-label">
            {classes.length} lớp
          </span>

        </div>

        <div className="table-wrap">

          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Lớp</th>
                <th>Mô tả</th>
                <th>Giáo viên</th>
                <th>Học sinh</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan="6">
                    <div className="table-loading">
                      Đang tải danh sách lớp...
                    </div>
                  </td>
                </tr>

              ) : classes.length === 0 ? (

                <tr>
                  <td colSpan="6">

                    <div className="empty">

                      <School
                        size={40}
                      />

                      <div>
                        Chưa có lớp học.
                      </div>

                      {isAdmin && (
                        <button
                          className="primary-btn"
                          onClick={openCreate}
                          style={{ marginTop: '12px' }}
                        >
                          <Plus size={17} />
                          Thêm lớp đầu tiên
                        </button>
                      )}

                    </div>

                  </td>
                </tr>

              ) : (

                classes.map(item => (

                  <tr
                    key={item.classID}
                  >

                    <td>
                      {item.classID}
                    </td>

                    <td>
                      <div className="person-cell">

                        <div className="avatar">
                          <School size={17} />
                        </div>

                        <div>
                          <strong>
                            {item.className}
                          </strong>

                          <small>
                            {item.descriptions || '—'}
                          </small>
                        </div>

                      </div>
                    </td>

                    <td>
                      {item.descriptions || '—'}
                    </td>

                    <td>
                      {item.teacherName || item.teacherID || '—'}
                    </td>

                    <td>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >

                        <Users size={15} />

                        {item.totalStudents ?? 0}

                      </div>

                    </td>

                    <td>

                      <div className="row-actions">

                        <button
                          className="icon-btn"
                          title="Xem chi tiết"
                          onClick={() =>
                            handleView(item.classID)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        {isAdmin && (
                          <button
                            className="icon-btn danger"
                            title="Xóa lớp"
                            onClick={() =>
                              handleDelete(item.classID)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* CREATE MODAL */}

      {showModal && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="modal modal-wide"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h3>
                  Thêm lớp học
                </h3>

                <p>
                  Tạo lớp học mới.
                </p>

              </div>

              <button
                className="icon-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={18} />
              </button>

            </div>

            <form
              className="form-grid"
              onSubmit={handleCreate}
            >

              {/* CLASS NAME */}

              <label>
                Tên lớp *

                <input
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  placeholder="Ví dụ: Lớp 10A1"
                  required
                />
              </label>

              {/* DESCRIPTION */}

              <label>
                Mô tả

                <input
                  name="descriptions"
                  value={form.descriptions}
                  onChange={handleChange}
                  placeholder="Ví dụ: Lớp 10A1 năm học 2026"
                />
              </label>

              {/* TEACHER */}

              <label>
                Teacher ID *

                <input
                  name="teacherID"
                  type="number"
                  value={form.teacherID}
                  onChange={handleChange}
                  placeholder="Ví dụ: 1"
                  required
                />
              </label>

              {/* SUBJECT */}

              <label>
                Subject IDs

                <input
                  name="subjectIDs"
                  value={form.subjectIDs}
                  onChange={handleChange}
                  placeholder="Ví dụ: 1,2,3"
                />
              </label>

              <div className="modal-footer">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? 'Đang tạo...'
                    : 'Tạo lớp'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* DETAIL MODAL */}

      {detail && (

        <div
          className="modal-backdrop"
          onClick={() =>
            setDetail(null)
          }
        >

          <div
            className="modal"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h3>
                  Chi tiết lớp học
                </h3>
              </div>

              <button
                className="icon-btn"
                onClick={() =>
                  setDetail(null)
                }
              >
                <X size={18} />
              </button>

            </div>

            <div className="detail-grid">

              <Detail
                label="ID"
                value={detail.classID}
              />

              <Detail
                label="Tên lớp"
                value={detail.className}
              />

              <Detail
                label="Mô tả"
                value={detail.descriptions}
              />

              <Detail
                label="Teacher ID"
                value={detail.teacherID}
              />

              <Detail
                label="Giáo viên"
                value={detail.teacherName}
              />

              <Detail
                label="Số học sinh"
                value={detail.totalStudents}
              />

              <Detail
                label="Subject IDs"
                value={
                  detail.subjectIDs?.join(', ') || '—'
                }
              />

            </div>

          </div>

        </div>

      )}

    </>
  )
}

function Detail({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>

      <strong>
        {value === null ||
        value === undefined ||
        value === ''
          ? '—'
          : String(value)}
      </strong>
    </div>
  )
}