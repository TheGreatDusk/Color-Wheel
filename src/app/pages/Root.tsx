import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { ColorScroll } from "../components/ColorScroll";

export function Root() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="mt-auto">
        <ColorScroll />
        <div className="bg-white border-t border-gray-100 py-6 px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2026 <span className="text-gray-600" style={{ fontWeight: 600 }}>colorwheel.org</span> — A curated encyclopedia of color
          </p>
        </div>
      </footer>
    </div>
  );
}
