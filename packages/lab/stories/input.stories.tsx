// TODO revisit when:
//  - multiline is implemented for Input
import { Button, ToolkitProvider } from "@brandname/core";
import {
  CalendarIcon,
  CloseIcon,
  CallIcon,
  SendIcon,
  UserIcon,
} from "@brandname/icons";
import {
  Input,
  FormField,
  StaticInputAdornment,
  Dropdown,
} from "@brandname/lab";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import "./input.qa.stories.css";

export default {
  title: "Lab/Input",
  component: Input,
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
  let text;
  // @ts-ignore
  // if (args.multiline) {
  //   text =
  //     "This is a Multiline Input with text which wraps onto more than one line.";
  // } else {
  // }
  // TODO: Are we providing multiline?
  text = "Value";

  return <Input defaultValue={text} style={{ width: "292px" }} {...args} />;
};

export const FeatureInput = Template.bind({});

FeatureInput.argTypes = {
  disabled: {
    control: {
      type: "boolean",
    },
  },
  // multiline: {
  //   control: {
  //     type: "boolean",
  //   },
  // },
  textAlign: {
    options: ["left", "right"],
    control: {
      type: "inline-radio",
    },
  },
};

FeatureInput.args = {
  disabled: false,
  // multiline: false,
  textAlign: "left",
};

export const ReadOnly: ComponentStory<typeof Input> = () => {
  return (
    <>
      <Input
        defaultValue={"Read Only Input"} // Read Only isn't currently a prop
        readOnly
        style={{ width: "292px" }}
      />
      <br />
      <br />
      <Input readOnly style={{ width: "292px" }} />
    </>
  );
};

export const WithFormField: ComponentStory<typeof Input> = () => {
  return (
    <FormField label="ADA compliant label" style={{ width: 292 }}>
      <Input defaultValue="Value" />
    </FormField>
  );
};

export const Spellcheck: ComponentStory<typeof Input> = () => {
  return (
    <Input
      defaultValue="This is a comment. It contains several sentences, with words spelt correctly or incorectly. Click to see Spellcheck take effect."
      style={{ width: "292px" }}
      inputProps={{ spellCheck: true }}
      // multiline
    />
  );
};

export const TouchDensityInput: ComponentStory<typeof Input> = () => {
  return (
    <ToolkitProvider density="touch">
      <Input defaultValue="Touch Density Input" style={{ width: "292px" }} />
    </ToolkitProvider>
  );
};

export const LowDensityInput: ComponentStory<typeof Input> = () => {
  return (
    <ToolkitProvider density="low">
      <Input defaultValue="Low Density Input" style={{ width: "292px" }} />
    </ToolkitProvider>
  );
};

export const HighDensityInput: ComponentStory<typeof Input> = () => {
  return (
    <ToolkitProvider density="high">
      <Input defaultValue="High Density Input" style={{ width: "292px" }} />
    </ToolkitProvider>
  );
};

export const Adornments: ComponentStory<typeof Input> = (args) => {
  const styles = {
    input: {
      width: 292,
    },
  };

  const data = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Delaware",
    "Florida",
  ];

  const suffixData = ["KG", "lbs", "g"];

  return (
    <>
      <Input
        defaultValue="Prefix: Icon"
        style={styles.input}
        {...args}
        startAdornment={
          <StaticInputAdornment>
            <CallIcon />
          </StaticInputAdornment>
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Prefix: Text"
        style={styles.input}
        {...args}
        startAdornment={<StaticInputAdornment>+1</StaticInputAdornment>}
      />
      <br />
      <br />
      <Input
        defaultValue="Suffix: Icon"
        style={styles.input}
        {...args}
        endAdornment={
          <StaticInputAdornment>
            <CalendarIcon size="small" />
          </StaticInputAdornment>
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Suffix: Text"
        style={styles.input}
        {...args}
        endAdornment={<StaticInputAdornment>KG</StaticInputAdornment>}
      />
      <br />
      <br />
      <Input
        defaultValue="Suffix: Button"
        style={styles.input}
        {...args}
        endAdornment={
          <Button variant="secondary">
            <CloseIcon aria-label="clear input" size="small" />
          </Button>
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Prefix: Icon + Text"
        style={styles.input}
        {...args}
        startAdornment={
          <>
            <StaticInputAdornment>
              {/* Phone --> Call */}
              <CallIcon size="small" />
            </StaticInputAdornment>
            <StaticInputAdornment>+1</StaticInputAdornment>
          </>
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Prefix: Interactive Component"
        style={styles.input}
        {...args}
        startAdornment={
          <Dropdown initialSelectedItem={data[0]} source={data} width={90} />
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Suffix: Text + Button"
        style={styles.input}
        {...args}
        endAdornment={
          <>
            <StaticInputAdornment>KG</StaticInputAdornment>
            <Button variant="secondary">
              <CloseIcon aria-label="clear input" size="small" />
            </Button>
          </>
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Suffix: Interactive Component"
        style={styles.input}
        {...args}
        endAdornment={
          <Dropdown
            initialSelectedItem={suffixData[0]}
            source={suffixData}
            width={60}
          />
        }
      />
      <br />
      <br />
      <Input
        defaultValue="Suffix: Button + Button"
        style={styles.input}
        {...args}
        endAdornment={
          <>
            <Button variant="secondary">
              <CloseIcon aria-label="clear input" size="small" />
            </Button>
            <Button variant="cta">
              <SendIcon size="small" />
            </Button>
          </>
        }
      />
      <br />
      <br />
      <Input
        defaultValue={"Suffix: Static + Button\n\n"}
        style={styles.input}
        {...args}
        endAdornment={
          <>
            <StaticInputAdornment>0/100</StaticInputAdornment>
            <Button variant="primary">
              <SendIcon size="small" />
            </Button>
          </>
        }
        startAdornment={
          <StaticInputAdornment>
            <UserIcon size="small" />
          </StaticInputAdornment>
        }
      />
    </>
    // TODO: Are we allowing for multiline?
  );
};
