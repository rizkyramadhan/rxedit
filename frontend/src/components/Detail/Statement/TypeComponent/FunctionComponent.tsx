import { toJS } from "mobx";
import { observer, useObservable } from "mobx-react-lite";
import React, { useEffect } from "react";
import VariableComponent, { newValueByType } from "../Variable";

export default observer(({ value, setValue, depth }: any) => {
  const meta = useObservable({
    value: value || [],
    expanded: [] as number[]
  });

  const setMetaValue = (newval: any) => {
    meta.value = newval;
  };
  useEffect(() => {
    setMetaValue(value);
  }, [value]);

  return (
    <div style={{ paddingBottom: 0 }}>
      {meta.value.length === 0 && (
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
      {meta.value.map((item: any, idx: number) => {
        const idxExpanded = meta.expanded.indexOf(idx) >= 0;
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "row",
              borderBottom:
                idx !== meta.value.length - 1 ? "1px solid #ccc" : "0px"
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
            <VariableComponent
              name={item.state.name}
              value={item.state.value}
              type={item.state.type}
              hideValue={!idxExpanded}
              depth={depth}
              set={(kind: string, newval: any) => {
                meta.value[idx].state[kind] = newval;
                if (kind === "type") {
                  meta.value[idx].state.value = newValueByType(newval);
                }
                setValue(toJS(meta.value));
              }}
              unset={() => {
                meta.value.splice(idx, 1);
                setValue(toJS(meta.value));
              }}
              useDeclaration={true}
            />
          </div>
        );
      })}
    </div>
  );
});