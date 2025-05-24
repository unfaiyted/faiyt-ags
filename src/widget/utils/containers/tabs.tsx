import { Widget, Gtk, } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
// import { getScrollDirection } from "../../../utils";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";

export interface TabContent {
  name: string;
  content: Gtk.Widget;
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
  const { setup, child, children, cssName, ...props } = tabContainerProps;

  const active = new Variable(props.active);
  const activeTab = new Variable(props.tabs[props.active]);
  const orientation = new Variable(props.orientation || Gtk.Orientation.HORIZONTAL);
  let lastActive = new Variable(props.active);
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
      cssName={`spacing-v-5 ${cssName}`}
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
  const { setup, child, children, cssName, ...props } = tabHeaderProps;

  const active = new Variable(0);

  const handleScroll = () => {
    // const scrollDirection = getScrollDirection(event);
    //
    // if (scrollDirection === Gdk.ScrollDirection.UP) {
    //   active.set(active.get() + 1);
    // } else if (scrollDirection === Gdk.ScrollDirection.DOWN) {
    //   active.set(active.get() - 1);
    // }
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
  const { child, children, cssName, index, active, ...props } =
    tabHeaderItemProps;

  const handleClick = () => {
    print("TabHeaderItem clicked");
    print("Active tab:", index);
    print("hideLables:", props.hideLabels);
    props.setActive();
  };

  const setup = (self: Gtk.Button) => {
    setup?.(self);

    if (typeof active === "number") {
      self.set_css_classes(self.get_css_classes().concat(["tab-btn-active"]));
    } else {
      active.subscribe((currIndex) => {
        print("Active tab:", currIndex);
        if (index === currIndex) {
          self.set_css_classes(self.get_css_classes().concat(["tab-btn-active"]));
        } else {
          self.remove_css_class("tab-btn-active");
        }
      });
    }
  };

  // print("TabHeaderItem:", props.tab.name);
  return (
    <button cssName="tab-btn" onClicked={handleClick}>
      <box
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        cssName={`spacing-v-5 txt-small`}
      >
        <PhosphorIcon iconName={props.tab.icon} size={24} />
        {!props.hideLabels ? <label label={props.tab.name} /> : <box />}
      </box>
    </button>
  );
};

const TabContent = (tabContentProps: TabContentProps) => {
  const { setup, child, children, cssName, ...props } = tabContentProps;

  return (
    <stack transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}>
      {bind(props.tab).as((v) => v.content({ cssName, ...props }))}
    </stack>
  );
};

export default TabContainer;
