import { sendError } from '../utils/apiResponse.js';

/**
 * Middleware to handle 404 Not Found requests for invalid routes
 */
const notFoundHandler = (req, res, next) => {
  return sendError(res, 'Route not found', 404);
};

export default notFoundHandler;
