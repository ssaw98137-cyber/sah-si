import { FaCheck } from "react-icons/fa";
import NcbLayout from "../components/NcbLayout";

export default function SuccessPage() {
  return (
    <NcbLayout>
      <div className="ncb-success flex flex-col   w-full">
        <img src="/assets/header.png" alt="Shary Bank" className="w-[70%]" />
        <div className="ncb-success__icon">
          <FaCheck color="#fff" />
        </div>
        <p className="ncb-success__text text-center text-[#0b4a5a]!">
          تم قبول طلبك بنجاح
        </p>
      </div>
      <span className="text-[#0b4a5a] text-center pb-5!">
        جميع الحقوق محفوظة © شركة مسارات 2026
      </span>
    </NcbLayout>
  );
}
