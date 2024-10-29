const feesRoutes = {
  paths: {
    "{base_url}/api/v1/fees/header/create": {
      post: {
        tags: ["Fees 💵"],
        summary: "Create fees header",
        description: "Create fees header",
        parameters: [],
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
                  name: {
                    type: "string",
                    description: "Fees header name",
                  },
                  feesCode: {
                    type: "string",
                    description: "Fees header code",
                  },
                  occurrence: {
                    type: "string",
                    description: "Fees header occurrence",
                    example: "Monthly",
                  },
                  dueDate: {
                    type: "string",
                    description: "Fees header due date",
                  },
                  description: {
                    type: "string",
                    description: "Fees header description",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Fees header created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Fees header name",
                    },
                    feesCode: {
                      type: "string",
                      description: "Fees header code",
                    },
                    occurrence: {
                      type: "string",
                      description: "Fees header occurrence",
                    },
                    dueDate: {
                      type: "string",
                      description: "Fees header due date",
                    },
                    description: {
                      type: "string",
                      description: "Fees header description",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request",
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
    "{base_url}/api/v1/fees/header/{id}": {
      get: {
        summary: "Get fees header by ID",
        tags: ["Fees 💵"],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "The ID of the fees header",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Fees header fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "Fees header name",
                    },
                    feesCode: {
                      type: "string",
                      description: "Fees header code",
                    },
                    occurrence: {
                      type: "string",
                      description: "Fees header occurrence",
                    },
                    dueDate: {
                      type: "string",
                      description: "Fees header due date",
                    },
                    description: {
                      type: "string",
                      description: "Fees header description",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees header not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/header/get-all": {
      get: {
        summary: "Get all fees headers",
        tags: ["Fees 💵"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Fees headers fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: {
                        type: "string",
                        description: "Fees header name",
                      },
                      feesCode: {
                        type: "string",
                        description: "Fees header code",
                      },
                      occurrence: {
                        type: "string",
                        description: "Fees header occurrence",
                      },
                      dueDate: {
                        type: "string",
                        description: "Fees header due date",
                      },
                      description: {
                        type: "string",
                        description: "Fees header description",
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
    "{base_url}/api/v1/fees/header/delete/{id}": {
      delete: {
        summary: "Delete a fees header",
        tags: ["Fees 💵"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "The ID of the fees header to delete",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Fees header deleted successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees header not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/header/update": {
      put: {
        summary: "Update a fees header",
        tags: ["Fees 💵"],
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
                  id: {
                    type: "string",
                    description: "Fees header ID",
                  },
                  name: {
                    type: "string",
                    description: "Fees header name",
                  },
                  feesCode: {
                    type: "string",
                    description: "Fees header code",
                  },
                  occurrence: {
                    type: "string",
                    description: "Fees header occurrence",
                  },
                  dueDate: {
                    type: "string",
                    description: "Fees header due date",
                  },
                  description: {
                    type: "string",
                    description: "Fees header description",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Fees header updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees header not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export default feesRoutes;
