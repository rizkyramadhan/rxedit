import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import { IconButton, IContextualMenuItem, Label } from "office-ui-fabric-react";
import React, { useEffect } from "react";
import SplitPane from "react-split-pane";
import { Api } from "../../api/Api";
import FunctionCall from "./Statement/FunctionCall";
import Variable, {
  detailAttrStyle,
  newValueByType
} from "./Statement/Variable";
import IfElse from "./Statement/IfElse";
import Looping from "./Statement/Looping";

export const statementType: IContextualMenuItem[] = [
  { key: "variable", text: "Variable" },
  { key: "ifelse", text: "If-Else" },
  { key: "looping", text: "Looping" },
  { key: "functionCall", text: "Function Call" }
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

const Message = ({ text }: any) => (
  <div style={{ textAlign: "center", padding: 100, color: "#ccc" }}>
    &mdash; {text} &mdash;
  </div>
);

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
            alignItems: "center",
            flexGrow: 1
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
            <Label
              style={detailAttrStyle}
              onClick={() => console.log(source.statements)}
            >
              {source.import.length} Imports
            </Label>
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
                  let name =
                    ["functionCall", "ifelse"].indexOf(val.key) > -1
                      ? ""
                      : `New${val.text}`;
                  let type = "string";
                  if (["ifelse", "functionCall"].indexOf(val.key))
                    type = "object";
                  let declaration = "const";
                  if (val.key === "ifelse") declaration = "if";
                  else if (val.key === "looping") declaration = "for";
                  let value: any = newValueByType(type);
                  if (type === "object")
                    value = {
                      "": {
                        type: "variable",
                        state: {
                          name: "NewVariable",
                          declaration: "const",
                          type: "string",
                          value: ""
                        }
                      }
                    };
                  source.statements.push({
                    type: val.key,
                    state: {
                      name: name,
                      declaration: declaration,
                      type: type,
                      value: value
                    }
                  });
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
        <SplitPane
          split="horizontal"
          minSize={91}
          primary="second"
          style={{ position: "relative", height: "100%" }}
          paneStyle={{
            overflowY: "auto"
          }}
        >
          <div>
            {source.statements.map((item: any, idx: number) => {
              return (
                <div
                  key={idx}
                  style={{
                    borderBottom: "1px solid #ecebeb"
                  }}
                >
                  {
                    ({
                      variable: (
                        <Variable
                          depth={0}
                          name={item.state.name}
                          declaration={item.state.declaration}
                          type={item.state.type}
                          value={item.state.value}
                          set={(kind: string, value: any) => {
                            source.statements[idx].state[kind] = value;
                            if (kind === "type") {
                              source.statements[
                                idx
                              ].state.value = newValueByType(value);
                            }
                          }}
                          unset={() => {
                            source.statements.splice(idx, 1);
                          }}
                        />
                      ),
                      functionCall: (
                        <FunctionCall
                          depth={0}
                          name={item.state.name}
                          declaration={item.state.declaration}
                          type={item.state.type}
                          value={item.state.value}
                          set={(kind: string, value: any) => {
                            source.statements[idx].state[kind] = value;
                            if (kind === "type") {
                              source.statements[
                                idx
                              ].state.value = newValueByType(value);
                            }
                          }}
                          unset={() => {
                            source.statements.splice(idx, 1);
                          }}
                        />
                      ),
                      ifelse: (
                        <IfElse
                          depth={0}
                          name={item.state.name}
                          declaration={item.state.declaration}
                          type={item.state.type}
                          value={item.state.value}
                          isFirstCondition={idx === 0}
                          set={(kind: string, value: any) => {
                            source.statements[idx].state[kind] = value;
                            if (kind === "type") {
                              source.statements[
                                idx
                              ].state.value = newValueByType(value);
                            }
                          }}
                          unset={() => {
                            source.statements.splice(idx, 1);
                          }}
                        />
                      ),
                      looping: (
                        <Looping
                          depth={0}
                          name={item.state.name}
                          declaration={item.state.declaration}
                          type={item.state.type}
                          value={item.state.value}
                          set={(kind: string, value: any) => {
                            source.statements[idx].state[kind] = value;
                            if (kind === "type") {
                              source.statements[
                                idx
                              ].state.value = newValueByType(value);
                            }
                          }}
                          unset={() => {
                            source.statements.splice(idx, 1);
                          }}
                        />
                      )
                    } as any)[item.type]
                  }
                </div>
              );
            })}
          </div>
          <div />
        </SplitPane>
      </div>
      <div />
    </SplitPane>
  );
});

const loadStructure = function(this: any, file: any) {
  const fetch = async () => {
    if (file) {
      let source = await Api.source(file.relativePath);
      this.default = source.default;
      this.import = source.import;
    }
  };
  fetch();
};
