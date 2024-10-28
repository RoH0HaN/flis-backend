const classRoutes = {
  paths: {
    "{base_url}/api/v1/class/create": {
      post: {
        summary: "Create a new class",
        tags: ["Classes 👩🏻‍🏫"],
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
                    description: "The name of the class",
                    example: "Kinder-garden",
                  },
                  description: {
                    type: "string",
                    description: "A brief description of the class",
                    example: "This class is for children.",
                  },
                  academicYear: {
                    type: "string",
                    description: "Send the current session ObjectID",
                    example: "62d5a5f6e0e9d9e9d9e9d9e9",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Class created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description: "The name of the class",
                      example: "Kinder-garden",
                    },
                    description: {
                      type: "string",
                      description: "A brief description of the class",
                      example: "This class is for children.",
                    },
                    academicYear: {
                      type: "string",
                      description: "The current session ObjectID",
                      example: "62d5a5f6e0e9d9e9d9e9d9e9",
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
            description: "Bad request/Validation error",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/class/delete/{class_id}": {
      delete: {
        summary: "Delete a class",
        tags: ["Classes 👩🏻‍🏫"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "class_id",
            in: "path",
            description: "The ID of the class to delete",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Class deleted successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Class not found/Validation error",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/class/update/{class_id}": {
      put: {
        summary: "Update a class",
        tags: ["Classes 👩🏻‍🏫"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "class_id",
            in: "path",
            description: "The ID of the class to update",
            required: true,
            schema: {
              type: "string",
            },
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
                    description: "The name of the class",
                    example: "Kinder-garden",
                  },
                  description: {
                    type: "string",
                    description: "A brief description of the class",
                    example: "This class is for children.",
                  },
                  academicYear: {
                    type: "string",
                    description: "Send the current session ObjectID",
                    example: "62d5a5f6e0e9d9e9d9e9d9e9",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Class updated successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Class not found/Validation error",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export default classRoutes;
