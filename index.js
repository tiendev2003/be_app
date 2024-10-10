const express = require("express");
const sequelize = require("./config/database.js");
const userRoutes = require("./routes/userRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const faqRoutes = require("./routes/faqRoutes.js");
const planRoutes = require("./routes/planRoutes.js");
const pageRoutes = require("./routes/pageRoutes.js");
const interestRoutes = require("./routes/interestRoutes.js");
const languageRoutes = require("./routes/languageRoutes.js");
const relationRoutes = require("./routes/relationRoutes.js");
const religionRoutes = require("./routes/religionRoutes.js");
const settingRoutes = require("./routes/settingRoutes.js");
const actionRoutes = require("./routes/actionRoutes.js");
const planPurchaseRoutes = require("./routes/planPurchaseRoutes.js");
const walletRoutes = require("./routes/walletRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes.js");
const { default: helmet } = require("helmet");
const responseFormatter = require("./middlewares/responseFormatter.js");
require("dotenv").config();
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler.js");
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(cors()); // Use the cors middleware
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(responseFormatter); // Sử dụng middleware responseFormatter
// Sử dụng routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/plan", planRoutes);
app.use("/api/plan-purchase", planPurchaseRoutes);
app.use("/api/wallet", walletRoutes);
// app.use('/api/report', reportRoutes);
app.use("/api/page", pageRoutes);
app.use('/api/notification', notificationRoutes);
app.use("/api/action", actionRoutes);
app.use("/api/interest", interestRoutes);
app.use("/api/language", languageRoutes);
app.use("/api/relation", relationRoutes);
app.use("/api/religion", religionRoutes);
app.use("/api/setting", settingRoutes);
app.use("/api/payment", paymentRoutes);
 

 
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middleware xử lý lỗi
app.use(errorHandler);

// Kết nối database và khởi động server
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
