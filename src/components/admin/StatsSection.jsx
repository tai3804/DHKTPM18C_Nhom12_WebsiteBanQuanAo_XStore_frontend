// components/admin/StatsSection.jsx
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

function StatsSection({ stats }) {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          color={stat.color}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

function StatCard({ label, value, color, icon }) {
  const themeMode = useSelector(selectThemeMode);
  return (
    <div
      className={`w-full p-4 rounded-xl shadow-sm border transition-colors duration-300 flex flex-col items-start ${
        themeMode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <div className="text-white">{icon}</div>
        </div>
        <span
          className={`text-sm font-medium transition-colors duration-300 ${
            themeMode === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-2xl font-bold transition-colors duration-300 ${
          themeMode === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default StatsSection;
