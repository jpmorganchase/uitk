import { ReactElement, useEffect, useState } from "react";
import cn from "classnames";
import { makePrefixer } from "@jpmorganchase/uitk-core";
import { ColorShadow } from "./ColorShadow";
import { FlatShadow } from "./FlatShadow";
import { useSearchParams } from "react-router-dom";
import { ShadowPatternProps } from "./ShadowPatternProps";

const withBaseName = makePrefixer("uitkShadow");

export const ShadowPattern = (props: ShadowPatternProps): ReactElement => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const openSections = searchParams.get("open")?.split("&") || [];
    setExpandedSections(openSections);
  }, [searchParams]);

  return (
    <div className={cn(withBaseName())}>
      {Object.keys(props.shadowPattern)
        .filter((innerPattern) =>
          Object.keys(props.shadowPattern[innerPattern]).includes("value")
        )
        .map(function (innerPattern) {
          return (
            <FlatShadow
              expandedSections={expandedSections}
              extractValue={props.extractValue}
              innerPattern={innerPattern}
              key={`${props.themeName}-shadow-${props.pattern}-${innerPattern}`}
              onUpdateJSON={props.onUpdateJSON}
              pattern={props.pattern}
              scope={props.scope}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              shadowPattern={props.shadowPattern[innerPattern]}
              themeName={props.themeName}
              uitkColorOverrides={props.uitkColorOverrides}
            />
          );
        })}
      {Object.keys(props.shadowPattern)
        .filter(
          (innerPattern) =>
            !Object.keys(props.shadowPattern[innerPattern]).includes("value")
        )
        .map(function (innerPattern) {
          return (
            <ColorShadow
              expandedSections={expandedSections}
              extractValue={props.extractValue}
              innerPattern={innerPattern}
              key={`${props.themeName}-shadow-${props.pattern}-${innerPattern}`}
              onUpdateJSON={props.onUpdateJSON}
              pattern={props.pattern}
              scope={props.scope}
              searchParams={searchParams}
              setSearchParams={setSearchParams}
              shadowPattern={props.shadowPattern[innerPattern]}
              themeName={props.themeName}
              uitkColorOverrides={props.uitkColorOverrides}
            />
          );
        })}
    </div>
  );
};
