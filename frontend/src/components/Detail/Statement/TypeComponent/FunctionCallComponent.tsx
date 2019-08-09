import { observer } from "mobx-react-lite";
import React from "react";
import ArrayComponent from "./ArrayComponent";

export default observer(({ value, setValue, depth }: any) => {
  return (
    <div>
      {value.length === 0 && (
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
      {value.length > 0 && (
        <ArrayComponent value={value} depth={depth} setValue={setValue} />
      )}
    </div>
  );
});
