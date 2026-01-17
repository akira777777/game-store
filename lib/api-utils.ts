// API utility functions for consistent error handling and response formatting

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Creates a standardized error response
 * In production, hides internal error details to prevent information leakage
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage = 'Internal server error'
): NextResponse {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      },
      { status: 400 }
    )
  }

  // Handle custom ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        ...(error.details && process.env.NODE_ENV === 'development' && { details: error.details }),
      },
      { status: error.statusCode }
    )
  }

  // Log unexpected errors (but don't expose details to client)
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('API Error:', errorMessage, error instanceof Error ? error.stack : '')

  return NextResponse.json(
    {
      error: defaultMessage,
      ...(process.env.NODE_ENV === 'development' && {
        details: errorMessage,
      }),
    },
    { status: 500 }
  )
}

/**
 * Wraps an async API handler with error handling
 */
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      return createErrorResponse(error)
    }
  }
}

/**
 * Validates request body size to prevent DoS
 */
export const MAX_REQUEST_BODY_SIZE = 1024 * 1024 // 1MB

/**
 * Safely parses JSON from request with size limit
 */
export async function parseRequestBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    throw new ApiError(400, 'Content-Type must be application/json')
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_BODY_SIZE) {
    throw new ApiError(413, 'Request body too large')
  }

  try {
    const text = await request.text()
    if (text.length > MAX_REQUEST_BODY_SIZE) {
      throw new ApiError(413, 'Request body too large')
    }
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(400, 'Invalid JSON in request body')
  }
}

/**
 * Validates pagination parameters
 */
export function validatePagination(params: {
  page?: string | null
  limit?: string | null
}) {
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1)
  const limit = Math.min(
    100,
    Math.max(1, parseInt(params.limit || '12', 10) || 12)
  )
  const skip = (page - 1) * limit

  return { page, limit, skip }
}
