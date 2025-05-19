import { Widget, Gtk, Gdk, Astal } from "astal/gtk3";
import { Variable, Binding, bind } from "astal";
import { getScrollDirection } from "../../../utils";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";

export interface TabContent {
  name: string;
  content: (props: Widget.BoxProps) => Gtk.Widget;
  icon: PhosphorIcons;
}

export interface TabContainerProps extends Widget.BoxProps {
  active: number;
  hideLabels?: boolean;
  showActiveLabel?: boolean;
  orientation?: Gtk.Orientation;
  tabs: TabContent[];
}

export interface TabHeaderProps extends Widget.BoxProps {
  orientation?: Gtk.Orientation;
}
export interface TabHeaderItemProps extends Widget.BoxProps {
  tab: TabContent;
  hideLabels?: boolean;
  active: number | Binding<number>;
  index: number;
  setActive: () => void;
}

export interface TabContentProps extends Widget.BoxProps {
  active: Binding<number> | number;
  tab: Binding<TabContent>;
}

export const TabContainer = (tabContainerProps: TabContainerProps) => {
  const { setup, child, children, className, ...props } = tabContainerProps;

  const active = Variable(props.active);
  const activeTab = Variable(props.tabs[props.active]);
  const orientation = Variable(props.orientation || Gtk.Orientation.HORIZONTAL);
  let lastActive = Variable(props.active);
  // const count = Math.min(icons.length, names.length);

  // print("Tabs length:", props.tabs.length);

  const handleHeaderClick = (index: number) => {
    lastActive.set(active.get());
    active.set(index);
  };

  active.subscribe((index) => {
    activeTab.set(props.tabs[index]);
  });

  return (
    <box
      vertical={orientation.get() == Gtk.Orientation.HORIZONTAL}
      className={`spacing-v-5 ${className}`}
    >
      <TabHeader {...props}>
        {props.tabs.map((tab, i) => (
          <TabHeaderItem
            {...props}
            hideLabels={props.hideLabels}
            tab={tab}
            active={bind(active).as((v) => v)}
            index={i}
            setActive={() => active.set(i)}
          />
        ))}
      </TabHeader>
      <TabContent {...props} tab={bind(activeTab).as((v) => v)} />
    </box>
  );
};

export const TabHeader = (tabHeaderProps: TabHeaderProps) => {
  const { setup, child, children, className, ...props } = tabHeaderProps;

  const active = Variable(0);

  const handleScroll = (self: Widget.EventBox, event: Astal.ScrollEvent) => {
    const scrollDirection = getScrollDirection(event);

    if (scrollDirection === Gdk.ScrollDirection.UP) {
      active.set(active.get() + 1);
    } else if (scrollDirection === Gdk.ScrollDirection.DOWN) {
      active.set(active.get() - 1);
    }
  };

  return (
    <box
      homogeneous={true}
      vertical={props.orientation == Gtk.Orientation.VERTICAL}
    >
      {/* <eventbox onScroll={handleScroll}>{children}</eventbox> */}
      {children}
    </box>
  );
};

export const TabHeaderItem = (tabHeaderItemProps: TabHeaderItemProps) => {
  const { child, children, className, index, active, ...props } =
    tabHeaderItemProps;

  const handleClick = (self: Widget.Button, event: Astal.ClickEvent) => {
    print("TabHeaderItem clicked");
    print("Active tab:", index);
    print("hideLables:", props.hideLabels);
    props.setActive();
  };

  const setup = (self: Widget.Button) => {
    setup?.(self);

    if (typeof active === "number") {
      self.toggleClassName("tab-btn-active", active === index);
    } else {
      active.subscribe((currIndex) => {
        print("Active tab:", currIndex);
        if (index === currIndex) {
          self.toggleClassName("tab-btn-active", true);
        } else {
          self.toggleClassName("tab-btn-active", false);
        }
      });
    }
  };

  // print("TabHeaderItem:", props.tab.name);
  return (
    <button className="tab-btn" onClick={handleClick}>
      <box
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        className={`spacing-v-5 txt-small`}
      >
        <PhosphorIcon icon={props.tab.icon} size={24} />
        {!props.hideLabels ? <label label={props.tab.name} /> : <box />}
      </box>
    </button>
  );
};

const TabContent = (tabContentProps: TabContentProps) => {
  const { setup, child, children, className, ...props } = tabContentProps;

  return (
    <stack transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}>
      {bind(props.tab).as((v) => v.content({ className, ...props }))}
    </stack>
  );
};

export default TabContainer;
