import { z } from "zod";

export const UUID_LIKE =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const idSchema = z
  .string()
  .regex(UUID_LIKE, "លេខសម្គាល់មិនត្រឹមត្រូវ។");