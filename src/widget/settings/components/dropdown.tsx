import { Gtk, Widget } from "astal/gtk4";
import { serviceLogger as log } from "../../../utils/logger";

interface DropdownProps {
  value: string;
  options: { label: string; value: string }[];
  onChanged: (value: string) => void;
}

export const Dropdown = ({
  value,
  options,
  onChanged
}: DropdownProps) => {
  const model = new Gtk.StringList();
  options.forEach(opt => model.append(opt.label));

  const selectedIndex = options.findIndex(opt => opt.value === value);

  // Create a wrapper component to handle the dropdown
  const DropdownWrapper = () => {
    const dropdown = new Gtk.DropDown({
      model: model,
      selected: selectedIndex >= 0 ? selectedIndex : 0,
      enable_search: true,
      show_arrow: true,
      can_focus: true,
      sensitive: true
    });

    dropdown.connect("notify::selected", () => {
      if (dropdown.selected !== null && dropdown.selected >= 0 && dropdown.selected < options.length) {
        const selectedValue = options[dropdown.selected].value;
        log.debug(`Dropdown value changed: ${selectedValue}`);
        onChanged(selectedValue);
      }
    });

    return dropdown;
  };

  return (
    <box 
      setup={(self) => {
        const dropdown = DropdownWrapper();
        self.append(dropdown);
      }}
    />
  );
};