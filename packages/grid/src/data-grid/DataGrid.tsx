import React, { ComponentType, useMemo, useState } from "react";
import { GridBase } from "../grid/components";
import { GridContext } from "../grid/GridContext";
import { DataGridContext } from "./DataGridContext";
import {
  ColDef,
  DataGridModelEvents,
  DataGridModel,
  GroupRowNode,
  RowKeyGetterFn,
  RowNode,
  SortFn,
  ColGroupDef,
} from "./DataGridModel";
import { SortInfo } from "./sort";
import {
  ColumnPinType,
  GridBackgroundVariant,
  RowSelectionMode,
} from "../grid";

export interface DataGridRowGroupCellComponentProps<
  TRowData,
  TGroupCellValue = any
> {
  rowNode: GroupRowNode<TRowData>;
}

export interface DataGridRowGroupLevelSettings<TRowData> {
  field: keyof TRowData;
  groupCellComponent?: ComponentType<
    DataGridRowGroupCellComponentProps<TRowData>
  >;
}

export interface DataGridLeafNodeProps<TRowData> {
  rowNode: RowNode<TRowData>;
}

export interface DataGridRowGroupSettings<TRowData> {
  groupLevels: DataGridRowGroupLevelSettings<TRowData>[];
  leafCellComponent?: ComponentType<DataGridLeafNodeProps<TRowData>>;
  showTreeLines?: boolean;
  title?: string;
  width?: number;
  pinned?: ColumnPinType;
}

// Filtering

export interface DataGridColumnFilterSettings<TCellValue = any> {
  columnKey: string;
  filterFn: (cellValue: TCellValue) => boolean;
}

export interface DataGridFilterSettings<TRowData> {
  columnFilters?: DataGridColumnFilterSettings[];
  filterFn: (rowData: TRowData) => boolean;
}

// Row styling
export type DataGridRowDividerVariant = "primary" | "secondary" | "none";

export interface DataGridRowSettings<T> {
  key: string;
  divider?: DataGridRowDividerVariant;
}

// Grid styling

export interface DataGridProps<TRowData = any, TColumnData = any> {
  className?: string;
  rowDividers?: DataGridRowDividerVariant;
  backgroundVariant?: GridBackgroundVariant;
  isFramed?: boolean;
  rowDividerField?: keyof TRowData; // Rows with different values in this field will be divided by high emphasis row divider

  rowKeyGetter: RowKeyGetterFn<TRowData>;
  data: TRowData[];
  columnDefinitions: ColDef<TRowData, TColumnData>[];
  columnGroupDefinitions: ColGroupDef<TRowData, TColumnData>[] | undefined;
  // TODO make this a component?
  leafNodeGroupNameField?: keyof TRowData; // Which field to show in the group/tree column for leaf nodes
  showTreeLines?: boolean;
  events?: DataGridModelEvents<TRowData>;

  sortFn?: SortFn<TRowData>;
  sortSettings?: SortInfo[];

  // Row Grouping
  rowGrouping?: DataGridRowGroupSettings<TRowData>;
  defaultRowGrouping?: DataGridRowGroupSettings<TRowData>;
  onRowGroupingChanged?: (
    rowGrouping: DataGridRowGroupSettings<TRowData>
  ) => void;

  // Filtering
  filterFn?: (rowData: TRowData) => boolean;

  // Selection
  rowSelectionMode?: RowSelectionMode;
  showCheckboxes?: boolean;
}

export const DataGrid = function <TRowData = any>(
  props: DataGridProps<TRowData>
) {
  const {
    className,
    rowKeyGetter,
    data,
    rowGrouping,
    showTreeLines,
    leafNodeGroupNameField,
    columnDefinitions,
    columnGroupDefinitions,
    events,
    filterFn,
    sortFn,
    sortSettings,
    backgroundVariant,
    isFramed,
    rowDividerField,
    rowSelectionMode,
    showCheckboxes,
  } = props;

  const [dataGridModel] = useState<DataGridModel<TRowData>>(
    () =>
      new DataGridModel({
        rowKeyGetter,
        data,
        columnDefinitions,
        events,
      })
  );

  const contextValue = useMemo(() => ({ dataGridModel }), []);

  const gridContextValue = useMemo(
    () => ({ model: dataGridModel.gridModel }),
    [dataGridModel.gridModel]
  );

  dataGridModel.setRowData(data);
  dataGridModel.setColumnDefs(columnDefinitions);
  dataGridModel.setColumnGroupDefs(columnGroupDefinitions);
  dataGridModel.setRowGrouping(rowGrouping);
  dataGridModel.setShowTreeLines(showTreeLines || false);
  dataGridModel.setLeafNodeGroupNameField(leafNodeGroupNameField);
  dataGridModel.setFilterFn(filterFn);
  dataGridModel.setSortFn(sortFn);
  dataGridModel.setSortSettings(sortSettings);
  dataGridModel.setBackgroundVariant(backgroundVariant);
  dataGridModel.setIsFramed(isFramed);
  dataGridModel.setRowDividerField(rowDividerField);
  dataGridModel.setRowSelectionMode(rowSelectionMode);
  dataGridModel.setShowCheckboxes(showCheckboxes);

  return (
    <DataGridContext.Provider value={contextValue}>
      <GridContext.Provider value={gridContextValue}>
        <GridBase className={className} />
      </GridContext.Provider>
    </DataGridContext.Provider>
  );
};
