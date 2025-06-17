"use server";

export async function POST(req: Request) {
  const body = await req.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.status.toString().startsWith("2")) {
    console.log(response);
    return new Response(JSON.stringify({ detail: "something went wrong" }), {
      status: response.status,
    });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
