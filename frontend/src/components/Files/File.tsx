import _ from "lodash";
import { observer, useObservable } from "mobx-react-lite";
import { Icon, TextField } from "office-ui-fabric-react";
import { Label } from "office-ui-fabric-react/lib/Label";
import React, { useEffect, useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { Api } from "../../api/Api";
import ContextMenu from "./ContextMenu";
import FileTree from "./FileTree";

export interface FileTreeDragItem {
  index: number;
  file: any;
  type: string;
  parent: any[];
  path: string;
}
export default observer(
  ({
    level,
    onSelect,
    file,
    index,
    selected,
    draghovered,
    onDragHover,
    onDrop,
    parent,
    path,
    contextmenu,
    onContextMenu
  }: any) => {
    const ref = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);

    const state = useObservable({
      edit: !!file.isNew
    });
    const namesplit = file.name.split(".");
    const ext = namesplit.pop();
    const name = file.type === "file" ? namesplit.join(".") : file.name;
    const editRef = useRef(null as any);
    useEffect(() => {
      if (!!editRef.current) {
        editRef.current.focus();
      }
    }, [state.edit]);

    const [, drop] = useDrop({
      accept: "filetree",
      drop(item: FileTreeDragItem, monitor: DropTargetMonitor) {
        const dragIndex = item.index;
        const dropIndex = index;

        // Don't replace items with themselves
        if (item.parent === parent && dragIndex === dropIndex) {
          return;
        }

        if (onDrop) {
          onDrop(item, file, dropIndex);
        }
      },
      hover(item: FileTreeDragItem, monitor: DropTargetMonitor) {
        if (!ref.current) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex = index;

        // Don't replace items with themselves
        if (item.parent === parent && dragIndex === hoverIndex) {
          return;
        }

        // Time to actually perform the action
        if (onDragHover) {
          item.path = path;
          onDragHover(item, file);
        }
      }
    });

    const [{ isDragging }, drag] = useDrag({
      item: { type: "filetree", file: file, index, parent, path },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging()
      }),
      canDrag: !state.edit && !(contextmenu === file.relativePath || state.edit)
    });

    const isSelected =
      draghovered === file.relativePath ||
      (file.type === "file" && selected === file.relativePath);
    const opacity = isDragging ? 0 : 1;

    drag(drop(ref));

    return (
      <>
        <div
          ref={ref}
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
            if (onContextMenu) {
              onContextMenu(file);
            }
          }}
          onClick={() => {
            onSelect(file);
            if (file.type === "dir") {
              file.expanded = !file.expanded;
            }
          }}
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #ececeb",
            backgroundColor: state.edit
              ? "yellow"
              : isSelected
              ? "#e6f4ff"
              : "#fff",
            padding: "0px 5px",
            paddingLeft: 10 * level,
            opacity
          }}
        >
          <div
            style={{
              marginRight: 5,
              marginTop: 2,
              marginBottom: -2,
              flexBasis: 30,
              textAlign: "center"
            }}
          >
            {file.type === "file" ? (
              <Icon
                iconName="FileHTML"
                style={{ color: "purple" }}
                title="Component"
              />
            ) : file.expanded ? (
              <Icon
                iconName="FolderOpen"
                style={{ color: "#222" }}
                title="Folder Expanded"
              />
            ) : (
              <Icon
                iconName="Folder"
                style={{ color: "#222" }}
                title="Folder"
              />
            )}
          </div>
          {state.edit ? (
            <TextField
              value={name}
              onKeyDown={(e: any) => {
                if (e.keyCode === 27) {
                  state.edit = false;
                  file.name = file.originalName;
                }

                if (e.keyCode === 13) {
                  applyRename(
                    name,
                    file,
                    state,
                    parent,
                    index,
                    onSelect,
                    selected
                  );
                }
              }}
              className="filetree-input"
              componentRef={editRef}
              onChange={(e: any) => {
                file.name =
                  e.target.value.replace(/\W/g, "") +
                  (file.type === "file" ? "." + ext : "");

                if (file.type === "file") {
                  file.name = _.upperFirst(file.name);
                }
              }}
            />
          ) : (
            <Label>{name}</Label>
          )}

          <div ref={labelRef} style={{ position: "absolute", right: 0 }} />
          {(contextmenu === file.relativePath || state.edit) && (
            <div
              onContextMenu={() => {
                onContextMenu({ relativePath: "" });

                if (state.edit) {
                  applyRename(
                    name,
                    file,
                    state,
                    parent,
                    index,
                    onSelect,
                    selected
                  );
                }
              }}
              onClick={() => {
                onContextMenu({ relativePath: "" });

                if (state.edit) {
                  applyRename(
                    name,
                    file,
                    state,
                    parent,
                    index,
                    onSelect,
                    selected
                  );
                }
              }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1
              }}
            />
          )}
          {contextmenu === file.relativePath && (
            <ContextMenu
              onContextMenu={onContextMenu}
              file={file}
              cref={labelRef}
              parent={parent}
              onDelete={() => {
                parent.splice(index, 1);
              }}
              onRename={() => {
                if (!file.originalName) file.originalName = file.name;
                state.edit = true;
              }}
            />
          )}
        </div>
        {file.children && file.expanded && (
          <FileTree
            level={level + 1}
            onSelect={onSelect}
            selected={selected}
            onDragHover={onDragHover}
            onDrop={onDrop}
            draghovered={draghovered}
            contextmenu={contextmenu}
            onContextMenu={onContextMenu}
            dir={file.children}
            path={path}
          />
        )}
      </>
    );
  }
);

const applyRename = (
  name: string,
  file: any,
  state: any,
  parent: any,
  index: number,
  onSelect: any,
  selected: string
) => {
  if (name === "") {
    if (!file.isNew) {
      state.edit = false;
      file.name = file.originalName;
    } else {
      parent.splice(index, 1);
    }
  } else {
    let found = _.filter(parent, i => i.name === file.name);
    if (found.length > 1) return;

    let dirPath = file.relativePath.split("/");
    dirPath.pop();
    dirPath = dirPath.join("/");
    file.relativePath = dirPath + "/" + file.name;
    if (file.isNew) {
      delete file.isNew;

      if (file.type === "file") {
        Api.newFile(file.relativePath);

        onSelect(file);
      } else {
        Api.newDir(file.relativePath);
      }
    } else {
      Api.move(dirPath + "/" + file.originalName, dirPath + "/" + file.name);
    }
    if (dirPath + "/" + file.originalName === selected) {
      onSelect(file);
    }
    file.originalName = file.name;
    state.edit = false;
  }
  file.originalName = "";
};
