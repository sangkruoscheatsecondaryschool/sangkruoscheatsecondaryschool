import { ImageResponse } from "next/og";

export function generateStaticParams() {
  return [{ size: "192" }, { size: "512" }];
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ size: string }> },
) {
  const { size } = await params;
  const s = Number(size);
  if (s !== 192 && s !== 512) {
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(req.url);
  const isMaskable = url.searchParams.get("purpose") === "maskable";

  const pad = isMaskable ? s * 0.2 : 0;
  const box = s - pad * 2;
  const fontSize = box * 0.42;

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
        }}
      >
        <div
          style={{
            width: box,
            height: box,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: isMaskable ? box * 0.22 : s * 0.22,
            background: "rgba(255,255,255,0.10)",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize,
              fontWeight: 800,
              letterSpacing: -fontSize * 0.03,
              fontFamily: "sans-serif",
            }}
          >
            SM
          </span>
        </div>
      </div>
    ),
    { width: s, height: s },
  );
}