const StyleDictionary = require("style-dictionary");

console.log("Build started...");
console.log("\n==============================================");

// REGISTER THE CUSTOM TRANSFORMS

const {
  fileHeader,
  formattedVariables,
  createPropertyFormatter,
  sortByReference, // This is not defined in TS type, but exported in lib JS and used by formattedVariables
} = StyleDictionary.formatHelpers;

const defaultFormatting = {
  lineSeparator: "\n",
};

const removeDefaultSuffix = (name) => name.replace(/-default$/, "");
const tokenWithoutDefaultNameSuffix = (token) => ({
  ...token,
  name: removeDefaultSuffix(token.name),
});

const removeAllDefaultFromVariableName = (name) =>
  name.replace(/-default/g, "");

/**
 * Does mostly the same functionality as default `formattedVariables`, but
 * removes any token name suffix with `-default`. Default is needed for Figma grouping,
 * but we don't want them in output code like CSS.
 */
function customFormattedVariables({
  format,
  dictionary,
  outputReferences = false,
  formatting = {},
  themeable = false,
}) {
  let { allTokens } = dictionary;

  let { lineSeparator } = Object.assign({}, defaultFormatting, formatting);

  // Some languages are imperative, meaning a variable has to be defined
  // before it is used. If `outputReferences` is true, check if the token
  // has a reference, and if it does send it to the end of the array.
  // We also need to account for nested references, a -> b -> c. They
  // need to be defined in reverse order: c, b, a so that the reference always
  // comes after the definition
  if (outputReferences) {
    // note: using the spread operator here so we get a new array rather than
    // mutating the original
    allTokens = [...allTokens].sort(sortByReference(dictionary));
  }

  return allTokens
    .map((token) =>
      createPropertyFormatter({
        outputReferences,
        dictionary,
        format,
        formatting,
        themeable,
      })(tokenWithoutDefaultNameSuffix(token))
    )
    .filter(function (strVal) {
      console.log({ strVal });
      return !!strVal;
    })
    .join(lineSeparator);
}

StyleDictionary.registerFormat({
  name: "uitk/css/themes/all",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    // console.log(dictionary);
    return (
      fileHeader({ file }) +
      ".uitk-light, .uitk-dark {\n" +
      removeAllDefaultFromVariableName(
        formattedVariables({
          format: "css",
          dictionary,
          outputReferences,
        })
      ) +
      "\n}\n"
    );
  },
});

StyleDictionary.registerFormat({
  name: "uitk/css/themes/light",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return (
      fileHeader({ file }) +
      ".uitk-light {\n" +
      removeAllDefaultFromVariableName(
        formattedVariables({
          format: "css",
          dictionary,
          outputReferences,
        })
      ) +
      "\n}\n"
    );
  },
});

StyleDictionary.registerFormat({
  name: "uitk/css/themes/dark",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return (
      fileHeader({ file }) +
      ".uitk-dark {\n" +
      removeAllDefaultFromVariableName(
        formattedVariables({
          format: "css",
          dictionary,
          outputReferences,
        })
      ) +
      "\n}\n"
    );
  },
});

StyleDictionary.registerFormat({
  name: "uitk/css/density/all",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return (
      fileHeader({ file }) +
      ".uitk-density-touch, .uitk-density-low, .uitk-density-medium, .uitk-density-high {\n" +
      removeAllDefaultFromVariableName(
        formattedVariables({
          format: "css",
          dictionary,
          outputReferences,
        })
      ) +
      "\n}\n"
    );
  },
});

StyleDictionary.registerFormat({
  name: "uitk/css/density/medium",
  formatter: function ({ dictionary, file, options }) {
    const { outputReferences } = options;
    return (
      fileHeader({ file }) +
      ".uitk-density-medium {\n" +
      removeAllDefaultFromVariableName(
        formattedVariables({
          format: "css",
          dictionary,
          outputReferences,
        })
      ) +
      "\n}\n"
    );
  },
});

// REGISTER THE CUSTOM TRANSFORM GROUPS

// if you want to see what a pre-defined group contains, uncomment the next line:
// console.log(StyleDictionary.transformGroup['group_name']);

StyleDictionary.registerTransformGroup({
  name: "uitk/css",
  // Only difference is using size/px not rem
  transforms: [
    "attribute/cti",
    "name/cti/kebab",
    "time/seconds",
    "content/icon",
    "size/px",
    "color/css",
  ],
});

// REGISTER THE CUSTOM FILTERS

const UITK_CHARACTERISTICS = [
  "accent",
  "actionable",
  "container",
  "delay",
  "disabled",
  "draggable",
  "droptarget",
  "editable",
  "focused",
  "measured",
  "navigable",
  "overlayable",
  "ratable",
  "selectable",
  "separable",
  "status",
  "taggable",
  "text",
];

StyleDictionary.registerFilter({
  name: "uitk/filter/colors/all",
  matcher: function (token) {
    return (
      //   token.group === "color" ||
      token.attributes.category === "color"
    );
  },
});

StyleDictionary.registerFilter({
  name: "uitk/filter/colors/palette-light",
  matcher: function (token) {
    return (
      /light/i.test(token.filePath) && token.attributes.category === "palette"
    );
  },
});

StyleDictionary.registerFilter({
  name: "uitk/filter/colors/palette-dark",
  matcher: function (token) {
    return (
      /dark/.test(token.filePath) && token.attributes.category === "palette"
    );
  },
});

StyleDictionary.registerFilter({
  name: "uitk/filter/colors/characteristics",
  matcher: function (token) {
    return UITK_CHARACTERISTICS.includes(token.attributes.category);
  },
});

StyleDictionary.registerFilter({
  name: "uitk/filter/sizes/density/all",
  matcher: function (token) {
    return (
      token.attributes.category === "size" &&
      !/low|medium|high|touch/i.test(token.filePath)
    );
  },
});

StyleDictionary.registerFilter({
  name: "uitk/filter/sizes/density/medium",
  matcher: function (token) {
    return (
      token.attributes.category === "size" && token.filePath.includes("medium")
    );
  },
});

// APPLY THE CONFIGURATION
// IMPORTANT: the registration of custom transforms
// needs to be done _before_ applying the configuration
const StyleDictionaryExtendedLight = StyleDictionary.extend(
  __dirname + "/config-light.json"
);

// FINALLY, BUILD ALL THE PLATFORMS
StyleDictionaryExtendedLight.buildAllPlatforms();

// We have to split light and dark, otherwise Style Dictionary will warn us conflict token and override values internally
const StyleDictionaryExtendedDark = StyleDictionary.extend(
  __dirname + "/config-dark.json"
);
StyleDictionaryExtendedDark.buildAllPlatforms();

console.log("\n==============================================");
console.log("\nBuild completed!");
