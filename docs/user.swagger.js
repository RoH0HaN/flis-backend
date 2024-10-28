const userRoutes = {
  paths: {
    "{base_url}/api/v1/user/sign-up": {
      post: {
        summary: "Create a new user",
        tags: ["Users 👨🏻‍💼"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the user",
                    example: "John Doe",
                  },
                  email: {
                    type: "string",
                    description: "The email of the user",
                    example: "xH2m9@example.com",
                  },
                  password: {
                    type: "string",
                    description: "The password of the user",
                    example: "password123",
                  },
                  role: {
                    type: "string",
                    description: "The role of the user",
                    example: "admin/teacher",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        name: {
                          type: "string",
                          description: "The name of the user",
                          example: "John Doe",
                        },
                        email: {
                          type: "string",
                          description: "The email of the user",
                          example: "xH2m9@example.com",
                        },
                        role: {
                          type: "string",
                          description: "The role of the user",
                          example: "admin/teacher",
                        },
                      },
                    },
                    accessToken: {
                      type: "string",
                      description: "The access token of the user",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjQ2MzU5OTI5NjU5NjQwMyIsImlhdCI6MTYzNjYzNzQyNn0.8YqXw7jKmUZ9IwUJhD8h6p3Vq0P3U7s6bT",
                    },
                    refreshToken: {
                      type: "string",
                      description: "The refresh token of the user",
                      example:
                        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNjQ2MzU5OTI5NjU5NjQwMyIsImlhdCI6MTYzNjYzNzQyNn0.8YqXw7jKmUZ9IwUJhD8h6p3Vq0P3U7s6bT",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized request",
          },
          400: {
            description: "Validation error",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/user/log-in": {
      post: {
        summary: "Log in a user",
        tags: ["Users 👨🏻‍💼"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    description: "The email of the user",
                    example: "xH2m9@example.com",
                  },
                  password: {
                    type: "string",
                    description: "The password of the user",
                    example: "password123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          400: {
            description: "Validation error/Invalid credentials",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/user/log-out": {
      post: {
        summary: "Log out a user",
        tags: ["Users 👨🏻‍💼"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User logged out successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/user/change-password": {
      post: {
        summary: "Change password of a user",
        tags: ["Users 👨🏻‍💼"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  oldPassword: {
                    type: "string",
                    description: "The old password of the user",
                    example: "password123",
                  },
                  newPassword: {
                    type: "string",
                    description: "The new password of the user",
                    example: "newPassword123",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password changed successfully",
          },
          401: {
            description: "Unauthorized request/Invalid password",
          },
          400: {
            description: "Validation error/Same password",
          },
          404: {
            description: "User not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/user/get-current-admin": {
      get: {
        summary: "Get current admin",
        tags: ["Users 👨🏻‍💼"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "User fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the user",
                      example: "John Doe",
                    },
                    email: {
                      type: "string",
                      description: "The email of the user",
                      example: "xH2m9@example.com",
                    },
                    role: {
                      type: "string",
                      description: "The role of the user",
                      example: "admin/teacher",
                    },
                    password: {
                      type: "string",
                      description: "The password of the user",
                      example: "password123",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized request",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export default userRoutes;
