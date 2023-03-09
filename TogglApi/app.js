
const express = require("express");
const app = express();
const morgan = require("morgan");

const productRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');
const timeEntriesRoutes = require('./routes/timeEntries');
const workspacesRoutes = require('./routes/workspaces');
const workspaceUserRoutes = require('./routes/workspaceUsers');
const workspaceProjectRoutes = require("./routes/workspaceProjects");
const weeklyReportRoutes = require("./routes/weeklyReport");
const detailedReportRoutes = require("./routes/detailedReport");
const crmTaskRoutes = require("./routes/crmTasks");
const crmUserRoutes = require("./routes/crmStaffs");

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", ordersRoutes);
app.use("/time-entries", timeEntriesRoutes);
app.use("/workspaces", workspacesRoutes);
app.use("/workspace-users", workspaceUserRoutes);
app.use("/workspace-tasks", workspaceUserRoutes);
app.use("/workspace-projects", workspaceProjectRoutes);
app.use("/weekly-report", weeklyReportRoutes);
app.use("/detailed-report", detailedReportRoutes);
app.use("/crm-tasks", crmTaskRoutes);
app.use("/crm-staffs", crmUserRoutes);
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});
module.exports = app;