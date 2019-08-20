import { absPath, app, project } from "../index";
import pathed from "path";
import {ts } from "ts-morph";

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
  console.log("path: "+path)
  console.log("absPath: "+absPath)
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
  

  let rootPath = "../node_modules";
  let modulePath = pathed.resolve(rootPath);
  const sfm = project.getSourceFile(absPath);
  if (sfm) {
    let i=0;
    while(i<sfm.getLocals().length){
      console.log(sfm.getLocals()[i].getEscapedName());
      // // const test = sfm[i].getBaseName();
      // // console.log(test)
      // // if (test.includes(req.body.search)) { 
      //   // foundModule.push(test)
      //   //console.log(test)
      // }
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
  console.log("path: "+path)
  console.log("absPath: "+absPath)
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

app.post("/get-usage-module",(req: any, res: any) => {
  const getpath = req.body.path
  console.log(getpath)
  const path = getpath.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  let foundUsage: Array<string>=[]
  if (sf) {
    const exportss=sf.getExportSymbols()
    let i=0;
    console.log("export length : "+exportss.length)
    
    while(i<exportss.length){
      const test = exportss[i].getEscapedName()
      console.log(test)
      const sfm = project.getSourceFiles();
      if(sfm){
        let j=0;
        while(j<sfm.length){
          const tested = sfm[j].getBaseName();
          // console.log(sfm[j].getImportDeclarations()[0].getModuleSpecifierValue())
          
          let k=0;
          while(k<sfm[j].getImportDeclarations().length){
            if (sfm[j].getImportDeclarations()[k].getModuleSpecifierValue()===req.body.module) { 
              console.log("-_-")
              foundUsage.push(tested)
            }
            k++
          }
          
          j++
        }
      }

      i++
    }
  }
  res.send(
    JSON.stringify({
      found: foundUsage
    })
  );
})