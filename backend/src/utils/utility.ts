import {
  FunctionDeclaration,
  VariableStatement,
  SyntaxKind,
  ImportDeclaration
} from "ts-morph";
import { parseTag } from "./parser";

export class paramsModel {
  name: String;
  type: String;
}
export class statmentsModel {
  statement: String;
  index: any;
}

export class callParamsModel {
  value: any;
}

export class statmentModel {
  index: any;
  kind: any;
  name: any;
  value: any;
}

export class functionStatmentModel {
  args: any;
  statements: Array<statmentModel>;
  returnType: any;
}

export class importModel {
  index: any;
  default: any;
  named: Array<any>;
  from: any;
}

export function mFunction(state: Array<any>, i: number): any {
  let paramss: Array<paramsModel> = [];
  let j: number = 0;
  while (j < (state[i] as FunctionDeclaration).getParameters().length) {
    paramss.push({
      name: (state[i] as FunctionDeclaration)
        .getParameters()
        [j].getSymbol()
        .getEscapedName(),
      type: (state[i] as FunctionDeclaration)
        .getParameters()
        [j].getTypeNode()
        .getText()
    });
    j++;
  }

  let statmen: Array<statmentModel> = [];
  j = 0;
  while (j < (state[i] as FunctionDeclaration).getStatements().length) {
    console.log(
      "   " +
        (state[i] as FunctionDeclaration).getStatements()[j].getKindName() +
        " || " +
        j
    );
    if (
      (state[i] as FunctionDeclaration).getStatements()[j].getKindName() ==
      "VariableStatement"
    ) {
      statmen.push(mVar((state[i] as FunctionDeclaration).getStatements(), j));
    } else if (
      (state[i] as FunctionDeclaration).getStatements()[j].getKindName() ==
      "ExpressionStatement"
    ) {
      statmen.push(
        mExpression((state[i] as FunctionDeclaration).getStatements(), j)
      );
    } else if (
      (state[i] as FunctionDeclaration).getStatements()[j].getKindName() ==
      "FunctionDeclaration"
    ) {
      statmen.push(
        mFunction((state[i] as FunctionDeclaration).getStatements(), j)
      );
    } else if (
      (state[i] as FunctionDeclaration).getStatements()[j].getKindName() ==
      "ReturnStatement"
    ) {
      statmen.push(
        mReturn((state[i] as FunctionDeclaration).getStatements(), j)
      );
    }
    j++;
  }
  j = 0;
  paramss = [];
  while (j < (state[i] as FunctionDeclaration).getParameters().length) {
    paramss.push({
      name: (state[i] as FunctionDeclaration)
        .getParameters()
        [j].getSymbolOrThrow()
        .getEscapedName(),
      type: (state[i] as FunctionDeclaration)
        .getParameters()
        [j].getTypeNode()
        .getText()
    });
    j++;
  }
  let statementFunction: Array<functionStatmentModel> = [];
  statementFunction.push({
    args: paramss,
    statements: statmen,
    returnType: (state[i] as FunctionDeclaration).getReturnType().getText()
  });

  let statements: statmentModel = {
    index: (state[i] as FunctionDeclaration).getChildIndex(),
    kind: state[i].getKindName(),
    name: state[i].getSymbol().getEscapedName(),
    value: statementFunction
  };
  return statements;
}
export function mVar(state: any, i: number): any {
  let statements: statmentModel = {
    index: (state[i] as VariableStatement).getChildIndex(),
    kind: (state[i] as VariableStatement).getDeclarationList().getKindName(),
    name: (state[i] as VariableStatement)
      .getDeclarationList()
      .getDeclarations()[0]
      .getSymbol()
      .getEscapedName(),
    value: (state[i] as VariableStatement)
      .getDeclarationList()
      .getDeclarations()[0]
      .getStructure().initializer
  };
  return statements;
}
export function mExpression(state: any, i: number): any {
  let paramss: Array<callParamsModel> = [];
  let j = 0;
  for (const callExpression of state[i].getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    while (j < callExpression.getArguments().length) {
      paramss.push({ value: callExpression.getArguments()[j].getText() });
      j++;
    }
  }
  for (const identifier of state[i].getDescendantsOfKind(
    SyntaxKind.Identifier
  )) {
    let statements: statmentModel = {
      index: state[i].getChildIndex(),
      kind: state[i].getKindName(),
      name: identifier.getText(),
      value: paramss
    };
    return statements;
  }
}

export function mReturn(state: Array<any>, i: number): any {
  for (const identifier of state[i].getDescendantsOfKind(
    SyntaxKind.Identifier
  )) {
    let statements: statmentModel = {
      index: state[i].getChildIndex(),
      kind: state[i].getKindName(),
      name: "",
      value: identifier.getText()
    };
    return statements;
  }
}
export function mImport(state: Array<any>, i: number): any {
  let namedImport: Array<string> = [];
  let j = 0;
  while (j < (state[i] as ImportDeclaration).getNamedImports().length) {
    namedImport.push(
      (state[i] as ImportDeclaration).getNamedImports()[j].getName()
    );
    j++;
  }
  let defaults: string = null;
  try {
    defaults = (state[i] as ImportDeclaration)
      .getDefaultImportOrThrow()
      .getText();
  } catch {
    defaults = "";
  }

  let statements: importModel = {
    index: (state[i] as ImportDeclaration).getChildIndex(),
    default: defaults,
    named: namedImport,
    from: (state[i] as ImportDeclaration).getModuleSpecifierValue()
  };
  return statements;
}
export function mDefault(sf: any): any {
  const expt = sf.getFirstChildByKind(SyntaxKind.ExportAssignment);
  const arrow = expt.getFirstChildByKind(SyntaxKind.ArrowFunction);
  console.log("arrow : " + arrow.getKindName());
  arrow.addStatements("aaa");

  if (expt) {
    let array: any = expt
      .getFirstChildByKindOrThrow(SyntaxKind.ArrowFunction)
      .getFirstChildByKindOrThrow(SyntaxKind.Block)
      .getFirstChildByKindOrThrow(SyntaxKind.ReturnStatement);

    try {
      array = array.getFirstChildByKindOrThrow(
        SyntaxKind.ParenthesizedExpression
      );
    } catch (e) {}

    const expr = array.getExpression();
    return {
      index: expt.getChildIndex(),
      wrapper: [],
      props: [],
      data: [],
      effects: [],
      render: parseTag(expr)
    };
  }
  return null;
}
function mSelect(sf: any) {}
