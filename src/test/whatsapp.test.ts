import { describe, expect, it } from "vitest";
import { profile, whatsappNumber, whatsappUrl } from "@/content/portfolio";

describe("Bouton WhatsApp", () => {
  it("utilise un numéro au format international, sans + ni espaces", () => {
    expect(whatsappNumber).toMatch(/^\d{8,15}$/);
  });

  it("ouvre la conversation du numéro configuré sur wa.me", () => {
    expect(whatsappUrl.startsWith(`https://wa.me/${whatsappNumber}?text=`)).toBe(true);
    expect(profile.whatsapp).toBe(whatsappUrl);
  });

  it("reste cohérent avec le numéro affiché dans la section contact", () => {
    expect(profile.phone.replace(/\D/g, "")).toBe(whatsappNumber);
    expect(profile.phoneHref).toBe(`tel:+${whatsappNumber}`);
  });
});
