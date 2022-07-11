import { useMemo, useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Card } from "@jpmorganchase/uitk-core";
import {
  ButtonBar,
  Carousel,
  CarouselSlide,
  DeckLayout,
  OrderedButton,
  Tabstrip,
} from "@jpmorganchase/uitk-lab";
import "./styles.css";

export default {
  title: "Lab/Layout/DeckLayout",
  component: DeckLayout,
  argTypes: {},
} as ComponentMeta<typeof DeckLayout>;

const deckCards = (slides: number) =>
  Array.from({ length: slides }, (_, index) => (
    <Card key={index}>
      <h2>{`Deck Item ${index + 1}`}</h2>
      <p>
        We can implement your cross-border liquidity model in just a few months,
        depending on the options, scope and complexity.
      </p>
    </Card>
  ));

const DefaultDeckLayoutStory: ComponentStory<typeof DeckLayout> = (args) => {
  const activeIndex = useMemo(() => args.activeIndex, [args.activeIndex]);

  const slides = 6;
  const [currentIndex, setCurrentIndex] = useState(activeIndex || 0);

  const handleIncrease = () => {
    if (currentIndex < slides - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handleDecrease = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  return (
    <>
      <button onClick={handleDecrease}>Previous</button>
      <button onClick={handleIncrease}>Next</button>
      <DeckLayout {...args} activeIndex={currentIndex}>
        {deckCards(slides)}
      </DeckLayout>
    </>
  );
};
export const DefaultDeckLayout = DefaultDeckLayoutStory.bind({});
DefaultDeckLayout.args = {
  activeIndex: 0,
};

const useTabSelection = (initialValue?: any) => {
  const [selectedTab, setSelectedTab] = useState(initialValue ?? 0);
  const handleTabSelection = (tabIndex: number) => {
    setSelectedTab(tabIndex);
  };
  return [selectedTab, handleTabSelection];
};

const WithTabStrip: ComponentStory<typeof DeckLayout> = (args) => {
  const [selectedTab, handleTabSelection] = useTabSelection();

  const tabs = ["Home", "Transactions", "FX", "Security Center", "Blog"];
  return (
    <div>
      <Tabstrip onChange={handleTabSelection} defaultTabs={tabs} />
      <DeckLayout {...args} activeIndex={selectedTab}>
        {tabs.map((tab, index) => {
          return (
            <Card key={index}>
              <h2>{`Tab ${index + 1}`}</h2>
              <p>
                We can implement your cross-border liquidity model in just a few
                months, depending on the options, scope and complexity.
              </p>
            </Card>
          );
        })}
      </DeckLayout>
    </div>
  );
};
export const DeckInTabstrip = WithTabStrip.bind({});
DeckInTabstrip.args = {};

const colors = ["fcd5ce", "f8edeb", "d8e2dc", "ffe5d9", "ffd7ba"];
const WithCarousel: ComponentStory<typeof DeckLayout> = (args) => {
  const renderButtonBar = () => (
    <ButtonBar>
      <OrderedButton variant="cta">Learn more</OrderedButton>
    </ButtonBar>
  );

  return (
    <Carousel className="carousel-container" {...args}>
      {Array.from({ length: 5 }, (_, index) => (
        <CarouselSlide
          key={index}
          ButtonBar={renderButtonBar}
          Media={
            <img
              alt="placeholder slider"
              src={`https://via.placeholder.com/1140x520/${
                colors[index]
              }?text=Carousel+Slide+${index + 1}`}
              style={{ width: "100%" }}
            />
          }
          description={"Lorem ipsum dolor sit amet"}
          title={"Carousel Slide"}
          contentAlignment={"left"}
        />
      ))}
    </Carousel>
  );
};
export const DeckInCarousel = WithCarousel.bind({});
DeckInCarousel.args = {};
