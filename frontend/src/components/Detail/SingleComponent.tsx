import _ from "lodash";
import { Label } from "office-ui-fabric-react";
import React from "react";
import RenderItem from "./RenderItem";
export default ({ component, isDefault }: any) => {
  const props = _.get(component, "props", []);
  const hoc = _.get(component, "props", []);
  const effects = _.get(component, "props", []);
  const data = _.get(component, "props", []);
  const render = _.get(component, "render", {});
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%"
      }}
    >
      <div
        style={{
          flex: " 0 0 22px",
          backgroundColor: isDefault ? "#fafafa" : "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "none",
          borderRight: "1px solid #ccc"
        }}
      >
        <img
          alt="Export"
          draggable={false}
          src="imgs/export.svg"
          style={{ margin: "5px 0px 0px 3px", width: 20 }}
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            borderBottom: "1px solid #ccc",
            padding: "5px 0px 5px 5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Label style={detailAttrStyle}>{props.length} Props</Label>
            <Label style={detailAttrStyle}>{data.length} Data</Label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Label style={detailAttrStyle}>{effects.length} Effects</Label>
            <Label style={detailAttrStyle}>{hoc.length} HOC</Label>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%"
          }}
        >
          <div
            style={{
              margin: 0,
              flex: 1,
              overflowY: "auto",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "100%"
            }}
          >
            <RenderItem component={render} level={0} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const detailAttrStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: "bold",
  padding: "0px 7px 2px 7px",
  cursor: "pointer",
  userSelect: "none",
  marginRight: 5,
  color: "#666",
  borderRadius: 4,
  background: "#ececeb"
};
