import { generateNonce } from 'siwe'

export async function GET() {
  const nonce = generateNonce()
  return new Response(nonce, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' },
  })
}