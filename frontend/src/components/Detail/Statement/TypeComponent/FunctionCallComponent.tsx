import { observer } from "mobx-react-lite";
import React from "react";
import ObjectComponent from "./ObjectComponent";

export default observer(({ value, setValue, depth }: any) => {
  const valueKeys = Object.keys(value);

  return (
    <div>
      {valueKeys.length === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            fontSize: 12,
            color: "#333"
          }}
        >
          &mdash; Parameter is empty &mdash;
        </div>
      )}
      {valueKeys.length > 0 && (
        <ObjectComponent value={value} depth={depth} setValue={setValue} />
      )}
    </div>
  );
});
