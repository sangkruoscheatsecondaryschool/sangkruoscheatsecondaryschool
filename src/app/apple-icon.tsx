import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #1d4ed8 0%, #1e40af 55%, #1e3a8a 100%)",
          color: "#ffffff",
          fontSize: 80,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        SM
      </div>
    ),
    { ...size },
  );
}