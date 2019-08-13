import cors from 'cors';
import express from 'express';
import fs, { stat } from 'fs';
import jetpack from 'fs-jetpack';
import path from 'path';
import { Project, SourceFile, VariableDeclarationKind, ExportAssignment, FunctionDeclaration, VariableDeclaration, VariableStatement, VariableDeclarationList, SyntaxKind, ExpressionStatement } from 'ts-morph';
import { getDefaultComponent, getImport } from './parser';
import { variableDeclaration } from '@babel/types';

let rootPath = '../app/src/';
let absPath = path.resolve(rootPath);
const app = express();
const port = 4000;
let project = new Project({
  tsConfigFilePath: rootPath + '../tsconfig.json'
});

class variableModel {
  name : String
  type: String
  value: any
  export: any
  index: any
};

class functionModel {
  name : String
  return : String
  params: Array<paramsModel>
  statements: any
  export: any
  index: any
};

class paramsModel{
  name : String
  type: String
}
class statmentsModel{
  statement : String
  index: any
}

class callParamsModel{
  value : any
}

class callFunc{
  name : String
  params: Array<callParamsModel>
  index: any
}

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
    
    let statmen: Array<any>=[""]
    let vard: Array<variableModel>=[]
    let func: Array<functionModel>=[]
    let callFunc: Array<callFunc>=[]
    statmen.pop();
    console.log()
    let i: number = 0;
    while (i < state.length) {
      statmen.push(state[i].getText())
      console.log(state[i].getKindName()+" || "+state[i].getChildIndex())

      
      if(state[i].getKindName()=="VariableStatement"){
        vard.push({"name":(state[i] as VariableStatement).getDeclarationList().getDeclarations()[0].getSymbol().getEscapedName()
        ,"type":(state[i] as VariableStatement).getDeclarationList().getDeclarations()[0].getType().getText()
        ,"value":(state[i] as VariableStatement).getDeclarationList().getDeclarations()[0].getStructure().initializer,
        "export":(state[i] as VariableStatement).isExported()
        ,"index" : (state[i] as VariableStatement).getChildIndex()
      })
      } else if(state[i].getKindName()=="FunctionDeclaration"){
        let paramss: Array<paramsModel>=[]
        let j: number = 0;
        
        
        while(j<(state[i] as FunctionDeclaration).getParameters().length){
          console.log((state[i] as FunctionDeclaration).getParameters()[j].getSymbol().getEscapedName())
          console.log((state[i] as FunctionDeclaration).getParameters()[j].getTypeNode().getText())

          paramss.push({"name": (state[i] as FunctionDeclaration).getParameters()[j].getSymbol().getEscapedName(),
          "type":(state[i] as FunctionDeclaration).getParameters()[j].getTypeNode().getText()}
          )
          j++;
        }
        let statmen : Array<statmentsModel>=[]
        j=0
        while(j<(state[i] as FunctionDeclaration).getStatements().length){
          statmen.push({"statement" : (state[i] as FunctionDeclaration).getStatements()[j].getText()
        ,"index": (state[i] as FunctionDeclaration).getStatements()[j].getChildIndex()});
          j++
        }


        func.push({"name":state[i].getSymbol().getEscapedName(),
          "return":(state[i] as FunctionDeclaration).getReturnType().getText(),
          "params":paramss,
          "statements" : statmen,
          "export":(state[i] as FunctionDeclaration).isExported()
          ,"index" : (state[i] as FunctionDeclaration).getChildIndex()
        })
        //console.log((state[i] as FunctionDeclaration).getParameter())
      }else if (state[i].getKindName()=="ExpressionStatement"){
        //console.log((state[i] as ExpressionStatement).getExpression()
        let paramss: Array<callParamsModel>=[]
        let j=0;
        for (const callExpression of state[i].getDescendantsOfKind(SyntaxKind.CallExpression)) {
          while (j<callExpression.getArguments().length){
            paramss.push({"value": callExpression.getArguments()[j].getText()});
            j++
          }
          console.log(callExpression.getArguments()[0].getText())
          
        }

        for (const identifier of state[i].getDescendantsOfKind(SyntaxKind.Identifier)) {
          console.log(identifier.getText())
          callFunc.push({"name": identifier.getText(),
        "params":paramss
        ,"index" : (state[i]).getChildIndex()
        
      })
        }
      }
    
      i++;
    }
    
    
    sf.saveSync();
    project.saveSync();
    res.send(
      JSON.stringify({
        import: getImport(sf),
         variable:vard,
         function:func,
         calledFunction:callFunc,
        default: getDefaultComponent(sf)
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
        name: req.body.newname,
        initializer: req.body.init,
        type:req.body.type
    }
  ]
  });
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
        name: req.body.newname,
        parameters: req.body.params,
        returnType: req.body.returnType,
        statements: req.body.statements
    });
  }
  project.saveSync();
  res.send('ok');
});

