import swaggerJsDoc from "swagger-jsdoc";
import swaggerDefinition from "./swagger.definition.js"; // Import the aggregated documentation

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Optional: Use if you need additional route documentation from comments
};

export default swaggerJsDoc(swaggerOptions);
