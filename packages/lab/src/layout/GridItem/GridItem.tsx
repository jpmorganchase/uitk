import { forwardRef, HTMLAttributes } from "react";
import cx from "classnames";

import { makePrefixer } from "@brandname/core";
import "./GridItem.css";
import { ResponsiveProp, useResponsiveProp } from "../internal/ResponsiveProps";

export const GRID_ALIGNMENT_BASE = [
  "start",
  "end",
  "center",
  "stretch",
] as const;

type GridAlignment = typeof GRID_ALIGNMENT_BASE[number];

type GridProperty = number | "auto";
export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The item will span across the provided number of grid columns
   */
  colSpan?: ResponsiveProp<GridProperty>;
  /**
   * The item will span across the provided number of grid rows
   */
  rowSpan?: ResponsiveProp<GridProperty>;
  /**
   * Aligns a grid item inside a cell along the inline (row) axis
   */
  horizontalAlignment?: GridAlignment;
  /**
   * Aligns a grid item inside a cell along the block (column) axis
   */
  verticalAlignment?: GridAlignment;
}

const withBaseName = makePrefixer("uitkGridItem");

const colStart = "auto";
const colEnd = "auto";
const rowStart = "auto";
const rowEnd = "auto";

export const GridItem = forwardRef<HTMLDivElement, GridItemProps>(
  function GridItem(
    {
      children,
      className,
      colSpan,
      rowSpan,
      horizontalAlignment = "stretch",
      verticalAlignment = "stretch",
      style,
      ...rest
    },
    ref
  ) {
    const gridItemColSpan = useResponsiveProp(colSpan, "auto");

    const gridItemRowSpan = useResponsiveProp(rowSpan, "auto");

    const gridColumnStart = gridItemColSpan
      ? `span ${gridItemColSpan}`
      : colStart;

    const gridColumnEnd = gridItemColSpan ? `span ${gridItemColSpan}` : colEnd;

    const gridRowStart = gridItemRowSpan ? `span ${gridItemRowSpan}` : rowStart;

    const gridRowEnd = gridItemRowSpan ? `span ${gridItemRowSpan}` : rowEnd;

    const gridArea = `${gridRowStart} / ${gridColumnStart} / ${gridRowEnd} / ${gridColumnEnd}`;

    const gridStyles = {
      ...style,
      "--grid-item-justify-self": horizontalAlignment,
      "--grid-item-align-self": verticalAlignment,
      "--grid-item-grid-area": gridArea,
    };

    return (
      <div
        className={cx(withBaseName(), className)}
        style={gridStyles}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
