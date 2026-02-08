import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import iconUnits from "@/assets/images/icon-units.svg";
import iconDropdown from "@/assets/images/icon-dropdown.svg";

const options = [
  {
    label: "Temperature",
    items: [
      { text: "Celsius (°C)", value: "celsius", checked: true },
      { text: "Fahrenheit (°F)", value: "fahrenheit", checked: false },
    ],
  },
  {
    label: "Wind Speed",
    items: [
      { text: "km/h", value: "km/h", checked: true },
      { text: "mph", value: "mph", checked: false },
    ],
  },
  {
    label: "Precipitation",
    items: [
      { text: "Millimeters (mm)", value: "mm", checked: true },
      { text: "Inches (in)", value: "in", checked: false },
    ],
  },
];

export function UnitsConverter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <img src={iconUnits} alt="Units Icon" />
          <span>Units</span>
          <img src={iconDropdown} alt="Dropdown Icon" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Switch to Imperial/Metric</DropdownMenuItem>
        {options.map((group) => (
          <DropdownMenuGroup key={group.label}>
            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
            {group.items.map((item) => (
              <DropdownMenuCheckboxItem
                key={item.value}
                textValue={item.value}
                checked={item.checked}
              >
                {item.text}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
