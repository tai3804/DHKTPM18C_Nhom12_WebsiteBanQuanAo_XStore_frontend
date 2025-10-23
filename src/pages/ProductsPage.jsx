import { useDispatch } from "react-redux";
import { addNoti } from "../slices/NotiSlice";
import Header from "../components/header/Header";

export default function ProductsPage() {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(addNoti("Thông báo thành công!", "success", 5000));

  };

  return (
    <div className="">
      <Header />
      <button
        onClick={handleClick}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Notification
      </button>
    </div>
  );
}
