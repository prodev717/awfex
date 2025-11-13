import { Sequelize, Model, DataTypes } from "sequelize";

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

(async () => {
  try {
    // ✅ Wait for the table to be created before inserting
    await sequelize.sync({ force: false });

    await Workflows.create({
      name: "sample",
      workflow: JSON.stringify({ mul: [{ add: [2, 3] }, 4] }),
    });

    const rows = await Workflows.findAll();
    console.log(rows.map((r) => r.toJSON()));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await sequelize.close();
  }
})();
