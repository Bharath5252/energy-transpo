const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes")
const userRoutes = require("./routes/userRoutes")
const tradeRoutes = require("./routes/tradeRoutes");

const app = express();

const corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB locally");
    })
    .catch((err) => {
        console.error("MongoDB connection error", err);
    });

// Default Route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application!" });
});


// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/users", userRoutes)
app.use("/api/trades", tradeRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

