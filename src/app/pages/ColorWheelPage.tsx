import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { fetchColor } from "../../utils/colors";

export function ColorWheelPage() {
  const [color, setColor] = useState("#ffffff");
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadColor = async () => {
      setLoading(true);
      const fetched = await fetchColor(color);
      setName(fetched ? fetched.name : null);
      setLoading(false);
    };
    loadColor();
  }, [color]);

  const handleHexChange = (value: string) => {
    // Validate hex
    const hexMatch = value.match(/^#?[0-9a-fA-F]{6}$/);
    if (hexMatch) {
      let hex = value;
      if (!hex.startsWith("#")) hex = "#" + hex;
      setColor(hex);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Color Wheel</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-center mb-6">
            <HexColorPicker color={color} onChange={setColor} />
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hex Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#ffffff"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
                {loading ? "Loading..." : name || "Unknown"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}