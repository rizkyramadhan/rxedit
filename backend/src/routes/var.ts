import { absPath, app, project } from "../index";
import { VariableDeclarationKind } from "ts-morph";

app.post("/add-var", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    sf.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const, // defaults to "let"
      declarations: [
        {
          name: req.body.name,
          initializer: req.body.init,
          type: req.body.type
        }
      ]
    });
  }
  project.saveSync();
  res.send("ok");
});

app.post("/del-var", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    // const varb = sf.getVariableStatement(req.body.name)
    const variableDeclaration = sf.getVariableDeclaration(req.body.name);
    variableDeclaration.remove();
  }
  project.saveSync();
  res.send("ok");
});

app.post("/edit-var", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    const variableDeclaration = sf.getVariableDeclaration(req.body.name);
    variableDeclaration.remove();

    sf.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const, // defaults to "let"
      declarations: [
        {
          name: req.body.newname,
          initializer: req.body.init,
          type: req.body.type
        }
      ]
    });
  }
  project.saveSync();
  res.send("ok");
});
