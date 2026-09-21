import { sendError } from '../utils/apiResponse.js';

/**
 * Global Error Handling Middleware
 * Handles malformed requests, server errors, and unexpected exceptions cleanly.
 * Prevents exposing sensitive stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Handle JSON parsing errors / malformed body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 'Malformed JSON payload in request body', 400);
  }

  // Handle CORS errors
  if (err.message && err.message.includes('CORS')) {
    return sendError(res, err.message, 403);
  }

  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : (err.message || 'Internal server error');

  return sendError(res, message, statusCode);
};

export default errorHandler;
