import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from 'jwt-decode';

export default function Home() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    } else {
      setAccessToken(token);
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email || "");
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("accessToken");
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="w-full bg-blue-500 text-white p-4">
        <div className="flex justify-between max-w-7xl mx-auto items-center">
          {/* Sol: Home Butonu */}
          <button
            onClick={() => router.push("/")}
            className="text-xl font-bold hover:underline"
          >
            Home
          </button>

          {/* Sağ: Kullanıcı Bilgisi */}
          <div className="flex items-center space-x-4">
            {email && <span className="text-sm font-medium">{email}</span>}
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                router.push("/login");
              }}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to My Catalog App</h1>
          <a
            href="/catalogs"
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View Catalogs
          </a>
        </div>
      </main>
    </div>
  );
}