import { absPath, app, project } from "../index";

app.post("/add-function", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.addFunction({
      name: req.body.name,
      parameters: req.body.params,
      returnType: req.body.returnType,
      statements: req.body.statements
    });
  }
  project.saveSync();
  res.send("ok");
});

app.post("/del-function", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    const func = sf.getFunction(req.body.name);
    func.remove();
  }
  project.saveSync();
  res.send("ok");
});

app.post("/edit-function", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.getFunction(req.body.name).remove();

    sf.addFunction({
      name: req.body.newname,
      parameters: req.body.params,
      returnType: req.body.returnType,
      statements: req.body.statements
    });
  }
  project.saveSync();
  res.send("ok");
});


app.post("/call-function", (req: any, res: any) => {
    const path = req.body.path.replace("./", absPath + "/");
    const sf = project.getSourceFile(path);
    if (sf) {
      // const selectedFunction=sf.getFunction(req.body.name)
      // const i = 0;
  
      sf.addStatements(req.body.function + "(" + req.body.params + ");");
    }
    project.saveSync();
    res.send("ok");
  });