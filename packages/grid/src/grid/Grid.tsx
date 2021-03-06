import {
  CellSelectionMode,
  ColumnDefinition,
  ColumnGroupDefinition,
  GridBackgroundVariant,
  GridModel,
  RowSelectionMode,
} from "./model";
import { useEffect, useState } from "react";
import { GridContext } from "./GridContext";
import { GridBase } from "./components";

export interface GridCallbacks<T> {
  onVisibleRowRangeChanged?: (visibleRowRange: [number, number]) => void;
}

export type RowKeyGetter<T> = (row: T | undefined, index: number) => string;

export interface GridData<T> {
  getKey: RowKeyGetter<T>;
  columnDefinitions?: ColumnDefinition<T>[];
  columnGroupDefinitions?: ColumnGroupDefinition<T>[];
  showFooter?: boolean;
  showTree?: boolean;
  showCheckboxes?: boolean;
  rowSelectionMode?: RowSelectionMode;
  cellSelectionMode?: CellSelectionMode;
  backgroundVariant?: GridBackgroundVariant;
  rowDividers?: number[]; // Indices of rows that have dividers (bottom border)
  data: T[];
}

export type GridProps<T> = GridCallbacks<T> & GridData<T>;

export function Grid<T>(props: GridProps<T>) {
  const [context] = useState(() => ({
    model: new GridModel<T>(props.getKey),
  }));

  const { model } = context;
  const { rowSelectionMode = "single", cellSelectionMode = "none" } = props;

  useEffect(() => {
    model.setColumnDefinitions(props.columnDefinitions);
    model.setColumnGroupDefinitions(props.columnGroupDefinitions);
    model.setShowFooter(props.showFooter);
    model.setShowTree(props.showTree);
    model.setShowCheckboxes(props.showCheckboxes);
    model.setData(props.data);
    model.setRowSelectionMode(rowSelectionMode);
    model.setCellSelectionMode(cellSelectionMode);
    model.setOnVisibleRowRangeChange(props.onVisibleRowRangeChanged);
    model.setBackgroundVariant(props.backgroundVariant);
    model.setRowDividers(props.rowDividers);
  });

  return (
    <GridContext.Provider value={context}>
      <GridBase />
    </GridContext.Provider>
  );
}
