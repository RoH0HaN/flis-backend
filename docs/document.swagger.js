const documentRoutes = {
  paths: {
    "{base_url}/api/v1/document/create": {
      post: {
        summary: "Create a document",
        tags: ["Documents 📄"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  document: {
                    type: "string",
                    format: "binary",
                    description: "Document file",
                  },
                  student: {
                    type: "string",
                    description: "Student ID",
                  },
                  description: {
                    type: "string",
                    description: "Document description",
                  },
                  documentType: {
                    type: "string",
                    description: "Document type (e.g. ID Proof, Report Card)",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Document created successfully",
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
    "{base_url}/api/v1/document/delete/{id}": {
      delete: {
        summary: "Delete a document",
        tags: ["Documents 📄"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            description: "The ID of the document to delete",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Document deleted successfully",
          },
          400: {
            description: "Bad request/Validation error",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Document not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/document/get-student-documents/{student}": {
      get: {
        summary: "Get documents for a student",
        tags: ["Documents 📄"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "student",
            in: "path",
            description: "The ID of the student",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Documents retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        description: "The ID of the document",
                      },
                      student: {
                        type: "string",
                        description: "The ID of the student",
                      },
                      description: {
                        type: "string",
                        description: "The description of the document",
                      },
                      documentType: {
                        type: "string",
                        description:
                          "The type of the document (e.g. ID Proof, Report Card)",
                      },
                      uploadDate: {
                        type: "string",
                        description: "The upload date of the document",
                      },
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
          404: {
            description: "Documents not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export default documentRoutes;
