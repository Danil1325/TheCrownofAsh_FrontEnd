// Client for the backend's cookie-authenticated /api/auth endpoints
// (DnDGame.API.Controllers.AuthController). The session lives in an HttpOnly
// cookie set by the backend, never in JS-readable storage — every request here
// must send `credentials: 'include'` or the browser won't attach/store it, since
// the frontend and API are on different origins (ports) even in dev.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export interface CurrentUser {
  id: number
  username: string
  email: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

/** Mirrors the backend's ApiErrorResponse (BusinessLayer/Dtos/Common/ApiErrorResponse.cs). */
interface ApiErrorBody {
  success: false
  errorCode: string
  message: string
}

/**
 * Thrown for any non-2xx response. `errorCode`/`message` come straight from the
 * backend's ApiErrorResponse where one exists. One case deliberately has no body
 * to read: a 401 from GET /me when there's no valid session cookie is produced by
 * the cookie-auth middleware itself (not a DomainException), so it carries no JSON
 * — callers checking "am I logged in?" should treat any ApiError from getCurrentUser
 * as "no", not inspect errorCode/message for that call.
 */
export class ApiError extends Error {
  readonly status: number
  readonly errorCode: string

  constructor(status: number, errorCode: string, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errorCode = errorCode
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const errorBody = body as ApiErrorBody | null
    throw new ApiError(
      response.status,
      errorBody?.errorCode ?? 'UNKNOWN_ERROR',
      errorBody?.message ?? 'Something went wrong. Please try again.',
    )
  }

  return body as T
}

export function register(request: RegisterRequest): Promise<CurrentUser> {
  return apiFetch<CurrentUser>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function login(request: LoginRequest): Promise<CurrentUser> {
  return apiFetch<CurrentUser>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

/** Always resolves (204 No Content on success) — never [Authorize]-gated on the backend. */
export function logout(): Promise<void> {
  return apiFetch<void>('/api/auth/logout', { method: 'POST' })
}

/** Rejects with ApiError (401, no body) if there is no valid session cookie. */
export function getCurrentUser(): Promise<CurrentUser> {
  return apiFetch<CurrentUser>('/api/auth/me', { method: 'GET' })
}
