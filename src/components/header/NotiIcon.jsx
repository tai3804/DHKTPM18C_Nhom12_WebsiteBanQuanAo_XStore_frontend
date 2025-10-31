import { Bell } from "lucide-react";

export default function NotiIcon() {
  return (
    <button className="relative hover:cursor-pointer">
      <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 transition" />
    </button>
  );
}
