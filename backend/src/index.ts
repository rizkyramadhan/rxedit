import cors from 'cors';
import express from 'express';
import fs from 'fs';
import jetpack from 'fs-jetpack';
import path from 'path';
import { Project, SourceFile, VariableDeclarationKind } from 'ts-morph';
import { getDefaultComponent, getImport } from './parser';

let rootPath = '../app/src/';
let absPath = path.resolve(rootPath);
const app = express();
const port = 4000;
let project = new Project({
  tsConfigFilePath: rootPath + '../tsconfig.json'
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.post('/loadproject', (req: any, res: any) => {
  // if (req.body.path) {
  //   rootPath = req.body.path;
  //   absPath = path.resolve(rootPath);
  // }
  res.send('ok');
});
app.post('/newproject', (req: any, res: any) => {});
app.post('/check', (req: any, res: any) => {});
app.get('/list', (req: any, res: any) => {
  const tree = jetpack.inspectTree(absPath, {
    relativePath: true
  });
  res.send(JSON.stringify(tree));
});
app.post('/source', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if (sf) {
    const state = sf.getStatements()
    console.log(state)
    res.send(
      JSON.stringify({
        import: getImport(sf),
        //default: getDefaultComponent(sf)
        statements: sf.getStatements()
      })
    );
  }
  
});
app.post('/new-file', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.createSourceFile(
    path,
    `
import React from "react";
import { View } from "react-xp";

export default () => {
  return (<View/>);
};
`
  );
  sf.saveSync();
  project.saveSync();
  res.send('ok');
});
app.post('/new-dir', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.createDirectory(path);
  if (sf) {
    sf.saveSync();
    project.saveSync();
    res.send('ok');
  }
});
app.post('/move', (req: any, res: any) => {
  const from = req.body.from.replace('./', absPath + '/');
  const to = req.body.to.replace('./', absPath + '/');
  if (fs.lstatSync(from).isDirectory()) {
    const sf = project.getDirectory(from);
    if (sf) {
      sf.moveImmediatelySync(to);
      project.saveSync();
      res.send('ok');
    }
  } else {
    const sf = project.getSourceFile(from);
    if (sf) {
      sf.moveImmediatelySync(to);
      project.saveSync();
      res.send('ok');
    }
  }
});
app.post('/del', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  if (fs.lstatSync(path).isDirectory()) {
    const sf = project.getDirectory(path);
    if (sf) {
      sf.forget();
      project.save();
      jetpack.remove(path);
      res.send('ok');
    }
  } else {
    const sf = project.getSourceFile(path);
    if (sf) {
      sf.delete();
      project.save();
      res.send('ok');
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});


app.post('/add-import', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
   
  if (sf) {
    sf.addImportDeclaration({
      defaultImport: req.body.default,
      moduleSpecifier: req.body.from,
      namedImports: req.body.named
    });

    project.saveSync();
    res.send('ok');
  }
});


app.post('/del-import', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  sf.getStatements()
  if (sf) {
    const imports = sf.getImportDeclaration(req.body.from);
    imports.remove();
    project.saveSync();
    res.send('ok');
  }
});


app.post('/edit-import', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
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
    res.send('ok');
  }
});

app.post('/add-var', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
      sf.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const, // defaults to "let"
    declarations: [{
        name: req.body.name,
        initializer: req.body.init,
        type:req.body.type
    }
  ]
  });
  }
  project.saveSync();
  res.send('ok');
});

app.post('/del-var', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    // const varb = sf.getVariableStatement(req.body.name)
    const variableDeclaration = sf.getVariableDeclaration(req.body.name);
    variableDeclaration.remove()
  }
  project.saveSync();
  res.send('ok');
});

app.post('/edit-var', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    
    const variableDeclaration = sf.getVariableDeclaration(req.body.name);
    variableDeclaration.remove()

      sf.addVariableStatement({
        declarationKind: VariableDeclarationKind.Const, // defaults to "let"
    declarations: [{
        name: req.body.name,
        initializer: req.body.init,
        type:req.body.type
    }
  ]
  });
  const varb = sf.getVariableDeclaration(req.body.name);
  // console.log(''+JSON.stringify({
  //       import: getImport(sf),
  //       default: getDefaultComponent(sf)
  //       //statements: sf.getStatements()
  //     })
  //   )
  }
  project.saveSync();
  res.send('ok');
});

app.post('/edit-var', (req: any, res: any) => {

})


app.post('/add-function', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
      sf.addFunction({
        name: req.body.name,
        parameters: req.body.params,
        returnType: req.body.returnType,
        statements:req.body.statements

    });
  }
  project.saveSync();
  res.send('ok');
});

app.post('/del-function', (req: any, res: any) => {
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
      const func = sf.getFunction(req.body.name)
      func.remove()
  }
  project.saveSync();
  res.send('ok');
});

app.post('/edit-function',( req:any, res: any) =>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    
      sf.getFunction(req.body.name).remove()

      sf.addFunction({
        name: req.body.name,
        parameters: req.body.params,
        returnType: req.body.return

    });
  }
  project.saveSync();
  res.send('ok');
});