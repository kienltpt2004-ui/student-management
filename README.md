# Hệ thống Quản lý Trường học

Một hệ thống quản lý trường học full-stack toàn diện được xây dựng bằng Spring Boot và React. Hệ thống cung cấp các giải pháp quản lý đầy đủ cho các cơ sở giáo dục, bao gồm quản lý học sinh, theo dõi điểm danh, quản lý kỳ thi, quản lý học phí và nhiều chức năng khác.

---

## 🏫 Tổng quan hệ thống

Hệ thống Quản lý Trường học được thiết kế để xử lý tất cả các khía cạnh của công tác quản lý nhà trường, từ việc đăng ký học sinh đến theo dõi kết quả học tập. Hệ thống hỗ trợ nhiều vai trò người dùng với các quyền truy cập phù hợp, đồng thời cung cấp trải nghiệm sử dụng thuận tiện cho quản trị viên, giáo viên, học sinh và phụ huynh.

---

## ✨ Các chức năng chính

### 🎓 **Quản lý học tập**

- **Quản lý học sinh:** Quản lý toàn bộ vòng đời của học sinh, bao gồm thông tin cá nhân, thông tin học tập và thông tin người giám hộ.
- **Quản lý giáo viên:** Quản lý hồ sơ giáo viên, trình độ chuyên môn và phân công giảng dạy.
- **Quản lý lớp & khối:** Tổ chức học sinh theo lớp và phân công môn học.
- **Quản lý môn học:** Tạo và quản lý môn học cùng với giáo viên phụ trách và lịch học.
- **Quản lý thời khóa biểu:** Lập lịch học động cho các lớp với hệ thống quản lý tiết học.

### 📊 **Điểm danh & kết quả học tập**

- **Theo dõi điểm danh:** Điểm danh hàng ngày với nhiều trạng thái khác nhau (Có mặt, Vắng mặt, Đi muộn, Có phép, Nửa ngày).
- **Điểm danh theo lớp:** Điểm danh hàng loạt cho toàn bộ học sinh trong một lớp.
- **Phân tích điểm danh:** Thống kê chi tiết về điểm danh và tính toán tỷ lệ phần trăm.
- **Báo cáo điểm danh:** Tạo các báo cáo điểm danh toàn diện.

### 📝 **Hệ thống thi**

- **Quản lý kỳ thi:** Tạo và lên lịch các kỳ thi với nhiều cấu hình chi tiết.
- **Quản lý kết quả:** Nhập và quản lý kết quả thi với chức năng tự động tính điểm/xếp loại.
- **Hệ thống xếp loại:** Hệ thống xếp loại toàn diện (A+, A, B+, B, C+, C, D, F).
- **Phân tích kết quả:** Thống kê điểm trung bình của lớp, học sinh có thành tích cao và phân tích kết quả không đạt.
- **Phiếu điểm:** Tạo phiếu kết quả học tập chi tiết cho học sinh.

### 💰 **Quản lý tài chính**

- **Cấu trúc học phí:** Quản lý học phí linh hoạt với nhiều loại phí khác nhau.
- **Theo dõi thanh toán:** Theo dõi các khoản thanh toán, ngày đến hạn và số tiền còn nợ.
- **Phương thức thanh toán:** Hỗ trợ nhiều phương thức thanh toán.
- **Báo cáo học phí:** Tạo các báo cáo tài chính và biên lai.

### 📢 **Hệ thống liên lạc**

- **Thông báo:** Quản lý thông báo trên toàn hệ thống.
- **Thông báo chung:** Gửi thông báo đến các đối tượng cụ thể.
- **Mức độ ưu tiên:** Thông báo với các mức độ khẩn cấp, cao, trung bình và thấp.
- **Hỗ trợ nhiều đối tượng:** Gửi thông báo đến học sinh, giáo viên, phụ huynh và nhân viên.

### 👨‍👩‍👧‍👦 **Cổng thông tin phụ huynh**

- **Thông tin con em:** Truy cập thông tin học tập của con.
- **Theo dõi điểm danh:** Xem lịch sử và thống kê điểm danh.
- **Theo dõi kết quả:** Truy cập kết quả thi và phiếu điểm.
- **Tình trạng học phí:** Theo dõi các khoản học phí đã thanh toán và còn nợ.

### 🔐 **Bảo mật & Kiểm soát truy cập**

- **Kiểm soát truy cập dựa trên vai trò (RBAC):** Hệ thống phân quyền toàn diện.
- **Xác thực JWT:** Xác thực an toàn dựa trên token.
- **Nhiều vai trò người dùng:** Admin, Principal, Teacher, Student, Parent, Accountant, Librarian, Receptionist, Clerk.
- **Endpoint an toàn:** Bảo vệ các API endpoint dựa trên quyền truy cập của từng vai trò.

