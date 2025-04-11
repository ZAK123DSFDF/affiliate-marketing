export async function GET(request: Request) {
  console.log("this is the api route");
  return new Response(JSON.stringify({ message: "Success" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
