const express = require("express");
const app = express();
const env = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path")
const cors = require("cors")

const authRouters = require("./routes/auth");
const adminRouters = require("./routes/admin/auth");
const categoryRouters = require("./routes/category");
const productRouters = require("./routes/product");
const cartRouters = require("./routes/cart");
const initialDataRouters = require("./routes/admin/initialData")
const pageRouters = require("./routes/admin/page")
env.config();

app.use(cors());
app.use(express.json());
// Connector to MongoDB
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// Body parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")))

app.use("/api", authRouters)
app.use("/api", adminRouters)
app.use("/api", categoryRouters)
app.use("/api", productRouters)
app.use("/api", cartRouters)
app.use("/api", initialDataRouters)
app.use("/api", pageRouters)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
