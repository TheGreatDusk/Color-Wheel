import { useNavigate } from "react-router";

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 py-32 text-center">
      <div
        className="w-16 h-16 rounded-full mx-auto mb-6 shadow-xl"
        style={{
          background: "conic-gradient(#FF0000, #FF7F00, #FFFF00, #00FF00, #00FFFF, #0000FF, #8B00FF, #FF00FF, #FF0000)"
        }}
      />
      <h1 className="text-gray-900 mb-3" style={{ fontWeight: 800, fontSize: "2rem" }}>
        404 — Page Not Found
      </h1>
      <p className="text-gray-500 mb-8">
        This page doesn't exist. Let's get you back on the color wheel.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm hover:bg-gray-700 transition"
          style={{ fontWeight: 600 }}
        >
          Go Home
        </button>
        <button
          onClick={() => navigate("/colors")}
          className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
          style={{ fontWeight: 600 }}
        >
          Browse Colors
        </button>
      </div>
    </div>
  );
}
