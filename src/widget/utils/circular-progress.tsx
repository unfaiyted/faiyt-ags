import { astalify, ConstructProps, Gtk } from "astal/gtk4"

// CircularProgress implementation for GTK4
export interface CircularProgressProps extends ConstructProps<Gtk.DrawingArea, Gtk.DrawingArea.ConstructorProps> {
  percentage?: number;
  size?: number;
  lineWidth?: number;
}

// Create a custom ConstructorProps interface that includes our custom properties
interface CustomDrawingAreaProps extends Gtk.DrawingArea.ConstructorProps {
  percentage?: number;
  size?: number;
  lineWidth?: number;
}

export const CircularProgress = astalify<Gtk.DrawingArea, CustomDrawingAreaProps>(
  Gtk.DrawingArea,
  {
    create(props) {
      const widget = new Gtk.DrawingArea();

      // Store custom properties on the widget
      widget._circularprogress = {
        percentage: props.percentage ?? 0,
        size: props.size ?? 24,
        lineWidth: props.lineWidth ?? 2
      };

      // Set size
      widget.set_content_width(widget._circularprogress.size);
      widget.set_content_height(widget._circularprogress.size);

      // Set up drawing function
      widget.set_draw_func((area, cr, width, height) => {
        const center = width / 2;
        const radius = (Math.min(width, height) - widget._circularprogress.lineWidth) / 2;

        // Background circle
        cr.arc(center, center, radius, 0, 2 * Math.PI);
        cr.setSourceRGBA(0.2, 0.2, 0.2, 0.5);
        cr.setLineWidth(widget._circularprogress.lineWidth);
        cr.stroke();

        // Progress arc
        if (widget._circularprogress.percentage > 0) {
          const startAngle = -Math.PI / 2;
          const endAngle = (widget._circularprogress.percentage / 100) * 2 * Math.PI + startAngle;

          cr.arc(center, center, radius, startAngle, endAngle);
          cr.setSourceRGBA(0.3, 0.8, 0.2, 1.0);
          cr.setLineWidth(widget._circularprogress.lineWidth);
          cr.stroke();
        }
      });

      return widget;
    },

    properties: {
      percentage: {
        get: (widget) => widget._circularprogress?.percentage ?? 0,
        set: (widget, value) => {
          widget._circularprogress = widget._circularprogress || {};
          widget._circularprogress.percentage = value;
          widget.queue_draw(); // Request redraw
        }
      },
      size: {
        get: (widget) => widget._circularprogress?.size ?? 24,
        set: (widget, value) => {
          widget._circularprogress = widget._circularprogress || {};
          widget._circularprogress.size = value;
          widget.set_content_width(value);
          widget.set_content_height(value);
          widget.queue_draw();
        }
      },
      lineWidth: {
        get: (widget) => widget._circularprogress?.lineWidth ?? 2,
        set: (widget, value) => {
          widget._circularprogress = widget._circularprogress || {};
          widget._circularprogress.lineWidth = value;
          widget.queue_draw();
        }
      }
    }
  }
);
