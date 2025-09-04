import type { ApiResponseOptions } from '@nestjs/swagger'

export const globalResponses: ApiResponseOptions[] = [
  {
    status: 400,
    description: 'Bad Request',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [
            {
              code: 'validation_title',
              detail: 'validation_message',
              attr: 'error_field',
            },
          ],
        },
      },
    },
  },
  {
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [
            {
              code: 'authentication_failed',
              detail: 'Incorrect authentication credentials.',
              attr: null,
            },
          ],
        },
      },
    },
  },
  {
    status: 403,
    description: 'Forbidden',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [
            {
              code: 'permission_denied',
              detail: 'You do not have permission to perform this action.',
              attr: null,
            },
          ],
        },
      },
    },
  },
  {
    status: 404,
    description: 'Not Found',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [{ code: 'not_found', detail: 'Not found.', attr: null }],
        },
      },
    },
  },
  {
    status: 405,
    description: 'Method Not Allowed',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [{ code: 'method_not_allowed', detail: 'Method "get" not allowed.', attr: null }],
        },
      },
    },
  },
  {
    status: 406,
    description: 'Not Acceptable',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [
            {
              code: 'not_acceptable',
              detail: 'Could not satisfy the request Accept header.',
              attr: null,
            },
          ],
        },
      },
    },
  },
  {
    status: 415,
    description: 'Unsupported Media Type',
    content: {
      'application/json': {
        example: {
          type: 'client_error',
          errors: [
            {
              code: 'unsupported_media_type',
              detail: 'Unsupported media type "application/json" in request.',
              attr: null,
            },
          ],
        },
      },
    },
  },
  {
    status: 500,
    description: 'Internal Server Error',
    content: {
      'application/json': {
        example: {
          type: 'server_error',
          errors: [{ code: 'error', detail: 'A server error occurred.', attr: null }],
        },
      },
    },
  },
]
