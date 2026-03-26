import { Hono } from 'npm:hono'

const app = new Hono()
app.basePath("/manzz-ts")
// 1. Definisikan Interface buat TypeScript (Biar Gak Merah-merah)
interface TelegramUpdate {
  message?: {
    chat: { id: number };
    text?: string;
    from?: { first_name: string };
  };
}

// 2. Route Utama (Webhook Entry Point)
app.post('/', async (c) => {
  try {
    // Ambil body pake await (Standard Hono)
    const update = await c.req.json<TelegramUpdate>()
    const msg = update.message

    if (msg && msg.text) {
      const chatId = msg.chat.id
      const text = msg.text
      const user = msg.from?.first_name || 'Manusia'

      console.log(`[LOG] Ada chat dari ${user}: ${text}`)

      // Logika Sederhana: Reply Balik
      // Kita pake return c.json buat ngirim "Webhook Response" (Cara paling kenceng)
      return c.json({
        method: 'sendMessage',
        chat_id: chatId,
        text: `Halo ${user}! Manzweb-TS lagi dengerin lu. Tadi lu bilang: "${text}"`,
      })
    }

    return c.json({ ok: true })
  } catch (err) {
    console.error('Anjrit Error:', err.message)
    return c.json({ error: 'Gagal olah data bos!' }, 400)
  }
})

// 3. Jalankan Server Deno
Deno.serve(app.fetch)
