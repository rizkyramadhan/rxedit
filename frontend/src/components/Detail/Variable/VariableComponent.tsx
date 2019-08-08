import { observer, useObservable } from "mobx-react-lite";
import {
  CommandBarButton,
  Dropdown,
  DropdownMenuItemType,
  IButtonStyles,
  Icon,
  IconButton,
  IDropdownOption,
  IDropdownStyles,
  ITextFieldStyles,
  TextField
} from "office-ui-fabric-react";
import React from "react";
import ArrayComponent from "./TypeComponent/ArrayComponent";
import BooleanComponent from "./TypeComponent/BooleanComponent";
import FunctionComponent from "./TypeComponent/FunctionComponent";
import NumberComponent from "./TypeComponent/NumberComponent";
import ObjectComponent from "./TypeComponent/ObjectComponent";
import StringComponent from "./TypeComponent/StringComponent";
import NullComponent from "./TypeComponent/NullComponent";
import UndefinedComponent from "./TypeComponent/UndefinedComponent";

export const optionsDataType: IDropdownOption[] = [
  { key: "array", text: "Array" },
  { key: "object", text: "Object" },
  { key: "divider_1", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "function", text: "Function" },
  { key: "functionCall", text: "Function Call" },
  { key: "divider_2", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "jsx", text: "JSX" },
  { key: "string", text: "String" },
  { key: "number", text: "Number" },
  { key: "boolean", text: "Boolean" },
  { key: "divider_3", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "statement", text: "Statement" },
  { key: "divider_4", text: "-", itemType: DropdownMenuItemType.Divider },
  { key: "null", text: "Null" },
  { key: "undefined", text: "Undefined" }
];

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

export function newValueByType(type: string) {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return true;
    case "array":
      return [];
    case "object":
      return {};
  }
}

export function getType(value: any) {
  if (Array.isArray(value)) {
    return "array";
  }

  return typeof value;
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
              options={[
                { key: "const", text: "const", data: { icon: "Uneditable" } },
                { key: "let", text: "let", data: { icon: "Edit" } }
              ]}
              onChange={(_e: any, val: any) => {
                set("declaration", val);
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
                  const name = val.replace(/^[^a-zA-Z_$]|[^0-9a-zA-Z_$]/gi, "");
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
                placeholder="<Empty>"
                iconProps={{ iconName: "EditStyle" }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <CommandBarButton
                text={name}
                onClick={() => {
                  if (isNameEditable) {
                    meta.tempEditName = name;
                    meta.editName = true;
                  }
                }}
                styles={buttonNameStyles}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row"
                }}
              >
                <Dropdown
                  options={optionsDataType}
                  styles={dataTypeDropdownStyles}
                  defaultSelectedKey={type}
                  onChange={(_e: any, val: any) => {
                    set("type", val.key);
                  }}
                />
                {
                  ({
                    array: (
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
                          set("value", [...value, ""]);
                        }}
                      />
                    ),
                    object: (
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
                          set("value", { ...value, "": "" });
                          console.log(value);
                        }}
                      />
                    )
                  } as any)[type]
                }
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
          {!hideValue && (
            <div
              style={{
                borderTop: "1px solid #ccc",
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
                {
                  ({
                    function: <FunctionComponent />,
                    string: (
                      <StringComponent
                        value={value}
                        setValue={(newval: string) => {
                          set("value", newval);
                        }}
                      />
                    ),
                    number: (
                      <NumberComponent
                        value={value}
                        setValue={(newval: number) => {
                          set("value", newval);
                        }}
                      />
                    ),
                    boolean: (
                      <BooleanComponent
                        value={value}
                        setValue={(newval: boolean) => {
                          set("value", newval);
                        }}
                      />
                    ),
                    array: (
                      <ArrayComponent
                        value={value}
                        depth={depth + 1}
                        setValue={(newval: any) => {
                          set("value", newval);
                        }}
                      />
                    ),
                    object: (
                      <ObjectComponent
                        value={value}
                        depth={depth + 1}
                        setValue={(newval: any) => {
                          set("value", newval);
                        }}
                      />
                    ),
                    null: (
                      <NullComponent
                        value={value}
                        setValue={(newval: string) => {
                          set("value", newval);
                        }}
                      />
                    ),
                    undefined: (
                      <UndefinedComponent
                        value={value}
                        setValue={(newval: string) => {
                          set("value", newval);
                        }}
                      />
                    )
                  } as any)[type]
                }
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

const dataTypeDropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    minWidth: 60,
    maxWidth: 150,
    marginRight: 5
  },
  title: {
    lineHeight: 25,
    height: 27,
    fontSize: 13,
    border: 0,
    textAlign: "right"
  },
  caretDownWrapper: {
    lineHeight: 25
  },
  root: {
    height: 27,
    flexDirection: "column",
    justifyContent: "flex-end",
    borderRight: "1px solid #ccc",
    borderLeft: "1px solid #ccc"
  },
  callout: {
    minWidth: 150
  }
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

const buttonNameStyles: Partial<IButtonStyles> = {
  root: {
    flex: 1,
    height: 27
  },
  label: {
    padding: 5,
    marginLeft: 0,
    fontSize: 13,
    textAlign: "left",
    textOverflow: "elipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  }
};

const typeDropdownStyles: Partial<IDropdownStyles> = {
  dropdown: {
    width: 50
  },
  root: {
    transform: "rotate(270deg)",
    width: 20,
    marginTop: 30
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
    marginTop: -25,
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
