import { create } from 'axios'
import { api, unwrap } from './client'

export const studentsApi = {
  list: async () => unwrap(await api.get('/students')),
  get: async (id) => unwrap(await api.get(`/students/${id}`)),
  detailed: async (id) => unwrap(await api.get(`/students/${id}/detailed`)),
  byClass: async (classId) => unwrap(await api.get(`/students/class/${classId}`)),
  create: async (data) => unwrap(await api.post('/students', data)),
  update: async (id, data) => unwrap(await api.put(`/students/${id}`, data)),
  remove: async (id) => unwrap(await api.delete(`/students/${id}`))
}

export const teachersApi = {
  list: async () => unwrap(await api.get('/teachers')),
  get: async (id) => unwrap(await api.get(`/teachers/${id}`)),
  create: async (data) => unwrap(await api.post('/teachers', data)),
  update: async (id, data) => unwrap(await api.put(`/teachers/${id}`, data)),
  remove: async (id) => unwrap(await api.delete(`/teachers/${id}`))
}

export const classApi = {
  list: async () =>
    unwrap(await api.get('/classes')),

  create: async (data) =>
    unwrap(await api.post('/classes', data)),

  get: async (id) =>
    unwrap(await api.get(`/classes/${id}`)),

  remove: async (id) =>
    unwrap(await api.delete(`/classes/${id}`))
}

export const subjectsApi = {
  list: async () =>
    unwrap(await api.get('/subjects')),

  create: async (data) =>
    unwrap(await api.post('/subjects', data)),

  get: async (id) =>
    unwrap(await api.get(`/subjects/${id}`)),

  remove: async (id) =>
    unwrap(await api.delete(`/subjects/${id}`))
}

export const attendanceApi = {
  student: async (studentId) => unwrap(await api.get(`/attendance/student/${studentId}`)),
  stats: async (studentId, startDate, endDate) =>
    unwrap(await api.get(`/attendance/stats/student/${studentId}`, { params: { startDate, endDate } })),
  percentage: async (studentId, startDate, endDate) =>
    unwrap(await api.get(`/attendance/percentage/student/${studentId}`, { params: { startDate, endDate } })),
  mark: async (data) => unwrap(await api.post('/attendance/mark', data)),
  update: async (id, data) => unwrap(await api.put(`/attendance/${id}`, data)),
  remove: async (id) => unwrap(await api.delete(`/attendance/${id}`))
}

export const examsApi = {
  list: async () => unwrap(await api.get('/exams')),
  get: async (id) => unwrap(await api.get(`/exams/${id}`)),
  byClass: async (classId) => unwrap(await api.get(`/exams/class/${classId}`)),
  upcomingByClass: async (classId) => unwrap(await api.get(`/exams/upcoming/class/${classId}`)),
  today: async () => unwrap(await api.get('/exams/today')),
  create: async (data) => unwrap(await api.post('/exams', data)),
  update: async (id, data) => unwrap(await api.put(`/exams/${id}`, data)),
  status: async (id, status) => unwrap(await api.put(`/exams/${id}/status`, null, { params: { status } })),
  remove: async (id) => unwrap(await api.delete(`/exams/${id}`))
}

export const resultsApi = {
  byStudent: async (studentId) => unwrap(await api.get(`/exam-results/student/${studentId}`)),
  performance: async (studentId) => unwrap(await api.get(`/exam-results/student/${studentId}/performance`)),
  reportCard: async (studentId, classId) =>
    unwrap(await api.get(`/exam-results/student/${studentId}/report-card`, { params: { classId } })),
  byExam: async (examId) => unwrap(await api.get(`/exam-results/exam/${examId}`)),
  save: async (data) => unwrap(await api.post('/exam-results', data)),
  update: async (id, data) => unwrap(await api.put(`/exam-results/${id}`, data)),
  remove: async (id) => unwrap(await api.delete(`/exam-results/${id}`))
}
