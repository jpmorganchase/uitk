import {
  Card,
  FLEX_ALIGNMENT_BASE,
  FLEX_CONTENT_ALIGNMENT_BASE,
  FlexItem,
  FlexLayout,
  FormField,
  Input,
  StackLayout,
  FlowLayout,
  Pill,
} from "@jpmorganchase/uitk-core";
import {
  Metric,
  MetricContent,
  MetricHeader,
  ContactAvatar,
  ContactDetails,
  ContactMetadata,
  ContactMetadataItem,
  ContactPrimaryInfo,
  ContactSecondaryInfo,
  ContactTertiaryInfo,
  ButtonBar,
  OrderedButton,
} from "@jpmorganchase/uitk-lab";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { FlexContent } from "./flex-item.stories";
import image2 from "docs/assets/image2.png";
import image3 from "docs/assets/image3.png";
import image4 from "docs/assets/image4.png";

export default {
  title: "Core/Layout/FlexLayout",
  component: FlexLayout,
  subcomponents: { FlexItem },
  argTypes: {
    align: {
      options: [...FLEX_ALIGNMENT_BASE, "stretch", "baseline"],
      control: { type: "select" },
    },
    justify: {
      options: FLEX_CONTENT_ALIGNMENT_BASE,
      control: { type: "select" },
    },
    separators: {
      options: ["start", "center", "end", true],
      control: { type: "select" },
    },
  },
  excludeStories: [
    "ContactDetailsExample",
    "FlexLayoutNestedExample",
    "SectionForm",
    "Blog",
  ],
} as ComponentMeta<typeof FlexLayout>;

const DefaultFlexLayoutStory: ComponentStory<typeof FlexLayout> = (args) => {
  return (
    <FlexLayout {...args}>
      {Array.from({ length: 5 }, (_, index) => (
        <FlexContent key={index} />
      ))}
    </FlexLayout>
  );
};
export const DefaultFlexLayout = DefaultFlexLayoutStory.bind({});
DefaultFlexLayout.args = {};

const SeparatedItemsStory: ComponentStory<typeof FlexLayout> = (args) => {
  return (
    <FlexLayout {...args}>
      {Array.from({ length: 4 }, (_, index) => (
        <FlexItem>
          <FlexContent key={index} />
        </FlexItem>
      ))}
    </FlexLayout>
  );
};
export const FlexLayoutWithSeparators = SeparatedItemsStory.bind({});
FlexLayoutWithSeparators.args = {
  separators: "center",
};

const Responsive: ComponentStory<typeof FlexLayout> = (args) => {
  return (
    <FlexLayout {...args}>
      {Array.from({ length: 6 }, (_, index) => (
        <FlexContent key={index} />
      ))}
    </FlexLayout>
  );
};
export const ToolkitFlexLayoutResponsive = Responsive.bind({});
ToolkitFlexLayoutResponsive.args = {
  direction: {
    xs: "column",
    md: "row",
  },
  wrap: {
    xs: true,
    lg: false,
  },
};

const FlexLayoutStorySimpleUsage: ComponentStory<typeof FlexLayout> = (
  args
) => {
  return (
    <div style={{ background: "#EAEDEF", padding: 24 }}>
      <FlexLayout {...args}>
        {Array.from({ length: 5 }, (_, index) => (
          <Metric key={index}>
            <MetricHeader title={`Form Stage ${index + 1}`} />
            <MetricContent value="Complete" />
          </Metric>
        ))}
        <Metric>
          <MetricHeader title="Form Stage 6" />
          <MetricContent value="Pending" />
        </Metric>
      </FlexLayout>
    </div>
  );
};
export const FlexLayoutSimpleUsage = FlexLayoutStorySimpleUsage.bind({});
FlexLayoutSimpleUsage.args = {
  wrap: true,
};

export const ContactDetailsExample = ({ index }: { index: number }) => (
  <ContactDetails embedded={true} stackAtBreakpoint={0}>
    <ContactAvatar />
    <ContactPrimaryInfo text={`Contact ${index + 1}`} />
    <ContactSecondaryInfo text="Blackrock Advisors (UK) Limited" />
    <ContactTertiaryInfo text="SPN 2188538" />
    <ContactMetadata collapsible={true}>
      <ContactMetadataItem value="Analyst" label="Role" />
      <ContactMetadataItem value="London, GBR" label="Location" />
      <ContactMetadataItem value="+44 2077 431102" label="Office" />

      <ContactMetadataItem value="alex.brailescu@blackrock.com" label="Email" />
    </ContactMetadata>
  </ContactDetails>
);

