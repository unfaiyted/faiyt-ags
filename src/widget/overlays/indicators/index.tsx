import { Widget, Gtk, Gdk } from "astal/gtk4";
import config from "../../../utils/config";
import { Binding, Variable, bind } from "astal";
import { c } from "../../../utils/style";

export interface ProgressBarProps extends Widget.BoxProps {
  value: Binding<number>;
}

// Expects a value between 0 and 100
export const ProgressBar = (props: ProgressBarProps) => {
  const { value, ...rest } = props;

  return (
    <box
      cssName="osd-progress"
      cssClasses={c`progress-bar-container ${props.cssName}`}
      {...rest}
      heightRequest={8}
      widthRequest={100}
    >
      <box
        hexpand={false}
        cssName="progress-bar-fill"
        widthRequest={value.as((v) => {
          const percent = Math.min(Math.max(v, 0), 100);
          // Scale to parent width of 200px
          return Math.round(100 * (percent / 100));
        })}
      />
    </box>
  );
};

export interface IndicatorCardProps extends Widget.BoxProps {
  value: Binding<number>;
  icon?: Widget.ImageProps;
  name?: Binding<string>;
}

export const IndicatorCard = (props: IndicatorCardProps) => {
  const label = Variable("0");

  const disable = () => {
    label.set("󰖭");
  };

  return (
    <box
      vertical
      hexpand
      cssClasses={c`osd-value osd-bg`}
      cssName={props.cssName}>

      <box vexpand>
        {props.icon ? (
          <box hexpand cssName="osd-icon">
            {props.icon}
          </box>
        ) : (
          <label
            xalign={0}
            yalign={0}
            hexpand
            cssName="osd-label"
            label={props.name}
          />
        )}
        <label
          hexpand={false}
          cssName="osd-value-txt"
          label={props.value.as((v) => v.toString() + "%")}
        />
      </box>
      <ProgressBar
        cssName={`${props.cssName}-progress`}
        hexpand
        vertical={false}
        value={props.value}
      />
    </box>
  );
};

export interface IndicatorContainerProps extends Widget.RevealerProps {
  // TODO: correct type
  children?: any;
}

export const IndicatorsContainer = (props: IndicatorContainerProps) => {
  const isShow = Variable(true);

  return (
    <revealer
      {...props}
      // cssName={bind(isShow).as((v) => (v ? showClass : hideClass))}
      transitionDuration={config.animations.durationSmall}
      transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
      revealChild={true}
    >
      <box halign={Gtk.Align.CENTER} vertical={false} cssName="indicator-container">
        {props?.children || props?.child}
      </box>
    </revealer>
  );
};

export default IndicatorsContainer;
