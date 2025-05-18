/// <reference path="./pangocairo-1.0.d.ts" />
/// <reference path="./cairo-1.0.d.ts" />
/// <reference path="./cairo.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./pango-1.0.d.ts" />
/// <reference path="./harfbuzz-0.0.d.ts" />
/// <reference path="./freetype2-2.0.d.ts" />
/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />
/// <reference path="./mtk-15.d.ts" />
/// <reference path="./graphene-1.0.d.ts" />
/// <reference path="./cogl-15.d.ts" />
/// <reference path="./xlib-2.0.d.ts" />
/// <reference path="./gl-1.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://CoglPango?version=15' {
    // Module dependencies
    import type PangoCairo from 'gi://PangoCairo?version=1.0';
    import type cairo from 'cairo';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type Pango from 'gi://Pango?version=1.0';
    import type HarfBuzz from 'gi://HarfBuzz?version=0.0';
    import type freetype2 from 'gi://freetype2?version=2.0';
    import type Gio from 'gi://Gio?version=2.0';
    import type GModule from 'gi://GModule?version=2.0';
    import type Mtk from 'gi://Mtk?version=15';
    import type Graphene from 'gi://Graphene?version=1.0';
    import type Cogl from 'gi://Cogl?version=15';
    import type xlib from 'gi://xlib?version=2.0';
    import type GL from 'gi://GL?version=1.0';

    export namespace CoglPango {
        /**
         * CoglPango-15
         */

        /**
         * This updates any internal glyph cache textures as necessary to be
         * able to render the given `layout`.
         *
         * This api should be used to avoid mid-scene modifications of
         * glyph-cache textures which can lead to undefined rendering results.
         * @param layout A #PangoLayout
         */
        function ensure_glyph_cache_for_layout(layout: Pango.Layout): void;
        /**
         * Create a [class`Pango`.Context] for the given `font_map`.
         * @param font_map a #CoglPangoFontMap
         * @returns the newly created context: free with [method@GObject.Object.unref].
         */
        function font_map_create_context(font_map: FontMap): Pango.Context;
        /**
         * Retrieves the [class`CoglPango`.Renderer] for the passed `font_map`.
         * @param font_map a #CoglPangoFontMap
         * @returns a #PangoRenderer
         */
        function font_map_get_renderer(font_map: FontMap): Pango.Renderer;
        /**
         * Creates a new font map.
         * @param context
         * @returns the newly created #PangoFontMap
         */
        function font_map_new(context: Cogl.Context): Pango.FontMap;
        /**
         * Sets the resolution for the `font_map`.
         *
         * This is a scale factor between points specified in a
         * [struct`Pango`.FontDescription] and Cogl units.
         * The default value is %96, meaning that a 10 point font will be 13
         * units high. (10 * 96. / 72. = 13.3).
         * @param font_map a #CoglPangoFontMap
         * @param dpi The resolution in "dots per inch". (Physical inches aren't       actually involved; the terminology is conventional.)
         */
        function font_map_set_resolution(font_map: FontMap, dpi: number): void;
        interface PipelineSetup {
            (pipeline: Cogl.Pipeline): void;
        }
        namespace Renderer {
            // Constructor properties interface

            interface ConstructorProps extends Pango.Renderer.ConstructorProps {
                context: Cogl.Context;
            }
        }

        class Renderer extends Pango.Renderer {
            static $gtype: GObject.GType<Renderer>;

            // Properties

            set context(val: Cogl.Context);

            // Constructors

            constructor(properties?: Partial<Renderer.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;
        }

        type RendererClass = typeof Renderer;
        type FontMap = PangoCairo.FontMap;
        /**
         * Name of the imported GIR library
         * `see` https://gitlab.gnome.org/GNOME/gjs/-/blob/master/gi/ns.cpp#L188
         */
        const __name__: string;
        /**
         * Version of the imported GIR library
         * `see` https://gitlab.gnome.org/GNOME/gjs/-/blob/master/gi/ns.cpp#L189
         */
        const __version__: string;
    }

    export default CoglPango;
}

declare module 'gi://CoglPango' {
    import CoglPango15 from 'gi://CoglPango?version=15';
    export default CoglPango15;
}
// END
