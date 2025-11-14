import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { FUNCTIONS, engine } from "./awfex.js";
import { Sequelize, Model, DataTypes } from "sequelize";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

//  Sequelize Setup
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

class Workflows extends Model {}

Workflows.init(
  {
    name: DataTypes.STRING,
    workflow: DataTypes.STRING,
  },
  { sequelize, modelName: "workflows" }
);

await sequelize.sync({ force: false });

app.get("/functions", (req, res) => {
  try {
    res.json(Object.keys(FUNCTIONS));
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post("/workflow", async (req, res) => {
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

app.get("/workflow/:name", async (req, res) => {
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

app.delete("/workflow/:name", async (req, res) => {
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

app.get("/workflow", async (req, res) => {
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

app.get("/run/:name", async (req, res) => {
  try {
    const wf = await Workflows.findOne({ where: { name: req.params.name } });

    if (!wf) {
      return res.status(404).json({ success: false, error: "Workflow not found" });
    }

    const workflowJSON = JSON.parse(wf.workflow);
    const result = engine(workflowJSON, req.query);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/run", (req, res) => {
  try {
    const result = engine(req.body, req.query);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("awfex running on port 5000"));