import {
  makePrefixer,
  Tooltip,
  TooltipProps,
  useForkRef,
  useTooltip,
  polymorphicRef,
} from "@jpmorganchase/uitk-core";
import cx from "classnames";
import {
  CSSProperties,
  ElementType,
  forwardRef,
  ComponentPropsWithoutRef,
  ReactElement,
  RefObject,
  HTMLAttributes,
  ForwardedRef,
} from "react";
import { useTruncation } from "./useTruncation";

import "./Text.css";

// export type As = "div" | "a" | "span" | "label" | "h1" | "h2" | "h3" | "h4";

// export type Element<T extends As = "div"> = T extends "span"
//   ? HTMLSpanElement
//   : T extends "label"
//   ? HTMLLabelElement
//   : T extends "a"
//   ? HTMLAnchorElement
//   : T extends "h1"
//   ? HTMLHeadingElement
//   : T extends "h2"
//   ? HTMLHeadingElement
//   : T extends "h3"
//   ? HTMLHeadingElement
//   : T extends "h4"
//   ? HTMLHeadingElement
//   : HTMLDivElement;

const withBaseName = makePrefixer("uitkText");

interface TextPropsBase<E extends ElementType> {
  /**
   * Represents the semantic element tag name as a string.
   * Defaults to 'div'
   */
  elementType?: ElementType;
  /**
   * Number of rows to display when truncate=true.
   */
  maxRows?: number;
  /**
   * If 'true', component will apply the logic for truncation. If 'false' then text will display entirely.
   * Defaults to 'false'
   */
  truncate?: boolean;
  /**
   * If 'true' it will show the Tooltip only if the text is truncated.
   * Defaults to 'true'
   */
  showTooltip?: boolean;
  /**
   * Customise Tooltip
   */
  tooltipProps?: Partial<TooltipProps>;
  /**
   * Customize the Tooltip text
   */
  tooltipText?: string;
  /**
   * Customise styling.
   */
  style?: CSSProperties;
  /**
   * Callback function triggered when overflow state changes.
   * @params [boolean] isOverflowed
   */
  onOverflowChange?: (isOverflowed: boolean) => unknown;
  /**
   * Match styling to a specified heading
   */
  styleAs?: "h1" | "h2" | "h3" | "h4" | "label";
}

export type TextProps<E extends ElementType = "div"> = TextPropsBase<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextPropsBase<E>>;

type PolymorphicText = <T extends ElementType>(
  props: TextProps<T> & {
    ref?: polymorphicRef<T>;
  }
) => ReactElement<TextProps<T>>;

export const Text = forwardRef<any, TextProps<ElementType>>(function Text<
  E extends ElementType = "div"
>(props: TextProps<E>, ref: polymorphicRef<E>): ReactElement<TextProps<E>> {
  const {
    children,
    className,
    elementType = "div",
    maxRows,
    onOverflowChange,
    showTooltip = true,
    style,
    styleAs,
    tooltipProps,
    tooltipText,
    truncate = false,
    tabIndex,
    ...restProps
  } = props;

  // Rendering
  const Component: ElementType = elementType;

  const getTruncatingComponent = () => {
    const { setContainerRef, hasTooltip, tooltipTextDefault, rows } =
      useTruncation({ children, maxRows, showTooltip, onOverflowChange }, ref);

    const { getTooltipProps, getTriggerProps } = useTooltip({
      enterDelay: 150,
      placement: "top",
      disabled: !hasTooltip,
    });

    const { ref: triggerRef, ...triggerProps } = getTriggerProps({
      className: cx(withBaseName(), className, withBaseName("lineClamp"), {
        [withBaseName(styleAs || "")]: styleAs,
      }),
      tabIndex: hasTooltip || elementType === "a" ? 0 : -1,
      style: {
        ...style,
        // @ts-ignore
        "--text-max-rows": rows,
      },
      ...restProps,
    } as HTMLAttributes<HTMLDivElement>);

    const handleRef = useForkRef(triggerRef, setContainerRef);

    return (
      <>
        <Component {...triggerProps} ref={handleRef}>
          {children}
        </Component>
        <Tooltip
          {...getTooltipProps({
            title: tooltipText || tooltipTextDefault,
            ...tooltipProps,
          })}
        />
      </>
    );
  };

  if (truncate) {
    return getTruncatingComponent();
  }

  return (
    <Component
      className={cx(withBaseName(), className, {
        [withBaseName(styleAs || "")]: styleAs,
      })}
      {...restProps}
      ref={ref}
      style={style}
    >
      {children}
    </Component>
  );
}) as PolymorphicText;
