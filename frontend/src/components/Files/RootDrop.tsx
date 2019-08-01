import React from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { FileTreeDragItem } from "./File";

export default ({ onDrop }: any) => {
  const [, drop] = useDrop({
    accept: "filetree",
    drop(item: FileTreeDragItem, monitor: DropTargetMonitor) {
      if (onDrop) {
        onDrop(item);
      }
    }
  });

  return <div ref={drop} style={{ flex: 1, minHeight: 100 }} />;
};
