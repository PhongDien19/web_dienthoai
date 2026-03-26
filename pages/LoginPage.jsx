import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth"; // Sử dụng hàm từ auth.ts
import toast from "react-hot-toast";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        // Gọi hàm register từ authApi
        data = await authApi.register(form.fullName, form.email, form.password);
      } else {
        // Gọi hàm login từ authApi
        data = await authApi.login(form.email, form.password);
      }

      // Lưu thông tin vào localStorage sau khi thành công
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      toast.success(
        isRegister ? "Tạo tài khoản thành công!" : "Chào mừng bạn quay lại!",
      );
      navigate("/");
    } catch (err) {
      console.error("Lỗi API:", err);
      // Hiển thị lỗi từ backend hoặc lỗi mặc định
      toast.error(
        err.response?.data?.message ||
          "Thông tin không chính xác, vui lòng thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{isRegister ? "ĐĂNG KÝ THÀNH VIÊN" : "ĐĂNG NHẬP HỆ THỐNG"}</h2>
          <p>Chào mừng bạn đến với TechStore</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <div className="input-group">
              <label>Họ và tên</label>
              <input
                name="fullName"
                placeholder="Nhập họ tên của bạn"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="admin@techstore.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : isRegister ? (
              "TẠO TÀI KHOẢN"
            ) : (
              "ĐĂNG NHẬP NGAY"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
            <span onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? " Đăng nhập" : " Đăng ký ngay"}
            </span>
          </p>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          background-color: #f4f7f6;
          font-family: 'Inter', sans-serif;
        }
        .login-card {
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }
        .login-header { text-align: center; margin-bottom: 30px; }
        .login-header h2 { color: #1a1a1a; font-size: 24px; margin-bottom: 8px; letter-spacing: 1px; }
        .login-header p { color: #666; font-size: 14px; }
        .input-group { margin-bottom: 20px; }
        .input-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #444; font-size: 14px; }
        .input-group input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          outline: none;
          transition: 0.3s;
        }
        .input-group input:focus { border-color: #007bff; box-shadow: 0 0 0 2px rgba(0,123,255,0.1); }
        .btn-submit {
          width: 100%;
          padding: 14px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 10px;
        }
        .btn-submit:hover { background: #333; transform: translateY(-1px); }
        .btn-submit:disabled { background: #ccc; cursor: not-allowed; }
        .login-footer { text-align: center; margin-top: 25px; font-size: 14px; }
        .login-footer span { color: #007bff; cursor: pointer; font-weight: 600; }
        .login-footer span:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