app.post('/set-default-export',( req:any, res: any) =>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
      sf.getFunction(req.body.name).setIsDefaultExport(true);
  }
  project.saveSync();
  res.send('ok');
});

app.post('/set-var-export',(req:any, res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.getVariableDeclaration(req.body.name).getVariableStatement().setIsExported(req.body.export);
  }
  project.saveSync();
  res.send('ok');
})


app.post('/set-func-export',(req:any, res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.getFunction(req.body.name).setIsExported(true);
  }
  project.saveSync();
  res.send('ok');
})

app.post('/call-function',(req:any, res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    // const selectedFunction=sf.getFunction(req.body.name)
    // const i = 0;
    
  sf.addStatements(req.body.function+"("+req.body.params+");");
  }
  project.saveSync();
  res.send('ok');
})

app.post('/del-statement',(req:any, res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.removeStatement(req.body.index)
  }
  project.saveSync();
  res.send('ok');
})

app.post('/insert-statement',(req:any,res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.insertStatements(req.body.index, req.body.statement);
  }
  project.saveSync();
  res.send('ok');
})


app.post('/add-statement',(req:any,res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.addStatements(req.body.statement);
  }
  project.saveSync();
  res.send('ok');
})

app.post('/add-statement-function',(req:any,res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.getFunction(req.body.function).addStatements(req.body.statement);
  }
  project.saveSync();
  res.send('ok');
})

app.post('/insert-statement-function',(req:any,res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.getFunction(req.body.function).insertStatements(req.body.index, req.body.statement);
  }
  project.saveSync();
  res.send('ok');
})

app.post('/del-statement-function',(req:any, res:any)=>{
  const path = req.body.path.replace('./', absPath + '/');
  const sf = project.getSourceFile(path);
  if(sf){
    sf.getFunction(req.body.function).removeStatement(req.body.index)
  }
  project.saveSync();
  res.send('ok');
})



// app.post('/add-statement-default',(req:any,res:any)=>{
//   const path = req.body.path.replace('./', absPath + '/');
//   const sf = project.getSourceFile(path);
//   if(sf){
//     //(sf.getDefaultExportSymbol().getDeclarations() as FunctionDeclaration).addStatements("hlooo")
//     console.log(sf.getDefaultExportSymbol().getMembers())
    
//     console.log(sf.getExportDeclarations()[1])
//     console.log(sf.getExportDeclarations()[2])
//   }
//   project.saveSync();
//   res.send('ok');
// })

// app.post('/insert-statement-default',(req:any,res:any)=>{
//   const path = req.body.path.replace('./', absPath + '/');
//   const sf = project.getSourceFile(path);
//   if(sf){
//     getDefaultComponent(sf).insertStatements(req.body.index, req.body.statement);
//   }
//   project.saveSync();
//   res.send('ok');
// })

// app.post('/del-statement-default',(req:any, res:any)=>{
//   const path = req.body.path.replace('./', absPath + '/');
//   const sf = project.getSourceFile(path);
//   if(sf){
//     getDefaultComponent(sf).removeStatement(req.body.index)
//   }
//   project.saveSync();
//   res.send('ok');
// })