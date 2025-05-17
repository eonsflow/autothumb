import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = { runtime: 'edge' };

export default async function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '제목 없음';
  const template = searchParams.get('template') || 'issue';

  const fileMap = {
    issue: 'bg-issue.png'
  };

  const filename = fileMap[template] || 'bg-issue.png';
  const origin = req.headers.get('x-forwarded-host')
    ? `https://${req.headers.get('x-forwarded-host')}`
    : req.nextUrl.origin;

  const imageUrl = `${origin}/${encodeURIComponent(filename)}`;
  const res = await fetch(imageUrl);
  if (!res.ok) {
    return new Response('이미지를 불러올 수 없음', { status: 500 });
  }

  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundImage: `url(${dataUrl})`,
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 60,
          fontWeight: 700,
          color: 'white',
          textAlign: 'center',
          padding: '60px',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}