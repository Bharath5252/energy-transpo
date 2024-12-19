const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

