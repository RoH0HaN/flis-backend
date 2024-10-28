const admissionRoutes = {
  paths: {
    "{base_url}/api/v1/admission/": {
      post: {
        summary: "Submit admission form",
        tags: ["Admissions 👨‍🎓"],
        consumes: ["multipart/form-data"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  "student_details[student_image]": {
                    type: "string",
                    format: "binary",
                    description: "Student's image file",
                  },
                  "student_details[first_name]": {
                    type: "string",
                    description: "Student's first name",
                    example: "Rahul",
                  },
                  "student_details[last_name]": {
                    type: "string",
                    description: "Student's last name",
                    example: "Roy",
                  },
                  "student_details[date_of_birth]": {
                    type: "string",
                    format: "date",
                    description: "Student's date of birth",
                    example: "2019-06-12",
                  },
                  "student_details[class]": {
                    type: "string",
                    description: "Class the student is applying for",
                    example: "class1",
                  },
                  "student_details[gender]": {
                    type: "string",
                    description: "Student's gender",
                    example: "male",
                  },
                  "student_details[religion]": {
                    type: "string",
                    description: "Student's religion",
                    example: "Hindu",
                  },
                  "student_details[caste]": {
                    type: "string",
                    description: "Student's caste",
                    example: "General",
                  },
                  "student_details[hobbies]": {
                    type: "string",
                    description: "Student's hobbies",
                    example: "Reading, Sports",
                  },
                  "student_details[talent]": {
                    type: "string",
                    description: "Student's talent",
                    example: "Singing",
                  },
                  "parent_guardian_details[father_information][name]": {
                    type: "string",
                    description: "Father's name",
                    example: "Anil Roy",
                  },
                  "parent_guardian_details[father_information][occupation]": {
                    type: "string",
                    description: "Father's occupation",
                    example: "Engineer",
                  },
                  "parent_guardian_details[father_information][contact_no]": {
                    type: "string",
                    description: "Father's contact number",
                    example: "8145312848",
                  },
                  "parent_guardian_details[mother_information][name]": {
                    type: "string",
                    description: "Mother's name",
                    example: "Maya Roy",
                  },
                  "parent_guardian_details[mother_information][occupation]": {
                    type: "string",
                    description: "Mother's occupation",
                    example: "Teacher",
                  },
                  "parent_guardian_details[mother_information][contact_no]": {
                    type: "string",
                    description: "Mother's contact number",
                    example: "8145312849",
                  },
                  "parent_guardian_details[guardian_information][name]": {
                    type: "string",
                    description: "Guardian's name",
                    example: "Rajesh Gupta",
                  },
                  "parent_guardian_details[guardian_information][relationship]":
                    {
                      type: "string",
                      description: "Guardian's relationship to the student",
                      example: "Uncle",
                    },
                  "parent_guardian_details[guardian_information][contact_no]": {
                    type: "string",
                    description: "Guardian's contact number",
                    example: "8145312850",
                  },
                  "parent_guardian_details[guardian_information][whatsapp_no]":
                    {
                      type: "string",
                      description: "Guardian's WhatsApp number",
                      example: "8145312851",
                    },
                  "parent_guardian_details[guardian_information][email]": {
                    type: "string",
                    format: "email",
                    description: "Guardian's email address",
                    example: "rajesh.gupta@gmail.com",
                  },
                  "parent_guardian_details[guardian_information][qualification]":
                    {
                      type: "string",
                      description: "Guardian's qualification",
                      example: "MBA",
                    },
                  "parent_guardian_details[guardian_information][occupation]": {
                    type: "string",
                    description: "Guardian's occupation",
                    example: "Businessman",
                  },
                  "parent_guardian_details[guardian_information][annual_income]":
                    {
                      type: "number",
                      description: "Guardian's annual income",
                      example: 80000,
                    },
                  "communication_address[current_address][country]": {
                    type: "string",
                    description: "Current address country",
                    example: "IN",
                  },
                  "communication_address[current_address][state]": {
                    type: "string",
                    description: "Current address state",
                    example: "WB",
                  },
                  "communication_address[current_address][district]": {
                    type: "string",
                    description: "Current address district",
                    example: "Murshidabad",
                  },
                  "communication_address[current_address][village]": {
                    type: "string",
                    description: "Current address village",
                    example: "Goraipur",
                  },
                  "communication_address[current_address][post_office]": {
                    type: "string",
                    description: "Current address post office",
                    example: "Daulatabad",
                  },
                  "communication_address[current_address][police_station]": {
                    type: "string",
                    description: "Current address police station",
                    example: "Daulatabad",
                  },
                  "communication_address[current_address][postal_code]": {
                    type: "string",
                    description: "Current address postal code",
                    example: "742302",
                  },
                  "communication_address[permanent_address][country]": {
                    type: "string",
                    description: "Permanent address country",
                    example: "IN",
                  },
                  "communication_address[permanent_address][state]": {
                    type: "string",
                    description: "Permanent address state",
                    example: "WB",
                  },
                  "communication_address[permanent_address][district]": {
                    type: "string",
                    description: "Permanent address district",
                    example: "Murshidabad",
                  },
                  "communication_address[permanent_address][village]": {
                    type: "string",
                    description: "Permanent address village",
                    example: "Goraipur",
                  },
                  "communication_address[permanent_address][post_office]": {
                    type: "string",
                    description: "Permanent address post office",
                    example: "Daulatabad",
                  },
                  "communication_address[permanent_address][police_station]": {
                    type: "string",
                    description: "Permanent address police station",
                    example: "Daulatabad",
                  },
                  "communication_address[permanent_address][postal_code]": {
                    type: "string",
                    description: "Permanent address postal code",
                    example: "742302",
                  },
                  "other_details[previous_institute_details][institute_name]": {
                    type: "string",
                    description: "Previous institute name",
                    example: "Nimtala High School",
                  },
                  "other_details[previous_institute_details][board_affiliation]":
                    {
                      type: "string",
                      description: "Board affiliation of previous institute",
                      example: "WBBSE",
                    },
                  "other_details[previous_institute_details][previous_class]": {
                    type: "number",
                    description: "Previous class attended",
                    example: 3,
                  },
                  "other_details[previous_institute_details][tc_submitted]": {
                    type: "boolean",
                    description: "Whether transfer certificate submitted",
                    example: true,
                  },
                  "other_details[medical_details][blood_group]": {
                    type: "string",
                    description: "Student's blood group",
                    example: "B+",
                  },
                  "other_details[medical_details][allergies][status]": {
                    type: "boolean",
                    description: "Status of allergies",
                    example: true,
                  },
                  "other_details[medical_details][allergies][details]": {
                    type: "string",
                    description: "Details of allergies",
                    example: "Peanuts",
                  },
                  "other_details[medical_details][special_medical_conditions][status]":
                    {
                      type: "boolean",
                      description: "Status of special medical conditions",
                      example: false,
                    },
                  "other_details[medical_details][special_medical_conditions][details]":
                    {
                      type: "string",
                      description: "Details of special medical conditions",
                      example: "N/A",
                    },
                  "other_details[medical_details][regular_medication][status]":
                    {
                      type: "boolean",
                      description: "Status of regular medication",
                      example: false,
                    },
                  "other_details[medical_details][regular_medication][details]":
                    {
                      type: "string",
                      description: "Details of regular medication",
                      example: "N/A",
                    },
                  "other_details[medical_details][special_assistance][status]":
                    {
                      type: "boolean",
                      description: "Status of special assistance",
                      example: false,
                    },
                  "other_details[medical_details][special_assistance][details]":
                    {
                      type: "string",
                      description: "Details of special assistance",
                      example: "N/A",
                    },
                  "other_details[medical_details][height]": {
                    type: "string",
                    description: "Student's height",
                    example: "120 cm",
                  },
                  "other_details[medical_details][weight]": {
                    type: "string",
                    description: "Student's weight",
                    example: "25 kg",
                  },
                  "bank_details[account_holder_name]": {
                    type: "string",
                    description: "Bank account holder's name",
                    example: "Rahul Roy",
                  },
                  "bank_details[bank_name]": {
                    type: "string",
                    description: "Bank name",
                    example: "SBI",
                  },
                  "bank_details[account_no]": {
                    type: "string",
                    description: "Bank account number",
                    example: "785665217369",
                  },
                  "bank_details[ifsc_code]": {
                    type: "string",
                    description: "IFSC code of the bank",
                    example: "BARB0MANIND",
                  },
                  "transaction_details[MUID]": {
                    type: "string",
                    description: "Merchant Unique ID",
                    example: "MUIDW176352728",
                  },
                  "transaction_details[transactionId]": {
                    type: "string",
                    description: "Transaction ID",
                    example: "T176352728",
                  },
                  "transaction_details[amount]": {
                    type: "number",
                    description: "Transaction amount",
                    example: 500,
                  },
                  "transaction_details[name]": {
                    type: "string",
                    description: "Name associated with the transaction",
                    example: "Rohan Debnath",
                  },
                  "transaction_details[mobile]": {
                    type: "string",
                    description: "Contact number for the transaction",
                    example: "8145312848",
                  },
                },
                required: [
                  "student_details[student_image]",
                  "student_details[first_name]",
                  "student_details[last_name]",
                  "student_details[gender]",
                  "student_details[date_of_birth]",
                  "student_details[class]",
                  "student_details[admission_date]",
                  "student_details[admission_class]",
                  "student_details[caste]",
                  "student_details[hobbies]",
                  "student_details[religion]",
                  "student_details[talent]",
                  "parent_guardian_details[father_information][name]",
                  "parent_guardian_details[father_information][contact_no]",
                  "parent_guardian_details[father_information][occupation]",
                  "parent_guardian_details[mother_information][name]",
                  "parent_guardian_details[mother_information][contact_no]",
                  "parent_guardian_details[mother_information][occupation]",
                  "parent_guardian_details[guardian_information][name]",
                  "parent_guardian_details[guardian_information][contact_no]",
                  "parent_guardian_details[guardian_information][relationship]",
                  "parent_guardian_details[guardian_information][occupation]",
                  "parent_guardian_details[guardian_information][whatsapp_no]",
                  "parent_guardian_details[guardian_information][email]",
                  "parent_guardian_details[guardian_information][qualification]",
                  "parent_guardian_details[guardian_information][annual_income]",
                  "communication_address[current_address][country]",
                  "communication_address[current_address][state]",
                  "communication_address[current_address][district]",
                  "communication_address[current_address][village]",
                  "communication_address[current_address][city]",
                  "communication_address[current_address][postal_code]",
                  "communication_address[current_address][post_office]",
                  "communication_address[current_address][police_station]",

                  "communication_address[permanent_address][country]",
                  "communication_address[permanent_address][state]",
                  "communication_address[permanent_address][district]",
                  "communication_address[permanent_address][village]",
                  "communication_address[permanent_address][city]",
                  "communication_address[permanent_address][postal_code]",
                  "communication_address[permanent_address][post_office]",
                  "communication_address[permanent_address][police_station]",

                  "other_details[previous_institute_details][institute_name]",
                  "other_details[previous_institute_details][board_affiliation]",
                  "other_details[previous_institute_details][previous_class]",
                  "other_details[previous_institute_details][tc_submitted]",
                  "other_details[medical_details][blood_group]",
                  "other_details[medical_details][allergies][status]",
                  "other_details[medical_details][allergies][details]",
                  "other_details[medical_details][special_medical_conditions][status]",
                  "other_details[medical_details][special_medical_conditions][details]",
                  "other_details[medical_details][regular_medication][status]",
                  "other_details[medical_details][regular_medication][details]",
                  "other_details[medical_details][special_assistance][status]",
                  "other_details[medical_details][special_assistance][details]",
                  "other_details[medical_details][height]",
                  "other_details[medical_details][weight]",
                  "bank_details[account_holder_name]",
                  "bank_details[bank_name]",
                  "bank_details[account_no]",
                  "bank_details[ifsc_code]",
                  "transaction_details[MUID]",
                  "transaction_details[transactionId]",
                  "transaction_details[amount]",
                  "transaction_details[name]",
                  "transaction_details[mobile]",
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Admission form submitted successfully",
          },
          400: {
            description: "Invalid form data",
          },
          500: {
            description: "Internal server error",
          },
        },
        security: [
          {
            bearerAuth: [],
          },
        ],
      },
    },
    "/api/v1/admission/verify-payment": {
      post: {
        summary: "Verify payment",
        tags: ["Admissions 👨‍🎓"],
        consumes: ["application/json"],
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            description: "Transaction ID",
            schema: {
              type: "string",
              example: "1234567890",
            },
          },
          {
            name: "doc_id",
            in: "query",
            required: true,
            description: "Document ID",
            schema: {
              type: "string",
              example: "1234567890",
            },
          },
        ],
        responses: {
          200: {
            description: "Payment verification successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      description: "Indicates if the payment was successful",
                      example: true,
                    },
                    link: {
                      type: "string",
                      description: "Payment success link",
                      example: "http://localhost:1250/success",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Payment verification failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message for payment failure",
                      example: "Payment failed.",
                    },
                    link: {
                      type: "string",
                      description: "Payment failed link",
                      example: "http://localhost:1250/error",
                    },
                  },
                },
              },
            },
          },
          500: {
            description: "Internal server error",
          },
        },
      },
    },
  },
};

export default admissionRoutes;
