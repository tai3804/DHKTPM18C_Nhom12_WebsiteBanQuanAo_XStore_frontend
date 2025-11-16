import React from "react";
import ChatManagement from "../../components/admin/ChatManagement";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectThemeMode } from "../../slices/ThemeSlice";

const ChatManagementPage = () => {
  const themeMode = useSelector(selectThemeMode);

  return (
    <div className="space-y-6">
      <div className="h-[calc(100vh-4rem)]">
        <ChatManagement />
      </div>
    </div>
  );
};

export default ChatManagementPage;