---

## 🏗️ Kiến trúc hệ thống

### **Backend (Spring Boot)**

- **Framework:** Spring Boot 3.2.3
- **Bảo mật:** Spring Security với JWT
- **Cơ sở dữ liệu:** PostgreSQL với JPA/Hibernate
- **Tài liệu API:** Tích hợp Swagger/OpenAPI
- **Mô hình kiến trúc:** Kiến trúc phân lớp (Controller → Service → Repository → Entity)

### **Frontend (React)**

- **Framework:** React với Vite
- **Styling:** Tailwind CSS
- **Công cụ build:** Vite cho quá trình phát triển và build nhanh.

---

## 🚀 Công nghệ sử dụng

### **Công nghệ Backend**

- **Java 17:** Các tính năng Java hiện đại và hiệu năng tốt.
- **Spring Boot 3.2.3:** Framework phát triển ứng dụng.
- **Spring Security:** Xác thực và phân quyền.
- **Spring Data JPA:** Lớp trừu tượng hóa cơ sở dữ liệu.
- **PostgreSQL:** Cơ sở dữ liệu quan hệ.
- **JWT (JSON Web Tokens):** Xác thực an toàn.
- **ModelMapper:** Ánh xạ giữa các đối tượng.
- **Lombok:** Giảm lượng code lặp lại.
- **Swagger/OpenAPI:** Tài liệu API.

### **Công nghệ Frontend**

- **React:** Thư viện xây dựng giao diện người dùng.
- **Vite:** Công cụ build và development server.
- **Tailwind CSS:** Framework CSS theo hướng utility-first.
- **JavaScript/TypeScript:** Ngôn ngữ lập trình.

### **Công cụ phát triển**

- **Maven:** Quản lý dependency.
- **Git:** Quản lý phiên bản.
- **Swagger UI:** Giao diện kiểm thử API.

---

## 📊 Database Schema

### **Các Entity chính**

- **Users:** Xác thực và thông tin cơ bản của người dùng.
- **Roles:** Kiểm soát truy cập dựa trên vai trò.
- **Students:** Thông tin cá nhân và học tập của học sinh.
- **Teachers:** Hồ sơ và trình độ chuyên môn của giáo viên.
- **Parents:** Thông tin phụ huynh/người giám hộ và mối quan hệ với học sinh.
- **Classes:** Tổ chức và quản lý lớp học.
- **Subjects:** Thông tin môn học và giáo viên phụ trách.

### **Các Entity học tập**

- **Attendance:** Theo dõi điểm danh hàng ngày.
- **Exams:** Lịch thi và cấu hình kỳ thi.
- **ExamResults:** Kết quả thi và điểm của học sinh.
- **Timetable:** Thời khóa biểu và các tiết học.

### **Các Entity quản trị**

- **Fees:** Cấu trúc học phí và theo dõi thanh toán.
- **Notifications:** Thông báo và thông tin truyền đạt trong hệ thống.

---

## 🔑 Vai trò người dùng & Quyền hạn

### **ADMIN**

- Toàn quyền truy cập hệ thống.
- Quản lý người dùng.
- Cấu hình hệ thống.
- Thực hiện tất cả các thao tác CRUD.

### **PRINCIPAL**

- Giám sát hoạt động học tập.
- Quản lý giáo viên.
- Quản lý học sinh.
- Quản lý kỳ thi.
- Giám sát tài chính.

### **TEACHER**

- Quản lý học sinh trong các lớp được phân công.
- Điểm danh.
- Tạo và đánh giá kỳ thi.
- Nhập kết quả.
- Trao đổi với phụ huynh.

### **STUDENT**

- Xem thông tin cá nhân.
- Kiểm tra lịch sử điểm danh.
- Xem kết quả thi.
- Xem thời khóa biểu.
- Nhận thông báo.

### **PARENT**

- Xem thông tin của con.
- Theo dõi điểm danh.
- Kiểm tra kết quả thi.
- Theo dõi tình trạng học phí.
- Nhận thông báo.

### **ACCOUNTANT**

- Quản lý học phí.
- Xử lý thanh toán.
- Báo cáo tài chính.
- Theo dõi giao dịch.

### **Các vai trò hỗ trợ**

- **Librarian:** Quản lý thư viện.
- **Receptionist:** Truy cập các thông tin cơ bản.
- **Clerk:** Thực hiện các công việc hành chính.

---

## 🛠️ Cài đặt và thiết lập

### **Yêu cầu hệ thống**

- Java 17 trở lên
- Node.js 16 trở lên
- PostgreSQL 12 trở lên
- Git

---

### **Thiết lập Backend**

#### 1. **Clone repository**

```bash
git clone https://github.com/dev-shahed/student-management-system.git
cd student-management-system/smsystem-backend