const express = require("express");
const Log = require("./middleware/logger");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {

    await Log(
        "backend",
        "info",
        "route",
        "Home route accessed"
    );

    res.json({
        message: "Server Running"
    });
});

const PORT = 3000;

app.listen(PORT, async () => {

    await Log(
        "backend",
        "info",
        "service",
        `Server running on port ${PORT}`
    );

    console.log(`Server running on ${PORT}`);
});