import classRoutes from "../docs/class.swagger.js";
import userRoutes from "../docs/user.swagger.js";
import admissionRoutes from "../docs/admission.swagger.js";
import sessionRoutes from "../docs/session.swagger.js";
import feesRoutes from "../docs/fees.swagger.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Future Leader International School API Documentation",
    version: "1.0.0",
    description: `
**Future Leader International School Backend**

A powerful and comprehensive backend system developed for Future Leader International School, designed to streamline academic, administrative, and communication processes across the organization.

### Developed by:
- Rohan Debnath - Backend Developer
- Akash Pal - Backend Developer

**Organization:** Apparium

This API provides secure, efficient, and well-documented endpoints to facilitate student admissions, class management, fee processing, and more.
    `,
    contact: {
      name: "Apparium",
      url: "https://apparium.com", // Replace with the actual organization link if available
      email: "support@apparium.com", // Replace with the actual support email if available
    },
    license: {
      name: "MIT License",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:1250",
      description: "Local development server",
    },
  ],
  paths: {
    ...userRoutes.paths,
    ...admissionRoutes.paths,
    ...classRoutes.paths,
    ...sessionRoutes.paths,
    ...feesRoutes.paths,
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT", // optional, indicates the format of the token
      },
    },
  },
  tags: [
    {
      name: "Users 👨🏻‍💼",
      description: "All the API's regarding 'users'",
    },
    {
      name: "Admissions 👨‍🎓",
      description: "All the API's regarding 'admission'",
    },
    {
      name: "Classes 👩🏻‍🏫",
      description: "All the API's regarding 'class'",
    },
    {
      name: "Sessions ⌚",
      description: "All the API's regarding 'session'",
    },
    {
      name: "Fees 💵",
      description: "All the API's regarding 'fees'",
    },
  ],
};

export default swaggerDefinition;
