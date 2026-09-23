# SchoolOS Modern Frontend

Frontend React/Vite hiện đại cho backend `dev-shahed/student-management-system`.

## Chạy
```bash
npm install
npm run dev
```

Mặc định frontend chạy ở http://localhost:5173 và gọi backend:
http://localhost:8080/api

Có thể đổi bằng:
```env
VITE_API_URL=http://localhost:8080/api
```

## Màn hình
- Đăng nhập JWT
- Dashboard
- Học sinh: CRUD + chi tiết
- Giáo viên: CRUD
- Điểm danh: tra cứu + ghi điểm danh
- Kỳ thi: CRUD
- Kết quả: tra cứu điểm + performance

## Lưu ý
Payload được xây dựng theo các DTO/Controller hiện tại của backend công khai:
StudentDTO, TeacherDTO, AttendanceDTO, ExamDTO, ExamResultDTO, LoginDTO.
Nếu source backend local của bạn đã khác GitHub `main`, hãy đối chiếu DTO trước khi dùng các form CRUD.
