import { ComponentType } from "react";
import { GroupHeaderCellProps } from "../components";

export interface ColumnGroupDefinition<T> {
  key: string;
  // columns: ColumnDefinition<T>[];
  columnKeys: string[];
  title: string;
  pinned?: "left" | "right";
  headerComponent?: ComponentType<GroupHeaderCellProps<T>>;
}
