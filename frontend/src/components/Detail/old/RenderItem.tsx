import { observer } from "mobx-react-lite";
import { Icon, Label } from "office-ui-fabric-react";
import React, { CSSProperties } from "react";
import RenderItemProps from "./RenderItemProps";
import { detailAttrStyle } from "./SingleComponent";

const RenderItem = observer(({ component, level }: any) => {
  if (!component) {
    return <div />;
  }

  if (level === 0) {
    component.expanded = true;
  }

  return (
    <>
      <div
        style={{
          borderBottom: "1px solid #ccc",
          display: "flex",
          cursor: "pointer",
          alignItems: "center"
        }}
        onClick={() => {
          component.expanded = !component.expanded;
        }}
      >
        <div
          style={{
            backgroundColor: `rgba(0,0,0, ${0.1 * level})`,
            marginBottom: -1,
            alignSelf: "stretch",
            width: 3 + 5 * level
          }}
        />
        <div
          style={{
            padding: "5px 0px 5px 7px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            userSelect: "none"
          }}
        >
          {typeof component === "string" ? (
            <Label>{component}</Label>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                width: "100%"
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <Label
                  style={{ cursor: "pointer", padding: 0, display: "flex" }}
                >
                  {component.props && component.props.length > 0 && (
                    <div
                      style={{
                        marginRight: 5,
                        opacity: 0.8,
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      {component.expanded ? (
                        <Icon
                          iconName="ChevronDownSmall"
                          style={{ fontSize: 8 }}
                        />
                      ) : (
                        <Icon
                          iconName="ChevronRightSmall"
                          style={{
                            fontSize: 8
                          }}
                        />
                      )}
                    </div>
                  )}
                  {component.tag}
                </Label>
                <div
                  style={{
                    fontSize: 10,
                    color: "#333",
                    display: "flex",
                    flexDirection: "row",
                    userSelect: "none"
                  }}
                  onClick={(e: any) => {
                    e.stopPropagation();
                  }}
                >
                  {component.children && component.children.length > 0 && (
                    <div
                      style={{
                        ...detailAttrStyle,
                        color: "#999",
                        backgroundColor: "#fafafa",
                        border: "1px solid #ececeb",
                        paddingBottom: 0,
                        paddingRight: 0,
                        alignItems: "center",
                        display: "flex"
                      }}
                    >
                      <div>{component.children.length} Children</div>
                      <div
                        style={
                          {
                            marginLeft: 5,
                            padding: "4px 5px",
                            textAlign: "center",
                            border: "1px solid #ececeb",
                            alignItems: "center",
                            display: "flex"
                          } as CSSProperties
                        }
                      >
                        <Icon iconName="Add" />
                      </div>
                    </div>
                  )}
                  {component.props && component.props.length > 0 && (
                    <div
                      style={{
                        ...detailAttrStyle,
                        color: "#999",
                        backgroundColor: "#fafafa",
                        border: "1px solid #ececeb",
                        paddingBottom: 0,
                        paddingRight: 0,
                        alignItems: "center",
                        display: "flex"
                      }}
                    >
                      <div>{component.props.length} Props</div>
                      <div
                        style={{
                          borderLeft: "1px solid #ececeb",
                          marginLeft: 5,
                          padding: "4px 5px",
                          textAlign: "center",
                          alignItems: "center",
                          display: "flex"
                        }}
                      >
                        <Icon iconName="Add" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {component.expanded &&
                component.props &&
                component.props.length > 0 && (
                  <div
                    style={{
                      border: "1px solid #ddd",
                      margin: "5px 5px 0px -2px",
                      minHeight: 15,
                      borderRadius: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "row"
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  >
                    {component.props.map((p: any, i: number) => (
                      <RenderItemProps prop={p} key={i} index={i} />
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      {component.children &&
        component.expanded &&
        component.children.map((c: any, i: number) => (
          <RenderItem component={c} level={level + 1} key={i} />
        ))}
    </>
  );
});

export default RenderItem;
