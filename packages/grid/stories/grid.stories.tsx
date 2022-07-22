import { Story } from "@storybook/react";
import { useState } from "react";
import { Blotter, BlotterRecord, makeFakeBlotterRecord } from "./grid/blotter";
import {
  ColumnDefinition,
  ColumnGroupDefinition,
  createNumericColumn,
  createTextColumn,
  Grid,
} from "@jpmorganchase/uitk-grid";
import { LazyGrid } from "./grid/lazy-loading/LazyGrid";

export default {
  title: "Grid/Grid",
  component: Grid,
};

const blotter = new Blotter();
for (let i = 0; i < 100; ++i) {
  const record = makeFakeBlotterRecord();
  record.identifier = `${i}-${record.identifier}`;
  blotter.addRecord(record);
}

const columnGroups: ColumnGroupDefinition<BlotterRecord>[] = [
  {
    key: "group1",
    title: "Group One",
    columnKeys: ["identifier", "client"],
    pinned: "left",
  },
  {
    key: "group2",
    title: "Group Two",
    columnKeys: ["side", "deskOwner", "status"],
  },
  {
    key: "group3",
    title: "Group Three",
    columnKeys: ["flag"],
  },
  {
    key: "group4",
    title: "Group Four",
    columnKeys: ["quantity", "averagePx"],
    pinned: "right",
  },
];

const columnDefinitions: ColumnDefinition<BlotterRecord>[] = [
  createTextColumn("identifier", "Identifier", "identifier", 100),
  createTextColumn("client", "Client", "client", 100),
  createTextColumn("side", "Side", "side", 100),
  createTextColumn("deskOwner", "Desk Owner", "deskOwner", 100),
  createTextColumn("status", "Status", "status", 100),
  createTextColumn("flag", "Flag", "flag", 200),
  createNumericColumn("quantity", "Quantity", "quantity", 80),
  createNumericColumn("averagePx", "Average Px", "averagePx", 100),
];

const allEditableColumnDefinitions = columnDefinitions.map((colDef) => {
  return {
    ...colDef,
    isEditable: true,
  };
});

const mixedEditableColumnDefinitions = columnDefinitions.map((colDef) => {
  if (!columnGroups[1].columnKeys.includes(colDef.key)) {
    return colDef;
  }
  return {
    ...colDef,
    isEditable: true,
  };
});

interface BlotterStoryProps {
  columnGroupDefinitions: ColumnGroupDefinition<BlotterRecord>[];
}

const getKey = (record: BlotterRecord | undefined, index: number) =>
  record ? record.key : String(index);

const ReadonlyGridTemplate: Story = () => {
  const [data, setData] = useState<BlotterRecord[]>(
    () => blotter.visibleRecords
  );

  return (
    <Grid
      data={data}
      columnDefinitions={columnDefinitions}
      columnGroupDefinitions={columnGroups}
      getKey={getKey}
    />
  );
};

const AllEditableGridTemplate: Story = () => {
  const [data, setData] = useState<BlotterRecord[]>(
    () => blotter.visibleRecords
  );

  return (
    <Grid
      data={data}
      columnDefinitions={allEditableColumnDefinitions}
      columnGroupDefinitions={columnGroups}
      getKey={getKey}
    />
  );
};

const MixedEditableGridTemplate: Story = () => {
  const [data, setData] = useState<BlotterRecord[]>(
    () => blotter.visibleRecords
  );

  return (
    <Grid
      data={data}
      columnDefinitions={mixedEditableColumnDefinitions}
      columnGroupDefinitions={columnGroups}
      getKey={getKey}
    />
  );
};

const MultiRowSelectionGridTemplate: Story = () => {
  const [data, setData] = useState<BlotterRecord[]>(
    () => blotter.visibleRecords
  );
  return (
    <Grid
      data={data}
      columnDefinitions={columnDefinitions}
      rowSelectionMode={"multi"}
      showCheckboxes={true}
      getKey={getKey}
    />
  );
};

const LazyGridTemplate: Story = () => {
  return <LazyGrid />;
};

const SingleRowSelectionGridTemplate: Story = () => {
  const [data, setData] = useState<BlotterRecord[]>(
    () => blotter.visibleRecords
  );
  return (
    <Grid
      data={data}
      columnDefinitions={columnDefinitions}
      rowSelectionMode={"single"}
      showCheckboxes={true}
      getKey={getKey}
      backgroundVariant={"zebra"}
    />
  );
};

const SingleCellSelectionGridTemplate: Story = () => {
  const [data] = useState<BlotterRecord[]>(() => blotter.visibleRecords);
  return (
    <Grid
      data={data}
      columnDefinitions={columnDefinitions}
      rowSelectionMode={"none"}
      cellSelectionMode={"single"}
      showCheckboxes={true}
      getKey={getKey}
      backgroundVariant={"zebra"}
    />
  );
};

const MultiCellSelectionGridTemplate: Story = () => {
  const [data] = useState<BlotterRecord[]>(() => blotter.visibleRecords);
  return (
    <Grid
      data={data}
      columnDefinitions={columnDefinitions}
      rowSelectionMode={"none"}
      cellSelectionMode={"multi"}
      getKey={getKey}
      backgroundVariant={"zebra"}
    />
  );
};

export const ReadonlyGridExample = ReadonlyGridTemplate.bind({});

export const AllEditableGridExample = AllEditableGridTemplate.bind({});

export const MixedEditableGridExample = MixedEditableGridTemplate.bind({});

export const MultiRowSelectionGrid = MultiRowSelectionGridTemplate.bind({});

export const SingleRowSelectionGrid = SingleRowSelectionGridTemplate.bind({});

export const LazyGridExample = LazyGridTemplate.bind({});

export const SingleCellSelectionGrid = SingleCellSelectionGridTemplate.bind({});

export const MultiCellSelectionGrid = MultiCellSelectionGridTemplate.bind({});
