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

app.post("/get-module",(req: any, res: any) => {
  //const someModuleImport = sourceFile.getImportDeclaration("module-specifier-text");
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFiles();
  let foundModule: Array<string>=[]
  if (sf) {
    
    let i=0;
    while(i<sf.length){
      
      const test = sf[i].getBaseName();
      if (test.includes(req.body.search) && sf[i].getDefaultExportSymbol()) { 
        foundModule.push(test)
      }
      i++
    }
  }
  res.send(
    JSON.stringify({
      found: foundModule
    })
  );
})

app.post("/get-export-from-module",(req: any, res: any) => {
  const getpath = req.body.path
  console.log(getpath)
  const path = getpath.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  let foundExport: Array<string>=[]
  if (sf) {
    const exportss=sf.getExportSymbols()
    let i=0;
    console.log("export length : "+exportss.length)
    
    while(i<exportss.length){
      const test = exportss[i].getEscapedName()
      
      if (test.includes(req.body.search)) { 
        foundExport.push(test)
      }
      i++
    }
  }
  res.send(
    JSON.stringify({
      found: foundExport
    })
  );
})