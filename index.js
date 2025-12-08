import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { FUNCTIONS, DESCRIPTIONS, engine } from "./awfex.js";
import { Sequelize, Model, DataTypes } from "sequelize";
import auth from "./middleware/auth.js";
import pg from "pg";

const app = express();
app.use(bodyParser.json());
app.use(cors());

//  Sequelize Setup for Neon PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // for Neon SSL
    },
  },
  logging: false,
});

// Workflows Model
class Workflows extends Model { }

Workflows.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    workflow: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { sequelize, modelName: "workflows" }
);

await sequelize.sync({ alter: true });

// sends function names
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

// creates or updates workflow
app.post("/workflow", auth, async (req, res) => {
  try {
    const { name, workflow } = req.body;

    if (!name || !workflow) {
      return res.status(400).json({
        success: false,
        error: "Name and workflow required",
      });
    }

    const existing = await Workflows.findOne({ where: { name } });

    if (existing) {
      existing.workflow = workflow;
      await existing.save();
    } else {
      await Workflows.create({ name, workflow });
    }

    res.json({ success: true, message: "Workflow saved successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// get workflow by name
app.get("/workflow/:name", auth, async (req, res) => {
  try {
    const wf = await Workflows.findOne({ where: { name: req.params.name } });

    if (!wf) {
      return res
        .status(404)
        .json({ success: false, error: "Workflow not found" });
    }

    res.json({
      success: true,
      name: wf.name,
      workflow: wf.workflow,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// delete workflow
app.delete("/workflow/:name", auth, async (req, res) => {
  try {
    const deleted = await Workflows.destroy({
      where: { name: req.params.name },
    });

    if (deleted === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Workflow not found" });
    }

    res.json({ success: true, message: "Workflow deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// get all workflows
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

// run workflow by name
app.get("/run/:name", auth, async (req, res) => {
  try {
    const wf = await Workflows.findOne({ where: { name: req.params.name } });

    if (!wf) {
      return res
        .status(404)
        .json({ success: false, error: "Workflow not found" });
    }

    const result = await engine(wf.workflow, req.query);

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// run workflow directly
app.post("/run", auth, async (req, res) => {
  try {
    const result = await engine(req.body, req.query);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => console.log("awfex running on port 5000"));