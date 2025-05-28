import { Gtk, Widget } from "astal/gtk4"
import { bind, Variable, Binding } from "astal"
import GdkPixbuf from "gi://GdkPixbuf"
import Cairo from "gi://cairo"

interface RoundedImageProps extends Widget.DrawingAreaProps {
    file: string
    size?: number | { width: number; height: number }
    radius?: number
}

export function RoundedImage({
    file,
    size = 48,
    radius = 8,
    cssClasses = [],
    ...rest
}: RoundedImageProps) {
    const width = typeof size === "number" ? size : size.width
    const height = typeof size === "number" ? size : size.height

    let pixbuf: GdkPixbuf.Pixbuf | null = null
    let error: Error | null = null

    // Load the image
    try {
        pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
            file,
            width,
            height,
            true // preserve aspect ratio
        )
    } catch (e) {
        error = e as Error
        console.error(`Failed to load image: ${file}`, e)
    }

    return (
        <drawingarea
            cssClasses={["rounded-image", ...cssClasses]}
            widthRequest={width}
            heightRequest={height}
            {...rest}
            onDraw={(widget, cr) => {
                const allocation = widget.get_allocation()
                const w = allocation.width
                const h = allocation.height

                // Create rounded rectangle path
                const degrees = Math.PI / 180.0
                
                cr.newSubPath()
                cr.arc(w - radius, radius, radius, -90 * degrees, 0 * degrees)
                cr.arc(w - radius, h - radius, radius, 0 * degrees, 90 * degrees)
                cr.arc(radius, h - radius, radius, 90 * degrees, 180 * degrees)
                cr.arc(radius, radius, radius, 180 * degrees, 270 * degrees)
                cr.closePath()

                // Clip to the rounded rectangle
                cr.clip()

                // Draw the image if loaded successfully
                if (pixbuf) {
                    // Scale the pixbuf to fit the allocation if needed
                    const scaledPixbuf = pixbuf.scale_simple(
                        w,
                        h,
                        GdkPixbuf.InterpType.BILINEAR
                    )

                    if (scaledPixbuf) {
                        // In GTK4, we need to use Cairo directly
                        const surface = Cairo.ImageSurface.createFromPng("/dev/null")
                        // Set source pixbuf using Cairo
                        cr.setSourcePixbuf(scaledPixbuf, 0, 0)
                        cr.paint()
                    }
                } else {
                    // Draw placeholder or error state
                    cr.setSourceRGBA(0.2, 0.2, 0.2, 0.8)
                    cr.paint()

                    // Draw error icon or text
                    if (error) {
                        cr.setSourceRGBA(1, 1, 1, 0.8)
                        cr.selectFontFace("monospace", 0, 0)
                        cr.setFontSize(Math.min(w, h) * 0.3)
                        cr.moveTo(w * 0.5 - 10, h * 0.5 + 5)
                        cr.showText("?")
                    }
                }

                return true
            }}
        />
    )
}

