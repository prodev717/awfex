import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { FUNCTIONS, DESCRIPTIONS, engine } from "./awfex.js";
import { Sequelize, Model, DataTypes } from "sequelize";
import auth from "./middleware/auth.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: "Too many requests from this IP, please try again after 15 minutes" },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
app.use(limiter);

//  Sequelize Setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false
});

class Workflows extends Model { }

Workflows.init(
  {
    name: DataTypes.STRING,
    workflow: DataTypes.STRING,
  },
  { sequelize, modelName: "workflows" }
);

await sequelize.sync({ force: false });

// sends functions names
app.get("/functions", (req, res) => {
  try {
    res.json(Object.keys(FUNCTIONS));
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// sends functions descriptions
app.get("/descriptions", (req, res) => {
  try {
    res.json(DESCRIPTIONS);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// creates a new workflow
app.post("/workflow", auth, async (req, res) => {
  try {
    const { name, workflow } = req.body;

    if (!name || !workflow) {
      return res.status(400).json({ success: false, error: "Name and workflow required" });
    }

    const existing = await Workflows.findOne({ where: { name } });

    if (existing) {
      existing.workflow = JSON.stringify(workflow);
      await existing.save();
    } else {
      await Workflows.create({
        name,
        workflow: JSON.stringify(workflow),
      });
    }

    res.json({ success: true, message: "Workflow saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// gets a workflow by name
app.get("/workflow/:name", auth, async (req, res) => {
  try {
    const wf = await Workflows.findOne({ where: { name: req.params.name } });

    if (!wf) {
      return res.status(404).json({ success: false, error: "Workflow not found" });
    }

    res.json({
      success: true,
      name: wf.name,
      workflow: JSON.parse(wf.workflow),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// deletes a workflow by name
app.delete("/workflow/:name", auth, async (req, res) => {
  try {
    const deleted = await Workflows.destroy({ where: { name: req.params.name } });
    if (deleted === 0) {
      return res.status(404).json({ success: false, error: "Workflow not found" });
    }
    res.json({ success: true, message: "Workflow deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// gets all workflows
app.get("/workflow", auth, async (req, res) => {
  try {
    const workflows = await Workflows.findAll({
      attributes: ["name"],
    });

    res.json({
      success: true,
      workflows: workflows.map((w) => w.name),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// runs a workflow by name
app.get("/run/:name", auth, async (req, res) => {
  try {
    const wf = await Workflows.findOne({ where: { name: req.params.name } });
    if (!wf) {
      return res.status(404).json({ success: false, error: "Workflow not found" });
    }
    const workflowJSON = JSON.parse(wf.workflow);
    const result = await engine(workflowJSON, req.query);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// runs a workflow
app.post("/run", auth, async (req, res) => {
  try {
    const result = await engine(req.body, req.query);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("awfex running on port 5000"));