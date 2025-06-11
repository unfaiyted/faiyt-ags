import { Gtk, Widget } from "astal/gtk4"
import { DrawingArea, DrawingAreaProps } from "./../utils/containers/drawing-area";
import { Variable, Binding } from "astal"
import GdkPixbuf from "gi://GdkPixbuf"
import Cairo from "gi://cairo"
import Gdk from "gi://Gdk?version=4.0"

interface RoundedImageProps extends DrawingAreaProps {
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
        // First load the image to get its dimensions
        const originalPixbuf = GdkPixbuf.Pixbuf.new_from_file(file)
        
        if (originalPixbuf) {
            const origWidth = originalPixbuf.get_width()
            const origHeight = originalPixbuf.get_height()
            
            // Calculate scale to fill (not fit)
            const scaleX = width / origWidth
            const scaleY = height / origHeight
            const scale = Math.max(scaleX, scaleY)
            
            // Load at the size that will fill the container
            const scaledWidth = Math.round(origWidth * scale)
            const scaledHeight = Math.round(origHeight * scale)
            
            pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
                file,
                scaledWidth,
                scaledHeight,
                false // don't preserve aspect ratio
            )
        }
    } catch (e) {
        error = e as Error
        console.error(`Failed to load image: ${file}`, e)
    }

    return (
        <DrawingArea
            cssClasses={["rounded-image"]}
            widthRequest={width}
            heightRequest={height}
            {...rest}
            setup={(self) => {
                self.set_draw_func((widget, cr) => {
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
                        // Center the image if it's larger than the container
                        const pixbufWidth = pixbuf.get_width()
                        const pixbufHeight = pixbuf.get_height()
                        const offsetX = (w - pixbufWidth) / 2
                        const offsetY = (h - pixbufHeight) / 2
                        
                        Gdk.cairo_set_source_pixbuf(cr, pixbuf, offsetX, offsetY)
                        cr.paint()
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
                })
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
        <DrawingArea
            cssClasses={["rounded-image", ...cssClasses]}
            widthRequest={width}
            heightRequest={height}
            setup={(self) => {
                self.set_draw_func((widget, cr) => {

                    const currentFile = file.get()
                    const allocation = widget.get_allocation()
                    const w = allocation.width
                    const h = allocation.height

                    let pixbuf: GdkPixbuf.Pixbuf | null = null
                    let error: Error | null = null

                    // Load the image if file path is provided
                    if (currentFile) {
                        try {
                            // First load the image to get its dimensions
                            const originalPixbuf = GdkPixbuf.Pixbuf.new_from_file(currentFile)
                            
                            if (originalPixbuf) {
                                const origWidth = originalPixbuf.get_width()
                                const origHeight = originalPixbuf.get_height()
                                
                                // Calculate scale to fill (not fit)
                                const scaleX = w / origWidth
                                const scaleY = h / origHeight
                                const scale = Math.max(scaleX, scaleY)
                                
                                // Load at the size that will fill the container
                                const scaledWidth = Math.round(origWidth * scale)
                                const scaledHeight = Math.round(origHeight * scale)
                                
                                pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
                                    currentFile,
                                    scaledWidth,
                                    scaledHeight,
                                    false // don't preserve aspect ratio
                                )
                            }
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
                        // Center the image if it's larger than the container
                        const pixbufWidth = pixbuf.get_width()
                        const pixbufHeight = pixbuf.get_height()
                        const offsetX = (w - pixbufWidth) / 2
                        const offsetY = (h - pixbufHeight) / 2
                        
                        Gdk.cairo_set_source_pixbuf(cr, pixbuf, offsetX, offsetY)
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
                })
                file.subscribe(() => self.queue_draw())
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
        <DrawingArea
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
                        Gtk.IconLookupFlags.PRELOAD
                    )

                    if (iconInfo) {
                        // In GTK4, we need to load the icon as a pixbuf differently
                        // Try to get the file path and load as pixbuf
                        const file = iconInfo.get_file()
                        if (file) {
                            const path = file.get_path()
                            if (path) {
                                const pixbuf = GdkPixbuf.Pixbuf.new_from_file_at_scale(
                                    path,
                                    Math.min(w, h),
                                    Math.min(w, h),
                                    true
                                )
                                if (pixbuf) {
                                    Gdk.cairo_set_source_pixbuf(cr, pixbuf, 0, 0)
                                    cr.paint()
                                } else {
                                    throw new Error("Failed to load icon pixbuf")
                                }
                            } else {
                                throw new Error("Failed to get icon path")
                            }
                        } else {
                            throw new Error("Failed to get icon file")
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
