import { logger } from "./logger";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(message = "غير مصادق") {
    super(message, 401, "UNAUTHENTICATED");
    this.name = "AuthError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "ليس لديك صلاحية كافية") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "غير موجود") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    logger.warn(`API ${error.code ?? error.name}`, {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });
    return Response.json(
      { success: false, error: error.message },
      { status: error.statusCode },
    );
  }

  const message = error instanceof Error ? error.message : "خطأ داخلي في الخادم";
  logger.error("Unhandled API error", { message, error });
  return Response.json(
    { success: false, error: "خطأ داخلي في الخادم" },
    { status: 500 },
  );
}

export function handlePrismaError(error: unknown): Response {
  const prismaError = error as { code?: string; meta?: unknown; message?: string };

  if (prismaError.code === "P2002") {
    return Response.json(
      { success: false, error: "بيانات مكررة. هذا السجل موجود بالفعل." },
      { status: 409 },
    );
  }

  if (prismaError.code === "P2025") {
    return Response.json(
      { success: false, error: "السجل غير موجود." },
      { status: 404 },
    );
  }

  if (prismaError.code === "P2003") {
    return Response.json(
      { success: false, error: "لا يمكن الحذف. هذا السجل مرتبط ببيانات أخرى." },
      { status: 409 },
    );
  }

  logger.error("Prisma error", { code: prismaError.code, message: prismaError.message });
  return Response.json(
    { success: false, error: "خطأ في قاعدة البيانات." },
    { status: 500 },
  );
}
