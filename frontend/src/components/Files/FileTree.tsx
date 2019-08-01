import { observer } from "mobx-react-lite";
import React from "react";
import File from "./File";
import _ from "lodash";

export const sortFileTree = (data: any) => {
  return _.sortBy(
    data.map((i: any) => {
      if (i.children) {
        i.children = sortFileTree(i.children);
      }
      return i;
    }),
    "type"
  );
};

export default observer(
  ({
    draghovered,
    selected,
    level,
    dir,
    onSelect,
    onDragHover,
    style,
    onDrop,
    path,
    contextmenu,
    onContextMenu
  }: any) => {
    const renderFile = (file: any, i: number, parent: any) => {
      return (
        <File
          key={file.relativePath}
          index={i}
          selected={selected}
          draghovered={draghovered}
          onDragHover={onDragHover}
          onDrop={onDrop}
          onSelect={onSelect}
          level={level}
          parent={parent}
          file={file}
          contextmenu={contextmenu}
          onContextMenu={onContextMenu}
          path={path + file.name + (file.type === "dir" ? "/" : "")}
        />
      );
    };
    return (
      <div style={style}>
        {dir.map((file: any, i: number) => renderFile(file, i, dir))}
      </div>
    );
  }
);
