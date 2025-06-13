import { Widget } from "astal/gtk4";
import { DrawingArea, DrawingAreaProps } from "../../utils/containers/drawing-area";

export interface ColorPreviewProps extends DrawingAreaProps {
  color: string; // Hex color value
  size?: number;
}

export default function ColorPreview({ color, size = 24, ...props }: ColorPreviewProps) {
  return (
    <DrawingArea
      widthRequest={size}
      heightRequest={size}
      {...props}
      setup={(self) => {
        self.set_draw_func((widget, cr) => {
          // Parse hex color
          const hex = color.replace('#', '');
          const r = parseInt(hex.slice(0, 2), 16) / 255;
          const g = parseInt(hex.slice(2, 4), 16) / 255;
          const b = parseInt(hex.slice(4, 6), 16) / 255;

          const width = widget.get_width();
          const height = widget.get_height();
          const radius = 4;

          // Draw rounded rectangle
          cr.arc(radius, radius, radius, Math.PI, 1.5 * Math.PI);
          cr.arc(width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI);
          cr.arc(width - radius, height - radius, radius, 0, 0.5 * Math.PI);
          cr.arc(radius, height - radius, radius, 0.5 * Math.PI, Math.PI);
          cr.closePath();

          // Fill with color
          cr.setSourceRGBA(r, g, b, 1);
          cr.fillPreserve();

          // Draw border
          cr.setSourceRGBA(0, 0, 0, 0.2);
          cr.setLineWidth(1);
          cr.stroke();
        });
      }}
    />
  );
}