// Alternative implementation with reactive file path
export function RoundedImageReactive({
    file,
    size = 48,
    radius = 8,
    cssClasses = [],
}: {
    file: Binding<string | null>
    size?: number | { width: number; height: number }
    radius?: number
    cssClasses?: string[]
}) {
    const width = typeof size === "number" ? size : size.width
    const height = typeof size === "number" ? size : size.height

    return (
        <drawingarea
            cssClasses={["rounded-image", ...cssClasses]}
            widthRequest={width}
            heightRequest={height}
            setup={(self) => {
                // Force redraw when file changes
                file.subscribe(() => self.queueDraw())
            }}
            onDraw={(widget, cr) => {
                const currentFile = file.get()
                const allocation = widget.get_allocation()
                const w = allocation.width
                const h = allocation.height

                let pixbuf: GdkPixbuf.Pixbuf | null = null
                let error: Error | null = null

                // Load the image if file path is provided
                if (currentFile) {
                    try {
                        pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
                            currentFile,
                            w,
                            h,
                            true // preserve aspect ratio
                        )
                    } catch (e) {
                        error = e as Error
                        console.error(`Failed to load image: ${currentFile}`, e)
                    }
                }

                // Create rounded rectangle path
                const degrees = Math.PI / 180.0
                
                cr.newSubPath()
                cr.arc(w - radius, radius, radius, -90 * degrees, 0 * degrees)
                cr.arc(w - radius, h - radius, radius, 0 * degrees, 90 * degrees)
                cr.arc(radius, h - radius, radius, 90 * degrees, 180 * degrees)
                cr.arc(radius, radius, radius, 180 * degrees, 270 * degrees)
                cr.closePath()

                // Clip to the rounded rectangle
                cr.clip()

                // Draw the image if loaded successfully
                if (pixbuf) {
                    cr.setSourcePixbuf(pixbuf, 0, 0)
                    cr.paint()
                } else if (!currentFile) {
                    // Draw loading state
                    cr.setSourceRGBA(0.3, 0.3, 0.3, 0.5)
                    cr.paint()
                    
                    // Draw loading icon
                    cr.setSourceRGBA(1, 1, 1, 0.6)
                    cr.selectFontFace("monospace", 0, 0)
                    cr.setFontSize(Math.min(w, h) * 0.3)
                    cr.moveTo(w * 0.5 - 10, h * 0.5 + 5)
                    cr.showText("⏳")
                } else {
                    // Draw placeholder or error state
                    cr.setSourceRGBA(0.2, 0.2, 0.2, 0.8)
                    cr.paint()

                    // Draw error icon or text
                    if (error) {
                        cr.setSourceRGBA(1, 1, 1, 0.8)
                        cr.selectFontFace("monospace", 0, 0)
                        cr.setFontSize(Math.min(w, h) * 0.3)
                        cr.moveTo(w * 0.5 - 10, h * 0.5 + 5)
                        cr.showText("?")
                    }
                }

                return true
            }}
        />
    )
}

// Helper function to create rounded image from icon name
export function RoundedIcon({
    icon,
    size = 48,
    radius = 8,
    cssClasses = [],
}: {
    icon: string
    size?: number
    radius?: number
    cssClasses?: string[]
}) {
    return (
        <drawingarea
            cssClasses={["rounded-icon", ...cssClasses]}
            widthRequest={size}
            heightRequest={size}
            onDraw={(widget, cr) => {
                const allocation = widget.get_allocation()
                const w = allocation.width
                const h = allocation.height

                // Create rounded rectangle path
                const degrees = Math.PI / 180.0
                
                cr.newSubPath()
                cr.arc(w - radius, radius, radius, -90 * degrees, 0 * degrees)
                cr.arc(w - radius, h - radius, radius, 0 * degrees, 90 * degrees)
                cr.arc(radius, h - radius, radius, 90 * degrees, 180 * degrees)
                cr.arc(radius, radius, radius, 180 * degrees, 270 * degrees)
                cr.closePath()

                // Clip to the rounded rectangle
                cr.clip()

                // Try to load icon from theme
                try {
                    const theme = Gtk.IconTheme.get_for_display(widget.get_display())
                    const iconInfo = theme.lookup_icon(
                        icon,
                        null,
                        Math.min(w, h),
                        1,
                        Gtk.TextDirection.NONE,
                        Gtk.IconLookupFlags.NONE
                    )
                    
                    if (iconInfo) {
                        const pixbuf = iconInfo.load_icon()
                        if (pixbuf) {
                            cr.setSourcePixbuf(pixbuf, 0, 0)
                            cr.paint()
                        } else {
                            throw new Error("Failed to load icon")
                        }
                    } else {
                        throw new Error("Icon not found")
                    }
                } catch (e) {
                    // Draw placeholder for missing icon
                    cr.setSourceRGBA(0.2, 0.2, 0.2, 0.8)
                    cr.paint()

                    // Draw question mark
                    cr.setSourceRGBA(1, 1, 1, 0.8)
                    cr.selectFontFace("monospace", 0, 0)
                    cr.setFontSize(Math.min(w, h) * 0.5)
                    cr.moveTo(w * 0.5 - 10, h * 0.5 + 10)
                    cr.showText("?")
                }

                return true
            }}
        />
    )
}