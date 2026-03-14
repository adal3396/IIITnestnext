/**
 * Stage 3: Bias Auditing & Explainability Logging Utility
 *
 * This utility asynchronously writes AI decisions to the `ai_audit_logs`
 * Supabase table. It runs without blocking the main API response.
 */

import { supabase } from "@/lib/supabase";

export interface AuditLogPayload {
  agent_name: string;
  action_type: string;
  input_snapshot: Record<string, unknown>;
  output_snapshot: Record<string, unknown>;
  reasoning: string;
  dpdp_compliant: boolean;
}

/**
 * Fire-and-forget audit logger.
 * Sends the sanitised request, AI output, and explainable reasoning to Supabase
 * for Super Admin review and bias auditing.
 */
export async function logAIAudit(payload: AuditLogPayload): Promise<void> {
  // Fire asynchronously so it doesn't block the API response time
  supabase
    .from("ai_audit_logs")
    .insert([
      {
        agent_name: payload.agent_name,
        action_type: payload.action_type,
        input_snapshot: payload.input_snapshot,
        output_snapshot: payload.output_snapshot,
        reasoning: payload.reasoning,
        dpdp_compliant: payload.dpdp_compliant,
      },
    ])
    .then(({ error }) => {
      if (error) {
        // We log locally if the DB insert fails, but we don't crash the agent
        console.error("[Audit Logger Failed]:", error.message);
      }
    });
}
