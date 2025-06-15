import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";
import React from "react";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { html, filename } = await request.json();

    const response = new ImageResponse(
      React.createElement(
        "div",
        {
          style: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "40px",
          },
        },
        React.createElement("div", {
          dangerouslySetInnerHTML: { __html: html },
        })
      ),
      {
        width: 1200,
        height: 1600,
      }
    );

    // Converti l'immagine in PDF usando una libreria client-side
    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);

    // Invia l'URL dell'immagine al client
    return new NextResponse(JSON.stringify({ imageUrl }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return new NextResponse("Error generating image", { status: 500 });
  }
}
