import { absPath, app, project } from "../index";

app.post("/add-import", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);

  if (sf) {
    sf.addImportDeclaration({
      defaultImport: req.body.default,
      moduleSpecifier: req.body.from,
      namedImports: req.body.named
    });

    project.saveSync();
    res.send("ok");
  }
});

app.post("/del-import", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  sf.getStatements();
  if (sf) {
    const imports = sf.getImportDeclaration(req.body.from);
    imports.remove();
    project.saveSync();
    res.send("ok");
  }
});

app.post("/edit-import", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);

  if (sf) {
    const imports = sf.getImportDeclaration(req.body.from);
    imports.remove();

    sf.addImportDeclaration({
      defaultImport: req.body.default,
      moduleSpecifier: req.body.from,
      namedImports: req.body.named
    });
    project.saveSync();
    res.send("ok");
  }
});
