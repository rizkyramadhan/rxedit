import { app, absPath } from "../index";
import { project } from "../index";
import { mVar, mDefault } from "../utils/utility";
import { mFunction } from "../utils/utility";
import { mExpression } from "../utils/utility";
import { mImport } from "../utils/utility";
import { importModel } from "../utils/utility";
import { statmentModel } from "../utils/utility";

app.post("/source", (req: any, res: any) => {
  const path = req.body.path.replace("./", absPath + "/");
  const sf = project.getSourceFile(path);
  if (sf) {
    const state = sf.getStatements();

    let statmen: Array<any> = [""];
    let statements: Array<statmentModel> = [];
    let imports: Array<importModel> = [];
    statmen.pop();

    let i: number = 0;
    while (i < state.length) {
      statmen.push(state[i].getText());
      console.log(state[i].getKindName() + " || " + state[i].getChildIndex());
      if (state[i].getKindName() == "VariableStatement") {
        statements.push(mVar(state, i));
      } else if (state[i].getKindName() == "FunctionDeclaration") {
        statements.push(mFunction(state, i));
      } else if (state[i].getKindName() == "ExpressionStatement") {
        statements.push(mExpression(state, i));
      } else if (state[i].getKindName() == "ImportDeclaration") {
        imports.push(mImport(state, i));
      }

      i++;
    }

    //////////////

    sf.saveSync();
    project.saveSync();
    res.send(
      JSON.stringify({
        import: imports,
        statements: statements,
        default: mDefault(sf)
      })
    );
  }
});
