import { nanoid } from "nanoid";
import { ATTACK_TYPES, generateSubject, generateBody } from "../utils/templates.js";

export function generateEmail({ targetName, targetRole, attackType }) {
  const type = Object.values(ATTACK_TYPES).includes(attackType)
    ? attackType
    : ATTACK_TYPES.DELIVERY;

  const subject = generateSubject(targetRole || "general", type);
  const bodyHtml = generateBody({ name: targetName || "there", role: targetRole || "general", type });

  return {
    id: nanoid(),
    channel: "email",
    attackType: type,
    target: { name: targetName || null, role: targetRole || "general" },
    subject,
    bodyHtml,
    createdAt: new Date().toISOString(),
    riskWeight: type === ATTACK_TYPES.ACCOUNT_VERIFY ? 3 : 2
  };
}
