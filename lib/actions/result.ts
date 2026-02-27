export type ActionResult<T = any> =
  | { ok: true; data: T; message?: string }
  | {
      ok: false;
      error: {
        code: "VALIDATION" | "AUTH" | "RLS" | "STORAGE" | "DB" | "UNKNOWN";
        message: string;
        fieldErrors?: Record<string, string[]>;
      };
    };
