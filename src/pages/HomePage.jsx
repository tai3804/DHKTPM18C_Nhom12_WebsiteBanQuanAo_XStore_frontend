import { useDispatch, useSelector } from "react-redux";
import Header from "../components/header/Header";
import { useEffect } from "react";
import { setUser } from "../slices/AuthSlice";

export default function HomePage() {
  const dispath = useDispatch();
  const { user } = useSelector(state => state.auth);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <button onClick={() => {
        
      }}>
        click
      </button>
      <main className="flex-1 p-4">
        {user ? (
          <div>
            <p>Username: {user.account.username}</p>
          </div>
        ) : (
          <p>Đang tải user...</p>
        )}
      </main>
    </div>
  );
}
