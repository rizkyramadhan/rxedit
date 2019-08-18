import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import { IconButton, IContextualMenuItem, Label } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import SplitPane from "react-split-pane";
import { Api } from "../../api/Api";
import Import from "./Import";
import StatementsComponent from "./Statement/TypeComponent/StatementsComponent";
import { newValueByType } from "./Statement/Variable";

export default observer(({ data }: any) => {
  const source = useObservable({
    import: [] as any,
    statements: [] as any
  });
  const file: any = recurseFind(data.dir, data.selected);
  useEffect(loadStructure.bind(source, file), [file]);

  if (data.loading) {
    return <Message text="Loading components" />;
  }
  if (!data.selected) {
    return <Message text="Please select a component" />;
  }
  if (!file) {
    return <Message text="Component not found, Please refresh the tree " />;
  }
  const namesplit = file.name.split(".");
  namesplit.pop();
  const name = namesplit.join(".");
  return (
    <SplitPane minSize={400}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            padding: "0px 0px 0px 15px",
            borderBottom: "1px solid #ccc",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Label
            style={{
              justifyContent: "flex-start",
              display: "flex",
              flexGrow: 1
            }}
          >
            {" "}
            {name || "_"}{" "}
          </Label>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Import source={source} />
            <IconButton
              iconProps={{ iconName: "CircleAddition" }}
              title="Add Variable"
              ariaLabel="Add Variable"
              styles={{
                root: {
                  height: 27
                }
              }}
              menuProps={{
                items: statementType,
                onItemClick: (_e: any, val: any) => {
                  source.statements.push(addStatement(val));
                }
              }}
              menuIconProps={{
                style: {
                  display: "none"
                }
              }}
            />
          </div>
        </div>
        <div>
          <div
            style={{
              borderBottom: "1px solid #ecebeb"
            }}
          >
            <StatementsComponent
              value={source.statements}
              depth={0}
              setValue={(newval: any) => {
                source.statements = newval;
              }}
            />
          </div>
        </div>
      </div>
      <div />
    </SplitPane>
  );
});

const loadStructure = function (this: any, file: any) {
  const fetch = async () => {
    if (file) {
      let source = await Api.source(file.relativePath);
      this.default = source.default;
      this.import = source.import;
    }
  };
  fetch();
};


export const statementType: IContextualMenuItem[] = [
  { key: "variable", text: "variable" },
  { key: "ifelse", text: "if-else" },
  { key: "switch", text: "switch-case" },
  { key: "looping", text: "looping" },
  { key: "functionCall", text: "function call" }
];

const recurseFind = (array: any[], find: string) => {
  let found = undefined;
  _.each(array, i => {
    if (i.relativePath === find) {
      found = i;
    } else if (i.children) {
      let f = recurseFind(i.children, find);
      if (f) {
        found = f;
      }
    }
  });
  return found;
};

export const addStatement = (val: any) => {
  let name =
    ["functionCall", "ifelse", "looping", "switch"].indexOf(val.key) > -1
      ? ""
      : `New${val.text}`;
  let type = "string";
  if (["ifelse", "functionCall", "looping", "switch"].indexOf(val.key) > -1)
    type = "array";
  let declaration = "const";
  if (val.key === "ifelse") declaration = "if";
  else if (val.key === "looping") declaration = "for";
  else if (val.key === "switch") declaration = "switch";
  let value: any = newValueByType(type);
  return {
    type: val.key,
    state: {
      name: name,
      declaration: declaration,
      type: type,
      value: value
    }
  };
};

const Message = ({ text }: any) => (
  <div style={{ textAlign: "center", padding: 100, color: "#ccc" }}>
    &mdash; {text} &mdash;
  </div>
);
