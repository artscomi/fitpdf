import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return new NextResponse("Video ID is required", { status: 400 });
  }

  try {
    const response = await fetch(
      `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    );

    if (!response.ok) {
      // Se maxresdefault non esiste, prova con hqdefault
      const fallbackResponse = await fetch(
        `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      );

      if (!fallbackResponse.ok) {
        throw new Error("Failed to fetch thumbnail");
      }

      const buffer = await fallbackResponse.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error fetching thumbnail:", error);
    return new NextResponse("Failed to fetch thumbnail", { status: 500 });
  }
}
