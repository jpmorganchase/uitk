import classnames from "classnames";
import { ForwardedRef, forwardRef, ReactElement, useState } from "react";
import { makePrefixer } from "@jpmorganchase/uitk-core";
import { ChevronDownIcon } from "@jpmorganchase/uitk-icons";
import { ListBase, ListStateContext } from "../list";
import { useFloatingUI } from "../popper";
import { useForkRef } from "../utils";
import { DropdownProps } from "./Dropdown";
import { DropdownButton } from "./DropdownButton";
import { useDropdown } from "./useDropdown";

import "./Dropdown.css";
import { Portal } from "../portal";
import { useWindow } from "../window";
import {
  flip,
  limitShift,
  shift,
  size,
} from "@floating-ui/react-dom-interactions";

export type MultiSelectDropdownProps<Item = string> = DropdownProps<
  Item,
  "multiple"
>;

const withBaseName = makePrefixer("uitkDropdown");

/**
 * Renders a multi-select dropdown with selectable items
 */
export const MultiSelectDropdown = forwardRef(function MultiSelectDropdown<
  Item
>(
  {
    IconComponent = ChevronDownIcon,
    className,
    children,
    container,
    disablePortal,
    width = "180px",
    ...restProps
  }: MultiSelectDropdownProps<Item>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const { rootProps, buttonProps, listContext, listProps } = useDropdown<
    Item,
    "multiple"
  >({ IconComponent, width, ...restProps }, true);
  const Window = useWindow();
  const [maxListHeight, setMaxListHeight] = useState<number | undefined>(
    undefined
  );
  const { reference, floating, x, y, strategy } = useFloatingUI({
    placement: "bottom-start",
    middleware: [
      flip({
        fallbackPlacements: ["bottom-start", "top-start"],
      }),
      shift({ limiter: limitShift() }),
      size({
        apply({ height }) {
          setMaxListHeight(height);
        },
      }),
    ],
  });

  const {
    disabled,
    fullWidth,
    isOpen,
    ref: rootRef,
    ...restRootProps
  } = rootProps;

  const handleRootRef = useForkRef(rootRef, ref);
  const handleRef = useForkRef<HTMLDivElement>(reference, handleRootRef);

  return (
    <div
      className={classnames(
        withBaseName(),
        {
          [withBaseName("disabled")]: disabled,
          [withBaseName("fullwidth")]: fullWidth,
        },
        className
      )}
      ref={handleRef}
      {...restRootProps}
    >
      {children ? (
        children({
          DropdownButtonProps: buttonProps,
          isOpen,
          itemToString: listProps.itemToString,
          selectedItem: listContext.state.selectedItem,
        })
      ) : (
        <DropdownButton {...buttonProps} />
      )}
      <Portal disablePortal={disablePortal} container={container}>
        {rootRef.current && isOpen && (
          <Window
            className={withBaseName("popper")}
            style={{
              top: y ?? "",
              left: x ?? "",
              position: strategy,
              maxHeight: maxListHeight ?? "",
            }}
            ref={floating}
          >
            <ListStateContext.Provider value={listContext}>
              <ListBase
                data-testid="dropdown-list"
                maxHeight={maxListHeight}
                {...listProps}
              />
            </ListStateContext.Provider>
          </Window>
        )}
      </Portal>
    </div>
  );
}) as <Item = string>(
  props: DropdownProps<Item, "multiple"> & {
    ref?: ForwardedRef<HTMLDivElement>;
  }
) => ReactElement<DropdownProps<Item, "multiple">>;
