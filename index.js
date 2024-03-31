const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3000;
const mongoURI = "mongodb+srv://aizaz060198:Ahmed6198%40@cluster0.iaiuzrt.mongodb.net/";
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log("Connected to MongoDB"));

// Define Schema
const userSchema = new mongoose.Schema({
    Category: String,
    Amount: Number,
    Info: String,
    Date: Date
});
const User = mongoose.model('User', userSchema);

// Routes
app.post("/add", async (req, res) => {
    try {
        const { category_select, amount_input, info, date_input } = req.body;

        // Validation
        if (!category_select || !amount_input || !info || !date_input) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Create new user
        const newUser = new User({
            Category: category_select,
            Amount: amount_input,
            Info: info,
            Date: new Date(date_input)
        });

        // Save user to database
        await newUser.save();

        console.log("Record Inserted Successfully");
        return res.return;
    } catch (error) {
        console.error("Error inserting record:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
});

// Start server
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
