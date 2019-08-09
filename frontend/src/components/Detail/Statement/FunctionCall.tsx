import { observer, useObservable } from "mobx-react-lite";
import {
  CommandBarButton,
  IconButton,
  ITextFieldStyles,
  TextField,
  Dropdown,
  IDropdownOption,
  Icon,
  IDropdownStyles
} from "office-ui-fabric-react";
import React from "react";
import FunctionCallComponent from "./TypeComponent/FunctionCallComponent";
import { optionsDeclaration } from "./Variable";
import { statementType } from "../Detail";

interface VariableComponentProps {
  name: string;
  value: any;
  type?: string;
  declaration?: string;
  useDeclaration?: boolean;
  hideValue?: boolean;
  editName?: boolean;
  depth: 0;
  isNameEditable?: boolean;
  set: (kind: string, value: any) => void;
  unset: () => void;
}

export default observer(
  ({
    name,
    value,
    type = "object",
    declaration = "const",
    useDeclaration = true,
    set,
    unset,
    depth = 0,
    hideValue = false,
    editName = false,
    isNameEditable = true
  }: VariableComponentProps) => {
    const meta = useObservable({
      editName,
      tempEditName: name
    });

    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          borderWidth: 0,
          borderColor: "#ccc",
          borderStyle: "solid"
        }}
      >
        {useDeclaration && (
          <div
            style={{
              position: "relative",
              flex: " 0 0 22px",
              backgroundColor:
                declaration === "const" ? "#fafafa" : "transparent",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRight: "1px solid #ccc"
            }}
          >
            <Dropdown
              onRenderOption={typeRenderOption as any}
              onRenderCaretDown={() => <div />}
              styles={typeDropdownStyles}
              defaultSelectedKey={declaration}
              options={
                ["statement", "function"].indexOf(type) >= -1
                  ? [
                      ...optionsDeclaration,
                      {
                        key: "return",
                        text: "return",
                        data: { icon: "ReturnKey" }
                      }
                    ]
                  : optionsDeclaration
              }
              onChange={(_e: any, val: any) => {
                set("declaration", val.key);
              }}
            />
          </div>
        )}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {meta.editName ? (
            <div
              style={{
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <TextField
                value={meta.tempEditName}
                onChange={(_e: any, val: any) => {
                  const pattern =
                    type === "functionCall"
                      ? /^[^a-zA-Z_$]|[^0-9a-zA-Z_$.]/gi
                      : /^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/gi;
                  const name = val.replace(pattern, "");
                  meta.tempEditName = name;
                }}
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13) {
                    e.target.blur();
                  }
                }}
                spellCheck={false}
                styles={nameFieldStyle}
                autoFocus
                onBlur={() => {
                  if (!!meta.tempEditName) {
                    set("name", meta.tempEditName);
                    meta.editName = false;
                  }
                }}
                borderless
                placeholder={type === "functionCall" ? "<Argument>" : "<Empty>"}
                iconProps={{ iconName: "EditStyle" }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                backgroundColor: "#fafafa"
              }}
            >
              {type !== "statement" && (
                <CommandBarButton
                  text={
                    !!name
                      ? name
                      : type === "functionCall"
                      ? "<Argument>"
                      : "<Empty>"
                  }
                  onClick={() => {
                    if (isNameEditable) {
                      meta.tempEditName = name;
                      meta.editName = true;
                    }
                  }}
                  styles={{
                    root: {
                      flex: 1,
                      height: 27,
                      background: "none"
                    },
                    label: {
                      padding: 5,
                      marginLeft: 0,
                      fontSize: 13,
                      textAlign: "left",
                      textOverflow: "elipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      fontStyle: type === "functionCall" ? "italic" : "normal"
                    }
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <IconButton
                  iconProps={{ iconName: "CircleAddition" }}
                  title="Add Item"
                  ariaLabel="Add Item"
                  style={{
                    height: 27,
                    borderRadius: 0,
                    borderRight: "1px solid #ccc"
                  }}
                  onClick={() => {
                    set("value", [
                      ...value,
                      {
                        type: "variable",
                        state: {
                          name: "NewVariable",
                          declaration: "const",
                          type: "string",
                          value: ""
                        }
                      }
                    ]);
                  }}
                />
                <IconButton
                  iconProps={{ iconName: "Delete" }}
                  title="Delete Variable"
                  ariaLabel="Delete Variable"
                  styles={{
                    root: {
                      height: 27
                    },
                    icon: {
                      color: "#d00000"
                    }
                  }}
                  onClick={() => {
                    unset();
                  }}
                />
              </div>
            </div>
          )}
          {(!hideValue || useDeclaration) && (
            <div
              style={{
                borderTop: "1px solid #ecebeb",
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center"
              }}
            >
              <div
                style={{
                  margin: 0,
                  flex: 1,
                  top: 0,
                  left: 0,
                  right: 0
                }}
              >
                <FunctionCallComponent
                  value={value}
                  depth={depth + 1}
                  setValue={(newval: any) => {
                    set("value", newval);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

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

const nameFieldStyle: Partial<ITextFieldStyles> = {
  root: {
    display: "flex",
    flex: 1
  },
  field: {
    display: "flex",
    flex: 1,
    fontSize: 13
  },
  wrapper: {
    display: "flex",
    flex: 1
  },
  fieldGroup: {
    display: "flex",
    flex: 1,
    height: 27
  }
};

const typeDropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: 50
  },
  root: {
    transform: "rotate(270deg)",
    width: 20,
    marginTop: 29
  },
  title: {
    backgroundColor: "#00000000",
    padding: 0,
    border: 0,
    fontSize: 13,
    height: 25,
    lineHeight: 23,
    textAlign: "right",
    paddingRight: 5
  },
  callout: {
    marginTop: -40,
    marginLeft: 25,
    minWidth: 100
  }
};

const typeRenderOption = (option: IDropdownOption): JSX.Element => {
  return (
    <div>
      {option.data && option.data.icon && (
        <Icon
          style={{ marginRight: "8px" }}
          iconName={option.data.icon}
          aria-hidden="true"
          title={option.data.icon}
        />
      )}
      <span style={{ fontSize: 13 }}>{option.text}</span>
    </div>
  );
};