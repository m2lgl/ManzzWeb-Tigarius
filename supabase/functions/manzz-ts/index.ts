import { Hono } from 'npm:hono'

const app = new Hono()

// JURUS SAPU JAGAT: Terima semua (GET/POST) di path mana pun
app.all('*', async (c) => {
  const path = c.req.path
  console.log(`[LOG] Ada tamu ngetok di path: ${path}`)

  // 1. Kalo diketuk pake browser (GET)
  if (c.req.method === 'GET') {
    return c.text("Gacor rrrr! Bot Manzz-TS udah Idup Bos! Webhook Aman! Lu di: ", path)
  }

  // 2. Kalo diketuk pake Telegram (POST)
  try {
    const update = await c.req.json() as any
    const msg = update.message

    if (msg && msg.text) {
      return c.json({
        method: 'sendMessage',
        chat_id: msg.chat.id,
        text: `Halo ${msg.from?.first_name || 'Manusia'}! Manzweb-TS nyaut nih. Lu tadi bilang: ${msg.text}`,
      })
    }
    return c.json({ ok: true })
  } catch (err) {
    return c.json({ error: 'Mumet bos, datanya aneh!' }, 400)
  }
})

Deno.serve(app.fetch)
