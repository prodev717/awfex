import express from "express";
import bodyParser from "body-parser";
import engine from "./awfex.js";

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'))

app.post("/run", (req, res) => {
  try {
    const result = engine(req.body);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("awfex running on port 5000"));
