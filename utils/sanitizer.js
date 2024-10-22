import DOMPurify from 'dompurify';

export function sanitizeInput(input) {
  return DOMPurify.sanitize(input);
}