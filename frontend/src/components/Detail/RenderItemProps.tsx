import "jsoneditor-react/es/editor.min.css";
import { Label } from "office-ui-fabric-react";
import React from "react";
import ObjectEditor from "./ObjectEditor";

export default ({ prop, index }: any) => {
  return (
    <div
      style={{
        padding: "0px 4px",
        display: "flex",
        alignItems: "stretch",
        borderTop: index > 0 ? "1px solid #ddd" : 0
      }}
    >
      <Label
        style={{
          padding: 0,
          margin: 0,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          flexBasis: 100,
          borderRight: "1px solid #ddd"
        }}
      >
        {prop.name}
      </Label>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {prop.detail ? (
          <ObjectEditor detail={prop.detail} type={prop.type} />
        ) : (
          <pre
            style={{
              fontSize: 11,
              flex: 1,
              margin: 0,
              paddingLeft: 10,
              display: "flex",
              alignItems: "center"
            }}
          >
            {prop.code.trim()}
          </pre>
        )}
      </div>
    </div>
  );
};
