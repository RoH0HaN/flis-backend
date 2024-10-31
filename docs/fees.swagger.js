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
    "{base_url}/api/v1/fees/group/create": {
      post: {
        summary: "Create a fees group",
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
                  name: {
                    type: "string",
                    description: "Fees group name",
                  },
                  groupCode: {
                    type: "string",
                    description: "Fees group code",
                  },
                  description: {
                    type: "string",
                    description: "Fees group description",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Fees group created successfully",
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
    "{base_url}/api/v1/fees/group/get-all": {
      get: {
        summary: "Get all fees groups",
        tags: ["Fees 💵"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Fees groups retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                        description: "Object ID of the fees group",
                      },
                      name: {
                        type: "string",
                        description: "Fees group name",
                      },
                      groupCode: {
                        type: "string",
                        description: "Fees group code",
                      },
                      description: {
                        type: "string",
                        description: "Fees group description",
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
    "{base_url}/api/v1/fees/group/get/{id}": {
      get: {
        summary: "Get a fees group by ID",
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
            description: "Fees group Object ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Fees group retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description: "Object ID of the fees group",
                    },
                    name: {
                      type: "string",
                      description: "Fees group name",
                    },
                    groupCode: {
                      type: "string",
                      description: "Fees group code",
                    },
                    description: {
                      type: "string",
                      description: "Fees group description",
                    },
                  },
                },
              },
            },
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees group not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/group/update": {
      put: {
        summary: "Update a fees group",
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
                    description: "Fees group object ID",
                  },
                  name: {
                    type: "string",
                    description: "Fees group name",
                  },
                  groupCode: {
                    type: "string",
                    description: "Fees group code",
                  },
                  description: {
                    type: "string",
                    description: "Fees group description",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Fees group updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees group not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/group/delete/{id}": {
      delete: {
        summary: "Delete a fees group by ID",
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
            description: "Fees group Object ID",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Fees group deleted successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees group not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/master/create": {
      post: {
        summary: "Create a fees master",
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
                  group: {
                    type: "string",
                    description: "Fees group object ID",
                  },
                  headers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        header: {
                          type: "string",
                          description: "Fees header object ID",
                        },
                        amount: {
                          type: "number",
                          description: "Fees header amount",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Fees master created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description: "Object ID of the fees master",
                    },
                    group: {
                      type: "string",
                      description: "Fees group object ID",
                    },
                    headers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          header: {
                            type: "string",
                            description: "Fees header object ID",
                          },
                          amount: {
                            type: "number",
                            description: "Fees header amount",
                          },
                        },
                      },
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
    "{base_url}/api/v1/fees/master/set-amount": {
      put: {
        summary: "Set fees master amount",
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
                  master_id: {
                    type: "string",
                    description: "Fees master object ID",
                  },
                  obj_id: {
                    type: "string",
                    description:
                      "Object ID of the header object inside the fees master",
                  },
                  amount: {
                    type: "number",
                    description: "Fees header amount",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Fees master updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees master not found",
            description: "Header object not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/master/delete-header": {
      put: {
        summary: "Delete header from fees master",
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
                  master_id: {
                    type: "string",
                    description: "Fees master object ID",
                  },
                  obj_id: {
                    type: "string",
                    description:
                      "Object ID of the header object inside the fees master",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Fees master updated successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees master not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/master/add-header": {
      put: {
        summary: "Add header to fees master",
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
                  master_id: {
                    type: "string",
                    description: "Fees master object ID",
                  },
                  headers: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        header: {
                          type: "string",
                          description: "Fees header object ID",
                        },
                        amount: {
                          type: "number",
                          description: "Fees header amount",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Fees master updated successfully",
          },
          400: {
            description: "Bad request",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees master not found",
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
    "{base_url}/api/v1/fees/master/get-all": {
      get: {
        summary: "Get all fees masters",
        tags: ["Fees 💵"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            description: "Fees master fetched successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      description: "Object ID of the fees master",
                    },
                    group: {
                      type: "string",
                      description: "Fees group object ID",
                    },
                    headers: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          header: {
                            type: "string",
                            description: "Fees header object ID",
                          },
                          amount: {
                            type: "number",
                            description: "Fees header amount",
                          },
                        },
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
    "{base_url}/api/v1/fees/master/{id}": {
      delete: {
        summary: "Delete fees master by ID",
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
            description: "Object ID of the fees master",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Fees master deleted successfully",
          },
          401: {
            description: "Unauthorized request",
          },
          404: {
            description: "Fees master not found",
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
