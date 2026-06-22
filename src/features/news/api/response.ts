export function ok<T>(data: T, meta?: Record<string, unknown>): Response {
  return Response.json(
    { success: true, data, ...(meta ?? {}) },
    { status: 200 },
  );
}

export function created<T>(data: T): Response {
  return Response.json({ success: true, data }, { status: 201 });
}

export function badRequest(error: string): Response {
  return Response.json({ success: false, error }, { status: 400 });
}

export function notFound(error = "غير موجود"): Response {
  return Response.json({ success: false, error }, { status: 404 });
}

export function unauthorized(error = "غير مصرح"): Response {
  return Response.json({ success: false, error }, { status: 401 });
}

export function forbidden(error = "ليس لديك صلاحية كافية"): Response {
  return Response.json({ success: false, error }, { status: 403 });
}

export function serverError(error?: unknown): Response {
  const message = error instanceof Error ? error.message : "خطأ داخلي في الخادم";
  return Response.json({ success: false, error: message }, { status: 500 });
}
