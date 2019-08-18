import { absPath, app, project } from "../index";

app.post("/set-var-export", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.getVariableDeclaration(req.body.name)
      .getVariableStatement()
      .setIsExported(req.body.export);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/set-func-export", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.getFunction(req.body.name).setIsExported(true);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/set-default-export", (req: any, res: any) => {
    const path = req.body.path.replace("./", absPath + "/");
    const sf = project.getSourceFile(path);
    if (sf) {
      sf.getFunction(req.body.name).setIsDefaultExport(true);
    }
    project.saveSync();
    res.send("ok");
  });
  
  