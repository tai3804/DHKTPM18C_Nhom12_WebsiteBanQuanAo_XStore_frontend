import { Bell } from "lucide-react";

export default function NotiIcon() {
  return (
    <button className="relative p-2 hover:bg-gray-100 rounded-full transition hover:cursor-pointer">
      <Bell className="w-6 h-6 text-gray-700 hover:text-gray-900 transition" />
    </button>
  );
}
