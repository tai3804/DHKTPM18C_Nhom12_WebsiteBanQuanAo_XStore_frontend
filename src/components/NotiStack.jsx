import { useSelector, useDispatch } from "react-redux";
import { removeNoti } from "../slices/NotiSlice";
import Noti from "./Noti";

export default function NotiStack() {
  const dispatch = useDispatch();
  const notis = useSelector(state => state.noti.list);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notis.map(n => (
        <Noti
          key={n.id}
          message={n.message}
          type={n.type}
          duration={n.duration}
          onClose={() => dispatch(removeNoti(n.id))}
        />
      ))}
    </div>
  );
}