const ContactCards: ComponentStory<typeof FlexLayout> = (args) => {
  return (
    <FlexLayout {...args}>
      {Array.from({ length: 12 }, (_, index) => (
        <FlexItem grow={1} key={index}>
          <Card style={{ minWidth: 360 }}>
            <ContactDetailsExample key={index} index={index} />
          </Card>
        </FlexItem>
      ))}
    </FlexLayout>
  );
};
export const FlexLayoutComposite = ContactCards.bind({});
FlexLayoutComposite.args = {
  wrap: true,
};

const FlexLayoutNestedExample: ComponentStory<typeof FlexLayout> = (args) => {
  return (
    <FlexLayout {...args}>
      <Card style={{ minWidth: 150 }}>
        <ContactDetailsExample index={0} />
      </Card>
      <FlexLayout>
        <Card style={{ minWidth: 150 }}>
          <ContactDetailsExample index={1} />
        </Card>
        <Card style={{ minWidth: 150 }}>
          <ContactDetailsExample index={2} />
        </Card>
      </FlexLayout>
    </FlexLayout>
  );
};
export const FlexLayoutNested = FlexLayoutNestedExample.bind({});
FlexLayoutNested.args = {
  justify: "space-between",
  wrap: true,
  gap: 6,
};

const FormFieldExample = () => (
  <FormField label="Label" helperText="Help text appears here">
    <Input />
  </FormField>
);

const sectionFormContent = (
  <>
    <h3>Section title</h3>
    <p>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    </p>
    <StackLayout>
      <FlexLayout wrap={false}>
        {Array.from({ length: 2 }, (_, index) => (
          <FormFieldExample key={index} />
        ))}
      </FlexLayout>
      <FormFieldExample />
      <FlexLayout wrap={false}>
        {Array.from({ length: 2 }, (_, index) => (
          <FormFieldExample key={index} />
        ))}
      </FlexLayout>
    </StackLayout>
  </>
);

export const SectionForm: ComponentStory<typeof FlexLayout> = (args) => {
  return (
    <form>
      <h2>Page title</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </p>
      <StackLayout>
        <FlexLayout wrap={false} {...args}>
          <FlexItem grow={1}>{sectionFormContent}</FlexItem>
          <FlexItem grow={1}>{sectionFormContent}</FlexItem>
        </FlexLayout>
        <ButtonBar>
          <OrderedButton variant="cta">Submit</OrderedButton>
          <OrderedButton>Cancel</OrderedButton>
        </ButtonBar>
      </StackLayout>
    </form>
  );
};

export const Blog = () => (
  <>
    <h2>
      Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod temp
      incididunt ut labore et dolore magna aliqua.
    </h2>
    <StackLayout>
      <FlexLayout wrap={false}>
        <FlexItem>
          <img src={image2} alt="eiffel tower" />
        </FlexItem>
        <FlexItem>
          <h3>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          </h3>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est,
            qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore
            magnam aliquam quaerat voluptatem.
          </p>
          <FlowLayout gap={1}>
            {Array.from({ length: 5 }, (_, index) => (
              <Pill label="Lorem" key={index} />
            ))}
          </FlowLayout>
        </FlexItem>
      </FlexLayout>

      <FlexLayout wrap={false}>
        <FlexItem>
          <img src={image3} alt="tree" />
        </FlexItem>
        <FlexItem>
          <h3>Nemo enim ipsam voluptatem quia voluptas sit aspernatur</h3>
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi.
          </p>
          <FlowLayout gap={1}>
            {Array.from({ length: 5 }, (_, index) => (
              <Pill label="Lorem" key={index} />
            ))}
          </FlowLayout>
        </FlexItem>
      </FlexLayout>

      <FlexLayout wrap={false}>
        <FlexItem>
          <img src={image4} alt="stairs" />
        </FlexItem>
        <FlexItem>
          <h3>At vero eos et accusamus et iusto odio dignissimos ducimus</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum. Duis aute irure dolor in reprehenderit in
            voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </p>
          <FlowLayout gap={1}>
            {Array.from({ length: 5 }, (_, index) => (
              <Pill label="Lorem" key={index} />
            ))}
          </FlowLayout>
        </FlexItem>
      </FlexLayout>
    </StackLayout>
  </>
);
