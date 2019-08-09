import { toJS } from "mobx";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import VariableComponent, { newValueByType } from "../Variable";
import FunctionCall from "../FunctionCall";
import IfElse from "../IfElse";

export default observer(({ value, setValue, depth }: any) => {
  const meta = useObservable({
    value: value || {},
    expanded: [] as number[]
  });

  const setMetaValue = (newval: any) => {
    meta.value = newval;
  };
  useEffect(() => {
    setMetaValue(value);
  }, [value]);

  const valueKeys = Object.keys(meta.value);
  return (
    <div style={{ paddingBottom: 0 }}>
      {valueKeys.length === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "5px 0",
            fontSize: 12,
            color: "#333"
          }}
        >
          &mdash; Argument is empty &mdash;
        </div>
      )}
      {valueKeys.map((key: string, idx: number) => {
        const item = meta.value[key];
        const idxExpanded = meta.expanded.indexOf(idx) >= 0;
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              borderBottom:
                idx !== valueKeys.length - 1 ? "1px solid #ecebeb" : "0px"
            }}
          >
            <div
              onClick={() => {
                if (idxExpanded) {
                  meta.expanded.splice(meta.expanded.indexOf(idx), 1);
                } else {
                  meta.expanded.push(idx);
                }
              }}
              style={{
                cursor: "pointer",
                flex: "0 15px",
                borderRight: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                background: `rgba(0,0,0,${0.5 - (depth / 4) * 0.2})`,
                userSelect: "none",
                justifyContent: "center"
              }}
            >
              ⋮
            </div>

            {
              ({
                variable: (
                  <VariableComponent
                    name={item.state.name}
                    value={item.state.value}
                    type={item.state.type}
                    declaration={item.state.declaration}
                    hideValue={!idxExpanded}
                    depth={depth}
                    set={(kind: string, newval: any) => {
                      meta.value[key].state[kind] = newval;
                      if (kind === "type") {
                        meta.value[key].state.value = newValueByType(newval);
                      } else if (kind === "name") {
                        meta.value[newval] = item;
                        delete meta.value[key];
                      }
                      setValue(toJS(meta.value));
                    }}
                    unset={() => {
                      delete meta.value[key];
                      setValue(toJS(meta.value));
                    }}
                    useDeclaration={true}
                  />
                ),
                functionCall: (
                  <FunctionCall
                    name={item.state.name}
                    value={item.state.value}
                    type={item.state.type}
                    declaration={item.state.declaration}
                    hideValue={!idxExpanded}
                    depth={depth}
                    set={(kind: string, newval: any) => {
                      meta.value[key].state[kind] = newval;
                      if (kind === "type") {
                        meta.value[key].state.value = newValueByType(newval);
                      } else if (kind === "name") {
                        meta.value[newval] = item;
                        delete meta.value[key];
                      }
                      setValue(toJS(meta.value));
                    }}
                    unset={() => {
                      delete meta.value[key];
                      setValue(toJS(meta.value));
                    }}
                    useDeclaration={true}
                  />
                ),
                ifelse: (
                  <IfElse
                    name={item.state.name}
                    value={item.state.value}
                    type={item.state.type}
                    declaration={item.state.declaration}
                    hideValue={!idxExpanded}
                    isFirstCondition={idx === 0}
                    depth={depth}
                    set={(kind: string, newval: any) => {
                      meta.value[key].state[kind] = newval;
                      if (kind === "type") {
                        meta.value[key].state.value = newValueByType(newval);
                      } else if (kind === "name") {
                        meta.value[newval] = item;
                        delete meta.value[key];
                      }
                      setValue(toJS(meta.value));
                    }}
                    unset={() => {
                      delete meta.value[key];
                      setValue(toJS(meta.value));
                    }}
                    useDeclaration={true}
                  />
                )
              } as any)[item.type]
            }
          </div>
        );
      })}
    </div>
  );
});
