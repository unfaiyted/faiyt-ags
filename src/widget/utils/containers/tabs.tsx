import { Widget, Gtk, Gdk } from "astal/gtk4";
import { Variable, Binding, bind } from "astal";
// import { getScrollDirection } from "../../../utils";
import PhosphorIcon from "../../utils/icons/phosphor";
import { PhosphorIcons } from "../../utils/icons/types";
import { c } from "../../../utils/style";
import { setupCursorHover } from "../../utils/buttons";

export interface TabContent {
  name: string;
  content: (props: Widget.BoxProps) => Gtk.Widget;
  icon: PhosphorIcons;
}

export interface TabNavigationKeys {
  /** Key value for moving to previous tab (default: Gdk.KEY_h) */
  prevKey?: number;
  /** Key value for moving to next tab (default: Gdk.KEY_l) */
  nextKey?: number;
  /** Modifier mask required (default: Gdk.ModifierType.CONTROL_MASK) */
  modifierMask?: Gdk.ModifierType;
}

export interface TabContainerProps extends Widget.BoxProps {
  active: number;
  hideLabels?: boolean;
  showActiveLabel?: boolean;
  orientation?: Gtk.Orientation;
  tabs: TabContent[];
  /** Optional keyboard navigation configuration */
  navigationKeys?: TabNavigationKeys;
  /** Callback when tab changes */
  onTabChange?: (index: number) => void;
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
  const { setup, child, children, cssName, navigationKeys, onTabChange, ...props } = tabContainerProps;

  const active = new Variable(props.active);
  const orientation = new Variable(props.orientation || Gtk.Orientation.HORIZONTAL);
  let lastActive = new Variable(props.active);

  // Default navigation keys
  const navKeys = {
    prevKey: navigationKeys?.prevKey ?? Gdk.KEY_h,
    nextKey: navigationKeys?.nextKey ?? Gdk.KEY_l,
    modifierMask: navigationKeys?.modifierMask ?? Gdk.ModifierType.CONTROL_MASK
  };

  const handleTabChange = (index: number) => {
    lastActive.set(active.get());
    active.set(index);
    onTabChange?.(index);
  };

  const navigateToPrevious = () => {
    const currentIndex = active.get();
    const newIndex = currentIndex === 0 ? props.tabs.length - 1 : currentIndex - 1;
    handleTabChange(newIndex);
  };

  const navigateToNext = () => {
    const currentIndex = active.get();
    const newIndex = currentIndex === props.tabs.length - 1 ? 0 : currentIndex + 1;
    handleTabChange(newIndex);
  };

  const setupKeyboardNavigation = (self: Gtk.Widget) => {
    const keyController = new Gtk.EventControllerKey();
    
    keyController.connect('key-pressed', (_controller, keyval, _keycode, state) => {
      // Check if the required modifier is pressed
      const modifierPressed = (state & navKeys.modifierMask) !== 0;
      
      if (!modifierPressed) {
        return false;
      }
      
      if (keyval === navKeys.prevKey) {
        navigateToPrevious();
        return true;
      } else if (keyval === navKeys.nextKey) {
        navigateToNext();
        return true;
      }
      
      return false;
    });
    
    self.add_controller(keyController);
  };

  return (
    <box
      vertical={orientation.get() == Gtk.Orientation.HORIZONTAL}
      cssName="tab-container"
      spacing={8}
      setup={(self) => {
        setupKeyboardNavigation(self);
        setup?.(self);
      }}
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
              setActive={() => handleTabChange(i)}
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
      setup={setupCursorHover}
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

// Re-export types for convenience
export type { TabNavigationKeys };
