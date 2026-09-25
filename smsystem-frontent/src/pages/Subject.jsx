import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { subjectsApi } from '../api/school'
import { apiError } from '../api/client'
import Modal from '../components/Modal'

const blank = {
  subjectName: '',
  descriptions: '',
  teacherID: '',
  days: []
}

export default function Subject() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)
  const [saving, setSaving] = useState(false)

  async function load() {
    setLoading(true)
    setError('')

    try {
      const d = await subjectsApi.list()

      setItems(
        Array.isArray(d)
          ? d
          : Array.isArray(d?.data)
            ? d.data
            : []
      )
    } catch (e) {
      setError(apiError(e))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function openCreate() {
    setEditing(null)
    setForm({
      ...blank,
      days: []
    })
    setError('')
    setModal(true)
  }

  function edit(x) {
    setEditing(x)

    setForm({
      subjectName: x.subjectName ?? '',
      descriptions: x.descriptions ?? '',
      teacherID: x.teacherID ?? '',
      days: Array.isArray(x.days) ? x.days : []
    })

    setError('')
    setModal(true)
  }

  function toggleDay(day) {
    setForm(prev => {
      const exists = prev.days.includes(day)

      return {
        ...prev,
        days: exists
          ? prev.days.filter(x => x !== day)
          : [...prev.days, day]
      }
    })
  }

  async function save(e) {
    e.preventDefault()

    setSaving(true)
    setError('')

    const payload = {
      subjectName: form.subjectName,
      descriptions: form.descriptions,
      teacherID: Number(form.teacherID) || null,
      days: form.days
    }

    try {
      /*
       * Backend hiện tại chỉ có POST cho Subject.
       * Nếu editing thì cần backend có PUT/PATCH tương ứng.
       */
      if (editing) {
        setError(
          'Backend SubjectController hiện chưa có API cập nhật môn học.'
        )
        return
      }

      await subjectsApi.create(payload)

      setModal(false)
      setEditing(null)
      setForm({
        ...blank,
        days: []
      })

      await load()
    } catch (e) {
      setError(apiError(e))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!confirm('Xóa môn học này?')) return

    setError('')

    try {
      await subjectsApi.remove(id)
      await load()
    } catch (e) {
      setError(apiError(e))
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <span className="eyebrow">SUBJECT MANAGEMENT</span>

          <h1>Môn học</h1>

          <p>
            Quản lý môn học, giáo viên phụ trách và lịch học.
          </p>
        </div>

        <div className="head-actions">
          <button
            className="secondary-btn"
            onClick={load}
          >
            <RefreshCw size={17} />
            Làm mới
          </button>

          <button
            className="primary-btn"
            onClick={openCreate}
          >
            <Plus size={18} />
            Thêm môn học
          </button>
        </div>
      </div>

      {error && (
        <div className="alert error">
          {error}
        </div>
      )}

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Môn học</th>
                <th>Mô tả</th>
                <th>Giáo viên</th>
                <th>Ngày học</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="table-loading">
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty">
                      Chưa có môn học.
                    </div>
                  </td>
                </tr>
              ) : (
                items.map(x => (
                  <tr key={x.subjectID}>
                    <td>
                      {x.subjectID}
                    </td>

                    <td>
                      <strong>
                        {x.subjectName || '—'}
                      </strong>
                    </td>

                    <td>
                      {x.descriptions || '—'}
                    </td>

                    <td>
                      {x.thoughtBy ? (
                        <>
                          <strong>
                            {x.thoughtBy.firstName || ''}{' '}
                            {x.thoughtBy.lastName || ''}
                          </strong>

                          {x.teacherID && (
                            <small>
                              ID: {x.teacherID}
                            </small>
                          )}
                        </>
                      ) : (
                        x.teacherID || '—'
                      )}
                    </td>

                    <td>
                      {Array.isArray(x.days) &&
                      x.days.length > 0 ? (
                        <div className="days-list">
                          {x.days.map(day => (
                            <span
                              className="badge"
                              key={day}
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>

                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-btn"
                          onClick={() => edit(x)}
                          title="Chỉnh sửa"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-btn danger"
                          onClick={() =>
                            remove(x.subjectID)
                          }
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={
          editing
            ? 'Chỉnh sửa môn học'
            : 'Thêm môn học'
        }
        wide
      >
        <form
          className="form-grid"
          onSubmit={save}
        >
          <Field
            label="Tên môn học"
            value={form.subjectName}
            onChange={v =>
              setForm({
                ...form,
                subjectName: v
              })
            }
            required
            wide
          />

          <Field
            label="Teacher ID"
            type="number"
            value={form.teacherID}
            onChange={v =>
              setForm({
                ...form,
                teacherID: v
              })
            }
            required
          />

          <div className="field wide">
            <span>Ngày học</span>

            <div className="days-grid">
              {[
                'MONDAY',
                'TUESDAY',
                'WEDNESDAY',
                'THURSDAY',
                'FRIDAY',
                'SATURDAY',
                'SUNDAY'
              ].map(day => (
                <label
                  className="day-checkbox"
                  key={day}
                >
                  <input
                    type="checkbox"
                    checked={form.days.includes(day)}
                    onChange={() =>
                      toggleDay(day)
                    }
                  />

                  <span>
                    {day}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <Field
            label="Mô tả"
            value={form.descriptions}
            onChange={v =>
              setForm({
                ...form,
                descriptions: v
              })
            }
            wide
          />

          <div className="modal-footer">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setModal(false)}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={saving || !!editing}
            >
              {saving
                ? 'Đang lưu...'
                : 'Lưu môn học'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  wide = false,
  ...rest
}) {
  return (
    <label
      className={wide ? 'field wide' : 'field'}
    >
      <span>{label}</span>

      <input
        type={type}
        value={value ?? ''}
        onChange={e =>
          onChange(e.target.value)
        }
        {...rest}
      />
    </label>
  )
}