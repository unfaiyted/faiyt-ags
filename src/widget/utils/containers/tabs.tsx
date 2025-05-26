import { Widget, Gtk, } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
// import { getScrollDirection } from "../../../utils";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import { c } from "../../../utils/style";

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


export const TabContainer = (tabContainerProps: TabContainerProps) => {
  const { setup, child, children, cssName, ...props } = tabContainerProps;

  const active = new Variable(props.active);
  const orientation = new Variable(props.orientation || Gtk.Orientation.HORIZONTAL);
  let lastActive = new Variable(props.active);

  const handleHeaderClick = (index: number) => {
    lastActive.set(active.get());
    active.set(index);
  };

  return (
    <box
      vertical={orientation.get() == Gtk.Orientation.HORIZONTAL}
      cssName="tab-container"
      spacing={8}
    >
      <box cssName="tab-header-wrapper" hexpand halign={Gtk.Align.CENTER}>
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
      </box>
      <box cssName="tab-content-wrapper">
        <stack
          transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
          transitionDuration={200}
          visibleChildName={bind(active).as(i => `tab-${i}`)}
        >
          {props.tabs.map((tab, i) => (
            <box name={`tab-${i}`} >
              {tab.content({ cssName: cssName || '' })}
            </box>
          ))}
        </stack>
      </box>
    </box>
  );
};

export const TabHeader = (tabHeaderProps: TabHeaderProps) => {
  const { setup, child, children, cssName, ...props } = tabHeaderProps;

  return (
    <box
      cssName="tab-header"
      hexpand
      halign={Gtk.Align.CENTER}
      valign={Gtk.Align.CENTER}
    >
      <box
        homogeneous={true}
        vertical={props.orientation == Gtk.Orientation.VERTICAL}
        spacing={4}
      >
        {children}
      </box>
    </box>
  );
};

export const TabHeaderItem = (tabHeaderItemProps: TabHeaderItemProps) => {
  const { child, children, cssName, index, active, ...props } =
    tabHeaderItemProps;

  const handleClick = () => {
    props.setActive();
  };

  const isActive = Variable(false);


  if (typeof active !== "number") {
    isActive.set(active.get() === index);
    active.subscribe((v) => {
      if (v === index) {
        print("Active tab:", v);
        isActive.set(true);
      } else {
        isActive.set(false);
      }

    });

  }



  return (
    <button
      cssName="tab-btn"
      cssClasses={bind(isActive).as(act => act ? ['active'] : [])}
      onClicked={handleClick}
    >
      <box
        cssName="tab-btn-content"
        spacing={8}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <box cssName="tab-icon-wrapper">
          <PhosphorIcon
            iconName={props.tab.icon}
            size={20}
            cssName="tab-icon"
          />
        </box>
        {!props.hideLabels && (
          <label
            cssName="tab-label"
            label={props.tab.name.charAt(0).toUpperCase() + props.tab.name.slice(1)}
          />
        )}
      </box>
    </button>
  );
};


export default TabContainer;
