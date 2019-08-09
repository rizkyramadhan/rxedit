import { observer } from "mobx-react-lite";
import React from "react";

export default observer(({ value, setValue }: any) => {
  value === undefined && setValue(null);
  return (
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
      {value === null ? "— Null —" : value}
    </div>
  );
});
