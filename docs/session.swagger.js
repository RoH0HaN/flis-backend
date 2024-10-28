const sessionRoutes = {
  paths: {
    "{base_url}/api/v1/session/create": {
      post: {
        summary: "Create new session",
        tags: ["Sessions 👩🏻‍🏫"],
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
                  year: {
                    type: "string",
                    description: "The year of the session",
                    example: "2024-2025",
                  },
                  startDate: {
                    type: "string",
                    description: "The start date of the session",
                    example: "2024-01-01",
                  },
                  endDate: {
                    type: "string",
                    description: "The end date of the session",
                    example: "2025-01-01",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Session created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    year: {
                      type: "string",
                      description: "The year of the session",
                      example: "2024-2025",
                    },
                    startDate: {
                      type: "string",
                      description: "The start date of the session",
                      example: "2024-01-01",
                    },
                    endDate: {
                      type: "string",
                      description: "The end date of the session",
                      example: "2025-01-01",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request/Validation error",
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
    "{base_url}/api/v1/session/delete": {
      delete: {
        summary: "Delete a session",
        tags: ["Sessions 👩🏻‍🏫"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "session_id",
            in: "path",
            description: "The ID of the session to delete",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Session deleted successfully",
          },
          400: {
            description: "Bad request/Validation error",
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
    "{base_url}/api/v1/session/get-all": {
      get: {
        summary: "Get all sessions",
        tags: ["Sessions 👩🏻‍🏫"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Sessions fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      year: {
                        type: "string",
                        description: "The year of the session",
                        example: "2024-2025",
                      },
                      startDate: {
                        type: "string",
                        description: "The start date of the session",
                        example: "2024-01-01",
                      },
                      endDate: {
                        type: "string",
                        description: "The end date of the session",
                        example: "2025-01-01",
                      },
                      isActive: {
                        type: "boolean",
                        description: "Whether the session is active or not",
                        example: true,
                      },
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

export default sessionRoutes;
