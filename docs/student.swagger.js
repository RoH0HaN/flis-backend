const studentRoutes = {
  paths: {
    "{base_url}/api/v1/student/create": {
      post: {
        summary: "Create a student",
        tags: ["Students 👨🏻‍🎓"],
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
                  application_id: {
                    type: "string",
                    description: "The unique application ID for the student",
                    example: "607d1b2f2f4e5e6d4c4c5e6e",
                  },
                  student_details: {
                    type: "object",
                    properties: {
                      first_name: { type: "string", example: "John" },
                      last_name: { type: "string", example: "Doe" },
                      date_of_birth: {
                        type: "string",
                        format: "date",
                        example: "2010-05-15",
                      },
                      class: { type: "string", example: "4" },
                      gender: { type: "string", example: "Male" },
                      religion: { type: "string", example: "Christianity" },
                      caste: { type: "string", example: "N/A" },
                      hobbies: { type: "string", example: "Reading, Sports" },
                      talent: { type: "string", example: "Singing" },
                      student_photo: {
                        type: "string",
                        example: "http://example.com/photo.jpg",
                      },
                    },
                    required: [
                      "first_name",
                      "last_name",
                      "date_of_birth",
                      "class",
                      "gender",
                      "religion",
                      "caste",
                      "student_photo",
                    ],
                  },
                  parent_guardian_details: {
                    type: "object",
                    properties: {
                      father_information: {
                        type: "object",
                        properties: {
                          name: { type: "string", example: "Michael Doe" },
                          occupation: { type: "string", example: "Engineer" },
                          contact_no: {
                            type: "string",
                            example: "+1234567890",
                          },
                        },
                        required: ["name", "occupation", "contact_no"],
                      },
                      mother_information: {
                        type: "object",
                        properties: {
                          name: { type: "string", example: "Sarah Doe" },
                          occupation: { type: "string", example: "Teacher" },
                          contact_no: {
                            type: "string",
                            example: "+0987654321",
                          },
                        },
                        required: ["name", "occupation", "contact_no"],
                      },
                      guardian_information: {
                        type: "object",
                        properties: {
                          name: { type: "string", example: "Alice Doe" },
                          relationship: { type: "string", example: "Aunt" },
                          contact_no: {
                            type: "string",
                            example: "+1122334455",
                          },
                          whatsapp_no: {
                            type: "string",
                            example: "+1122334455",
                          },
                          email: {
                            type: "string",
                            example: "alice.doe@example.com",
                          },
                          qualification: { type: "string", example: "MBA" },
                          occupation: {
                            type: "string",
                            example: "Businesswoman",
                          },
                          annual_income: { type: "string", example: "60000" },
                        },
                        required: [
                          "name",
                          "relationship",
                          "contact_no",
                          "email",
                          "occupation",
                          "annual_income",
                        ],
                      },
                    },
                  },
                  communication_address: {
                    type: "object",
                    properties: {
                      current_address: {
                        type: "object",
                        properties: {
                          country: { type: "string", example: "USA" },
                          state: { type: "string", example: "California" },
                          district: { type: "string", example: "Los Angeles" },
                          village: { type: "string", example: "N/A" },
                          post_office: { type: "string", example: "N/A" },
                          police_station: { type: "string", example: "N/A" },
                          postal_code: { type: "string", example: "90001" },
                        },
                        required: [
                          "country",
                          "state",
                          "district",
                          "postal_code",
                        ],
                      },
                      permanent_address: {
                        type: "object",
                        properties: {
                          country: { type: "string", example: "USA" },
                          state: { type: "string", example: "California" },
                          district: { type: "string", example: "Los Angeles" },
                          village: { type: "string", example: "N/A" },
                          post_office: { type: "string", example: "N/A" },
                          police_station: { type: "string", example: "N/A" },
                          postal_code: { type: "string", example: "90001" },
                        },
                        required: [
                          "country",
                          "state",
                          "district",
                          "postal_code",
                        ],
                      },
                    },
                  },
                  other_details: {
                    type: "object",
                    properties: {
                      previous_institute_details: {
                        type: "object",
                        properties: {
                          institute_name: {
                            type: "string",
                            example: "ABC School",
                          },
                          board_affiliation: {
                            type: "string",
                            example: "State Board",
                          },
                          previous_class: { type: "string", example: "3" },
                          tc_submitted: { type: "boolean", example: true },
                        },
                      },
                      medical_details: {
                        type: "object",
                        properties: {
                          blood_group: { type: "string", example: "O+" },
                          allergies: {
                            type: "object",
                            properties: {
                              status: { type: "boolean", example: false },
                              details: { type: "string", example: "N/A" },
                            },
                          },
                          special_medical_conditions: {
                            type: "object",
                            properties: {
                              status: { type: "boolean", example: false },
                              details: { type: "string", example: "N/A" },
                            },
                          },
                          regular_medication: {
                            type: "object",
                            properties: {
                              status: { type: "boolean", example: false },
                              details: { type: "string", example: "N/A" },
                            },
                          },
                          special_assistance: {
                            type: "object",
                            properties: {
                              status: { type: "boolean", example: false },
                              details: { type: "string", example: "N/A" },
                            },
                          },
                          height: { type: "string", example: "150 cm" },
                          weight: { type: "string", example: "40 kg" },
                        },
                      },
                    },
                  },
                  bank_details: {
                    type: "object",
                    properties: {
                      account_holder_name: {
                        type: "string",
                        example: "John Doe",
                      },
                      bank_name: { type: "string", example: "ABC Bank" },
                      account_no: { type: "string", example: "123456789012" },
                      ifsc_code: { type: "string", example: "ABCD1234567" },
                    },
                  },
                  admission_date: {
                    type: "string",
                    format: "date",
                    example: "2024-10-01",
                  },
                  class_info: {
                    type: "object",
                    properties: {
                      session: { type: "string", example: "2024-25" },
                      grade: { type: "string", example: "4" },
                      section: { type: "string", example: "A" },
                    },
                    required: ["session", "grade"],
                  },
                  session: {
                    type: "object",
                    properties: {
                      year: { type: "string", example: "2024-25" },
                      isActive: { type: "boolean", example: true },
                    },
                  },
                },
                required: [
                  "application_id",
                  "student_details",
                  "parent_guardian_details",
                  "communication_address",
                  "other_details",
                  "class_info",
                  "session",
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Student created successfully",
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
    "{base_url}/api/v1/student/get-current-status/{application_id}": {
      get: {
        summary: "Get current status of a student",
        tags: ["Students 👨🏻‍🎓"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            name: "application_id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Get current status of a student",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    application_id: {
                      type: "string",
                      description: "The unique application ID for the student",
                      example: "607d1b2f2f4e5e6d4c4c5e6e",
                    },
                    student_details: {
                      type: "object",
                      properties: {
                        first_name: { type: "string", example: "John" },
                        last_name: { type: "string", example: "Doe" },
                        date_of_birth: {
                          type: "string",
                          format: "date",
                          example: "2010-05-15",
                        },
                        class: { type: "string", example: "4" },
                        gender: { type: "string", example: "Male" },
                        religion: { type: "string", example: "Christianity" },
                        caste: { type: "string", example: "N/A" },
                        hobbies: { type: "string", example: "Reading, Sports" },
                        talent: { type: "string", example: "Singing" },
                        student_photo: {
                          type: "string",
                          example: "http://example.com/photo.jpg",
                        },
                      },
                      required: [
                        "first_name",
                        "last_name",
                        "date_of_birth",
                        "class",
                        "gender",
                        "religion",
                        "caste",
                        "student_photo",
                      ],
                    },
                    parent_guardian_details: {
                      type: "object",
                      properties: {
                        father_information: {
                          type: "object",
                          properties: {
                            name: { type: "string", example: "Michael Doe" },
                            occupation: { type: "string", example: "Engineer" },
                            contact_no: {
                              type: "string",
                              example: "+1234567890",
                            },
                          },
                          required: ["name", "occupation", "contact_no"],
                        },
                        mother_information: {
                          type: "object",
                          properties: {
                            name: { type: "string", example: "Sarah Doe" },
                            occupation: { type: "string", example: "Teacher" },
                            contact_no: {
                              type: "string",
                              example: "+0987654321",
                            },
                          },
                          required: ["name", "occupation", "contact_no"],
                        },
                        guardian_information: {
                          type: "object",
                          properties: {
                            name: { type: "string", example: "Alice Doe" },
                            relationship: { type: "string", example: "Aunt" },
                            contact_no: {
                              type: "string",
                              example: "+1122334455",
                            },
                            whatsapp_no: {
                              type: "string",
                              example: "+1122334455",
                            },
                            email: {
                              type: "string",
                              example: "alice.doe@example.com",
                            },
                            qualification: { type: "string", example: "MBA" },
                            occupation: {
                              type: "string",
                              example: "Businesswoman",
                            },
                            annual_income: { type: "string", example: "60000" },
                          },
                          required: [
                            "name",
                            "relationship",
                            "contact_no",
                            "email",
                            "occupation",
                            "annual_income",
                          ],
                        },
                      },
                    },
                    communication_address: {
                      type: "object",
                      properties: {
                        current_address: {
                          type: "object",
                          properties: {
                            country: { type: "string", example: "USA" },
                            state: { type: "string", example: "California" },
                            district: {
                              type: "string",
                              example: "Los Angeles",
                            },
                            village: { type: "string", example: "N/A" },
                            post_office: { type: "string", example: "N/A" },
                            police_station: { type: "string", example: "N/A" },
                            postal_code: { type: "string", example: "90001" },
                          },
                          required: [
                            "country",
                            "state",
                            "district",
                            "postal_code",
                          ],
                        },
                        permanent_address: {
                          type: "object",
                          properties: {
                            country: { type: "string", example: "USA" },
                            state: { type: "string", example: "California" },
                            district: {
                              type: "string",
                              example: "Los Angeles",
                            },
                            village: { type: "string", example: "N/A" },
                            post_office: { type: "string", example: "N/A" },
                            police_station: { type: "string", example: "N/A" },
                            postal_code: { type: "string", example: "90001" },
                          },
                          required: [
                            "country",
                            "state",
                            "district",
                            "postal_code",
                          ],
                        },
                      },
                    },
                    other_details: {
                      type: "object",
                      properties: {
                        previous_institute_details: {
                          type: "object",
                          properties: {
                            institute_name: {
                              type: "string",
                              example: "ABC School",
                            },
                            board_affiliation: {
                              type: "string",
                              example: "State Board",
                            },
                            previous_class: { type: "string", example: "3" },
                            tc_submitted: { type: "boolean", example: true },
                          },
                        },
                        medical_details: {
                          type: "object",
                          properties: {
                            blood_group: { type: "string", example: "O+" },
                            allergies: {
                              type: "object",
                              properties: {
                                status: { type: "boolean", example: false },
                                details: { type: "string", example: "N/A" },
                              },
                            },
                            special_medical_conditions: {
                              type: "object",
                              properties: {
                                status: { type: "boolean", example: false },
                                details: { type: "string", example: "N/A" },
                              },
                            },
                            regular_medication: {
                              type: "object",
                              properties: {
                                status: { type: "boolean", example: false },
                                details: { type: "string", example: "N/A" },
                              },
                            },
                            special_assistance: {
                              type: "object",
                              properties: {
                                status: { type: "boolean", example: false },
                                details: { type: "string", example: "N/A" },
                              },
                            },
                            height: { type: "string", example: "150 cm" },
                            weight: { type: "string", example: "40 kg" },
                          },
                        },
                      },
                    },
                    bank_details: {
                      type: "object",
                      properties: {
                        account_holder_name: {
                          type: "string",
                          example: "John Doe",
                        },
                        bank_name: { type: "string", example: "ABC Bank" },
                        account_no: { type: "string", example: "123456789012" },
                        ifsc_code: { type: "string", example: "ABCD1234567" },
                      },
                    },
                    admission_date: {
                      type: "string",
                      format: "date",
                      example: "2024-10-01",
                    },
                    class_info: {
                      type: "object",
                      properties: {
                        session: { type: "string", example: "2024-25" },
                        grade: { type: "string", example: "4" },
                        section: { type: "string", example: "A" },
                      },
                      required: ["session", "grade"],
                    },
                    session: {
                      type: "object",
                      properties: {
                        year: { type: "string", example: "2024-25" },
                        isActive: { type: "boolean", example: true },
                      },
                    },
                    applicationId: {
                      type: "string",
                      example: "607d1b2f2f4e5e6d4c4c5e6e",
                    },
                    currentStatus: {
                      type: "string",
                      example:
                        "Eg ('N/A', 'EDITED', 'UPLOADED', 'SIGNED', 'FEES', 'COMPLETED')",
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
  },
};

export default studentRoutes;
