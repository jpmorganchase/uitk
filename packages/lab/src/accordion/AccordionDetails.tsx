import {
  makePrefixer,
  useForkRef,
  useIsomorphicLayoutEffect,
} from "@jpmorganchase/uitk-core";
import cn from "classnames";
import { forwardRef, HTMLAttributes, useRef, useState } from "react";
import { useAccordionSectionContext } from "./AccordionSectionContext";

import "./Accordion.css";

const withBaseName = makePrefixer("uitkAccordionDetails");

export interface AccordionDetailsProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Render children even if the component is collapsed. Prevents unmounting of children components.
   * */
  preventUnmountOnCollapse?: boolean;
}

const msCollapseAnimationDuration = 150;

// Collapsed - the section is completely collapsed, don't render anything, height is 0
// Measuring - the section is about to expand, rendering a dummy preview to measure
//   the height of expanded section
// Expanding - the section is expanding but hasn't yet expanded to full size. height is set to
//   the value measured in the previous step
// Expanded - the section is expanded, need to render the content, height is set to auto
// Collapsing - the section is about to start collapsing, the height is set to current height
//   (auto has to be replaced by a number, then the component has to be rendered, then the value can
//    be set to 0)
enum AccordionState {
  COLLAPSING = "collapsing",
  COLLAPSED = "collapsed",
  MEASURING = "measuring",
  EXPANDING = "expanding",
  EXPANDED = "expanded",
}

export const AccordionDetails = forwardRef<
  HTMLDivElement,
  AccordionDetailsProps
>(function AccordionDetails(
  { children, className, preventUnmountOnCollapse, ...restProps },
  ref
) {
  const { isDisabled, isExpanded } = useAccordionSectionContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const forkedRef = useForkRef(ref, rootRef);

  const [state, setState] = useState<AccordionState>(
    isExpanded ? AccordionState.EXPANDED : AccordionState.COLLAPSED
  );

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) {
      return;
    }
    if (isExpanded) {
      if (state === AccordionState.COLLAPSED) {
        setState(AccordionState.MEASURING);
      } else if (state === AccordionState.MEASURING) {
        rootRef.current.style.height = `${
          contentRef.current!.getBoundingClientRect().height
        }px`;
        setState(AccordionState.EXPANDING);
      } else if (state === AccordionState.EXPANDING) {
        setTimeout(() => {
          setState(AccordionState.EXPANDED);
        }, msCollapseAnimationDuration);
      } else if (state === AccordionState.EXPANDED) {
        rootRef.current.style.height = "auto";
      }
    } else {
      if (state === AccordionState.EXPANDED) {
        rootRef.current.style.height = `${
          rootRef.current.getBoundingClientRect().height
        }px`;
        setTimeout(() => {
          setState(AccordionState.COLLAPSING);
        }, 0);
      } else if (state === AccordionState.COLLAPSING) {
        rootRef.current.style.height = "0";
        setTimeout(() => {
          setState(AccordionState.COLLAPSED);
        }, msCollapseAnimationDuration);
      } else if (state === AccordionState.COLLAPSED) {
        rootRef.current.style.height = "0";
      }
    }
  }, [isExpanded, state]);

  return (
    <div
      {...restProps}
      ref={forkedRef}
      className={cn(
        withBaseName(),
        {
          [withBaseName("disabled")]: isDisabled,
        },
        className
      )}
    >
      <div
        ref={contentRef}
        className={cn({
          [withBaseName("dummy")]: state === AccordionState.MEASURING,
        })}
      >
        {preventUnmountOnCollapse || state !== AccordionState.COLLAPSED ? (
          <div className={withBaseName("content")}>{children}</div>
        ) : null}
      </div>
    </div>
  );
});
