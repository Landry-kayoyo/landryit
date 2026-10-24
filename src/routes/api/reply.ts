import { createFileRoute } from "@tanstack/react-router";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const replySchema = z.object({
  messageId: z.string().uuid("ID de message invalide"),
  to: z.string().email("Email invalide"),
  toName: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  body: z.string().min(1, "La réponse ne peut pas être vide").max(5000),
  originalMessage: z.string().optional(),
});

export const Route = createFileRoute("/api/reply")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => null);
          const parsed = replySchema.safeParse(body);

          if (!parsed.success) {
            return json(
              { error: "Données invalides", details: parsed.error.flatten() },
              400,
            );
          }

          const { messageId, to, toName, subject, body: replyBody, originalMessage } = parsed.data;

          const host = process.env["SMTP_HOST"] || "smtp.gmail.com";
          const port = Number(process.env["SMTP_PORT"] || 465);
          const secure = process.env["SMTP_SECURE"] !== "false";
          const user = process.env["SMTP_USER"];
          const pass = process.env["SMTP_PASSWORD"];
          const from = process.env["SMTP_FROM"] || user;

          if (!user || !pass) {
            return json({ error: "Configuration SMTP manquante" }, 500);
          }

          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
          });

          const mailHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 18px; border-bottom: 2px solid #3b82f6; padding-bottom: 12px;">
                Réponse de Landry Kayoyo
              </h2>

              <p style="color: #374151; font-size: 15px; line-height: 1.7; margin-top: 20px; white-space: pre-wrap;">${escapeHtml(replyBody)}</p>

              ${originalMessage ? `
              <div style="margin-top: 28px; padding: 14px 16px; background-color: #f8fafc; border-left: 3px solid #cbd5e1; border-radius: 0 8px 8px 0;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Votre message original</p>
                <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(originalMessage)}</p>
              </div>` : ""}

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
                Landry Kayoyo &middot; D&eacute;veloppeur web &amp; infrastructure r&eacute;seau
              </p>
            </div>
          `;

          const mailText = `${replyBody}${originalMessage ? `\n\n---\nVotre message original :\n${originalMessage}` : ""}`;

          await transporter.sendMail({
            from: `"Landry Kayoyo" <${from}>`,
            to: `"${toName}" <${to}>`,
            replyTo: from,
            subject,
            text: mailText,
            html: mailHtml,
          });

          // Marquer le message comme répondu dans Supabase
          try {
            const supabase = createClient(
              process.env["SUPABASE_URL"]!,
              process.env["SUPABASE_SERVICE_ROLE_KEY"]!,
              { auth: { persistSession: false, autoRefreshToken: false } },
            );
            await supabase.from("contact_messages").update({
              status: "replied",
              replied_at: new Date().toISOString(),
              reply_notes: replyBody.slice(0, 500),
            }).eq("id", messageId);
          } catch (dbErr) {
            console.error("Erreur mise à jour statut message :", dbErr);
          }

          return json({ success: true });
        } catch (error) {
          console.error("Erreur envoi réponse :", error);
          const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
          return json({ error: "Échec de l'envoi.", details: errorMessage }, 500);
        }
      },
    },
  },
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
