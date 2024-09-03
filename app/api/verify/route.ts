import { SiweMessage } from "siwe";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
    const siweMessage = new SiweMessage(message);
    // const fields = await siweMessage.verify({ signature })

    // if (fields.nonce !== req.cookies.get('nonce')) {
    //   return new Response(JSON.stringify({ ok: false, message: 'Invalid nonce.' }), {
    //     status: 422,
    //     headers: { 'Content-Type': 'application/json' },
    //   })
    // }

    // // Here you should create a session for the user
    // // This is just a placeholder
    // const session = { address: fields.address }
    await siweMessage.verify({ signature });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, message: (error as Error).message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
