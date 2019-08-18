import { absPath, app, project } from "../index";
import { SyntaxKind } from "ts-morph";

app.post("/del-statement", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.removeStatement(req.body.index);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/insert-statement", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.insertStatements(req.body.index, req.body.statement);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/add-statement", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.addStatements(req.body.statement);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/add-statement-function", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.getFunction(req.body.function).addStatements(req.body.statement);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/insert-statement-function", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.getFunction(req.body.function).insertStatements(
      req.body.index,
      req.body.statement
    );
  }
  project.saveSync();
  res.send("ok");
});

app.post("/del-statement-function", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.getFunction(req.body.function).removeStatement(req.body.index);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/add-statement-default", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    const expt = sf.getFirstChildByKind(SyntaxKind.ExportAssignment);
    const arrow = expt.getFirstChildByKind(SyntaxKind.ArrowFunction);
    console.log("arrow : " + arrow.getKindName());
    arrow.addStatements(req.body.statement);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/insert-statement-default", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    const expt = sf.getFirstChildByKind(SyntaxKind.ExportAssignment);
    const arrow = expt.getFirstChildByKind(SyntaxKind.ArrowFunction);
    console.log("arrow : " + arrow.getKindName());
    arrow.insertStatements(req.body.index, req.body.statement);
  }
  project.saveSync();
  res.send("ok");
});

app.post("/del-statement-default", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    const expt = sf.getFirstChildByKind(SyntaxKind.ExportAssignment);
    const arrow = expt.getFirstChildByKind(SyntaxKind.ArrowFunction);
    console.log("arrow : " + arrow.getKindName());
    arrow.removeStatement(req.body.index);
  }
  project.saveSync();
  res.send("ok");
});
