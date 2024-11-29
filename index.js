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

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(cors({
  origin: '*',  // Địa chỉ frontend của bạn
  methods: 'GET,POST,PUT,DELETE',   // Các phương thức HTTP được phép
  allowedHeaders: 'Content-Type ,Authorization, Origin, X-Requested-With, Accept',  // Các header được phép
}));


app.use(express.json());
app.use((req, res, next) => {
  // Kiểm tra xem tài nguyên có phải là cross-origin không
  if (req.get('Origin') && req.get('Origin') !== 'http://localhost:5173') {
    // Nếu là cross-origin, thêm header Cross-Origin-Resource-Policy: cross-origin
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  } else {
    // Nếu là same-origin, thêm header Cross-Origin-Resource-Policy: same-site
    res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  }
  
  next();
});
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
