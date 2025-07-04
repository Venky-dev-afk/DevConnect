import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
        router.push("/login");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => router.pathname === path;

  return (
    <>
      <nav className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-wide">
            DevConnect
          </Link>
          <div className="space-x-4 text-sm">
            <Link href="/dashboard" className={isActive("/dashboard") ? "underline" : "hover:underline"}>
              Dashboard
            </Link>
            <Link href="/projects" className={isActive("/projects") ? "underline" : "hover:underline"}>
              Projects
            </Link>
            {user ? (
              <>
                <Link href="/my-projects" className={isActive("/my-projects") ? "underline" : "hover:underline"}>
                  My Projects
                </Link>
                <Link href="/add-project" className={isActive("/add-project") ? "underline" : "hover:underline"}>
                  Post Project
                </Link>
                <Link href="/profile" className={isActive("/profile") ? "underline" : "hover:underline"}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="hover:underline">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
                <Link href="/signup" className="hover:underline">
                  SignUp
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="bg-gray-100 min-h-screen p-4">{children}</main>
    </>
  );
}
