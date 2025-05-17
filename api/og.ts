export const config = { runtime: "edge" };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "제목 없음";
  const template = searchParams.get("template") || "information";

  const fileMap = {
    information: "bg-information.png",
    question: "bg-question.png",
    doyouknow: "bg-doyouknow.png"
  };

  const filename = fileMap[template] || "bg-information.png";
  const imageUrl = new URL("/public/" + filename, req.url).toString();
  const res = await fetch(imageUrl);
  if (!res.ok) return new Response("이미지 로드 실패", { status: 500 });

  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

  return new Response(
    \`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <image href="\${dataUrl}" width="1200" height="630"/>
      <text x="600" y="315" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">\${title}</text>
    </svg>
    \`,
    { headers: { "Content-Type": "image/svg+xml" } }
  );
}
