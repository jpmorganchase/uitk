import { Scrim } from "@jpmorganchase/uitk-lab";
import { useRef, useState } from "react";

// TODO lighter variant test

describe("Given a Scrim", () => {
  describe("WHEN closeWithEscape is `true`", () => {
    it("THEN should call onClose when Escape is pressed and return focus", () => {
      const closeSpy = cy.stub().as("closeSpy");

      function TestComponent() {
        const [open, setOpen] = useState(false);
        return (
          <div>
            <Scrim
              open={open}
              onClose={() => {
                setOpen(false);
                closeSpy();
              }}
              closeWithEscape
            />
            <button onClick={() => setOpen((old) => !old)}>OPEN SCRIM</button>
          </div>
        );
      }

      cy.mount(<TestComponent />);
      cy.findByRole("button").click();
      cy.realPress("Escape");
      cy.get("@closeSpy").should("have.callCount", 1);

      cy.findByRole("button").should("have.focus");
    });
  });

  describe("WHEN open", () => {
    it("THEN should apply aria-hidden to siblings", () => {
      cy.mount(
        <div>
          <div data-testid="siblingWithChild">
            <span />
          </div>
          <Scrim open />
          <div data-testid="siblingNoChild" />
        </div>
      );

      cy.findByTestId("siblingWithChild").should(
        "have.attr",
        "aria-hidden",
        "true"
      );
      cy.findByTestId("siblingNoChild").should(
        "have.attr",
        "aria-hidden",
        "true"
      );
    });
    it("THEN should apply tabindex=-1 to siblings and niblings", () => {
      function TestComponent() {
        const parentRef = useRef<HTMLDivElement>(null);
        const [open, setOpen] = useState(false);
        return (
          <div ref={parentRef}>
            <Scrim containerFix open={open} parentRef={parentRef}>
              <button onClick={() => setOpen((old) => !old)}>
                CLOSE SCRIM
              </button>
            </Scrim>
            <button
              data-testid="openScrim"
              onClick={() => setOpen((old) => !old)}
            >
              OPEN SCRIM
            </button>
            <input tabIndex={-1} type="text" />
          </div>
        );
      }

      cy.mount(<TestComponent />);

      cy.findByRole("button", { name: "OPEN SCRIM" }).click();

      cy.findByTestId("openScrim").should("have.attr", "tabindex", "-1");
      cy.findByRole("textbox", { hidden: true }).should(
        "have.attr",
        "tabindex",
        "-1"
      );

      cy.findByRole("button", { name: "CLOSE SCRIM" }).click();

      cy.findByRole("button", { name: "OPEN SCRIM" }).should(
        "not.have.attr",
        "tabindex"
      );
      cy.findByRole("textbox").should("have.attr", "tabindex", "-1");
    });
  });

  describe("WHEN in a container state", () => {
    it("THEN should prevent selection to siblings and niblings", () => {
      function TestComponent() {
        const parentRef = useRef<HTMLDivElement>(null);
        const [open, setOpen] = useState(false);
        return (
          <div data-testid="parent" ref={parentRef}>
            <Scrim containerFix open={open} parentRef={parentRef}>
              <button onClick={() => setOpen((old) => !old)}>
                CLOSE SCRIM
              </button>
            </Scrim>
            <button onClick={() => setOpen((old) => !old)}>OPEN SCRIM</button>
          </div>
        );
      }
      cy.mount(<TestComponent />);

      cy.findByRole("button", { name: "OPEN SCRIM" }).click();
      cy.findByTestId("parent").should("have.css", "userSelect", "none");
      cy.findByRole("button", { name: "CLOSE SCRIM" }).click();
      cy.findByTestId("parent").should("have.css", "userSelect", "auto");
    });

    it("THEN should have `aria-modal=false` and `role=dialog`", () => {
      cy.mount(<Scrim containerFix open />);
      cy.findByRole("dialog")
        .should("exist")
        .and("have.attr", "aria-modal", "false");
    });
  });

  describe("Test Scrim interactions", () => {
    it("should render children when open", () => {
      cy.mount(<Scrim open>Click to close Scrim</Scrim>);
      cy.findByText("Click to close Scrim").should("exist");
    });

    it("should call `onClick` handler if set", () => {
      const clickSpy = cy.stub().as("clickSpy");
      cy.mount(<Scrim onBackDropClick={clickSpy} open />);
      cy.findByRole("dialog").click();
      cy.get("@clickSpy").should("have.callCount", 1);
    });
  });
});
