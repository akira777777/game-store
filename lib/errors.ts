/**
 * Custom error classes for better error handling and debugging
 */

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, "AUTHENTICATION_ERROR")
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, "AUTHORIZATION_ERROR")
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND")
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT")
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 500, "DATABASE_ERROR", details)
  }
}

export class ExternalServiceError extends AppError {
  constructor(service: string, message: string, details?: unknown) {
    super(`External service error (${service}): ${message}`, 502, "EXTERNAL_SERVICE_ERROR", details)
  }
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown): {
  error: string
  code?: string
  details?: unknown
} {
  if (error instanceof AppError) {
    const result: { error: string; code?: string; details?: unknown } = {
      error: error.message,
      code: error.code,
    }
    if (error.details) {
      result.details = error.details
    }
    return result
  }

  if (error instanceof Error) {
    return {
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      code: "INTERNAL_ERROR",
    }
  }

  return {
    error: "Internal server error",
    code: "UNKNOWN_ERROR",
  }
}
