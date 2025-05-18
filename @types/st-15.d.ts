/// <reference path="./meta-15.d.ts" />
/// <reference path="./xlib-2.0.d.ts" />
/// <reference path="./xfixes-4.0.d.ts" />
/// <reference path="./mtk-15.d.ts" />
/// <reference path="./graphene-1.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />
/// <reference path="./gdesktopenums-3.0.d.ts" />
/// <reference path="./coglpango-15.d.ts" />
/// <reference path="./pangocairo-1.0.d.ts" />
/// <reference path="./cairo-1.0.d.ts" />
/// <reference path="./cairo.d.ts" />
/// <reference path="./pango-1.0.d.ts" />
/// <reference path="./harfbuzz-0.0.d.ts" />
/// <reference path="./freetype2-2.0.d.ts" />
/// <reference path="./cogl-15.d.ts" />
/// <reference path="./gl-1.0.d.ts" />
/// <reference path="./clutter-15.d.ts" />
/// <reference path="./atk-1.0.d.ts" />
/// <reference path="./gdkpixbuf-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://St?version=15' {
    // Module dependencies
    import type Meta from 'gi://Meta?version=15';
    import type xlib from 'gi://xlib?version=2.0';
    import type xfixes from 'gi://xfixes?version=4.0';
    import type Mtk from 'gi://Mtk?version=15';
    import type Graphene from 'gi://Graphene?version=1.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type Gio from 'gi://Gio?version=2.0';
    import type GModule from 'gi://GModule?version=2.0';
    import type GDesktopEnums from 'gi://GDesktopEnums?version=3.0';
    import type CoglPango from 'gi://CoglPango?version=15';
    import type PangoCairo from 'gi://PangoCairo?version=1.0';
    import type cairo from 'cairo';
    import type Pango from 'gi://Pango?version=1.0';
    import type HarfBuzz from 'gi://HarfBuzz?version=0.0';
    import type freetype2 from 'gi://freetype2?version=2.0';
    import type Cogl from 'gi://Cogl?version=15';
    import type GL from 'gi://GL?version=1.0';
    import type Clutter from 'gi://Clutter?version=15';
    import type Atk from 'gi://Atk?version=1.0';
    import type GdkPixbuf from 'gi://GdkPixbuf?version=2.0';

    export namespace St {
        /**
         * St-15
         */

        export namespace BackgroundSize {
            export const $gtype: GObject.GType<BackgroundSize>;
        }

        enum BackgroundSize {
            AUTO,
            CONTAIN,
            COVER,
            FIXED,
        }

        export namespace ClipboardType {
            export const $gtype: GObject.GType<ClipboardType>;
        }

        enum ClipboardType {
            PRIMARY,
            CLIPBOARD,
        }
        /**
         * Used to target a particular corner of a #StThemeNode element.
         */

        /**
         * Used to target a particular corner of a #StThemeNode element.
         */
        export namespace Corner {
            export const $gtype: GObject.GType<Corner>;
        }

        enum Corner {
            /**
             * The top-right corner.
             */
            TOPLEFT,
            /**
             * The top-right corner.
             */
            TOPRIGHT,
            /**
             * The bottom-right corner.
             */
            BOTTOMRIGHT,
            /**
             * The bottom-left corner.
             */
            BOTTOMLEFT,
        }
        /**
         * Enumeration for focus direction.
         */

        /**
         * Enumeration for focus direction.
         */
        export namespace DirectionType {
            export const $gtype: GObject.GType<DirectionType>;
        }

        enum DirectionType {
            /**
             * Move forward.
             */
            TAB_FORWARD,
            /**
             * Move backward.
             */
            TAB_BACKWARD,
            /**
             * Move up.
             */
            UP,
            /**
             * Move down.
             */
            DOWN,
            /**
             * Move left.
             */
            LEFT,
            /**
             * Move right.
             */
            RIGHT,
        }
        /**
         * Used to specify options when rendering gradients.
         */

        /**
         * Used to specify options when rendering gradients.
         */
        export namespace GradientType {
            export const $gtype: GObject.GType<GradientType>;
        }

        enum GradientType {
            /**
             * No gradient.
             */
            NONE,
            /**
             * A vertical gradient.
             */
            VERTICAL,
            /**
             * A horizontal gradient.
             */
            HORIZONTAL,
            /**
             * Lookup the style requested in the icon name.
             */
            RADIAL,
        }
        /**
         * Used to specify options when looking up icons.
         */

        /**
         * Used to specify options when looking up icons.
         */
        export namespace IconStyle {
            export const $gtype: GObject.GType<IconStyle>;
        }

        enum IconStyle {
            /**
             * Lookup the style requested in the icon name.
             */
            REQUESTED,
            /**
             * Try to always load regular icons, even when symbolic
             *   icon names are given.
             */
            REGULAR,
            /**
             * Try to always load symbolic icons, even when regular
             *   icon names are given.
             */
            SYMBOLIC,
        }
        /**
         * Error codes for StIconTheme operations.
         */
        class IconThemeError extends GLib.Error {
            static $gtype: GObject.GType<IconThemeError>;

            // Static fields

            /**
             * The icon specified does not exist in the theme
             */
            static NOT_FOUND: number;
            /**
             * An unspecified error occurred.
             */
            static FAILED: number;

            // Constructors

            constructor(options: { message: string; code: number });
            _init(...args: any[]): void;

            // Static methods

            static quark(): GLib.Quark;
        }

        export namespace PolicyType {
            export const $gtype: GObject.GType<PolicyType>;
        }

        enum PolicyType {
            ALWAYS,
            AUTOMATIC,
            NEVER,
            EXTERNAL,
        }
        /**
         * Used to target a particular side of a #StThemeNode element.
         */

        /**
         * Used to target a particular side of a #StThemeNode element.
         */
        export namespace Side {
            export const $gtype: GObject.GType<Side>;
        }

        enum Side {
            /**
             * The top side.
             */
            TOP,
            /**
             * The right side.
             */
            RIGHT,
            /**
             * The bottom side.
             */
            BOTTOM,
            /**
             * The left side.
             */
            LEFT,
        }

        export namespace SystemAccentColor {
            export const $gtype: GObject.GType<SystemAccentColor>;
        }

        enum SystemAccentColor {
            BLUE,
            TEAL,
            GREEN,
            YELLOW,
            ORANGE,
            RED,
            PINK,
            PURPLE,
            SLATE,
        }

        export namespace SystemColorScheme {
            export const $gtype: GObject.GType<SystemColorScheme>;
        }

        enum SystemColorScheme {
            DEFAULT,
            PREFER_DARK,
            PREFER_LIGHT,
        }
        /**
         * Used to align text in a label.
         */

        /**
         * Used to align text in a label.
         */
        export namespace TextAlign {
            export const $gtype: GObject.GType<TextAlign>;
        }

        enum TextAlign {
            /**
             * Text is aligned at the beginning of the label.
             */
            LEFT,
            /**
             * Text is aligned in the middle of the label.
             */
            CENTER,
            /**
             * Text is aligned at the end of the label.
             */
            RIGHT,
            JUSTIFY,
        }

        export namespace TextureCachePolicy {
            export const $gtype: GObject.GType<TextureCachePolicy>;
        }

        enum TextureCachePolicy {
            NONE,
            FOREVER,
        }
        /**
         * Creates a string describing `actor,` for use in debugging. This
         * includes the class name and actor name (if any), plus if `actor`
         * is an #StWidget, its style class and pseudo class names.
         * @param actor a #ClutterActor
         * @returns the debug name.
         */
        function describe_actor(actor: Clutter.Actor): string;
        function icon_theme_error_quark(): GLib.Quark;
        interface ClipboardCallbackFunc {
            (clipboard: Clipboard, text: string): void;
        }
        interface ClipboardContentCallbackFunc {
            (clipboard: Clipboard, bytes: GLib.Bytes | Uint8Array): void;
        }
        interface EntryCursorFunc {
            (entry: Entry, use_ibeam: boolean, data?: any | null): void;
        }
        /**
         * A mask representing which mouse buttons an #StButton responds to.
         */

        /**
         * A mask representing which mouse buttons an #StButton responds to.
         */
        export namespace ButtonMask {
            export const $gtype: GObject.GType<ButtonMask>;
        }

        enum ButtonMask {
            /**
             * button 1 (left)
             */
            ONE,
            /**
             * button 2 (middle)
             */
            TWO,
            /**
             * button 3 (right)
             */
            THREE,
        }
        /**
         * Used to specify options for [method`St`.IconTheme.lookup_icon]
         */

        /**
         * Used to specify options for [method`St`.IconTheme.lookup_icon]
         */
        export namespace IconLookupFlags {
            export const $gtype: GObject.GType<IconLookupFlags>;
        }

        enum IconLookupFlags {
            /**
             * Never get SVG icons, even if gdk-pixbuf
             *   supports them. Cannot be used together with %ST_ICON_LOOKUP_FORCE_SVG.
             */
            NO_SVG,
            /**
             * Get SVG icons, even if gdk-pixbuf
             *   doesn’t support them.
             *   Cannot be used together with %ST_ICON_LOOKUP_NO_SVG.
             */
            FORCE_SVG,
            /**
             * Try to shorten icon name at '-'
             *   characters before looking at inherited themes. This flag is only
             *   supported in functions that take a single icon name. For more general
             *   fallback, see st_icon_theme_choose_icon().
             */
            GENERIC_FALLBACK,
            /**
             * Always get the icon scaled to the
             *   requested size.
             */
            FORCE_SIZE,
            /**
             * Try to always load regular icons, even
             *   when symbolic icon names are given.
             */
            FORCE_REGULAR,
            /**
             * Try to always load symbolic icons, even
             *   when regular icon names are given.
             */
            FORCE_SYMBOLIC,
            /**
             * Try to load a variant of the icon for left-to-right
             *   text direction.
             */
            DIR_LTR,
            /**
             * Try to load a variant of the icon for right-to-left
             *   text direction.
             */
            DIR_RTL,
        }
        /**
         * Flags used to determine the decoration of text.
         *
         * Not that neither %ST_TEXT_DECORATION_OVERLINE or %ST_TEXT_DECORATION_BLINK
         * are implemented, currently.
         */

        /**
         * Flags used to determine the decoration of text.
         *
         * Not that neither %ST_TEXT_DECORATION_OVERLINE or %ST_TEXT_DECORATION_BLINK
         * are implemented, currently.
         */
        export namespace TextDecoration {
            export const $gtype: GObject.GType<TextDecoration>;
        }

        enum TextDecoration {
            UNDERLINE,
            /**
             * Text is overlined
             */
            OVERLINE,
            /**
             * Text is striked out
             */
            LINE_THROUGH,
            /**
             * Text blinks
             */
            BLINK,
        }
        namespace Adjustment {
            // Signal callback interfaces

            interface Changed {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps, Clutter.Animatable.ConstructorProps {
                actor: Clutter.Actor;
                lower: number;
                page_increment: number;
                pageIncrement: number;
                page_size: number;
                pageSize: number;
                step_increment: number;
                stepIncrement: number;
                upper: number;
                value: number;
            }
        }

        /**
         * An adjustable bounded value.
         *
         * The #StAdjustment object represents a range of values bounded between a
         * minimum and maximum, together with step and page increments and a page size.
         */
        class Adjustment extends GObject.Object implements Clutter.Animatable {
            static $gtype: GObject.GType<Adjustment>;

            // Properties

            /**
             * If the adjustment is used as #ClutterAnimatable for a
             * #ClutterPropertyTransition, this property is used to determine which
             * monitor should drive the animation.
             */
            get actor(): Clutter.Actor;
            set actor(val: Clutter.Actor);
            /**
             * The minimum value of the adjustment.
             */
            get lower(): number;
            set lower(val: number);
            /**
             * The page increment of the adjustment.
             */
            get page_increment(): number;
            set page_increment(val: number);
            /**
             * The page increment of the adjustment.
             */
            get pageIncrement(): number;
            set pageIncrement(val: number);
            /**
             * The page size of the adjustment.
             *
             * Note that the page-size is irrelevant and should be set to zero if the
             * adjustment is used for a simple scalar value.
             */
            get page_size(): number;
            set page_size(val: number);
            /**
             * The page size of the adjustment.
             *
             * Note that the page-size is irrelevant and should be set to zero if the
             * adjustment is used for a simple scalar value.
             */
            get pageSize(): number;
            set pageSize(val: number);
            /**
             * The step increment of the adjustment.
             */
            get step_increment(): number;
            set step_increment(val: number);
            /**
             * The step increment of the adjustment.
             */
            get stepIncrement(): number;
            set stepIncrement(val: number);
            /**
             * The maximum value of the adjustment.
             *
             * Note that values will be restricted by `upper - page-size` if
             * #StAdjustment:page-size is non-zero.
             */
            get upper(): number;
            set upper(val: number);
            /**
             * The value of the adjustment.
             */
            get value(): number;
            set value(val: number);

            // Constructors

            constructor(properties?: Partial<Adjustment.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](
                actor: Clutter.Actor | null,
                value: number,
                lower: number,
                upper: number,
                step_increment: number,
                page_increment: number,
                page_size: number,
            ): Adjustment;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'changed', callback: (_source: this) => void): number;
            connect_after(signal: 'changed', callback: (_source: this) => void): number;
            emit(signal: 'changed'): void;

            // Virtual methods

            /**
             * Class handler for the ::changed signal.
             */
            vfunc_changed(): void;

            // Methods

            /**
             * Add a #ClutterTransition for the adjustment. If the transition stops, it will
             * be automatically removed if [property`Clutter`.Transition:remove-on-complete] is %TRUE.
             * @param name a unique name for the transition
             * @param transition a #ClutterTransition
             */
            add_transition(name: string, transition: Clutter.Transition): void;
            /**
             * Adjusts the adjustment using delta values from a scroll event.
             * You should use this instead of using [method`St`.Adjustment.set_value]
             * as this method will tweak the values directly using the same
             * math as GTK+, to ensure that scrolling is consistent across
             * the environment.
             * @param delta A delta, retrieved directly from clutter_event_get_scroll_delta()   or similar.
             */
            adjust_for_scroll_event(delta: number): void;
            /**
             * Set #StAdjustment:value to a value clamped between `lower` and `upper`. The
             * clamping described by [method`St`.Adjustment.set_value] still applies.
             * @param lower the lower value
             * @param upper the upper value
             */
            clamp_page(lower: number, upper: number): void;
            /**
             * Get the #ClutterTransition for `name` previously added with
             * [method`St`.Adjustment.add_transition] or %NULL if not found.
             * @param name a transition name
             * @returns a #ClutterTransition
             */
            get_transition(name: string): Clutter.Transition | null;
            /**
             * Gets the current value of the adjustment. See st_adjustment_set_value().
             * @returns The current value of the adjustment
             */
            get_value(): number;
            /**
             * Gets all of `adjustment'`s values at once.
             */
            get_values(): [number, number, number, number, number, number];
            remove_transition(name: string): void;
            /**
             * Sets the #StAdjustment value. The value is clamped to lie between
             * #StAdjustment:lower and #StAdjustment:upper - #StAdjustment:page-size.
             * @param value the new value
             */
            set_value(value: number): void;
            /**
             * Sets all properties of the adjustment at once.
             *
             * Use this function to avoid multiple emissions of the #GObject::notify and
             * [signal`St`.Adjustment::changed] signals. See st_adjustment_set_lower() for an
             * alternative way of compressing multiple emissions of #GObject::notify and
             * [signal`St`.Adjustment::changed] into one of each.
             * @param value the new value
             * @param lower the new minimum value
             * @param upper the new maximum value
             * @param step_increment the new step increment
             * @param page_increment the new page increment
             * @param page_size the new page size
             */
            set_values(
                value: number,
                lower: number,
                upper: number,
                step_increment: number,
                page_increment: number,
                page_size: number,
            ): void;

            // Inherited methods
            /**
             * Finds the [class`GObject`.ParamSpec] for `property_name`
             * @param property_name the name of the animatable property to find
             * @returns The #GParamSpec for the given property   or %NULL
             */
            find_property(property_name: string): GObject.ParamSpec;
            /**
             * Get animated actor.
             * @returns a #ClutterActor
             */
            get_actor(): Clutter.Actor;
            /**
             * Retrieves the current state of `property_name` and sets `value` with it
             * @param property_name the name of the animatable property to retrieve
             * @param value a #GValue initialized to the type of the property to retrieve
             */
            get_initial_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Asks a #ClutterAnimatable implementation to interpolate a
             * a named property between the initial and final values of
             * a #ClutterInterval, using `progress` as the interpolation
             * value, and store the result inside `value`.
             *
             * This function should be used for every property animation
             * involving `ClutterAnimatable`s.
             * @param property_name the name of the property to interpolate
             * @param interval a #ClutterInterval with the animation range
             * @param progress the progress to use to interpolate between the   initial and final values of the @interval
             * @returns %TRUE if the interpolation was successful,   and %FALSE otherwise
             */
            interpolate_value(property_name: string, interval: Clutter.Interval, progress: number): [boolean, unknown];
            /**
             * Sets the current state of `property_name` to `value`
             * @param property_name the name of the animatable property to set
             * @param value the value of the animatable property to set
             */
            set_final_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Finds the [class`GObject`.ParamSpec] for `property_name`
             * @param property_name the name of the animatable property to find
             */
            vfunc_find_property(property_name: string): GObject.ParamSpec;
            /**
             * Get animated actor.
             */
            vfunc_get_actor(): Clutter.Actor;
            /**
             * Retrieves the current state of `property_name` and sets `value` with it
             * @param property_name the name of the animatable property to retrieve
             * @param value a #GValue initialized to the type of the property to retrieve
             */
            vfunc_get_initial_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Asks a #ClutterAnimatable implementation to interpolate a
             * a named property between the initial and final values of
             * a #ClutterInterval, using `progress` as the interpolation
             * value, and store the result inside `value`.
             *
             * This function should be used for every property animation
             * involving `ClutterAnimatable`s.
             * @param property_name the name of the property to interpolate
             * @param interval a #ClutterInterval with the animation range
             * @param progress the progress to use to interpolate between the   initial and final values of the @interval
             */
            vfunc_interpolate_value(
                property_name: string,
                interval: Clutter.Interval,
                progress: number,
            ): [boolean, unknown];
            /**
             * Sets the current state of `property_name` to `value`
             * @param property_name the name of the animatable property to set
             * @param value the value of the animatable property to set
             */
            vfunc_set_final_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Bin {
            // Constructor properties interface

            interface ConstructorProps<A extends Clutter.Actor = Clutter.Actor>
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                child: A;
            }
        }

        /**
         * A simple container with one actor.
         *
         * #StBin is a simple container capable of having only one
         * #ClutterActor as a child.
         */
        class Bin<A extends Clutter.Actor = Clutter.Actor>
            extends Widget
            implements Atk.ImplementorIface, Clutter.Animatable
        {
            static $gtype: GObject.GType<Bin>;

            // Properties

            /**
             * The child #ClutterActor of the #StBin container.
             */
            get child(): A;
            set child(val: A);

            // Constructors

            constructor(properties?: Partial<Bin.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): Bin;

            // Methods

            /**
             * Gets the #ClutterActor child for `bin`.
             * @returns a #ClutterActor, or %NULL
             */
            get_child(): A | null;
            /**
             * Sets `child` as the child of `bin`.
             *
             * If `bin` already has a child, the previous child is removed.
             * @param child a #ClutterActor, or %NULL
             */
            set_child(child?: A | null): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace BorderImage {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class BorderImage extends GObject.Object {
            static $gtype: GObject.GType<BorderImage>;

            // Constructors

            constructor(properties?: Partial<BorderImage.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](
                file: Gio.File,
                border_top: number,
                border_right: number,
                border_bottom: number,
                border_left: number,
                scale_factor: number,
            ): BorderImage;

            // Methods

            /**
             * Check if two #StBorderImage objects are identical.
             * @param other a different #StBorderImage
             * @returns %TRUE if the two border image objects are identical
             */
            equal(other: BorderImage): boolean;
            get_borders(border_top: number, border_right: number, border_bottom: number, border_left: number): void;
            /**
             * Get the #GFile for `image`.
             * @returns a #GFile
             */
            get_file(): Gio.File;
        }

        namespace BoxLayout {
            // Constructor properties interface

            interface ConstructorProps
                extends Viewport.ConstructorProps<Clutter.BoxLayout>,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps,
                    Scrollable.ConstructorProps {
                pack_start: boolean;
                packStart: boolean;
                vertical: boolean;
            }
        }

        /**
         * Layout container arranging children in a single line.
         *
         * The #StBoxLayout arranges its children along a single line, where each
         * child can be allocated either its preferred size or larger if the expand
         * option is set. If the fill option is set, the actor will be allocated more
         * than its requested size. If the fill option is not set, but the expand option
         * is enabled, then the position of the actor within the available space can
         * be determined by the alignment child property.
         */
        class BoxLayout
            extends Viewport<Clutter.BoxLayout>
            implements Atk.ImplementorIface, Clutter.Animatable, Scrollable
        {
            static $gtype: GObject.GType<BoxLayout>;

            // Properties

            /**
             * A convenience property for the #ClutterBoxLayout:pack-start property of the
             * internal layout for #StBoxLayout.
             */
            get pack_start(): boolean;
            set pack_start(val: boolean);
            /**
             * A convenience property for the #ClutterBoxLayout:pack-start property of the
             * internal layout for #StBoxLayout.
             */
            get packStart(): boolean;
            set packStart(val: boolean);
            /**
             * A convenience property for the #ClutterBoxLayout:vertical property of the
             * internal layout for #StBoxLayout.
             */
            get vertical(): boolean;
            set vertical(val: boolean);

            // Constructors

            constructor(properties?: Partial<BoxLayout.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): BoxLayout;

            // Methods

            get_pack_start(): boolean;
            /**
             * Get the value of the #StBoxLayout:vertical property.
             * @returns %TRUE if the layout is vertical
             */
            get_vertical(): boolean;
            set_pack_start(pack_start: boolean): void;
            /**
             * Set the value of the #StBoxLayout:vertical property
             * @param vertical %TRUE if the layout should be vertical
             */
            set_vertical(vertical: boolean): void;

            // Inherited properties
            /**
             * The horizontal #StAdjustment used by the #StScrollable.
             *
             * Implementations should override this property to provide read-write
             * access to the #StAdjustment.
             *
             * JavaScript code may override this as demonstrated below:
             *
             * ```js
             * export const MyScrollable = GObject.registerClass({
             *     Properties: {
             *         'hadjustment': GObject.ParamSpec.override(
             *             'hadjustment',
             *             St.Scrollable
             *         )
             *     }
             * }, class MyScrollable extends St.Scrollable {
             *
             *     get hadjustment() {
             *         return this._hadjustment || null;
             *     }
             *
             *     set hadjustment(adjustment) {
             *         if (this.hadjustment === adjustment)
             *             return;
             *
             *         this._hadjustment = adjustment;
             *         this.notify('hadjustment');
             *     }
             * });
             * ```
             */
            get hadjustment(): Adjustment;
            set hadjustment(val: Adjustment);
            /**
             * The vertical #StAdjustment used by the #StScrollable.
             *
             * Implementations should override this property to provide read-write
             * access to the #StAdjustment.
             *
             * See #StScrollable:hadjustment for an example of how to override this
             * property in JavaScript code.
             */
            get vadjustment(): Adjustment;
            set vadjustment(val: Adjustment);

            // Inherited methods
            get_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * This method should be implemented by classes implementing the #StScrollable
             * interface.
             *
             * JavaScript code should do this by overriding the `vfunc_set_adjustments()`
             * method.
             * @param hadjustment the horizontal #StAdjustment
             * @param vadjustment the vertical #StAdjustment
             */
            set_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            vfunc_get_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * This method should be implemented by classes implementing the #StScrollable
             * interface.
             *
             * JavaScript code should do this by overriding the `vfunc_set_adjustments()`
             * method.
             * @param hadjustment the horizontal #StAdjustment
             * @param vadjustment the vertical #StAdjustment
             */
            vfunc_set_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Button {
            // Signal callback interfaces

            interface Clicked {
                (clicked_button: number): void;
            }

            // Constructor properties interface

            interface ConstructorProps<A extends Clutter.Actor = Clutter.Actor>
                extends Bin.ConstructorProps<A>,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                button_mask: ButtonMask;
                buttonMask: ButtonMask;
                checked: boolean;
                icon_name: string;
                iconName: string;
                label: string;
                pressed: boolean;
                toggle_mode: boolean;
                toggleMode: boolean;
            }
        }

        /**
         * Button widget
         *
         * A button widget with support for either a text label or icon, toggle mode
         * and transitions effects between states.
         */
        class Button<A extends Clutter.Actor = Clutter.Actor>
            extends Bin<A>
            implements Atk.ImplementorIface, Clutter.Animatable
        {
            static $gtype: GObject.GType<Button>;

            // Properties

            /**
             * Which buttons will trigger the #StButton::clicked signal.
             */
            get button_mask(): ButtonMask;
            set button_mask(val: ButtonMask);
            /**
             * Which buttons will trigger the #StButton::clicked signal.
             */
            get buttonMask(): ButtonMask;
            set buttonMask(val: ButtonMask);
            /**
             * If #StButton:toggle-mode is %TRUE, indicates if the #StButton is toggled
             * "on" or "off".
             *
             * When the value is %TRUE, the #StButton will have the `checked` CSS
             * pseudo-class set.
             */
            get checked(): boolean;
            set checked(val: boolean);
            /**
             * The icon name of the #StButton.
             */
            get icon_name(): string;
            set icon_name(val: string);
            /**
             * The icon name of the #StButton.
             */
            get iconName(): string;
            set iconName(val: string);
            /**
             * The label of the #StButton.
             */
            get label(): string;
            set label(val: string);
            /**
             * In contrast to #StButton:checked, this property indicates whether the
             * #StButton is being actively pressed, rather than just in the "on" state.
             */
            get pressed(): boolean;
            /**
             * Whether the #StButton is operating in toggle mode (on/off).
             */
            get toggle_mode(): boolean;
            set toggle_mode(val: boolean);
            /**
             * Whether the #StButton is operating in toggle mode (on/off).
             */
            get toggleMode(): boolean;
            set toggleMode(val: boolean);

            // Constructors

            constructor(properties?: Partial<Button.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): Button;

            static new_with_label(text: string): Button;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'clicked', callback: (_source: this, clicked_button: number) => void): number;
            connect_after(signal: 'clicked', callback: (_source: this, clicked_button: number) => void): number;
            emit(signal: 'clicked', clicked_button: number): void;

            // Virtual methods

            vfunc_clicked(clicked_button: number): void;
            vfunc_transition(): void;

            // Methods

            /**
             * If this widget is holding a pointer grab, this function will
             * will ungrab it, and reset the #StButton:pressed state.  The effect is
             * similar to if the user had released the mouse button, but without
             * emitting the #StButton::clicked signal.
             *
             * This function is useful if for example you want to do something
             * after the user is holding the mouse button for a given period of
             * time, breaking the grab.
             */
            fake_release(): void;
            /**
             * Gets the mask of mouse buttons that `button` emits the
             * #StButton::clicked signal for.
             * @returns the mask of mouse buttons that @button emits the #StButton::clicked signal for.
             */
            get_button_mask(): ButtonMask;
            /**
             * Get the #StButton:checked property of a #StButton that is in toggle mode.
             * @returns %TRUE if the button is checked, or %FALSE if not
             */
            get_checked(): boolean;
            /**
             * Get the icon name of the button. If the button isn't showing an icon,
             * the return value will be %NULL.
             * @returns the icon name of the button
             */
            get_icon_name(): string | null;
            /**
             * Get the text displayed on the button. If the label is empty, an empty string
             * will be returned instead of %NULL.
             * @returns the text for the button
             */
            get_label(): string;
            /**
             * Get the toggle mode status of the button.
             * @returns %TRUE if toggle mode is set, otherwise %FALSE
             */
            get_toggle_mode(): boolean;
            /**
             * Sets which mouse buttons `button` emits #StButton::clicked for.
             * @param mask the mask of mouse buttons that @button responds to
             */
            set_button_mask(mask: ButtonMask | null): void;
            /**
             * Set the #StButton:checked property of the button. This is only really useful
             * if the button has #StButton:toggle-mode property set to %TRUE.
             * @param checked %TRUE or %FALSE
             */
            set_checked(checked: boolean): void;
            /**
             * Adds an `StIcon` with the given icon name as a child.
             *
             * If `button` already contains a child actor, that child will
             * be removed and replaced with the icon.
             * @param icon_name an icon name
             */
            set_icon_name(icon_name: string): void;
            /**
             * Sets the text displayed on the button.
             * @param text text to set the label to
             */
            set_label(text?: string | null): void;
            /**
             * Enables or disables toggle mode for the button. In toggle mode, the checked
             * state will be "toggled" when the user clicks the button.
             * @param toggle %TRUE or %FALSE
             */
            set_toggle_mode(toggle: boolean): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Clipboard {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * A simple representation of the clipboard
         *
         * #StCliboard is a very simple object representation of the clipboard
         * available to applications. Text is always assumed to be UTF-8 and non-text
         * items are not handled.
         */
        class Clipboard extends GObject.Object {
            static $gtype: GObject.GType<Clipboard>;

            // Constructors

            constructor(properties?: Partial<Clipboard.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Static methods

            /**
             * Get the global #StClipboard object that represents the clipboard.
             */
            static get_default(): Clipboard;

            // Methods

            /**
             * Request the data from the clipboard in #GBytes form. `callback` is executed
             * when the data is retrieved.
             * @param type The type of clipboard data you want
             * @param mimetype The mimetype to get content for
             * @param callback function to be called when the type is retrieved
             */
            get_content(type: ClipboardType | null, mimetype: string, callback: ClipboardContentCallbackFunc): void;
            /**
             * Gets a list of the mimetypes supported by the default #StClipboard.
             * @param type
             * @returns the supported mimetypes
             */
            get_mimetypes(type: ClipboardType | null): string[];
            /**
             * Request the data from the clipboard in text form. `callback` is executed
             * when the data is retrieved.
             * @param type The type of clipboard data you want
             * @param callback function to be called when the text is retrieved
             */
            get_text(type: ClipboardType | null, callback: ClipboardCallbackFunc): void;
            /**
             * Sets the clipboard content to `bytes`.
             *
             * `mimetype` is a semi-colon separated list of mime-type strings.
             * @param type The type of clipboard that you want to set
             * @param mimetype content mimetype
             * @param bytes content data
             */
            set_content(type: ClipboardType | null, mimetype: string, bytes: GLib.Bytes | Uint8Array): void;
            /**
             * Sets text as the current contents of the clipboard.
             * @param type The type of clipboard that you want to set
             * @param text text to copy to the clipboard
             */
            set_text(type: ClipboardType | null, text: string): void;
        }

        namespace DrawingArea {
            // Signal callback interfaces

            interface Repaint {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {}
        }

        /**
         * A dynamically-sized Cairo drawing area
         *
         * #StDrawingArea allows drawing via Cairo; the primary difference is that
         * it is dynamically sized. To use, connect to the [signal`St`.DrawingArea::repaint]
         * signal, and inside the signal handler, call
         * [method`St`.DrawingArea.get_context] to get the Cairo context to draw to.  The
         * [signal`St`.DrawingArea::repaint] signal will be emitted by default when the area is
         * resized or the CSS style changes; you can use the
         * [method`St`.DrawingArea.queue_repaint] as well.
         */
        class DrawingArea extends Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<DrawingArea>;

            // Constructors

            constructor(properties?: Partial<DrawingArea.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'repaint', callback: (_source: this) => void): number;
            connect_after(signal: 'repaint', callback: (_source: this) => void): number;
            emit(signal: 'repaint'): void;

            // Virtual methods

            vfunc_repaint(): void;

            // Methods

            /**
             * Gets the Cairo context to paint to. This function must only be called
             * from a signal handler or virtual function for the [signal`St`.DrawingArea::repaint]
             * signal.
             *
             * JavaScript code must call the special dispose function before returning from
             * the signal handler or virtual function to avoid leaking memory:
             *
             * ```js
             * function onRepaint(area) {
             *     let cr = area.get_context();
             *
             *     // Draw to the context
             *
             *     cr.$dispose();
             * }
             *
             * let area = new St.DrawingArea();
             * area.connect('repaint', onRepaint);
             * ```
             * @returns the Cairo context for the paint operation
             */
            get_context(): cairo.Context;
            // Conflicted with Clutter.Actor.get_context
            get_context(...args: never[]): any;
            /**
             * Gets the size of the cairo surface being painted to, which is equal
             * to the size of the content area of the widget. This function must
             * only be called from a signal handler for the #StDrawingArea::repaint signal.
             */
            get_surface_size(): [number, number];
            /**
             * Will cause the actor to emit a [signal`St`.DrawingArea::repaint] signal before it is
             * next drawn to the scene. Useful if some parameters for the area being
             * drawn other than the size or style have changed. Note that
             * clutter_actor_queue_redraw() will simply result in the same
             * contents being drawn to the scene again.
             */
            queue_repaint(): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Entry {
            // Signal callback interfaces

            interface PrimaryIconClicked {
                (): void;
            }

            interface SecondaryIconClicked {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                clutter_text: Clutter.Text;
                clutterText: Clutter.Text;
                hint_actor: Clutter.Actor;
                hintActor: Clutter.Actor;
                hint_text: string;
                hintText: string;
                input_hints: Clutter.InputContentHintFlags;
                inputHints: Clutter.InputContentHintFlags;
                input_purpose: Clutter.InputContentPurpose;
                inputPurpose: Clutter.InputContentPurpose;
                primary_icon: Clutter.Actor;
                primaryIcon: Clutter.Actor;
                secondary_icon: Clutter.Actor;
                secondaryIcon: Clutter.Actor;
                text: string;
            }
        }

        /**
         * Widget for displaying text
         *
         * #StEntry is a simple widget for displaying text. It derives from
         * #StWidget to add extra style and placement functionality over
         * #ClutterText. The internal #ClutterText is publicly accessibly to allow
         * applications to set further properties.
         *
         * #StEntry supports the following pseudo style states:
         *
         * - `focus`: the widget has focus
         * - `indeterminate`: the widget is showing the hint text or actor
         */
        class Entry extends Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<Entry>;

            // Properties

            /**
             * The internal #ClutterText actor supporting the #StEntry.
             */
            get clutter_text(): Clutter.Text;
            /**
             * The internal #ClutterText actor supporting the #StEntry.
             */
            get clutterText(): Clutter.Text;
            /**
             * A #ClutterActor to display when the entry is empty and unfocused. Setting
             * this will replace the actor displaying #StEntry:hint-text.
             */
            get hint_actor(): Clutter.Actor;
            set hint_actor(val: Clutter.Actor);
            /**
             * A #ClutterActor to display when the entry is empty and unfocused. Setting
             * this will replace the actor displaying #StEntry:hint-text.
             */
            get hintActor(): Clutter.Actor;
            set hintActor(val: Clutter.Actor);
            /**
             * The text to display when the entry is empty and unfocused. Setting this
             * will replace the actor of #StEntry::hint-actor.
             */
            get hint_text(): string;
            set hint_text(val: string);
            /**
             * The text to display when the entry is empty and unfocused. Setting this
             * will replace the actor of #StEntry::hint-actor.
             */
            get hintText(): string;
            set hintText(val: string);
            /**
             * The #ClutterInputContentHintFlags providing additional hints (beyond
             * #StEntry:input-purpose) that allow input methods to fine-tune their
             * behaviour.
             */
            get input_hints(): Clutter.InputContentHintFlags;
            set input_hints(val: Clutter.InputContentHintFlags);
            /**
             * The #ClutterInputContentHintFlags providing additional hints (beyond
             * #StEntry:input-purpose) that allow input methods to fine-tune their
             * behaviour.
             */
            get inputHints(): Clutter.InputContentHintFlags;
            set inputHints(val: Clutter.InputContentHintFlags);
            /**
             * The #ClutterInputContentPurpose that helps on-screen keyboards and similar
             * input methods to decide which keys should be presented to the user.
             */
            get input_purpose(): Clutter.InputContentPurpose;
            set input_purpose(val: Clutter.InputContentPurpose);
            /**
             * The #ClutterInputContentPurpose that helps on-screen keyboards and similar
             * input methods to decide which keys should be presented to the user.
             */
            get inputPurpose(): Clutter.InputContentPurpose;
            set inputPurpose(val: Clutter.InputContentPurpose);
            /**
             * The #ClutterActor acting as the primary icon at the start of the #StEntry.
             */
            get primary_icon(): Clutter.Actor;
            set primary_icon(val: Clutter.Actor);
            /**
             * The #ClutterActor acting as the primary icon at the start of the #StEntry.
             */
            get primaryIcon(): Clutter.Actor;
            set primaryIcon(val: Clutter.Actor);
            /**
             * The #ClutterActor acting as the secondary icon at the end of the #StEntry.
             */
            get secondary_icon(): Clutter.Actor;
            set secondary_icon(val: Clutter.Actor);
            /**
             * The #ClutterActor acting as the secondary icon at the end of the #StEntry.
             */
            get secondaryIcon(): Clutter.Actor;
            set secondaryIcon(val: Clutter.Actor);
            /**
             * The current text value of the #StEntry.
             */
            get text(): string;
            set text(val: string);

            // Constructors

            constructor(properties?: Partial<Entry.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](text?: string | null): Entry;
            // Conflicted with Clutter.Actor.new

            static ['new'](...args: never[]): any;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'primary-icon-clicked', callback: (_source: this) => void): number;
            connect_after(signal: 'primary-icon-clicked', callback: (_source: this) => void): number;
            emit(signal: 'primary-icon-clicked'): void;
            connect(signal: 'secondary-icon-clicked', callback: (_source: this) => void): number;
            connect_after(signal: 'secondary-icon-clicked', callback: (_source: this) => void): number;
            emit(signal: 'secondary-icon-clicked'): void;

            // Virtual methods

            vfunc_primary_icon_clicked(): void;
            vfunc_secondary_icon_clicked(): void;

            // Methods

            /**
             * Retrieve the internal #ClutterText so that extra parameters can be set.
             * @returns the #ClutterText used by @entry
             */
            get_clutter_text(): Clutter.Actor;
            /**
             * Get the value of the #StEntry:hint-actor property.
             * @returns a #ClutterActor
             */
            get_hint_actor(): Clutter.Actor | null;
            /**
             * Gets the text that is displayed when the entry is empty and unfocused or
             * %NULL if the #StEntry:hint-actor was set to an actor that is not a #StLabel.
             *
             * Unlike st_entry_get_text() this function may return %NULL if
             * #StEntry:hint-actor is not a #StLabel.
             * @returns the current value of the hint property
             */
            get_hint_text(): string | null;
            /**
             * Gets the value of the #StEntry:input-hints property.
             * @returns the input hints for the entry
             */
            get_input_hints(): Clutter.InputContentHintFlags;
            /**
             * Gets the value of the #StEntry:input-purpose property.
             * @returns the input purpose of the entry
             */
            get_input_purpose(): Clutter.InputContentPurpose;
            /**
             * Get the value of the #StEntry:primary-icon property.
             * @returns a #ClutterActor
             */
            get_primary_icon(): Clutter.Actor | null;
            /**
             * Get the value of the #StEntry:secondary-icon property.
             * @returns a #ClutterActor
             */
            get_secondary_icon(): Clutter.Actor | null;
            /**
             * Get the text displayed on the entry. If `entry` is empty, an empty string will
             * be returned instead of %NULL.
             * @returns the text for the entry
             */
            get_text(): string;
            /**
             * Set the hint actor of the entry to `hint_actor`.
             * @param hint_actor a #ClutterActor
             */
            set_hint_actor(hint_actor?: Clutter.Actor | null): void;
            /**
             * Sets the text to display when the entry is empty and unfocused. When the
             * entry is displaying the hint, it has a pseudo class of `indeterminate`.
             * A value of %NULL unsets the hint.
             * @param text text to set as the entry hint
             */
            set_hint_text(text?: string | null): void;
            /**
             * Sets the #StEntry:input-hints property, which
             * allows input methods to fine-tune their behaviour.
             * @param hints the hints
             */
            set_input_hints(hints: Clutter.InputContentHintFlags | null): void;
            /**
             * Sets the #StEntry:input-purpose property which
             * can be used by on-screen keyboards and other input
             * methods to adjust their behaviour.
             * @param purpose the purpose
             */
            set_input_purpose(purpose: Clutter.InputContentPurpose | null): void;
            /**
             * Set the primary icon of the entry to `icon`.
             * @param icon a #ClutterActor
             */
            set_primary_icon(icon?: Clutter.Actor | null): void;
            /**
             * Set the secondary icon of the entry to `icon`.
             * @param icon an #ClutterActor
             */
            set_secondary_icon(icon?: Clutter.Actor | null): void;
            /**
             * Sets the text displayed on the entry. If `text` is %NULL, the #ClutterText
             * will instead be set to an empty string.
             * @param text text to set the entry to
             */
            set_text(text?: string | null): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace FocusManager {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * Keyboard focus management
         *
         * #StFocusManager handles keyboard focus for all actors on the stage.
         */
        class FocusManager extends GObject.Object {
            static $gtype: GObject.GType<FocusManager>;

            // Constructors

            constructor(properties?: Partial<FocusManager.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Static methods

            /**
             * Gets the #StFocusManager for `stage,` creating it if necessary.
             * @param stage a #ClutterStage
             */
            static get_for_stage(stage: Clutter.Stage): FocusManager;

            // Methods

            /**
             * Adds a new focus group to `manager`. When the focus is in an actor
             * that is a descendant of `root,` `manager` will handle moving focus
             * from one actor to another within `root` based on keyboard events.
             * @param root the root container of the group
             */
            add_group(root: Widget): void;
            /**
             * Checks if `widget` is inside a focus group, and if so, returns
             * the root of that group.
             * @param widget an #StWidget
             * @returns the focus group root, or %NULL if @widget is not in a focus group
             */
            get_group(widget: Widget): Widget;
            /**
             * Try to navigate from `event` as if it bubbled all the way up to
             * the stage. This is useful in complex event handling situations
             * where you want key navigation, but a parent might be stopping
             * the key navigation event from bubbling all the way up to the stage.
             * @param event a #ClutterEvent
             * @returns Whether a new actor was navigated to
             */
            navigate_from_event(event: Clutter.Event): boolean;
            /**
             * Removes the group rooted at `root` from `manager`
             * @param root the root container of the group
             */
            remove_group(root: Widget): void;
        }

        namespace GenericAccessible {
            // Signal callback interfaces

            interface GetCurrentValue {
                (): number;
            }

            interface GetMaximumValue {
                (): number;
            }

            interface GetMinimumIncrement {
                (): number;
            }

            interface GetMinimumValue {
                (): number;
            }

            interface SetCurrentValue {
                (new_value: number): void;
            }

            // Constructor properties interface

            interface ConstructorProps
                extends WidgetAccessible.ConstructorProps,
                    Atk.Component.ConstructorProps,
                    Atk.Value.ConstructorProps {}
        }

        /**
         * An accessible class with signals for implementing specific Atk interfaces
         *
         * #StGenericAccessible is mainly a workaround for the current lack of
         * of a proper support for GValue at javascript. See bug#703412 for
         * more information. We implement the accessible interfaces, but proxy
         * the virtual functions into signals, which gjs can catch.
         *
         * #StGenericAccessible is an #StWidgetAccessible
         */
        class GenericAccessible extends WidgetAccessible implements Atk.Component, Atk.Value {
            static $gtype: GObject.GType<GenericAccessible>;

            // Constructors

            constructor(properties?: Partial<GenericAccessible.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static new_for_actor(actor: Clutter.Actor): GenericAccessible;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'get-current-value', callback: (_source: this) => number): number;
            connect_after(signal: 'get-current-value', callback: (_source: this) => number): number;
            emit(signal: 'get-current-value'): void;
            connect(signal: 'get-maximum-value', callback: (_source: this) => number): number;
            connect_after(signal: 'get-maximum-value', callback: (_source: this) => number): number;
            emit(signal: 'get-maximum-value'): void;
            connect(signal: 'get-minimum-increment', callback: (_source: this) => number): number;
            connect_after(signal: 'get-minimum-increment', callback: (_source: this) => number): number;
            emit(signal: 'get-minimum-increment'): void;
            connect(signal: 'get-minimum-value', callback: (_source: this) => number): number;
            connect_after(signal: 'get-minimum-value', callback: (_source: this) => number): number;
            emit(signal: 'get-minimum-value'): void;
            connect(signal: 'set-current-value', callback: (_source: this, new_value: number) => void): number;
            connect_after(signal: 'set-current-value', callback: (_source: this, new_value: number) => void): number;
            emit(signal: 'set-current-value', new_value: number): void;

            // Inherited methods
            /**
             * Gets the value of this object.
             */
            get_current_value(): unknown;
            /**
             * Gets the minimum increment by which the value of this object may be
             * changed.  If zero, the minimum increment is undefined, which may
             * mean that it is limited only by the floating point precision of the
             * platform.
             * @returns the minimum increment by which the value of this object may be changed. zero if undefined.
             */
            get_increment(): number;
            /**
             * Gets the maximum value of this object.
             */
            get_maximum_value(): unknown;
            /**
             * Gets the minimum increment by which the value of this object may be changed.  If zero,
             * the minimum increment is undefined, which may mean that it is limited only by the
             * floating point precision of the platform.
             */
            get_minimum_increment(): unknown;
            /**
             * Gets the minimum value of this object.
             */
            get_minimum_value(): unknown;
            /**
             * Gets the range of this object.
             * @returns a newly allocated #AtkRange that represents the minimum, maximum and descriptor (if available) of @obj. NULL if that range is not defined.
             */
            get_range(): Atk.Range | null;
            /**
             * Gets the list of subranges defined for this object. See #AtkValue
             * introduction for examples of subranges and when to expose them.
             * @returns an #GSList of #AtkRange which each of the subranges defined for this object. Free the returns list with g_slist_free().
             */
            get_sub_ranges(): Atk.Range[];
            /**
             * Gets the current value and the human readable text alternative of
             * `obj`. `text` is a newly created string, that must be freed by the
             * caller. Can be NULL if no descriptor is available.
             */
            get_value_and_text(): [number, string];
            /**
             * Sets the value of this object.
             * @param value a #GValue which is the desired new accessible value.
             * @returns %TRUE if new value is successfully set, %FALSE otherwise.
             */
            set_current_value(value: GObject.Value | any): boolean;
            /**
             * Sets the value of this object.
             *
             * This method is intended to provide a way to change the value of the
             * object. In any case, it is possible that the value can't be
             * modified (ie: a read-only component). If the value changes due this
             * call, it is possible that the text could change, and will trigger
             * an #AtkValue::value-changed signal emission.
             *
             * Note for implementors: the deprecated atk_value_set_current_value()
             * method returned TRUE or FALSE depending if the value was assigned
             * or not. In the practice several implementors were not able to
             * decide it, and returned TRUE in any case. For that reason it is not
             * required anymore to return if the value was properly assigned or
             * not.
             * @param new_value a double which is the desired new accessible value.
             */
            set_value(new_value: number): void;
            /**
             * Gets the value of this object.
             */
            vfunc_get_current_value(): unknown;
            /**
             * Gets the minimum increment by which the value of this object may be
             * changed.  If zero, the minimum increment is undefined, which may
             * mean that it is limited only by the floating point precision of the
             * platform.
             */
            vfunc_get_increment(): number;
            /**
             * Gets the maximum value of this object.
             */
            vfunc_get_maximum_value(): unknown;
            /**
             * Gets the minimum increment by which the value of this object may be changed.  If zero,
             * the minimum increment is undefined, which may mean that it is limited only by the
             * floating point precision of the platform.
             */
            vfunc_get_minimum_increment(): unknown;
            /**
             * Gets the minimum value of this object.
             */
            vfunc_get_minimum_value(): unknown;
            /**
             * Gets the range of this object.
             */
            vfunc_get_range(): Atk.Range | null;
            /**
             * Gets the list of subranges defined for this object. See #AtkValue
             * introduction for examples of subranges and when to expose them.
             */
            vfunc_get_sub_ranges(): Atk.Range[];
            /**
             * Gets the current value and the human readable text alternative of
             * `obj`. `text` is a newly created string, that must be freed by the
             * caller. Can be NULL if no descriptor is available.
             */
            vfunc_get_value_and_text(): [number, string];
            /**
             * Sets the value of this object.
             * @param value a #GValue which is the desired new accessible value.
             */
            vfunc_set_current_value(value: GObject.Value | any): boolean;
            /**
             * Sets the value of this object.
             *
             * This method is intended to provide a way to change the value of the
             * object. In any case, it is possible that the value can't be
             * modified (ie: a read-only component). If the value changes due this
             * call, it is possible that the text could change, and will trigger
             * an #AtkValue::value-changed signal emission.
             *
             * Note for implementors: the deprecated atk_value_set_current_value()
             * method returned TRUE or FALSE depending if the value was assigned
             * or not. In the practice several implementors were not able to
             * decide it, and returned TRUE in any case. For that reason it is not
             * required anymore to return if the value was properly assigned or
             * not.
             * @param new_value a double which is the desired new accessible value.
             */
            vfunc_set_value(new_value: number): void;
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Icon {
            // Constructor properties interface

            interface ConstructorProps
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                fallback_gicon: Gio.Icon;
                fallbackGicon: Gio.Icon;
                fallback_icon_name: string;
                fallbackIconName: string;
                gicon: Gio.Icon;
                icon_name: string;
                iconName: string;
                icon_size: number;
                iconSize: number;
                is_symbolic: boolean;
                isSymbolic: boolean;
            }
        }

        /**
         * A simple styled icon actor
         *
         * #StIcon is a simple styled texture actor that displays an image from
         * a stylesheet.
         */
        class Icon extends Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<Icon>;

            // Properties

            /**
             * The fallback #GIcon to display if #StIcon:gicon fails to load.
             */
            get fallback_gicon(): Gio.Icon;
            set fallback_gicon(val: Gio.Icon);
            /**
             * The fallback #GIcon to display if #StIcon:gicon fails to load.
             */
            get fallbackGicon(): Gio.Icon;
            set fallbackGicon(val: Gio.Icon);
            /**
             * The fallback icon name of the #StIcon. See st_icon_set_fallback_icon_name()
             * for details.
             */
            get fallback_icon_name(): string;
            set fallback_icon_name(val: string);
            /**
             * The fallback icon name of the #StIcon. See st_icon_set_fallback_icon_name()
             * for details.
             */
            get fallbackIconName(): string;
            set fallbackIconName(val: string);
            /**
             * The #GIcon being displayed by this #StIcon.
             */
            get gicon(): Gio.Icon;
            set gicon(val: Gio.Icon);
            /**
             * The name of the icon if the icon being displayed is a #GThemedIcon.
             */
            get icon_name(): string;
            set icon_name(val: string);
            /**
             * The name of the icon if the icon being displayed is a #GThemedIcon.
             */
            get iconName(): string;
            set iconName(val: string);
            /**
             * The size of the icon, if greater than `0`. Otherwise the icon size is derived
             * from the current style.
             */
            get icon_size(): number;
            set icon_size(val: number);
            /**
             * The size of the icon, if greater than `0`. Otherwise the icon size is derived
             * from the current style.
             */
            get iconSize(): number;
            set iconSize(val: number);
            get is_symbolic(): boolean;
            get isSymbolic(): boolean;

            // Constructors

            constructor(properties?: Partial<Icon.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): Icon;

            // Methods

            /**
             * Gets the currently set fallback #GIcon.
             * @returns The fallback #GIcon, if set, otherwise %NULL
             */
            get_fallback_gicon(): Gio.Icon;
            /**
             * This is a convenience method to get the icon name of the fallback
             * #GThemedIcon that is currently set.
             * @returns The name of the icon or %NULL if no icon is set
             */
            get_fallback_icon_name(): string;
            /**
             * Gets the current #GIcon in use.
             * @returns The current #GIcon, if set, otherwise %NULL
             */
            get_gicon(): Gio.Icon | null;
            /**
             * This is a convenience method to get the icon name of the current icon, if it
             * is currently a #GThemedIcon, or %NULL otherwise.
             * @returns The name of the icon or %NULL
             */
            get_icon_name(): string | null;
            /**
             * Gets the explicit size set using st_icon_set_icon_size() for the icon.
             * This is not necessarily the size that the icon will be displayed at.
             * @returns The explicitly set size, or -1 if no size has been set
             */
            get_icon_size(): number;
            get_is_symbolic(): boolean;
            /**
             * Sets a fallback #GIcon to show if the normal icon fails to load.
             * If `fallback_gicon` is %NULL or fails to load, the icon is unset and no
             * texture will be visible for the fallback icon.
             * @param fallback_gicon the fallback #GIcon
             */
            set_fallback_gicon(fallback_gicon?: Gio.Icon | null): void;
            /**
             * This is a convenience method to set the fallback #GIcon to a #GThemedIcon
             * created using the given icon name. If `fallback_icon_name` is an empty
             * string, %NULL or fails to load, the icon is unset and no texture will
             * be visible for the fallback icon.
             * @param fallback_icon_name the name of the fallback icon
             */
            set_fallback_icon_name(fallback_icon_name?: string | null): void;
            /**
             * Sets a #GIcon to show for the icon. If `gicon` is %NULL or fails to load,
             * the fallback icon set using st_icon_set_fallback_icon() will be shown.
             * @param gicon a #GIcon
             */
            set_gicon(gicon?: Gio.Icon | null): void;
            /**
             * This is a convenience method to set the #GIcon to a #GThemedIcon created
             * using the given icon name. If `icon_name` is an empty string, %NULL or
             * fails to load, the fallback icon will be shown.
             * @param icon_name the name of the icon
             */
            set_icon_name(icon_name?: string | null): void;
            /**
             * Sets an explicit size for the icon. Setting `size` to -1 will use the size
             * defined by the current style or the default icon size.
             * @param size if positive, the new size, otherwise the size will be   derived from the current style
             */
            set_icon_size(size: number): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace IconInfo {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class IconInfo extends GObject.Object {
            static $gtype: GObject.GType<IconInfo>;

            // Constructors

            constructor(properties?: Partial<IconInfo.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static new_for_pixbuf(icon_theme: IconTheme, pixbuf: GdkPixbuf.Pixbuf): IconInfo;

            // Methods

            /**
             * Gets the base scale for the icon.
             *
             * The base scale is a scale for the icon that was specified by
             * the icon theme creator. For instance an icon drawn for a
             * high-dpi screen with window scale 2 for a base size of 32 will be
             * 64 pixels tall and have a base scale of 2.
             * @returns the base scale
             */
            get_base_scale(): number;
            /**
             * Gets the base size for the icon.
             *
             * The base size is a size for the icon that was specified by
             * the icon theme creator. This may be different
             * than the actual size of image; an example of
             * this is small emblem icons that can be attached
             * to a larger icon. These icons will be given
             * the same base size as the larger icons to which
             * they are attached.
             *
             * Note that for scaled icons the base size does
             * not include the base scale.
             * @returns the base size, or 0, if no base     size is known for the icon.
             */
            get_base_size(): number;
            /**
             * Gets the filename for the icon.
             * @returns the filename for the icon.     The return value is owned by GTK+ and should not be modified     or freed.
             */
            get_filename(): string | null;
            /**
             * Checks if the icon is symbolic or not.
             *
             * This currently uses only the file name and not
             * the file contents for determining this.
             * This behaviour may change in the future.
             * @returns %TRUE if the icon is symbolic, %FALSE otherwise
             */
            is_symbolic(): boolean;
            /**
             * Renders an icon previously looked up in an icon theme using
             * [method`St`.IconTheme.lookup_icon]; the size will be based on the size
             * passed to [method`St`.IconTheme.lookup_icon]. Note that the resulting
             * pixbuf may not be exactly this size; an icon theme may have icons
             * that differ slightly from their nominal sizes, and in addition GTK+
             * will avoid scaling icons that it considers sufficiently close to the
             * requested size or for which the source image would have to be scaled
             * up too far. (This maintains sharpness.). This behaviour can be changed
             * by passing the %ST_ICON_LOOKUP_FORCE_SIZE flag when obtaining
             * the #StIconInfo. If this flag has been specified, the pixbuf
             * returned by this function will be scaled to the exact size.
             * @returns the rendered icon; this may be a newly     created icon or a new reference to an internal icon, so you must     not modify the icon. Use g_object_unref() to release your reference     to the icon.
             */
            load_icon(): GdkPixbuf.Pixbuf;
            /**
             * Asynchronously load, render and scale an icon previously looked up
             * from the icon theme using [method`St`.IconTheme.lookup_icon].
             *
             * For more details, see [method`St`.IconInfo.load_icon] which is the synchronous
             * version of this call.
             * @param cancellable optional #GCancellable object, %NULL to ignore
             */
            load_icon_async(cancellable?: Gio.Cancellable | null): Promise<GdkPixbuf.Pixbuf>;
            /**
             * Asynchronously load, render and scale an icon previously looked up
             * from the icon theme using [method`St`.IconTheme.lookup_icon].
             *
             * For more details, see [method`St`.IconInfo.load_icon] which is the synchronous
             * version of this call.
             * @param cancellable optional #GCancellable object, %NULL to ignore
             * @param callback a #GAsyncReadyCallback to call when the     request is satisfied
             */
            load_icon_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void;
            /**
             * Asynchronously load, render and scale an icon previously looked up
             * from the icon theme using [method`St`.IconTheme.lookup_icon].
             *
             * For more details, see [method`St`.IconInfo.load_icon] which is the synchronous
             * version of this call.
             * @param cancellable optional #GCancellable object, %NULL to ignore
             * @param callback a #GAsyncReadyCallback to call when the     request is satisfied
             */
            load_icon_async(
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<GdkPixbuf.Pixbuf> | void;
            /**
             * Finishes an async icon load, see st_icon_info_load_icon_async().
             * @param res a #GAsyncResult
             * @returns the rendered icon; this may be a newly     created icon or a new reference to an internal icon, so you must     not modify the icon. Use g_object_unref() to release your reference     to the icon.
             */
            load_icon_finish(res: Gio.AsyncResult): GdkPixbuf.Pixbuf;
            /**
             * Loads an icon, modifying it to match the system colours for the foreground,
             * success, warning and error colors provided. If the icon is not a symbolic
             * one, the function will return the result from [method`St`.IconInfo.load_icon].
             *
             * This allows loading symbolic icons that will match the system theme.
             *
             * Unless you are implementing a widget, you will want to use
             * g_themed_icon_new_with_default_fallbacks() to load the icon.
             *
             * As implementation details, the icon loaded needs to be of SVG type,
             * contain the “symbolic” term as the last component of the icon name,
             * and use the “fg”, “success”, “warning” and “error” CSS styles in the
             * SVG file itself.
             *
             * See the [Symbolic Icons Specification](http://www.freedesktop.org/wiki/SymbolicIcons)
             * for more information about symbolic icons.
             * @param colors a #StIconColors representing the foreground, warning and error colors
             * @returns a #GdkPixbuf representing the loaded icon
             */
            load_symbolic(colors: IconColors): [GdkPixbuf.Pixbuf, boolean];
            /**
             * Asynchronously load, render and scale a symbolic icon previously looked up
             * from the icon theme using [method`St`.IconTheme.lookup_icon].
             *
             * For more details, see st_icon_info_load_symbolic() which is the synchronous
             * version of this call.
             * @param colors an #StIconColors representing the foreground, error and     success colors of the icon
             * @param cancellable optional #GCancellable object,     %NULL to ignore
             */
            load_symbolic_async(
                colors: IconColors,
                cancellable?: Gio.Cancellable | null,
            ): Promise<[GdkPixbuf.Pixbuf, boolean]>;
            /**
             * Asynchronously load, render and scale a symbolic icon previously looked up
             * from the icon theme using [method`St`.IconTheme.lookup_icon].
             *
             * For more details, see st_icon_info_load_symbolic() which is the synchronous
             * version of this call.
             * @param colors an #StIconColors representing the foreground, error and     success colors of the icon
             * @param cancellable optional #GCancellable object,     %NULL to ignore
             * @param callback a #GAsyncReadyCallback to call when the     request is satisfied
             */
            load_symbolic_async(
                colors: IconColors,
                cancellable: Gio.Cancellable | null,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Asynchronously load, render and scale a symbolic icon previously looked up
             * from the icon theme using [method`St`.IconTheme.lookup_icon].
             *
             * For more details, see st_icon_info_load_symbolic() which is the synchronous
             * version of this call.
             * @param colors an #StIconColors representing the foreground, error and     success colors of the icon
             * @param cancellable optional #GCancellable object,     %NULL to ignore
             * @param callback a #GAsyncReadyCallback to call when the     request is satisfied
             */
            load_symbolic_async(
                colors: IconColors,
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<[GdkPixbuf.Pixbuf, boolean]> | void;
            /**
             * Finishes an async icon load, see st_icon_info_load_symbolic_async().
             * @param res a #GAsyncResult
             * @returns the rendered icon; this may be a newly     created icon or a new reference to an internal icon, so you must     not modify the icon. Use g_object_unref() to release your reference     to the icon.
             */
            load_symbolic_finish(res: Gio.AsyncResult): [GdkPixbuf.Pixbuf, boolean];
        }

        namespace IconTheme {
            // Signal callback interfaces

            interface Changed {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * Looking up icons by name
         *
         * #StIconTheme provides a facility for looking up icons by name
         * and size. The main reason for using a name rather than simply
         * providing a filename is to allow different icons to be used
         * depending on what “icon theme” is selected
         * by the user. The operation of icon themes on Linux and Unix
         * follows the [Icon Theme Specification](http://www.freedesktop.org/Standards/icon-theme-spec)
         * There is a fallback icon theme, named `hicolor`, where applications
         * should install their icons, but additional icon themes can be installed
         * as operating system vendors and users choose.
         *
         * In many cases, named themes are used indirectly, via #StIcon,
         * rather than directly, but looking up icons directly is also simple.
         * The #StIconTheme object acts as a database of all the icons in the
         * current theme.
         */
        class IconTheme extends GObject.Object {
            static $gtype: GObject.GType<IconTheme>;

            // Constructors

            constructor(properties?: Partial<IconTheme.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): IconTheme;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'changed', callback: (_source: this) => void): number;
            connect_after(signal: 'changed', callback: (_source: this) => void): number;
            emit(signal: 'changed'): void;

            // Methods

            /**
             * Adds a resource path that will be looked at when looking
             * for icons, similar to search paths.
             *
             * This function should be used to make application-specific icons
             * available as part of the icon theme.
             *
             * The resources are considered as part of the hicolor icon theme
             * and must be located in subdirectories that are defined in the
             * hicolor icon theme, such as ``path/`16x16/actions/run.png`.
             * Icons that are directly placed in the resource path instead
             * of a subdirectory are also considered as ultimate fallback.
             * @param path a resource path
             */
            add_resource_path(path: string): void;
            /**
             * Appends a directory to the search path.
             * See st_icon_theme_set_search_path().
             * @param path directory name to append to the icon path
             */
            append_search_path(path: string): void;
            /**
             * Looks up a named icon and returns a #StIconInfo containing
             * information such as the filename of the icon. The icon
             * can then be rendered into a pixbuf using
             * [method`St`.IconInfo.load_icon]. ([method`St`.IconTheme.load_icon]
             * combines these two steps if all you need is the pixbuf.)
             *
             * If `icon_names` contains more than one name, this function
             * tries them all in the given order before falling back to
             * inherited icon themes.
             * @param icon_names %NULL-terminated array of     icon names to lookup
             * @param size desired icon size
             * @param flags flags modifying the behavior of the icon lookup
             * @returns a #StIconInfo object containing information about the icon
             */
            choose_icon(icon_names: string[], size: number, flags: IconLookupFlags | null): IconInfo | null;
            /**
             * Looks up a named icon for a particular window scale and returns
             * a #StIconInfo containing information such as the filename of the
             * icon. The icon can then be rendered into a pixbuf using
             * [method`St`.IconInfo.load_icon]. ([method`St`.IconTheme.load_icon]
             * combines these two steps if all you need is the pixbuf.)
             *
             * If `icon_names` contains more than one name, this function
             * tries them all in the given order before falling back to
             * inherited icon themes.
             * @param icon_names %NULL-terminated     array of icon names to lookup
             * @param size desired icon size
             * @param scale desired scale
             * @param flags flags modifying the behavior of the icon lookup
             * @returns a #StIconInfo object     containing information about the icon.
             */
            choose_icon_for_scale(
                icon_names: string[],
                size: number,
                scale: number,
                flags: IconLookupFlags | null,
            ): IconInfo | null;
            /**
             * Returns an array of integers describing the sizes at which
             * the icon is available without scaling. A size of -1 means
             * that the icon is available in a scalable format. The array
             * is zero-terminated.
             * @param icon_name the name of an icon
             * @returns An newly allocated array describing the sizes at which the icon is available. The array should be freed with g_free() when it is no longer needed.
             */
            get_icon_sizes(icon_name: string): number[];
            /**
             * Gets the current search path. See st_icon_theme_set_search_path().
             */
            get_search_path(): string[] | null;
            /**
             * Checks whether an icon theme includes an icon
             * for a particular name.
             * @param icon_name the name of an icon
             * @returns %TRUE if @icon_theme includes an  icon for @icon_name.
             */
            has_icon(icon_name: string): boolean;
            /**
             * Gets the list of contexts available within the current
             * hierarchy of icon themes.
             * See st_icon_theme_list_icons() for details about contexts.
             * @returns a #GList list     holding the names of all the contexts in the theme. You must first     free each element in the list with g_free(), then free the list     itself with g_list_free().
             */
            list_contexts(): string[];
            /**
             * Lists the icons in the current icon theme. Only a subset
             * of the icons can be listed by providing a context string.
             * The set of values for the context string is system dependent,
             * but will typically include such values as “Applications” and
             * “MimeTypes”. Contexts are explained in the
             * [Icon Theme Specification](http://www.freedesktop.org/wiki/Specifications/icon-theme-spec).
             * The standard contexts are listed in the
             * [Icon Naming Specification](http://www.freedesktop.org/wiki/Specifications/icon-naming-spec).
             * Also see st_icon_theme_list_contexts().
             * @param context a string identifying a particular type of           icon, or %NULL to list all icons.
             * @returns a #GList list     holding the names of all the icons in the theme. You must     first free each element in the list with g_free(), then     free the list itself with g_list_free().
             */
            list_icons(context?: string | null): string[];
            /**
             * Looks up an icon in an icon theme, scales it to the given size
             * and renders it into a pixbuf. This is a convenience function;
             * if more details about the icon are needed, use
             * [method`St`.IconTheme.lookup_icon] followed by [method`St`.IconInfo.load_icon].
             *
             * Note that you probably want to listen for icon theme changes and
             * update the icon. This is usually done by connecting to the
             * GtkWidget::style-set signal. If for some reason you do not want to
             * update the icon when the icon theme changes, you should consider
             * using gdk_pixbuf_copy() to make a private copy of the pixbuf
             * returned by this function. Otherwise GTK+ may need to keep the old
             * icon theme loaded, which would be a waste of memory.
             * @param icon_name the name of the icon to lookup
             * @param size the desired icon size. The resulting icon may not be     exactly this size.
             * @param flags flags modifying the behavior of the icon lookup
             * @returns the rendered icon; this may be     a newly created icon or a new reference to an internal icon, so     you must not modify the icon.
             */
            load_icon(icon_name: string, size: number, flags: IconLookupFlags | null): GdkPixbuf.Pixbuf | null;
            /**
             * Looks up an icon in an icon theme for a particular window scale,
             * scales it to the given size and renders it into a pixbuf. This is a
             * convenience function; if more details about the icon are needed,
             * use [method`St`.IconTheme.lookup_icon] followed by
             * [method`St`.IconInfo.load_icon].
             *
             * Note that you probably want to listen for icon theme changes and
             * update the icon. This is usually done by connecting to the
             * GtkWidget::style-set signal. If for some reason you do not want to
             * update the icon when the icon theme changes, you should consider
             * using gdk_pixbuf_copy() to make a private copy of the pixbuf
             * returned by this function. Otherwise GTK+ may need to keep the old
             * icon theme loaded, which would be a waste of memory.
             * @param icon_name the name of the icon to lookup
             * @param size the desired icon size. The resulting icon may not be     exactly this size.
             * @param scale desired scale
             * @param flags flags modifying the behavior of the icon lookup
             * @returns the rendered icon; this may be     a newly created icon or a new reference to an internal icon, so     you must not modify the icon.
             */
            load_icon_for_scale(
                icon_name: string,
                size: number,
                scale: number,
                flags: IconLookupFlags | null,
            ): GdkPixbuf.Pixbuf | null;
            /**
             * Looks up an icon and returns a #StIconInfo containing information
             * such as the filename of the icon. The icon can then be rendered
             * into a pixbuf using [method`St`.IconInfo.load_icon].
             *
             * When rendering on displays with high pixel densities you should not
             * use a `size` multiplied by the scaling factor returned by functions
             * like gdk_window_get_scale_factor(). Instead, you should use
             * [method`St`.IconTheme.lookup_by_gicon_for_scale], as the assets loaded
             * for a given scaling factor may be different.
             * @param icon the #GIcon to look up
             * @param size desired icon size
             * @param flags flags modifying the behavior of the icon lookup
             * @returns a #StIconInfo containing     information about the icon.
             */
            lookup_by_gicon(icon: Gio.Icon, size: number, flags: IconLookupFlags | null): IconInfo | null;
            /**
             * Looks up an icon and returns a #StIconInfo containing information
             * such as the filename of the icon. The icon can then be rendered into
             * a pixbuf using [method`St`.IconInfo.load_icon].
             * @param icon the #GIcon to look up
             * @param size desired icon size
             * @param scale the desired scale
             * @param flags flags modifying the behavior of the icon lookup
             * @returns a #StIconInfo containing     information about the icon.
             */
            lookup_by_gicon_for_scale(
                icon: Gio.Icon,
                size: number,
                scale: number,
                flags: IconLookupFlags | null,
            ): IconInfo | null;
            /**
             * Looks up a named icon and returns a #StIconInfo containing
             * information such as the filename of the icon. The icon
             * can then be rendered into a pixbuf using
             * [method`St`.IconInfo.load_icon]. ([method`St`.IconTheme.load_icon]
             * combines these two steps if all you need is the pixbuf.)
             *
             * When rendering on displays with high pixel densities you should not
             * use a `size` multiplied by the scaling factor returned by functions
             * like gdk_window_get_scale_factor(). Instead, you should use
             * [method`St`.IconTheme.lookup_by_gicon_for_scale], as the assets loaded
             * for a given scaling factor may be different.
             * @param icon_name the name of the icon to lookup
             * @param size desired icon size
             * @param flags flags modifying the behavior of the icon lookup
             * @returns a #StIconInfo object     containing information about the icon.
             */
            lookup_icon(icon_name: string, size: number, flags: IconLookupFlags | null): IconInfo | null;
            /**
             * Looks up a named icon for a particular window scale and returns a
             * #StIconInfo containing information such as the filename of the
             * icon. The icon can then be rendered into a pixbuf using
             * [method`St`.IconInfo.load_icon]. ([method`St`.IconTheme.load_icon] combines
             * these two steps if all you need is the pixbuf.)
             * @param icon_name the name of the icon to lookup
             * @param size desired icon size
             * @param scale the desired scale
             * @param flags flags modifying the behavior of the icon lookup
             * @returns a #StIconInfo object     containing information about the icon.
             */
            lookup_icon_for_scale(
                icon_name: string,
                size: number,
                scale: number,
                flags: IconLookupFlags | null,
            ): IconInfo | null;
            /**
             * Prepends a directory to the search path.
             * See st_icon_theme_set_search_path().
             * @param path directory name to prepend to the icon path
             */
            prepend_search_path(path: string): void;
            /**
             * Checks to see if the icon theme has changed; if it has, any
             * currently cached information is discarded and will be reloaded
             * next time `icon_theme` is accessed.
             * @returns %TRUE if the icon theme has changed and needed     to be reloaded.
             */
            rescan_if_needed(): boolean;
            /**
             * Sets the search path for the icon theme object. When looking
             * for an icon theme, GTK+ will search for a subdirectory of
             * one or more of the directories in `path` with the same name
             * as the icon theme containing an index.theme file. (Themes from
             * multiple of the path elements are combined to allow themes to be
             * extended by adding icons in the user’s home directory.)
             *
             * In addition if an icon found isn’t found either in the current
             * icon theme or the default icon theme, and an image file with
             * the right name is found directly in one of the elements of
             * `path,` then that image will be used for the icon name.
             * (This is legacy feature, and new icons should be put
             * into the fallback icon theme, which is called hicolor,
             * rather than directly on the icon path.)
             * @param path array of     directories that are searched for icon themes
             */
            set_search_path(path: string[]): void;
        }

        namespace ImageContent {
            // Constructor properties interface

            interface ConstructorProps
                extends Clutter.Image.ConstructorProps,
                    Clutter.Content.ConstructorProps,
                    Gio.Icon.ConstructorProps,
                    Gio.LoadableIcon.ConstructorProps {
                preferred_height: number;
                preferredHeight: number;
                preferred_width: number;
                preferredWidth: number;
            }
        }

        class ImageContent extends Clutter.Image implements Clutter.Content, Gio.Icon, Gio.LoadableIcon {
            static $gtype: GObject.GType<ImageContent>;

            // Properties

            get preferred_height(): number;
            get preferredHeight(): number;
            get preferred_width(): number;
            get preferredWidth(): number;

            // Constructors

            constructor(properties?: Partial<ImageContent.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Static methods

            /**
             * Creates a new #StImageContent, a simple content for sized images.
             *
             * See #ClutterImage for setting the actual image to display or #StIcon for
             * displaying icons.
             * @param width The preferred width to be used when drawing the content
             * @param height The preferred width to be used when drawing the content
             */
            static new_with_preferred_size(width: number, height: number): Clutter.Content;

            // Inherited methods
            /**
             * Retrieves the natural size of the `content,` if any.
             *
             * The natural size of a #ClutterContent is defined as the size the content
             * would have regardless of the allocation of the actor that is painting it,
             * for instance the size of an image data.
             * @returns %TRUE if the content has a preferred size, and %FALSE   otherwise
             */
            get_preferred_size(): [boolean, number, number];
            /**
             * Invalidates a #ClutterContent.
             *
             * This function should be called by #ClutterContent implementations when
             * they change the way a the content should be painted regardless of the
             * actor state.
             */
            invalidate(): void;
            /**
             * Signals that `content'`s size changed. Attached actors with request mode
             * set to %CLUTTER_REQUEST_CONTENT_SIZE will have a relayout queued.
             *
             * Attached actors with other request modes are not redrawn. To redraw them
             * too, use [method`Clutter`.Content.invalidate].
             */
            invalidate_size(): void;
            /**
             * virtual function; called each time a #ClutterContent is attached
             *   to a #ClutterActor.
             * @param actor
             */
            vfunc_attached(actor: Clutter.Actor): void;
            /**
             * virtual function; called each time a #ClutterContent is detached
             *   from a #ClutterActor.
             * @param actor
             */
            vfunc_detached(actor: Clutter.Actor): void;
            /**
             * Retrieves the natural size of the `content,` if any.
             *
             * The natural size of a #ClutterContent is defined as the size the content
             * would have regardless of the allocation of the actor that is painting it,
             * for instance the size of an image data.
             */
            vfunc_get_preferred_size(): [boolean, number, number];
            /**
             * Invalidates a #ClutterContent.
             *
             * This function should be called by #ClutterContent implementations when
             * they change the way a the content should be painted regardless of the
             * actor state.
             */
            vfunc_invalidate(): void;
            /**
             * Signals that `content'`s size changed. Attached actors with request mode
             * set to %CLUTTER_REQUEST_CONTENT_SIZE will have a relayout queued.
             *
             * Attached actors with other request modes are not redrawn. To redraw them
             * too, use [method`Clutter`.Content.invalidate].
             */
            vfunc_invalidate_size(): void;
            /**
             * virtual function; called each time the content needs to
             *   paint itself
             * @param actor
             * @param node
             * @param paint_context
             */
            vfunc_paint_content(
                actor: Clutter.Actor,
                node: Clutter.PaintNode,
                paint_context: Clutter.PaintContext,
            ): void;
            /**
             * Checks if two icons are equal.
             * @param icon2 pointer to the second #GIcon.
             * @returns %TRUE if @icon1 is equal to @icon2. %FALSE otherwise.
             */
            equal(icon2?: Gio.Icon | null): boolean;
            /**
             * Gets a hash for an icon.
             * @returns a #guint containing a hash for the @icon, suitable for   use in a #GHashTable or similar data structure.
             */
            hash(): number;
            /**
             * Serializes a #GIcon into a #GVariant. An equivalent #GIcon can be retrieved
             * back by calling g_icon_deserialize() on the returned value.
             * As serialization will avoid using raw icon data when possible, it only
             * makes sense to transfer the #GVariant between processes on the same machine,
             * (as opposed to over the network), and within the same file system namespace.
             * @returns a #GVariant, or %NULL when serialization fails. The #GVariant will not be floating.
             */
            serialize(): GLib.Variant | null;
            /**
             * Generates a textual representation of `icon` that can be used for
             * serialization such as when passing `icon` to a different process or
             * saving it to persistent storage. Use g_icon_new_for_string() to
             * get `icon` back from the returned string.
             *
             * The encoding of the returned string is proprietary to #GIcon except
             * in the following two cases
             *
             * - If `icon` is a #GFileIcon, the returned string is a native path
             *   (such as `/path/to/my icon.png`) without escaping
             *   if the #GFile for `icon` is a native file.  If the file is not
             *   native, the returned string is the result of g_file_get_uri()
             *   (such as `sftp://path/to/my%20icon.png`).
             *
             * - If `icon` is a #GThemedIcon with exactly one name and no fallbacks,
             *   the encoding is simply the name (such as `network-server`).
             * @returns An allocated NUL-terminated UTF8 string or %NULL if @icon can't be serialized. Use g_free() to free.
             */
            to_string(): string | null;
            /**
             * Checks if two icons are equal.
             * @param icon2 pointer to the second #GIcon.
             */
            vfunc_equal(icon2?: Gio.Icon | null): boolean;
            /**
             * Gets a hash for an icon.
             */
            vfunc_hash(): number;
            /**
             * Serializes a #GIcon into a #GVariant. An equivalent #GIcon can be retrieved
             * back by calling g_icon_deserialize() on the returned value.
             * As serialization will avoid using raw icon data when possible, it only
             * makes sense to transfer the #GVariant between processes on the same machine,
             * (as opposed to over the network), and within the same file system namespace.
             */
            vfunc_serialize(): GLib.Variant | null;
            /**
             * Serializes the `icon` into string tokens.
             * This is can be invoked when g_icon_new_for_string() is called.
             */
            vfunc_to_tokens(): [boolean, string[], number];
            /**
             * Loads a loadable icon. For the asynchronous version of this function,
             * see g_loadable_icon_load_async().
             * @param size an integer.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @returns a #GInputStream to read the icon from.
             */
            load(size: number, cancellable?: Gio.Cancellable | null): [Gio.InputStream, string];
            /**
             * Loads an icon asynchronously. To finish this function, see
             * g_loadable_icon_load_finish(). For the synchronous, blocking
             * version of this function, see g_loadable_icon_load().
             * @param size an integer.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             */
            load_async(size: number, cancellable?: Gio.Cancellable | null): Promise<[Gio.InputStream, string]>;
            /**
             * Loads an icon asynchronously. To finish this function, see
             * g_loadable_icon_load_finish(). For the synchronous, blocking
             * version of this function, see g_loadable_icon_load().
             * @param size an integer.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @param callback a #GAsyncReadyCallback   to call when the request is satisfied
             */
            load_async(
                size: number,
                cancellable: Gio.Cancellable | null,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Loads an icon asynchronously. To finish this function, see
             * g_loadable_icon_load_finish(). For the synchronous, blocking
             * version of this function, see g_loadable_icon_load().
             * @param size an integer.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @param callback a #GAsyncReadyCallback   to call when the request is satisfied
             */
            load_async(
                size: number,
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<[Gio.InputStream, string]> | void;
            /**
             * Finishes an asynchronous icon load started in g_loadable_icon_load_async().
             * @param res a #GAsyncResult.
             * @returns a #GInputStream to read the icon from.
             */
            load_finish(res: Gio.AsyncResult): [Gio.InputStream, string];
            /**
             * Loads a loadable icon. For the asynchronous version of this function,
             * see g_loadable_icon_load_async().
             * @param size an integer.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             */
            vfunc_load(size: number, cancellable?: Gio.Cancellable | null): [Gio.InputStream, string];
            /**
             * Loads an icon asynchronously. To finish this function, see
             * g_loadable_icon_load_finish(). For the synchronous, blocking
             * version of this function, see g_loadable_icon_load().
             * @param size an integer.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @param callback a #GAsyncReadyCallback   to call when the request is satisfied
             */
            vfunc_load_async(
                size: number,
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Finishes an asynchronous icon load started in g_loadable_icon_load_async().
             * @param res a #GAsyncResult.
             */
            vfunc_load_finish(res: Gio.AsyncResult): [Gio.InputStream, string];
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            // Conflicted with Clutter.Image.set_data
            set_data(...args: never[]): any;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Label {
            // Constructor properties interface

            interface ConstructorProps
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                clutter_text: Clutter.Text;
                clutterText: Clutter.Text;
                text: string;
            }
        }

        /**
         * Widget for displaying text
         *
         * #StLabel is a simple widget for displaying text. It derives from
         * #StWidget to add extra style and placement functionality over
         * #ClutterText. The internal #ClutterText is publicly accessibly to allow
         * applications to set further properties.
         */
        class Label extends Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<Label>;

            // Properties

            /**
             * The internal #ClutterText actor supporting the label
             */
            get clutter_text(): Clutter.Text;
            /**
             * The internal #ClutterText actor supporting the label
             */
            get clutterText(): Clutter.Text;
            /**
             * The current text being display in the #StLabel.
             */
            get text(): string;
            set text(val: string);

            // Constructors

            constructor(properties?: Partial<Label.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](text?: string | null): Label;
            // Conflicted with Clutter.Actor.new

            static ['new'](...args: never[]): any;

            // Methods

            /**
             * Retrieve the internal #ClutterText used by `label` so that extra parameters
             * can be set.
             * @returns the #ClutterText used by #StLabel. The actor is owned by the #StLabel and should not be destroyed by the application.
             */
            get_clutter_text(): Clutter.Actor;
            /**
             * Get the text displayed on the label.
             * @returns the text for the label. This must not be freed by the application
             */
            get_text(): string;
            /**
             * Sets the text displayed by the label.
             * @param text text to set the label to
             */
            set_text(text?: string | null): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace PasswordEntry {
            // Constructor properties interface

            interface ConstructorProps
                extends Entry.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                password_visible: boolean;
                passwordVisible: boolean;
                show_peek_icon: boolean;
                showPeekIcon: boolean;
            }
        }

        class PasswordEntry extends Entry implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<PasswordEntry>;

            // Properties

            /**
             * Whether the text in the entry is masked for privacy.
             */
            get password_visible(): boolean;
            set password_visible(val: boolean);
            /**
             * Whether the text in the entry is masked for privacy.
             */
            get passwordVisible(): boolean;
            set passwordVisible(val: boolean);
            /**
             * Whether to display an icon button to toggle the masking enabled by the
             * #StPasswordEntry:password-visible property.
             */
            get show_peek_icon(): boolean;
            set show_peek_icon(val: boolean);
            /**
             * Whether to display an icon button to toggle the masking enabled by the
             * #StPasswordEntry:password-visible property.
             */
            get showPeekIcon(): boolean;
            set showPeekIcon(val: boolean);

            // Constructors

            constructor(properties?: Partial<PasswordEntry.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): PasswordEntry;

            // Methods

            /**
             * Gets whether the text is masked in the password entry.
             * @returns %TRUE if visible
             */
            get_password_visible(): boolean;
            /**
             * Gets whether peek-icon is shown or hidden in the password entry.
             * @returns %TRUE if visible
             */
            get_show_peek_icon(): boolean;
            /**
             * Sets whether to show or hide text in the password entry.
             * @param value %TRUE to show the password in the entry, #FALSE otherwise
             */
            set_password_visible(value: boolean): void;
            /**
             * Sets whether to show or hide the peek-icon in the password entry. If %TRUE,
             * a icon button for temporarily unmasking the password will be shown at the
             * end of the entry.
             * @param value %TRUE to show the peek-icon in the entry
             */
            set_show_peek_icon(value: boolean): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace ScrollBar {
            // Signal callback interfaces

            interface ScrollStart {
                (): void;
            }

            interface ScrollStop {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                adjustment: Adjustment;
                vertical: boolean;
            }
        }

        /**
         * A user interface element to control scrollable areas.
         *
         * The #StScrollBar allows users to scroll scrollable actors, either by
         * the step or page amount, or by manually dragging the handle.
         */
        class ScrollBar extends Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<ScrollBar>;

            // Properties

            /**
             * The #StAdjustment controlling the #StScrollBar.
             */
            get adjustment(): Adjustment;
            set adjustment(val: Adjustment);
            /**
             * Whether the #StScrollBar is vertical. If %FALSE it is horizontal.
             */
            get vertical(): boolean;
            set vertical(val: boolean);

            // Constructors

            constructor(properties?: Partial<ScrollBar.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](adjustment: Adjustment): ScrollBar;
            // Conflicted with Clutter.Actor.new

            static ['new'](...args: never[]): any;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'scroll-start', callback: (_source: this) => void): number;
            connect_after(signal: 'scroll-start', callback: (_source: this) => void): number;
            emit(signal: 'scroll-start'): void;
            connect(signal: 'scroll-stop', callback: (_source: this) => void): number;
            connect_after(signal: 'scroll-stop', callback: (_source: this) => void): number;
            emit(signal: 'scroll-stop'): void;

            // Virtual methods

            vfunc_scroll_start(): void;
            vfunc_scroll_stop(): void;

            // Methods

            /**
             * Gets the #StAdjustment that controls the current position of `bar`.
             * @returns an #StAdjustment
             */
            get_adjustment(): Adjustment;
            set_adjustment(adjustment: Adjustment): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace ScrollView {
            // Constructor properties interface

            interface ConstructorProps<A extends Clutter.Actor = Clutter.Actor>
                extends Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                child: Scrollable;
                enable_mouse_scrolling: boolean;
                enableMouseScrolling: boolean;
                hadjustment: Adjustment;
                hscroll: ScrollBar;
                hscrollbar_policy: PolicyType;
                hscrollbarPolicy: PolicyType;
                hscrollbar_visible: boolean;
                hscrollbarVisible: boolean;
                overlay_scrollbars: boolean;
                overlayScrollbars: boolean;
                vadjustment: Adjustment;
                vscroll: ScrollBar;
                vscrollbar_policy: PolicyType;
                vscrollbarPolicy: PolicyType;
                vscrollbar_visible: boolean;
                vscrollbarVisible: boolean;
            }
        }

        /**
         * Container for scrollable children
         *
         * #StScrollView is a single child container for actors that implement
         * #StScrollable. It provides scrollbars around the edge of the child to
         * allow the user to move around the scrollable area.
         */
        class ScrollView<A extends Clutter.Actor = Clutter.Actor>
            extends Widget
            implements Atk.ImplementorIface, Clutter.Animatable
        {
            static $gtype: GObject.GType<ScrollView>;

            // Properties

            /**
             * The child #StScrollable of the #StScrollView container.
             */
            get child(): Scrollable;
            set child(val: Scrollable);
            /**
             * Whether to enable automatic mouse wheel scrolling.
             */
            get enable_mouse_scrolling(): boolean;
            set enable_mouse_scrolling(val: boolean);
            /**
             * Whether to enable automatic mouse wheel scrolling.
             */
            get enableMouseScrolling(): boolean;
            set enableMouseScrolling(val: boolean);
            /**
             * The horizontal #StAdjustment for the #StScrollView.
             */
            get hadjustment(): Adjustment;
            /**
             * The horizontal #StScrollBar for the #StScrollView.
             */
            get hscroll(): ScrollBar;
            /**
             * The #StPolicyType for when to show the horizontal #StScrollBar.
             */
            get hscrollbar_policy(): PolicyType;
            set hscrollbar_policy(val: PolicyType);
            /**
             * The #StPolicyType for when to show the horizontal #StScrollBar.
             */
            get hscrollbarPolicy(): PolicyType;
            set hscrollbarPolicy(val: PolicyType);
            /**
             * Whether the horizontal #StScrollBar is visible.
             */
            get hscrollbar_visible(): boolean;
            /**
             * Whether the horizontal #StScrollBar is visible.
             */
            get hscrollbarVisible(): boolean;
            /**
             * Whether scrollbars are painted on top of the content.
             */
            get overlay_scrollbars(): boolean;
            set overlay_scrollbars(val: boolean);
            /**
             * Whether scrollbars are painted on top of the content.
             */
            get overlayScrollbars(): boolean;
            set overlayScrollbars(val: boolean);
            /**
             * The vertical #StAdjustment for the #StScrollView.
             */
            get vadjustment(): Adjustment;
            /**
             * The vertical #StScrollBar for the #StScrollView.
             */
            get vscroll(): ScrollBar;
            /**
             * The #StPolicyType for when to show the vertical #StScrollBar.
             */
            get vscrollbar_policy(): PolicyType;
            set vscrollbar_policy(val: PolicyType);
            /**
             * The #StPolicyType for when to show the vertical #StScrollBar.
             */
            get vscrollbarPolicy(): PolicyType;
            set vscrollbarPolicy(val: PolicyType);
            /**
             * Whether the vertical #StScrollBar is visible.
             */
            get vscrollbar_visible(): boolean;
            /**
             * Whether the vertical #StScrollBar is visible.
             */
            get vscrollbarVisible(): boolean;

            // Constructors

            constructor(properties?: Partial<ScrollView.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): ScrollView;

            // Methods

            /**
             * Gets the #StScrollable content of `scroll`.
             * @returns a #StScrollable, or %NULL
             */
            get_child(): Scrollable | null;
            /**
             * Get the step increment of the horizontal plane.
             * @returns the horizontal step increment
             */
            get_column_size(): number;
            /**
             * Gets the horizontal #StAdjustment of the #StScrollView.
             * @returns the horizontal adjustment
             */
            get_hadjustment(): Adjustment;
            /**
             * Gets the horizontal #StScrollBar of the #StScrollView.
             * @returns the horizontal scrollbar
             */
            get_hscroll_bar(): ScrollBar;
            /**
             * Get whether automatic mouse wheel scrolling is enabled or disabled.
             * @returns %TRUE if enabled, %FALSE otherwise
             */
            get_mouse_scrolling(): boolean;
            /**
             * Gets whether scrollbars are painted on top of the content.
             * @returns %TRUE if enabled, %FALSE otherwise
             */
            get_overlay_scrollbars(): boolean;
            /**
             * Get the step increment of the vertical plane.
             * @returns the vertical step increment
             */
            get_row_size(): number;
            /**
             * Gets the vertical #StAdjustment of the #StScrollView.
             * @returns the vertical adjustment
             */
            get_vadjustment(): Adjustment;
            /**
             * Gets the vertical scrollbar of the #StScrollView.
             * @returns the vertical #StScrollBar
             */
            get_vscroll_bar(): ScrollBar;
            /**
             * Sets `child` as the content of `scroll`.
             *
             * If `scroll` already has a child, the previous child is removed.
             * @param child a #StScrollable, or %NULL
             */
            set_child(child?: Scrollable | null): void;
            /**
             * Set the step increment of the horizontal plane to `column_size`.
             * @param column_size horizontal step increment
             */
            set_column_size(column_size: number): void;
            /**
             * Sets automatic mouse wheel scrolling to enabled or disabled.
             * @param enabled %TRUE or %FALSE
             */
            set_mouse_scrolling(enabled: boolean): void;
            /**
             * Sets whether scrollbars are painted on top of the content.
             * @param enabled Whether to enable overlay scrollbars
             */
            set_overlay_scrollbars(enabled: boolean): void;
            /**
             * Set the scroll policy.
             * @param hscroll Whether to enable horizontal scrolling
             * @param vscroll Whether to enable vertical scrolling
             */
            set_policy(hscroll: PolicyType | null, vscroll: PolicyType | null): void;
            /**
             * Set the step increment of the vertical plane to `row_size`.
             * @param row_size vertical step increment
             */
            set_row_size(row_size: number): void;
            /**
             * Sets the fade effects in all four edges of the view. A value of 0
             * disables the effect.
             * @param fade_margins a #ClutterMargin defining the vertical fade effects, in pixels.
             */
            update_fade_effect(fade_margins: Clutter.Margin): void;

            // Inherited methods
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace ScrollViewFade {
            // Constructor properties interface

            interface ConstructorProps extends Clutter.ShaderEffect.ConstructorProps {
                extend_fade_area: boolean;
                extendFadeArea: boolean;
                fade_edges: boolean;
                fadeEdges: boolean;
                fade_margins: Clutter.Margin;
                fadeMargins: Clutter.Margin;
            }
        }

        class ScrollViewFade extends Clutter.ShaderEffect {
            static $gtype: GObject.GType<ScrollViewFade>;

            // Properties

            /**
             * Whether faded edges should extend beyond the faded area of the #StScrollViewFade.
             */
            get extend_fade_area(): boolean;
            set extend_fade_area(val: boolean);
            /**
             * Whether faded edges should extend beyond the faded area of the #StScrollViewFade.
             */
            get extendFadeArea(): boolean;
            set extendFadeArea(val: boolean);
            /**
             * Whether the faded area should extend to the edges of the #StScrollViewFade.
             */
            get fade_edges(): boolean;
            set fade_edges(val: boolean);
            /**
             * Whether the faded area should extend to the edges of the #StScrollViewFade.
             */
            get fadeEdges(): boolean;
            set fadeEdges(val: boolean);
            /**
             * The margins widths that are faded.
             */
            get fade_margins(): Clutter.Margin;
            set fade_margins(val: Clutter.Margin);
            /**
             * The margins widths that are faded.
             */
            get fadeMargins(): Clutter.Margin;
            set fadeMargins(val: Clutter.Margin);

            // Constructors

            constructor(properties?: Partial<ScrollViewFade.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): ScrollViewFade;
        }

        namespace Settings {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                accent_color: SystemAccentColor;
                accentColor: SystemAccentColor;
                color_scheme: SystemColorScheme;
                colorScheme: SystemColorScheme;
                disable_show_password: boolean;
                disableShowPassword: boolean;
                drag_threshold: number;
                dragThreshold: number;
                enable_animations: boolean;
                enableAnimations: boolean;
                font_name: string;
                fontName: string;
                gtk_icon_theme: string;
                gtkIconTheme: string;
                high_contrast: boolean;
                highContrast: boolean;
                magnifier_active: boolean;
                magnifierActive: boolean;
                primary_paste: boolean;
                primaryPaste: boolean;
                slow_down_factor: number;
                slowDownFactor: number;
            }
        }

        class Settings extends GObject.Object {
            static $gtype: GObject.GType<Settings>;

            // Properties

            /**
             * The current accent color.
             */
            get accent_color(): SystemAccentColor;
            /**
             * The current accent color.
             */
            get accentColor(): SystemAccentColor;
            /**
             * The preferred color-scheme
             */
            get color_scheme(): SystemColorScheme;
            /**
             * The preferred color-scheme
             */
            get colorScheme(): SystemColorScheme;
            /**
             * Whether password showing can be locked down
             */
            get disable_show_password(): boolean;
            /**
             * Whether password showing can be locked down
             */
            get disableShowPassword(): boolean;
            /**
             * The threshold before a drag operation begins.
             */
            get drag_threshold(): number;
            /**
             * The threshold before a drag operation begins.
             */
            get dragThreshold(): number;
            /**
             * Whether animations are enabled.
             */
            get enable_animations(): boolean;
            /**
             * Whether animations are enabled.
             */
            get enableAnimations(): boolean;
            /**
             * The current font name.
             */
            get font_name(): string;
            /**
             * The current font name.
             */
            get fontName(): string;
            /**
             * The current GTK icon theme
             */
            get gtk_icon_theme(): string;
            /**
             * The current GTK icon theme
             */
            get gtkIconTheme(): string;
            /**
             * Whether the accessibility high contrast mode is enabled.
             */
            get high_contrast(): boolean;
            /**
             * Whether the accessibility high contrast mode is enabled.
             */
            get highContrast(): boolean;
            /**
             * Whether the accessibility magnifier is active.
             */
            get magnifier_active(): boolean;
            /**
             * Whether the accessibility magnifier is active.
             */
            get magnifierActive(): boolean;
            /**
             * Whether pasting from the `PRIMARY` selection is supported (eg. middle-click
             * paste).
             */
            get primary_paste(): boolean;
            /**
             * Whether pasting from the `PRIMARY` selection is supported (eg. middle-click
             * paste).
             */
            get primaryPaste(): boolean;
            /**
             * The slow-down factor applied to all animation durations.
             */
            get slow_down_factor(): number;
            set slow_down_factor(val: number);
            /**
             * The slow-down factor applied to all animation durations.
             */
            get slowDownFactor(): number;
            set slowDownFactor(val: number);

            // Constructors

            constructor(properties?: Partial<Settings.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Static methods

            /**
             * Gets the global #StSettings object.
             */
            static get(): Settings;

            // Methods

            inhibit_animations(): void;
            uninhibit_animations(): void;
        }

        namespace TextureCache {
            // Signal callback interfaces

            interface IconThemeChanged {
                (): void;
            }

            interface TextureFileChanged {
                (file: Gio.File): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class TextureCache extends GObject.Object {
            static $gtype: GObject.GType<TextureCache>;

            // Constructors

            constructor(properties?: Partial<TextureCache.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'icon-theme-changed', callback: (_source: this) => void): number;
            connect_after(signal: 'icon-theme-changed', callback: (_source: this) => void): number;
            emit(signal: 'icon-theme-changed'): void;
            connect(signal: 'texture-file-changed', callback: (_source: this, file: Gio.File) => void): number;
            connect_after(signal: 'texture-file-changed', callback: (_source: this, file: Gio.File) => void): number;
            emit(signal: 'texture-file-changed', file: Gio.File): void;

            // Static methods

            static get_default(): TextureCache;

            // Methods

            /**
             * Create a #GIcon from `surface`.
             * @param surface A #cairo_surface_t
             * @returns A new #GIcon
             */
            load_cairo_surface_to_gicon(surface: cairo.Surface): Gio.Icon;
            /**
             * Asynchronously load an image.   Initially, the returned texture will have a natural
             * size of zero.  At some later point, either the image will be loaded successfully
             * and at that point size will be negotiated, or upon an error, no image will be set.
             * @param file a #GFile of the image file from which to create a pixbuf
             * @param available_width available width for the image, can be -1 if not limited
             * @param available_height available height for the image, can be -1 if not limited
             * @param paint_scale scale factor of the display
             * @param resource_scale Resource scale factor
             * @returns A new #ClutterActor with no image loaded initially.
             */
            load_file_async(
                file: Gio.File,
                available_width: number,
                available_height: number,
                paint_scale: number,
                resource_scale: number,
            ): Clutter.Actor;
            /**
             * This function synchronously loads the given file path
             * into a cairo surface.  On error, a warning is emitted
             * and %NULL is returned.
             * @param file A #GFile in supported image format
             * @param paint_scale Scale factor of the display
             * @param resource_scale Resource scale factor
             * @returns a new #cairo_surface_t
             */
            load_file_to_cairo_surface(file: Gio.File, paint_scale: number, resource_scale: number): cairo.Surface;
            /**
             * This method returns a new #ClutterActor for a given #GIcon. If the
             * icon isn't loaded already, the texture will be filled
             * asynchronously.
             * @param theme_node The #StThemeNode to use for colors, or %NULL                            if the icon must not be recolored
             * @param icon the #GIcon to load
             * @param size Size of themed
             * @param paint_scale Scale factor of display
             * @param resource_scale Resource scale factor
             * @returns A new #ClutterActor for the icon, or %NULL if not found
             */
            load_gicon(
                theme_node: ThemeNode | null,
                icon: Gio.Icon,
                size: number,
                paint_scale: number,
                resource_scale: number,
            ): Clutter.Actor | null;
            /**
             * This function reads a single image file which contains multiple images internally.
             * The image file will be divided using `grid_width` and `grid_height;`
             * note that the dimensions of the image loaded from `path`
             * should be a multiple of the specified grid dimensions.
             * @param file A #GFile
             * @param grid_width Width in pixels
             * @param grid_height Height in pixels
             * @param paint_scale Scale factor of the display
             * @param resource_scale
             * @param load_callback Function called when the image is loaded, or %NULL
             * @returns A new #ClutterActor
             */
            load_sliced_image(
                file: Gio.File,
                grid_width: number,
                grid_height: number,
                paint_scale: number,
                resource_scale: number,
                load_callback?: GLib.Func | null,
            ): Clutter.Actor;
            /**
             * Rescan the current icon theme, if necessary.
             * @returns %TRUE if the icon theme has changed and needed to be reloaded.
             */
            rescan_icon_theme(): boolean;
        }

        namespace Theme {
            // Signal callback interfaces

            interface CustomStylesheetsChanged {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                application_stylesheet: Gio.File;
                applicationStylesheet: Gio.File;
                default_stylesheet: Gio.File;
                defaultStylesheet: Gio.File;
                theme_stylesheet: Gio.File;
                themeStylesheet: Gio.File;
            }
        }

        /**
         * A set of stylesheets
         *
         * #StTheme holds a set of stylesheets. (The "cascade" of the name
         * Cascading Stylesheets.) A #StTheme can be set to apply to all the actors
         * in a stage using st_theme_context_set_theme().
         */
        class Theme extends GObject.Object {
            static $gtype: GObject.GType<Theme>;

            // Properties

            /**
             * The highest priority stylesheet, representing application-specific
             * styling; this is associated with the CSS "author" stylesheet.
             */
            get application_stylesheet(): Gio.File;
            /**
             * The highest priority stylesheet, representing application-specific
             * styling; this is associated with the CSS "author" stylesheet.
             */
            get applicationStylesheet(): Gio.File;
            /**
             * The lowest priority stylesheet, representing global default
             * styling; this is associated with the CSS "user agent" stylesheet.
             */
            get default_stylesheet(): Gio.File;
            /**
             * The lowest priority stylesheet, representing global default
             * styling; this is associated with the CSS "user agent" stylesheet.
             */
            get defaultStylesheet(): Gio.File;
            /**
             * The second priority stylesheet, representing theme-specific styling;
             * this is associated with the CSS "user" stylesheet.
             */
            get theme_stylesheet(): Gio.File;
            /**
             * The second priority stylesheet, representing theme-specific styling;
             * this is associated with the CSS "user" stylesheet.
             */
            get themeStylesheet(): Gio.File;

            // Constructors

            constructor(properties?: Partial<Theme.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](
                application_stylesheet: Gio.File,
                theme_stylesheet: Gio.File,
                default_stylesheet: Gio.File,
            ): Theme;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'custom-stylesheets-changed', callback: (_source: this) => void): number;
            connect_after(signal: 'custom-stylesheets-changed', callback: (_source: this) => void): number;
            emit(signal: 'custom-stylesheets-changed'): void;

            // Methods

            /**
             * Get a list of the stylesheet files loaded with st_theme_load_stylesheet().
             * @returns the list of stylesheet files          that were loaded with st_theme_load_stylesheet()
             */
            get_custom_stylesheets(): Gio.File[];
            /**
             * Load the stylesheet associated with `file`.
             * @param file a #GFile
             * @returns %TRUE if successful
             */
            load_stylesheet(file: Gio.File): boolean;
            /**
             * Unload the stylesheet associated with `file`. If `file` was not loaded this
             * function does nothing.
             * @param file a #GFile
             */
            unload_stylesheet(file: Gio.File): void;
        }

        namespace ThemeContext {
            // Signal callback interfaces

            interface Changed {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                scale_factor: number;
                scaleFactor: number;
            }
        }

        /**
         * Holds global information about a tree of styled objects
         *
         * #StThemeContext is responsible for managing information global to a tree of styled objects,
         * such as the set of stylesheets or the default font. In normal usage, a #StThemeContext
         * is bound to a #ClutterStage; a singleton #StThemeContext can be obtained for a #ClutterStage
         * by using st_theme_context_get_for_stage().
         */
        class ThemeContext extends GObject.Object {
            static $gtype: GObject.GType<ThemeContext>;

            // Properties

            /**
             * The scaling factor used for HiDPI scaling.
             */
            get scale_factor(): number;
            set scale_factor(val: number);
            /**
             * The scaling factor used for HiDPI scaling.
             */
            get scaleFactor(): number;
            set scaleFactor(val: number);

            // Constructors

            constructor(properties?: Partial<ThemeContext.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): ThemeContext;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'changed', callback: (_source: this) => void): number;
            connect_after(signal: 'changed', callback: (_source: this) => void): number;
            emit(signal: 'changed'): void;

            // Static methods

            /**
             * Gets a singleton theme context associated with the stage.
             * @param stage a #ClutterStage
             */
            static get_for_stage(stage: Clutter.Stage): ThemeContext;

            // Methods

            /**
             * Gets the current accent color for the theme context.
             */
            get_accent_color(): [Cogl.Color | null, Cogl.Color | null];
            /**
             * Gets the default font for the theme context. See st_theme_context_set_font().
             * @returns the default font for the theme context.
             */
            get_font(): Pango.FontDescription;
            /**
             * Gets the root node of the tree of theme style nodes that associated with this
             * context. For the node tree associated with a stage, this node represents
             * styles applied to the stage itself.
             * @returns the root node of the context's style tree
             */
            get_root_node(): ThemeNode;
            /**
             * Return the current scale factor of `context`.
             * @returns an integer scale factor
             */
            get_scale_factor(): number;
            /**
             * Gets the default theme for the context. See st_theme_context_set_theme()
             * @returns the default theme for the context
             */
            get_theme(): Theme;
            /**
             * Return an existing node matching `node,` or if that isn't possible,
             * `node` itself.
             * @param node a #StThemeNode
             * @returns a node with the same properties as @node
             */
            intern_node(node: ThemeNode): ThemeNode;
            /**
             * Sets the default font for the theme context. This is the font that
             * is inherited by the root node of the tree of theme nodes. If the
             * font is not overridden, then this font will be used. If the font is
             * partially modified (for example, with 'font-size: 110%'), then that
             * modification is based on this font.
             * @param font the default font for theme context
             */
            set_font(font: Pango.FontDescription): void;
            /**
             * Sets the default set of theme stylesheets for the context. This theme will
             * be used for the root node and for nodes descending from it, unless some other
             * style is explicitly specified.
             * @param theme a #StTheme
             */
            set_theme(theme: Theme): void;
        }

        namespace ThemeNode {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * Style information for one node in a tree of themed objects
         *
         * A #StThemeNode represents the CSS style information (the set of CSS properties) for one
         * node in a tree of themed objects. In typical usage, it represents the style information
         * for a single #ClutterActor. A #StThemeNode is immutable: attributes such as the
         * CSS classes for the node are passed in at construction. If the attributes of the node
         * or any parent node change, the node should be discarded and a new node created.
         * #StThemeNode has generic accessors to look up properties by name and specific
         * accessors for standard CSS properties that add caching and handling of various
         * details of the CSS specification. #StThemeNode also has convenience functions to help
         * in implementing a #ClutterActor with borders and padding.
         *
         * Note that pixel measurements take the #StThemeContext:scale-factor into
         * account so all values are in physical pixels, as opposed to logical pixels.
         * Physical pixels correspond to actor sizes, not necessarily to pixels on
         * display devices (eg. when `scale-monitor-framebuffer` is enabled).
         */
        class ThemeNode extends GObject.Object {
            static $gtype: GObject.GType<ThemeNode>;

            // Constructors

            constructor(properties?: Partial<ThemeNode.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](
                context: ThemeContext,
                parent_node: ThemeNode | null,
                theme: Theme | null,
                element_type: GObject.GType,
                element_id: string | null,
                element_class: string | null,
                pseudo_class: string | null,
                inline_style: string,
            ): ThemeNode;

            // Methods

            /**
             * Adjusts a "for height" passed to clutter_actor_get_preferred_width() to
             * account for borders and padding. This is a convenience function meant
             * to be called from a get_preferred_width() method of a #ClutterActor
             * subclass. The value after adjustment is the height available for the actor's
             * content.
             * @param for_height the "for height" to adjust
             */
            adjust_for_height(for_height: number): number;
            /**
             * Adjusts a "for width" passed to clutter_actor_get_preferred_height() to
             * account for borders and padding. This is a convenience function meant
             * to be called from a get_preferred_height() method of a #ClutterActor
             * subclass. The value after adjustment is the width available for the actor's
             * content.
             * @param for_width the "for width" to adjust
             */
            adjust_for_width(for_width: number): number;
            /**
             * Adjusts the minimum and natural height computed for an actor by
             * adding on the necessary space for borders and padding and taking
             * into account any minimum or maximum height. This is a convenience
             * function meant to be called from the get_preferred_height() method
             * of a #ClutterActor subclass
             * @param min_height_p the minimum height to adjust
             * @param natural_height_p the natural height to adjust
             */
            adjust_preferred_height(min_height_p: number, natural_height_p: number): [number, number];
            /**
             * Adjusts the minimum and natural width computed for an actor by
             * adding on the necessary space for borders and padding and taking
             * into account any minimum or maximum width. This is a convenience
             * function meant to be called from the get_preferred_width() method
             * of a #ClutterActor subclass
             * @param min_width_p the minimum width to adjust
             * @param natural_width_p the natural width to adjust
             */
            adjust_preferred_width(min_width_p: number, natural_width_p: number): [number, number];
            /**
             * Compare two #StThemeNodes. Two nodes which compare equal will match
             * the same CSS rules and have the same style properties. However, two
             * nodes that have ended up with identical style properties do not
             * necessarily compare equal.
             *
             * In detail, `node_a` and `node_b` are considered equal if and only if:
             *
             * - they share the same #StTheme and #StThemeContext
             * - they have the same parent
             * - they have the same element type
             * - their id, class, pseudo-class and inline-style match
             * @param node_b second #StThemeNode
             * @returns %TRUE if @node_a equals @node_b
             */
            equal(node_b: ThemeNode): boolean;
            /**
             * Tests if two theme nodes have the same borders and padding; this can be
             * used to optimize having to relayout when the style applied to a Clutter
             * actor changes colors without changing the geometry.
             * @param other a different #StThemeNode
             * @returns %TRUE if equal, %FALSE otherwise
             */
            geometry_equal(other: ThemeNode): boolean;
            /**
             * Gets `node'`s background color.
             */
            get_background_color(): Cogl.Color;
            /**
             * The `start` and `end` arguments will only be set if `type` is not #ST_GRADIENT_NONE.
             */
            get_background_gradient(): [GradientType, Cogl.Color, Cogl.Color];
            get_background_image(): Gio.File;
            /**
             * Gets the value for the -st-background-image-shadow style property
             * @returns the node's background image shadow, or   %NULL if node has no such shadow
             */
            get_background_image_shadow(): Shadow | null;
            /**
             * Gets the box used to paint the actor's background, including the area
             * occupied by properties which paint outside the actor's assigned allocation.
             * @param allocation the box allocated to a #ClutterActor
             */
            get_background_paint_box(allocation: Clutter.ActorBox): Clutter.ActorBox;
            /**
             * Gets the color of `node'`s border on `side`
             * @param side a #StSide
             */
            get_border_color(side: Side | null): Cogl.Color;
            /**
             * Gets the value for the border-image style property
             * @returns the border image, or %NULL   if there is no border image.
             */
            get_border_image(): BorderImage;
            /**
             * Get the border radius for `node` at `corner,` in physical pixels.
             * @param corner a #StCorner
             * @returns the border radius in physical pixels
             */
            get_border_radius(corner: Corner | null): number;
            /**
             * Get the border width for `node` on `side,` in physical pixels.
             * @param side a #StCorner
             * @returns the border width in physical pixels
             */
            get_border_width(side: Side | null): number;
            /**
             * Gets the value for the box-shadow style property
             * @returns the node's shadow, or %NULL   if node has no shadow
             */
            get_box_shadow(): Shadow | null;
            /**
             * Generically looks up a property containing a single color value. When
             * specific getters (like st_theme_node_get_background_color()) exist, they
             * should be used instead. They are cached, so more efficient, and have
             * handling for shortcut properties and other details of CSS.
             *
             * If `property_name` is not found, a warning will be logged and a
             * default color returned.
             *
             * See also st_theme_node_lookup_color(), which provides more options,
             * and lets you handle the case where the theme does not specify the
             * indicated color.
             * @param property_name The name of the color property
             */
            get_color(property_name: string): Cogl.Color;
            /**
             * Gets the box within an actor's allocation that contents the content
             * of an actor (excluding borders and padding). This is a convenience function
             * meant to be used from the allocate() or paint() methods of a #ClutterActor
             * subclass.
             * @param allocation the box allocated to a #ClutterAlctor
             */
            get_content_box(allocation: Clutter.ActorBox): Clutter.ActorBox;
            /**
             * Generically looks up a property containing a single numeric value
             *  without units.
             *
             * See also st_theme_node_lookup_double(), which provides more options,
             * and lets you handle the case where the theme does not specify the
             * indicated value.
             * @param property_name The name of the numeric property
             * @returns the value found. If @property_name is not  found, a warning will be logged and 0 will be returned.
             */
            get_double(property_name: string): number;
            /**
             * Get the list of element classes for `node`.
             * @returns the element's classes
             */
            get_element_classes(): string[];
            /**
             * Get the unique element ID for `node`.
             * @returns the element's ID
             */
            get_element_id(): string;
            /**
             * Get the element #GType for `node`.
             * @returns the element type
             */
            get_element_type(): GObject.GType;
            /**
             * Get the current font of `node` as a #PangoFontDescription
             * @returns the current font
             */
            get_font(): Pango.FontDescription;
            /**
             * Get the CSS font-features for `node`.
             * @returns font-features as a string
             */
            get_font_features(): string;
            /**
             * Gets `node'`s foreground color.
             */
            get_foreground_color(): Cogl.Color;
            /**
             * Get the height for `node,` in physical pixels.
             * @returns the height in physical pixels
             */
            get_height(): number;
            /**
             * Gets the total horizontal padding (left + right padding), in physical pixels.
             * @returns the total horizontal padding in physical pixels
             */
            get_horizontal_padding(): number;
            /**
             * Gets the colors that should be used for colorizing symbolic icons according
             * the style of this node.
             * @returns the icon colors to use for this theme node
             */
            get_icon_colors(): IconColors;
            /**
             * Get the icon style for `node` (eg. symbolic, regular). This corresponds to the
             * special `-st-icon-style` CSS property.
             * @returns the icon style for @node
             */
            get_icon_style(): IconStyle;
            /**
             * Generically looks up a property containing a single length value. When
             * specific getters (like st_theme_node_get_border_width()) exist, they
             * should be used instead. They are cached, so more efficient, and have
             * handling for shortcut properties and other details of CSS.
             *
             * Unlike st_theme_node_get_color() and st_theme_node_get_double(),
             * this does not print a warning if the property is not found; it just
             * returns 0.
             *
             * See also st_theme_node_lookup_length(), which provides more options. The
             * returned value is in physical pixels, as opposed to logical pixels.
             * @param property_name The name of the length property
             * @returns the length, in pixels, or 0 if the property was not found.
             */
            get_length(property_name: string): number;
            /**
             * Gets the value for the letter-spacing style property, in physical pixels.
             * @returns the value of the letter-spacing property, if   found, or zero if such property has not been found.
             */
            get_letter_spacing(): number;
            /**
             * Get the margin for `node` on `side,` in physical pixels. This corresponds to
             * the CSS properties such as `margin-top`.
             * @param side a #StSide
             * @returns the margin size in physical pixels
             */
            get_margin(side: Side | null): number;
            /**
             * Get the maximum height for `node,` in physical pixels.
             * @returns the maximum height in physical pixels
             */
            get_max_height(): number;
            /**
             * Get the maximum width for `node,` in physical pixels.
             * @returns the maximum width in physical pixels
             */
            get_max_width(): number;
            /**
             * Get the minimum height for `node,` in physical pixels.
             * @returns the minimum height in physical pixels
             */
            get_min_height(): number;
            /**
             * Get the minimum width for `node,` in physical pixels.
             * @returns the minimum width in physical pixels
             */
            get_min_width(): number;
            /**
             * Gets the color of `node'`s outline.
             */
            get_outline_color(): Cogl.Color;
            /**
             * Get the width of the outline for `node,` in physical pixels.
             * @returns the width in physical pixels
             */
            get_outline_width(): number;
            /**
             * Get the padding for `node` on `side,` in physical pixels. This corresponds to
             * the CSS properties such as `padding-top`.
             * @param side a #StSide
             * @returns the padding size in physical pixels
             */
            get_padding(side: Side | null): number;
            /**
             * Gets the box used to paint the actor, including the area occupied
             * by properties which paint outside the actor's assigned allocation.
             * When painting `node` to an offscreen buffer, this function can be
             * used to determine the necessary size of the buffer.
             * @param allocation the box allocated to a #ClutterActor
             */
            get_paint_box(allocation: Clutter.ActorBox): Clutter.ActorBox;
            /**
             * Gets the parent themed element node.
             * @returns the parent #StThemeNode, or %NULL if  this is the root node of the tree of theme elements.
             */
            get_parent(): ThemeNode | null;
            /**
             * Get the list of pseudo-classes for `node` (eg. `:focused`).
             * @returns the element's pseudo-classes
             */
            get_pseudo_classes(): string[];
            /**
             * Generically looks up a property containing a set of shadow values. When
             * specific getters (like st_theme_node_get_box_shadow()) exist, they
             * should be used instead. They are cached, so more efficient, and have
             * handling for shortcut properties and other details of CSS.
             *
             * Like st_theme_get_length(), this does not print a warning if the property is
             * not found; it just returns %NULL
             *
             * See also st_theme_node_lookup_shadow (), which provides more options.
             * @param property_name The name of the shadow property
             * @returns the shadow, or %NULL if the property was   not found.
             */
            get_shadow(property_name: string): Shadow | null;
            /**
             * Get the text alignment of `node`.
             * @returns the alignment of text for @node
             */
            get_text_align(): TextAlign;
            /**
             * Get the text decoration for `node` (eg. underline, line-through, etc).
             * @returns the text decoration for @node
             */
            get_text_decoration(): TextDecoration;
            /**
             * Gets the value for the text-shadow style property
             * @returns the node's text-shadow, or %NULL   if node has no text-shadow
             */
            get_text_shadow(): Shadow | null;
            /**
             * Gets the theme stylesheet set that styles this node
             * @returns the theme stylesheet set
             */
            get_theme(): Theme;
            /**
             * Get the value of the transition-duration property, which
             * specifies the transition time between the previous #StThemeNode
             * and `node`.
             * @returns the node's transition duration in milliseconds
             */
            get_transition_duration(): number;
            /**
             * Looks up a property containing a single URL value.
             *
             * See also st_theme_node_lookup_url(), which provides more options,
             * and lets you handle the case where the theme does not specify the
             * indicated value.
             * @param property_name The name of the string property
             * @returns the newly allocated value if found.  If @property_name is not found, a warning will be logged and %NULL  will be returned.
             */
            get_url(property_name: string): Gio.File | null;
            /**
             * Gets the total vertical padding (top + bottom padding), in physical pixels.
             * @returns the total vertical padding in physical pixels
             */
            get_vertical_padding(): number;
            /**
             * Get the width for `node,` in physical pixels.
             * @returns the width in physical pixels
             */
            get_width(): number;
            /**
             * Converts `node` to a hash value.
             * @returns a hash value corresponding to @node
             */
            hash(): number;
            invalidate_background_image(): void;
            invalidate_border_image(): void;
            /**
             * Generically looks up a property containing a single color value. When
             * specific getters (like st_theme_node_get_background_color()) exist, they
             * should be used instead. They are cached, so more efficient, and have
             * handling for shortcut properties and other details of CSS.
             *
             * See also st_theme_node_get_color(), which provides a simpler API.
             * @param property_name The name of the color property
             * @param inherit if %TRUE, if a value is not found for the property on the   node, then it will be looked up on the parent node, and then on the   parent's parent, and so forth. Note that if the property has a   value of 'inherit' it will be inherited even if %FALSE is passed   in for @inherit; this only affects the default behavior for inheritance.
             * @returns %TRUE if the property was found in the properties for this  theme node (or in the properties of parent nodes when inheriting.)
             */
            lookup_color(property_name: string, inherit: boolean): [boolean, Cogl.Color];
            /**
             * Generically looks up a property containing a single numeric value
             *  without units.
             *
             * See also st_theme_node_get_double(), which provides a simpler API.
             * @param property_name The name of the numeric property
             * @param inherit if %TRUE, if a value is not found for the property on the   node, then it will be looked up on the parent node, and then on the   parent's parent, and so forth. Note that if the property has a   value of 'inherit' it will be inherited even if %FALSE is passed   in for @inherit; this only affects the default behavior for inheritance.
             * @returns %TRUE if the property was found in the properties for this  theme node (or in the properties of parent nodes when inheriting.)
             */
            lookup_double(property_name: string, inherit: boolean): [boolean, number];
            /**
             * Generically looks up a property containing a single length value. When
             * specific getters (like st_theme_node_get_border_width()) exist, they
             * should be used instead. They are cached, so more efficient, and have
             * handling for shortcut properties and other details of CSS.
             *
             * See also st_theme_node_get_length(), which provides a simpler API.
             * @param property_name The name of the length property
             * @param inherit if %TRUE, if a value is not found for the property on the   node, then it will be looked up on the parent node, and then on the   parent's parent, and so forth. Note that if the property has a   value of 'inherit' it will be inherited even if %FALSE is passed   in for @inherit; this only affects the default behavior for inheritance.
             * @returns %TRUE if the property was found in the properties for this  theme node (or in the properties of parent nodes when inheriting.)
             */
            lookup_length(property_name: string, inherit: boolean): [boolean, number];
            /**
             * If the property is not found, the value in the shadow variable will not
             * be changed.
             *
             * Generically looks up a property containing a set of shadow values. When
             * specific getters (like st_theme_node_get_box_shadow ()) exist, they
             * should be used instead. They are cached, so more efficient, and have
             * handling for shortcut properties and other details of CSS.
             *
             * See also st_theme_node_get_shadow(), which provides a simpler API.
             * @param property_name The name of the shadow property
             * @param inherit if %TRUE, if a value is not found for the property on the   node, then it will be looked up on the parent node, and then on the   parent's parent, and so forth. Note that if the property has a   value of 'inherit' it will be inherited even if %FALSE is passed   in for @inherit; this only affects the default behavior for inheritance.
             * @returns %TRUE if the property was found in the properties for this   theme node (or in the properties of parent nodes when inheriting.), %FALSE   if the property was not found, or was explicitly set to 'none'.
             */
            lookup_shadow(property_name: string, inherit: boolean): [boolean, Shadow];
            /**
             * Generically looks up a property containing a single time value,
             *  which is converted to milliseconds.
             * @param property_name The name of the time property
             * @param inherit if %TRUE, if a value is not found for the property on the   node, then it will be looked up on the parent node, and then on the   parent's parent, and so forth. Note that if the property has a   value of 'inherit' it will be inherited even if %FALSE is passed   in for @inherit; this only affects the default behavior for inheritance.
             * @returns %TRUE if the property was found in the properties for this  theme node (or in the properties of parent nodes when inheriting.)
             */
            lookup_time(property_name: string, inherit: boolean): [boolean, number];
            /**
             * Looks up a property containing a single URL value.
             *
             * See also st_theme_node_get_url(), which provides a simpler API.
             * @param property_name The name of the string property
             * @param inherit if %TRUE, if a value is not found for the property on the   node, then it will be looked up on the parent node, and then on the   parent's parent, and so forth. Note that if the property has a   value of 'inherit' it will be inherited even if %FALSE is passed   in for @inherit; this only affects the default behavior for inheritance.
             * @returns %TRUE if the property was found in the properties for this  theme node (or in the properties of parent nodes when inheriting.)
             */
            lookup_url(property_name: string, inherit: boolean): [boolean, Gio.File];
            /**
             * Check if st_theme_node_paint() will paint identically for `node` as it does
             * for `other`. Note that in some cases this function may return %TRUE even
             * if there is no visible difference in the painting.
             * @param other a different #StThemeNode
             * @returns %TRUE if the two theme nodes paint identically. %FALSE if the   two nodes potentially paint differently.
             */
            paint_equal(other?: ThemeNode | null): boolean;
            /**
             * Serialize `node` to a string of its #GType name, CSS ID, classes and
             * pseudo-classes.
             * @returns the serialized theme node
             */
            to_string(): string;
        }

        namespace Viewport {
            // Constructor properties interface

            interface ConstructorProps<
                A extends Clutter.LayoutManager = Clutter.LayoutManager,
                B extends Clutter.Content = Clutter.Content,
            > extends Widget.ConstructorProps<A, B>,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps,
                    Scrollable.ConstructorProps {
                clip_to_view: boolean;
                clipToView: boolean;
            }
        }

        /**
         * Scrollable container
         *
         * The #StViewport is a generic #StScrollable implementation.
         */
        class Viewport<
                A extends Clutter.LayoutManager = Clutter.LayoutManager,
                B extends Clutter.Content = Clutter.Content,
            >
            extends Widget<A, B>
            implements Atk.ImplementorIface, Clutter.Animatable, Scrollable
        {
            static $gtype: GObject.GType<Viewport>;

            // Properties

            get clip_to_view(): boolean;
            set clip_to_view(val: boolean);
            get clipToView(): boolean;
            set clipToView(val: boolean);

            // Constructors

            constructor(properties?: Partial<Viewport.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Inherited properties
            /**
             * The horizontal #StAdjustment used by the #StScrollable.
             *
             * Implementations should override this property to provide read-write
             * access to the #StAdjustment.
             *
             * JavaScript code may override this as demonstrated below:
             *
             * ```js
             * export const MyScrollable = GObject.registerClass({
             *     Properties: {
             *         'hadjustment': GObject.ParamSpec.override(
             *             'hadjustment',
             *             St.Scrollable
             *         )
             *     }
             * }, class MyScrollable extends St.Scrollable {
             *
             *     get hadjustment() {
             *         return this._hadjustment || null;
             *     }
             *
             *     set hadjustment(adjustment) {
             *         if (this.hadjustment === adjustment)
             *             return;
             *
             *         this._hadjustment = adjustment;
             *         this.notify('hadjustment');
             *     }
             * });
             * ```
             */
            get hadjustment(): Adjustment;
            set hadjustment(val: Adjustment);
            /**
             * The vertical #StAdjustment used by the #StScrollable.
             *
             * Implementations should override this property to provide read-write
             * access to the #StAdjustment.
             *
             * See #StScrollable:hadjustment for an example of how to override this
             * property in JavaScript code.
             */
            get vadjustment(): Adjustment;
            set vadjustment(val: Adjustment);

            // Inherited methods
            get_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * This method should be implemented by classes implementing the #StScrollable
             * interface.
             *
             * JavaScript code should do this by overriding the `vfunc_set_adjustments()`
             * method.
             * @param hadjustment the horizontal #StAdjustment
             * @param vadjustment the vertical #StAdjustment
             */
            set_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            vfunc_get_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * This method should be implemented by classes implementing the #StScrollable
             * interface.
             *
             * JavaScript code should do this by overriding the `vfunc_set_adjustments()`
             * method.
             * @param hadjustment the horizontal #StAdjustment
             * @param vadjustment the vertical #StAdjustment
             */
            vfunc_set_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace Widget {
            // Signal callback interfaces

            interface PopupMenu {
                (): void;
            }

            interface StyleChanged {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps<
                A extends Clutter.LayoutManager = Clutter.LayoutManager,
                B extends Clutter.Content = Clutter.Content,
            > extends Clutter.Actor.ConstructorProps<A, B>,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                can_focus: boolean;
                canFocus: boolean;
                hover: boolean;
                label_actor: Clutter.Actor;
                labelActor: Clutter.Actor;
                pseudo_class: string;
                pseudoClass: string;
                style: string;
                style_class: string;
                styleClass: string;
                track_hover: boolean;
                trackHover: boolean;
            }
        }

        /**
         * Base class for stylable actors
         *
         * #StWidget is a simple abstract class on top of #ClutterActor. It
         * provides basic theming properties.
         *
         * Actors in the St library should subclass #StWidget if they plan
         * to obey to a certain #StStyle.
         */
        class Widget<
                A extends Clutter.LayoutManager = Clutter.LayoutManager,
                B extends Clutter.Content = Clutter.Content,
            >
            extends Clutter.Actor<A, B>
            implements Atk.ImplementorIface, Clutter.Animatable
        {
            static $gtype: GObject.GType<Widget>;

            // Properties

            /**
             * Whether or not the widget can be focused via keyboard navigation.
             */
            get can_focus(): boolean;
            set can_focus(val: boolean);
            /**
             * Whether or not the widget can be focused via keyboard navigation.
             */
            get canFocus(): boolean;
            set canFocus(val: boolean);
            /**
             * Whether or not the pointer is currently hovering over the widget. This is
             * only tracked automatically if #StWidget:track-hover is %TRUE, but you can
             * adjust it manually in any case.
             */
            get hover(): boolean;
            set hover(val: boolean);
            /**
             * An actor that labels this widget.
             */
            get label_actor(): Clutter.Actor;
            set label_actor(val: Clutter.Actor);
            /**
             * An actor that labels this widget.
             */
            get labelActor(): Clutter.Actor;
            set labelActor(val: Clutter.Actor);
            /**
             * The pseudo-class of the actor. Typical values include "hover", "active",
             * "focus".
             */
            get pseudo_class(): string;
            set pseudo_class(val: string);
            /**
             * The pseudo-class of the actor. Typical values include "hover", "active",
             * "focus".
             */
            get pseudoClass(): string;
            set pseudoClass(val: string);
            /**
             * Inline style information for the actor as a ';'-separated list of
             * CSS properties.
             */
            get style(): string;
            set style(val: string);
            /**
             * The style-class of the actor for use in styling.
             */
            get style_class(): string;
            set style_class(val: string);
            /**
             * The style-class of the actor for use in styling.
             */
            get styleClass(): string;
            set styleClass(val: string);
            /**
             * Determines whether the widget tracks pointer hover state. If
             * %TRUE (and the widget is visible and reactive), the
             * #StWidget:hover property and "hover" style pseudo class will be
             * adjusted automatically as the pointer moves in and out of the
             * widget.
             */
            get track_hover(): boolean;
            set track_hover(val: boolean);
            /**
             * Determines whether the widget tracks pointer hover state. If
             * %TRUE (and the widget is visible and reactive), the
             * #StWidget:hover property and "hover" style pseudo class will be
             * adjusted automatically as the pointer moves in and out of the
             * widget.
             */
            get trackHover(): boolean;
            set trackHover(val: boolean);

            // Constructors

            constructor(properties?: Partial<Widget.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'popup-menu', callback: (_source: this) => void): number;
            connect_after(signal: 'popup-menu', callback: (_source: this) => void): number;
            emit(signal: 'popup-menu'): void;
            connect(signal: 'style-changed', callback: (_source: this) => void): number;
            connect_after(signal: 'style-changed', callback: (_source: this) => void): number;
            emit(signal: 'style-changed'): void;

            // Virtual methods

            /**
             * Gets a list of the focusable children of `widget,` in "Tab"
             * order. By default, this returns all visible
             * (as in [method`Clutter`.Actor.is_visible]) children of `widget`.
             */
            vfunc_get_focus_chain(): Clutter.Actor[];
            vfunc_navigate_focus(from: Clutter.Actor | null, direction: DirectionType): boolean;
            /**
             * Asks the widget to pop-up a context menu by emitting #StWidget::popup-menu.
             */
            vfunc_popup_menu(): void;
            vfunc_style_changed(): void;

            // Methods

            /**
             * This method adds `state` as one of the accessible states for
             * `widget`. The list of states of a widget describes the current state
             * of user interface element `widget` and is provided so that assistive
             * technologies know how to present `widget` to the user.
             *
             * Usually you will have no need to add accessible states for an
             * object, as the accessible object can extract most of the states
             * from the object itself (ie: a #StButton knows when it is pressed).
             * This method is only required when one cannot extract the
             * information automatically from the object itself (i.e.: a generic
             * container used as a toggle menu item will not automatically include
             * the toggled state).
             * @param state #AtkStateType state to add
             */
            add_accessible_state(state: Atk.StateType | null): void;
            /**
             * Adds `style_class` to `actor'`s style class name list, if it is not
             * already present.
             * @param style_class a style class name string
             */
            add_style_class_name(style_class: string): void;
            /**
             * Adds `pseudo_class` to `actor'`s pseudo class list, if it is not
             * already present.
             * @param pseudo_class a pseudo class string
             */
            add_style_pseudo_class(pseudo_class: string): void;
            /**
             * Ensures that `widget` has read its style information and propagated any
             * changes to its children.
             */
            ensure_style(): void;
            /**
             * Returns the current value of the can-focus property. See
             * st_widget_set_can_focus() for more information.
             * @returns current value of can-focus on @widget
             */
            get_can_focus(): boolean;
            /**
             * Gets a list of the focusable children of `widget,` in "Tab"
             * order. By default, this returns all visible
             * (as in [method`Clutter`.Actor.is_visible]) children of `widget`.
             * @returns @widget's focusable children
             */
            get_focus_chain(): Clutter.Actor[];
            /**
             * If #StWidget:track-hover is set, this returns whether the pointer
             * is currently over the widget.
             * @returns current value of hover on @widget
             */
            get_hover(): boolean;
            /**
             * Gets the label that identifies `widget` if it is defined
             * @returns the label that identifies the widget
             */
            get_label_actor(): Clutter.Actor;
            /**
             * Get the current inline style string. See st_widget_set_style().
             * @returns The inline style string, or %NULL. The   string is owned by the #StWidget and should not be modified or freed.
             */
            get_style(): string | null;
            /**
             * Get the current style class name
             * @returns the class name string. The string is owned by the #StWidget and should not be modified or freed.
             */
            get_style_class_name(): string;
            /**
             * Get the current style pseudo class list.
             *
             * Note that an actor can have multiple pseudo classes; if you just
             * want to test for the presence of a specific pseudo class, use
             * st_widget_has_style_pseudo_class().
             * @returns the pseudo class list string. The string is owned by the #StWidget and should not be modified or freed.
             */
            get_style_pseudo_class(): string;
            /**
             * Gets the theme node holding style information for the widget.
             * The theme node is used to access standard and custom CSS
             * properties of the widget.
             *
             * Note: it is a fatal error to call this on a widget that is
             *  not been added to a stage.
             * @returns the theme node for the widget.   This is owned by the widget. When attributes of the widget   or the environment that affect the styling change (for example   the style_class property of the widget), it will be recreated,   and the ::style-changed signal will be emitted on the widget.
             */
            get_theme_node(): ThemeNode;
            /**
             * Returns the current value of the #StWidget:track-hover property. See
             * st_widget_set_track_hover() for more information.
             * @returns current value of track-hover on @widget
             */
            get_track_hover(): boolean;
            /**
             * Tests if `actor'`s style class list includes `style_class`.
             * @param style_class a style class string
             * @returns whether or not @actor's style class list includes @style_class.
             */
            has_style_class_name(style_class: string): boolean;
            /**
             * Tests if `actor'`s pseudo class list includes `pseudo_class`.
             * @param pseudo_class a pseudo class string
             * @returns whether or not @actor's pseudo class list includes @pseudo_class.
             */
            has_style_pseudo_class(pseudo_class: string): boolean;
            /**
             * Tries to update the keyboard focus within `widget` in response to a
             * keyboard event.
             *
             * If `from` is a descendant of `widget,` this attempts to move the
             * keyboard focus to the next descendant of `widget` (in the order
             * implied by `direction)` that has the #StWidget:can-focus property
             * set. If `from` is %NULL, this attempts to focus either `widget`
             * itself, or its first descendant in the order implied by
             * `direction`. If `from` is outside of `widget,` it behaves as if it was
             * a descendant if `direction` is one of the directional arrows and as
             * if it was %NULL otherwise.
             *
             * If a container type is marked #StWidget:can-focus, the expected
             * behavior is that it will only take up a single slot on the focus
             * chain as a whole, rather than allowing navigation between its child
             * actors (or having a distinction between itself being focused and
             * one of its children being focused).
             *
             * Some widget classes might have slightly different behavior from the
             * above, where that would make more sense.
             *
             * If `wrap_around` is %TRUE and `from` is a child of `widget,` but the
             * widget has no further children that can accept the focus in the
             * given direction, then st_widget_navigate_focus() will try a second
             * time, using a %NULL `from,` which should cause it to reset the focus
             * to the first available widget in the given direction.
             * @param from the actor that the focus is coming from
             * @param direction the direction focus is moving in
             * @param wrap_around whether focus should wrap around
             * @returns %TRUE if clutter_actor_grab_key_focus() has been called on an actor. %FALSE if not.
             */
            navigate_focus(from: Clutter.Actor | null, direction: DirectionType | null, wrap_around: boolean): boolean;
            /**
             * Paint the background of the widget. This is meant to be called by
             * subclasses of StWidget that need to paint the background without
             * painting children.
             * @param node
             * @param paint_context
             */
            paint_background(node: Clutter.PaintNode, paint_context: Clutter.PaintContext): void;
            /**
             * Returns the theme node for the widget if it has already been
             * computed, %NULL if the widget hasn't been added to a  stage or the theme
             * node hasn't been computed. If %NULL is returned, then ::style-changed
             * will be reliably emitted before the widget is allocated or painted.
             * @returns the theme node for the widget.   This is owned by the widget. When attributes of the widget   or the environment that affect the styling change (for example   the style_class property of the widget), it will be recreated,   and the ::style-changed signal will be emitted on the widget.
             */
            peek_theme_node(): ThemeNode;
            /**
             * Asks the widget to pop-up a context menu by emitting #StWidget::popup-menu.
             */
            popup_menu(): void;
            /**
             * This method removes `state` as on of the accessible states for
             * `widget`. See st_widget_add_accessible_state() for more information.
             * @param state #AtkState state to remove
             */
            remove_accessible_state(state: Atk.StateType | null): void;
            /**
             * Removes `style_class` from `actor'`s style class name, if it is
             * present.
             * @param style_class a style class name string
             */
            remove_style_class_name(style_class: string): void;
            /**
             * Removes `pseudo_class` from `actor'`s pseudo class, if it is present.
             * @param pseudo_class a pseudo class string
             */
            remove_style_pseudo_class(pseudo_class: string): void;
            /**
             * Marks `widget` as being able to receive keyboard focus via
             * keyboard navigation.
             * @param can_focus %TRUE if the widget can receive keyboard focus   via keyboard navigation
             */
            set_can_focus(can_focus: boolean): void;
            /**
             * Sets `widget'`s hover property and adds or removes "hover" from its
             * pseudo class accordingly.
             *
             * If you have set #StWidget:track-hover, you should not need to call
             * this directly. You can call st_widget_sync_hover() if the hover
             * state might be out of sync due to another actor's pointer grab.
             * @param hover whether the pointer is hovering over the widget
             */
            set_hover(hover: boolean): void;
            /**
             * Sets `label` as the #ClutterActor that identifies (labels)
             * `widget`. `label` can be %NULL to indicate that `widget` is not
             * labelled any more
             * @param label a #ClutterActor
             */
            set_label_actor(label: Clutter.Actor): void;
            /**
             * Set the inline style string for this widget. The inline style string is an
             * optional ';'-separated list of CSS properties that override the style as
             * determined from the stylesheets of the current theme.
             * @param style a inline style string, or %NULL
             */
            set_style(style?: string | null): void;
            /**
             * Set the style class name list. `style_class_list` can either be
             * %NULL, for no classes, or a space-separated list of style class
             * names. See also st_widget_add_style_class_name() and
             * st_widget_remove_style_class_name().
             * @param style_class_list a new style class list string
             */
            set_style_class_name(style_class_list?: string | null): void;
            /**
             * Set the style pseudo class list. `pseudo_class_list` can either be
             * %NULL, for no classes, or a space-separated list of pseudo class
             * names. See also st_widget_add_style_pseudo_class() and
             * st_widget_remove_style_pseudo_class().
             * @param pseudo_class_list a new pseudo class list string
             */
            set_style_pseudo_class(pseudo_class_list?: string | null): void;
            /**
             * Enables hover tracking on the #StWidget.
             *
             * If hover tracking is enabled, and the widget is visible and
             * reactive, then `widget'`s #StWidget:hover property will be updated
             * automatically to reflect whether the pointer is in `widget` (or one
             * of its children), and `widget'`s #StWidget:pseudo-class will have
             * the "hover" class added and removed from it accordingly.
             *
             * Note that currently it is not possible to correctly track the hover
             * state when another actor has a pointer grab. You can use
             * st_widget_sync_hover() to update the property manually in this
             * case.
             * @param track_hover %TRUE if the widget should track the pointer hover state
             */
            set_track_hover(track_hover: boolean): void;
            style_changed(): void;
            /**
             * Sets `widget'`s hover state according to the current pointer
             * position. This can be used to ensure that it is correct after
             * (or during) a pointer grab.
             */
            sync_hover(): void;

            // Inherited methods
            /**
             * Finds the [class`GObject`.ParamSpec] for `property_name`
             * @param property_name the name of the animatable property to find
             * @returns The #GParamSpec for the given property   or %NULL
             */
            find_property(property_name: string): GObject.ParamSpec;
            /**
             * Get animated actor.
             * @returns a #ClutterActor
             */
            get_actor(): Clutter.Actor;
            /**
             * Retrieves the current state of `property_name` and sets `value` with it
             * @param property_name the name of the animatable property to retrieve
             * @param value a #GValue initialized to the type of the property to retrieve
             */
            get_initial_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Asks a #ClutterAnimatable implementation to interpolate a
             * a named property between the initial and final values of
             * a #ClutterInterval, using `progress` as the interpolation
             * value, and store the result inside `value`.
             *
             * This function should be used for every property animation
             * involving `ClutterAnimatable`s.
             * @param property_name the name of the property to interpolate
             * @param interval a #ClutterInterval with the animation range
             * @param progress the progress to use to interpolate between the   initial and final values of the @interval
             * @returns %TRUE if the interpolation was successful,   and %FALSE otherwise
             */
            interpolate_value(property_name: string, interval: Clutter.Interval, progress: number): [boolean, unknown];
            /**
             * Sets the current state of `property_name` to `value`
             * @param property_name the name of the animatable property to set
             * @param value the value of the animatable property to set
             */
            set_final_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Finds the [class`GObject`.ParamSpec] for `property_name`
             * @param property_name the name of the animatable property to find
             */
            vfunc_find_property(property_name: string): GObject.ParamSpec;
            /**
             * Get animated actor.
             */
            vfunc_get_actor(): Clutter.Actor;
            /**
             * Retrieves the current state of `property_name` and sets `value` with it
             * @param property_name the name of the animatable property to retrieve
             * @param value a #GValue initialized to the type of the property to retrieve
             */
            vfunc_get_initial_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Asks a #ClutterAnimatable implementation to interpolate a
             * a named property between the initial and final values of
             * a #ClutterInterval, using `progress` as the interpolation
             * value, and store the result inside `value`.
             *
             * This function should be used for every property animation
             * involving `ClutterAnimatable`s.
             * @param property_name the name of the property to interpolate
             * @param interval a #ClutterInterval with the animation range
             * @param progress the progress to use to interpolate between the   initial and final values of the @interval
             */
            vfunc_interpolate_value(
                property_name: string,
                interval: Clutter.Interval,
                progress: number,
            ): [boolean, unknown];
            /**
             * Sets the current state of `property_name` to `value`
             * @param property_name the name of the animatable property to set
             * @param value the value of the animatable property to set
             */
            vfunc_set_final_state(property_name: string, value: GObject.Value | any): void;
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        namespace WidgetAccessible {
            // Constructor properties interface

            interface ConstructorProps
                extends Clutter.ActorAccessible.ConstructorProps,
                    Atk.Component.ConstructorProps {}
        }

        class WidgetAccessible extends Clutter.ActorAccessible implements Atk.Component {
            static $gtype: GObject.GType<WidgetAccessible>;

            // Constructors

            constructor(properties?: Partial<WidgetAccessible.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Inherited methods
            /**
             * Checks whether the specified point is within the extent of the `component`.
             *
             * Toolkit implementor note: ATK provides a default implementation for
             * this virtual method. In general there are little reason to
             * re-implement it.
             * @param x x coordinate
             * @param y y coordinate
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             * @returns %TRUE or %FALSE indicating whether the specified point is within the extent of the @component or not
             */
            contains(x: number, y: number, coord_type: Atk.CoordType | null): boolean;
            /**
             * Returns the alpha value (i.e. the opacity) for this
             * `component,` on a scale from 0 (fully transparent) to 1.0
             * (fully opaque).
             * @returns An alpha value from 0 to 1.0, inclusive.
             */
            get_alpha(): number;
            /**
             * Gets the rectangle which gives the extent of the `component`.
             *
             * If the extent can not be obtained (e.g. a non-embedded plug or missing
             * support), all of x, y, width, height are set to -1.
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            get_extents(coord_type: Atk.CoordType | null): [number, number, number, number];
            /**
             * Gets the layer of the component.
             * @returns an #AtkLayer which is the layer of the component
             */
            get_layer(): Atk.Layer;
            /**
             * Gets the zorder of the component. The value G_MININT will be returned
             * if the layer of the component is not ATK_LAYER_MDI or ATK_LAYER_WINDOW.
             * @returns a gint which is the zorder of the component, i.e. the depth at which the component is shown in relation to other components in the same container.
             */
            get_mdi_zorder(): number;
            /**
             * Gets the position of `component` in the form of
             * a point specifying `component'`s top-left corner.
             *
             * If the position can not be obtained (e.g. a non-embedded plug or missing
             * support), x and y are set to -1.
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            get_position(coord_type: Atk.CoordType | null): [number, number];
            /**
             * Gets the size of the `component` in terms of width and height.
             *
             * If the size can not be obtained (e.g. a non-embedded plug or missing
             * support), width and height are set to -1.
             */
            get_size(): [number, number];
            /**
             * Grabs focus for this `component`.
             * @returns %TRUE if successful, %FALSE otherwise.
             */
            grab_focus(): boolean;
            /**
             * Gets a reference to the accessible child, if one exists, at the
             * coordinate point specified by `x` and `y`.
             * @param x x coordinate
             * @param y y coordinate
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             * @returns a reference to the accessible child, if one exists
             */
            ref_accessible_at_point(x: number, y: number, coord_type: Atk.CoordType | null): Atk.Object | null;
            /**
             * Remove the handler specified by `handler_id` from the list of
             * functions to be executed when this object receives focus events
             * (in or out).
             * @param handler_id the handler id of the focus handler to be removed from @component
             */
            remove_focus_handler(handler_id: number): void;
            /**
             * Makes `component` visible on the screen by scrolling all necessary parents.
             *
             * Contrary to atk_component_set_position, this does not actually move
             * `component` in its parent, this only makes the parents scroll so that the
             * object shows up on the screen, given its current position within the parents.
             * @param type specify where the object should be made visible.
             * @returns whether scrolling was successful.
             */
            scroll_to(type: Atk.ScrollType | null): boolean;
            /**
             * Move the top-left of `component` to a given position of the screen by
             * scrolling all necessary parents.
             * @param coords specify whether coordinates are relative to the screen or to the parent object.
             * @param x x-position where to scroll to
             * @param y y-position where to scroll to
             * @returns whether scrolling was successful.
             */
            scroll_to_point(coords: Atk.CoordType | null, x: number, y: number): boolean;
            /**
             * Sets the extents of `component`.
             * @param x x coordinate
             * @param y y coordinate
             * @param width width to set for @component
             * @param height height to set for @component
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             * @returns %TRUE or %FALSE whether the extents were set or not
             */
            set_extents(x: number, y: number, width: number, height: number, coord_type: Atk.CoordType | null): boolean;
            /**
             * Sets the position of `component`.
             *
             * Contrary to atk_component_scroll_to, this does not trigger any scrolling,
             * this just moves `component` in its parent.
             * @param x x coordinate
             * @param y y coordinate
             * @param coord_type specifies whether the coordinates are relative to the screen or to the component's top level window
             * @returns %TRUE or %FALSE whether or not the position was set or not
             */
            set_position(x: number, y: number, coord_type: Atk.CoordType | null): boolean;
            /**
             * Set the size of the `component` in terms of width and height.
             * @param width width to set for @component
             * @param height height to set for @component
             * @returns %TRUE or %FALSE whether the size was set or not
             */
            set_size(width: number, height: number): boolean;
            vfunc_bounds_changed(bounds: Atk.Rectangle): void;
            /**
             * Checks whether the specified point is within the extent of the `component`.
             *
             * Toolkit implementor note: ATK provides a default implementation for
             * this virtual method. In general there are little reason to
             * re-implement it.
             * @param x x coordinate
             * @param y y coordinate
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            vfunc_contains(x: number, y: number, coord_type: Atk.CoordType): boolean;
            /**
             * Returns the alpha value (i.e. the opacity) for this
             * `component,` on a scale from 0 (fully transparent) to 1.0
             * (fully opaque).
             */
            vfunc_get_alpha(): number;
            /**
             * Gets the rectangle which gives the extent of the `component`.
             *
             * If the extent can not be obtained (e.g. a non-embedded plug or missing
             * support), all of x, y, width, height are set to -1.
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            vfunc_get_extents(coord_type: Atk.CoordType): [number, number, number, number];
            /**
             * Gets the layer of the component.
             */
            vfunc_get_layer(): Atk.Layer;
            /**
             * Gets the zorder of the component. The value G_MININT will be returned
             * if the layer of the component is not ATK_LAYER_MDI or ATK_LAYER_WINDOW.
             */
            vfunc_get_mdi_zorder(): number;
            /**
             * Gets the position of `component` in the form of
             * a point specifying `component'`s top-left corner.
             *
             * If the position can not be obtained (e.g. a non-embedded plug or missing
             * support), x and y are set to -1.
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            vfunc_get_position(coord_type: Atk.CoordType): [number, number];
            /**
             * Gets the size of the `component` in terms of width and height.
             *
             * If the size can not be obtained (e.g. a non-embedded plug or missing
             * support), width and height are set to -1.
             */
            vfunc_get_size(): [number, number];
            /**
             * Grabs focus for this `component`.
             */
            vfunc_grab_focus(): boolean;
            /**
             * Gets a reference to the accessible child, if one exists, at the
             * coordinate point specified by `x` and `y`.
             * @param x x coordinate
             * @param y y coordinate
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            vfunc_ref_accessible_at_point(x: number, y: number, coord_type: Atk.CoordType): Atk.Object | null;
            /**
             * Remove the handler specified by `handler_id` from the list of
             * functions to be executed when this object receives focus events
             * (in or out).
             * @param handler_id the handler id of the focus handler to be removed from @component
             */
            vfunc_remove_focus_handler(handler_id: number): void;
            /**
             * Makes `component` visible on the screen by scrolling all necessary parents.
             *
             * Contrary to atk_component_set_position, this does not actually move
             * `component` in its parent, this only makes the parents scroll so that the
             * object shows up on the screen, given its current position within the parents.
             * @param type specify where the object should be made visible.
             */
            vfunc_scroll_to(type: Atk.ScrollType): boolean;
            /**
             * Move the top-left of `component` to a given position of the screen by
             * scrolling all necessary parents.
             * @param coords specify whether coordinates are relative to the screen or to the parent object.
             * @param x x-position where to scroll to
             * @param y y-position where to scroll to
             */
            vfunc_scroll_to_point(coords: Atk.CoordType, x: number, y: number): boolean;
            /**
             * Sets the extents of `component`.
             * @param x x coordinate
             * @param y y coordinate
             * @param width width to set for @component
             * @param height height to set for @component
             * @param coord_type specifies whether the coordinates are relative to the screen or to the components top level window
             */
            vfunc_set_extents(x: number, y: number, width: number, height: number, coord_type: Atk.CoordType): boolean;
            /**
             * Sets the position of `component`.
             *
             * Contrary to atk_component_scroll_to, this does not trigger any scrolling,
             * this just moves `component` in its parent.
             * @param x x coordinate
             * @param y y coordinate
             * @param coord_type specifies whether the coordinates are relative to the screen or to the component's top level window
             */
            vfunc_set_position(x: number, y: number, coord_type: Atk.CoordType): boolean;
            /**
             * Set the size of the `component` in terms of width and height.
             * @param width width to set for @component
             * @param height height to set for @component
             */
            vfunc_set_size(width: number, height: number): boolean;
            /**
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target`.
             *
             * Whenever the `source_property` is changed the `target_property` is
             * updated using the same value. For instance:
             *
             *
             * ```c
             *   g_object_bind_property (action, "active", widget, "sensitive", 0);
             * ```
             *
             *
             * Will result in the "sensitive" property of the widget #GObject instance to be
             * updated with the same value of the "active" property of the action #GObject
             * instance.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well.
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. To remove the binding without affecting the
             * `source` and the `target` you can just call g_object_unref() on the returned
             * #GBinding instance.
             *
             * Removing the binding by calling g_object_unref() on it must only be done if
             * the binding, `source` and `target` are only used from a single thread and it
             * is clear that both `source` and `target` outlive the binding. Especially it
             * is not safe to rely on this if the binding, `source` or `target` can be
             * finalized from different threads. Keep another reference to the binding and
             * use g_binding_unbind() instead to be on the safe side.
             *
             * A #GObject can have multiple bindings.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
            ): GObject.Binding;
            /**
             * Complete version of g_object_bind_property().
             *
             * Creates a binding between `source_property` on `source` and `target_property`
             * on `target,` allowing you to set the transformation functions to be used by
             * the binding.
             *
             * If `flags` contains %G_BINDING_BIDIRECTIONAL then the binding will be mutual:
             * if `target_property` on `target` changes then the `source_property` on `source`
             * will be updated as well. The `transform_from` function is only used in case
             * of bidirectional bindings, otherwise it will be ignored
             *
             * The binding will automatically be removed when either the `source` or the
             * `target` instances are finalized. This will release the reference that is
             * being held on the #GBinding instance; if you want to hold on to the
             * #GBinding instance, you will need to hold a reference to it.
             *
             * To remove the binding, call g_binding_unbind().
             *
             * A #GObject can have multiple bindings.
             *
             * The same `user_data` parameter will be used for both `transform_to`
             * and `transform_from` transformation functions; the `notify` function will
             * be called once, when the binding is removed. If you need different data
             * for each transformation function, please use
             * g_object_bind_property_with_closures() instead.
             * @param source_property the property on @source to bind
             * @param target the target #GObject
             * @param target_property the property on @target to bind
             * @param flags flags to pass to #GBinding
             * @param transform_to the transformation function     from the @source to the @target, or %NULL to use the default
             * @param transform_from the transformation function     from the @target to the @source, or %NULL to use the default
             * @param notify a function to call when disposing the binding, to free     resources used by the transformation functions, or %NULL if not required
             * @returns the #GBinding instance representing the     binding between the two #GObject instances. The binding is released     whenever the #GBinding reference count reaches zero.
             */
            bind_property_full(
                source_property: string,
                target: GObject.Object,
                target_property: string,
                flags: GObject.BindingFlags | null,
                transform_to?: GObject.BindingTransformFunc | null,
                transform_from?: GObject.BindingTransformFunc | null,
                notify?: GLib.DestroyNotify | null,
            ): GObject.Binding;
            // Conflicted with GObject.Object.bind_property_full
            bind_property_full(...args: never[]): any;
            /**
             * This function is intended for #GObject implementations to re-enforce
             * a [floating][floating-ref] object reference. Doing this is seldom
             * required: all #GInitiallyUnowneds are created with a floating reference
             * which usually just needs to be sunken by calling g_object_ref_sink().
             */
            force_floating(): void;
            /**
             * Increases the freeze count on `object`. If the freeze count is
             * non-zero, the emission of "notify" signals on `object` is
             * stopped. The signals are queued until the freeze count is decreased
             * to zero. Duplicate notifications are squashed so that at most one
             * #GObject::notify signal is emitted for each property modified while the
             * object is frozen.
             *
             * This is necessary for accessors that modify multiple properties to prevent
             * premature notification while the object is still being modified.
             */
            freeze_notify(): void;
            /**
             * Gets a named field from the objects table of associations (see g_object_set_data()).
             * @param key name of the key for that association
             * @returns the data if found,          or %NULL if no such data exists.
             */
            get_data(key: string): any | null;
            /**
             * Gets a property of an object.
             *
             * The value can be:
             * - an empty GObject.Value initialized by G_VALUE_INIT, which will be automatically initialized with the expected type of the property (since GLib 2.60)
             * - a GObject.Value initialized with the expected type of the property
             * - a GObject.Value initialized with a type to which the expected type of the property can be transformed
             *
             * In general, a copy is made of the property contents and the caller is responsible for freeing the memory by calling GObject.Value.unset.
             *
             * Note that GObject.Object.get_property is really intended for language bindings, GObject.Object.get is much more convenient for C programming.
             * @param property_name The name of the property to get
             * @param value Return location for the property value. Can be an empty GObject.Value initialized by G_VALUE_INIT (auto-initialized with expected type since GLib 2.60), a GObject.Value initialized with the expected property type, or a GObject.Value initialized with a transformable type
             */
            get_property(property_name: string, value: GObject.Value | any): any;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            get_qdata(quark: GLib.Quark): any | null;
            /**
             * Gets `n_properties` properties for an `object`.
             * Obtained properties will be set to `values`. All properties must be valid.
             * Warnings will be emitted and undefined behaviour may result if invalid
             * properties are passed in.
             * @param names the names of each property to get
             * @param values the values of each property to get
             */
            getv(names: string[], values: (GObject.Value | any)[]): void;
            /**
             * Checks whether `object` has a [floating][floating-ref] reference.
             * @returns %TRUE if @object has a floating reference
             */
            is_floating(): boolean;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param property_name the name of a property installed on the class of @object.
             */
            notify(property_name: string): void;
            /**
             * Emits a "notify" signal for the property specified by `pspec` on `object`.
             *
             * This function omits the property name lookup, hence it is faster than
             * g_object_notify().
             *
             * One way to avoid using g_object_notify() from within the
             * class that registered the properties, and using g_object_notify_by_pspec()
             * instead, is to store the GParamSpec used with
             * g_object_class_install_property() inside a static array, e.g.:
             *
             *
             * ```c
             *   typedef enum
             *   {
             *     PROP_FOO = 1,
             *     PROP_LAST
             *   } MyObjectProperty;
             *
             *   static GParamSpec *properties[PROP_LAST];
             *
             *   static void
             *   my_object_class_init (MyObjectClass *klass)
             *   {
             *     properties[PROP_FOO] = g_param_spec_int ("foo", NULL, NULL,
             *                                              0, 100,
             *                                              50,
             *                                              G_PARAM_READWRITE | G_PARAM_STATIC_STRINGS);
             *     g_object_class_install_property (gobject_class,
             *                                      PROP_FOO,
             *                                      properties[PROP_FOO]);
             *   }
             * ```
             *
             *
             * and then notify a change on the "foo" property with:
             *
             *
             * ```c
             *   g_object_notify_by_pspec (self, properties[PROP_FOO]);
             * ```
             *
             * @param pspec the #GParamSpec of a property installed on the class of @object.
             */
            notify_by_pspec(pspec: GObject.ParamSpec): void;
            /**
             * Increases the reference count of `object`.
             *
             * Since GLib 2.56, if `GLIB_VERSION_MAX_ALLOWED` is 2.56 or greater, the type
             * of `object` will be propagated to the return type (using the GCC typeof()
             * extension), so any casting the caller needs to do on the return type must be
             * explicit.
             * @returns the same @object
             */
            ref(): GObject.Object;
            /**
             * Increase the reference count of `object,` and possibly remove the
             * [floating][floating-ref] reference, if `object` has a floating reference.
             *
             * In other words, if the object is floating, then this call "assumes
             * ownership" of the floating reference, converting it to a normal
             * reference by clearing the floating flag while leaving the reference
             * count unchanged.  If the object is not floating, then this call
             * adds a new normal reference increasing the reference count by one.
             *
             * Since GLib 2.56, the type of `object` will be propagated to the return type
             * under the same conditions as for g_object_ref().
             * @returns @object
             */
            ref_sink(): GObject.Object;
            /**
             * Releases all references to other objects. This can be used to break
             * reference cycles.
             *
             * This function should only be called from object system implementations.
             */
            run_dispose(): void;
            /**
             * Each object carries around a table of associations from
             * strings to pointers.  This function lets you set an association.
             *
             * If the object already had an association with that name,
             * the old association will be destroyed.
             *
             * Internally, the `key` is converted to a #GQuark using g_quark_from_string().
             * This means a copy of `key` is kept permanently (even after `object` has been
             * finalized) — so it is recommended to only use a small, bounded set of values
             * for `key` in your program, to avoid the #GQuark storage growing unbounded.
             * @param key name of the key
             * @param data data to associate with that key
             */
            set_data(key: string, data?: any | null): void;
            /**
             * Sets a property on an object.
             * @param property_name The name of the property to set
             * @param value The value to set the property to
             */
            set_property(property_name: string, value: GObject.Value | any): void;
            /**
             * Remove a specified datum from the object's data associations,
             * without invoking the association's destroy handler.
             * @param key name of the key
             * @returns the data if found, or %NULL          if no such data exists.
             */
            steal_data(key: string): any | null;
            /**
             * This function gets back user data pointers stored via
             * g_object_set_qdata() and removes the `data` from object
             * without invoking its destroy() function (if any was
             * set).
             * Usually, calling this function is only required to update
             * user data pointers with a destroy notifier, for example:
             *
             * ```c
             * void
             * object_add_to_user_list (GObject     *object,
             *                          const gchar *new_string)
             * {
             *   // the quark, naming the object data
             *   GQuark quark_string_list = g_quark_from_static_string ("my-string-list");
             *   // retrieve the old string list
             *   GList *list = g_object_steal_qdata (object, quark_string_list);
             *
             *   // prepend new string
             *   list = g_list_prepend (list, g_strdup (new_string));
             *   // this changed 'list', so we need to set it again
             *   g_object_set_qdata_full (object, quark_string_list, list, free_string_list);
             * }
             * static void
             * free_string_list (gpointer data)
             * {
             *   GList *node, *list = data;
             *
             *   for (node = list; node; node = node->next)
             *     g_free (node->data);
             *   g_list_free (list);
             * }
             * ```
             *
             * Using g_object_get_qdata() in the above example, instead of
             * g_object_steal_qdata() would have left the destroy function set,
             * and thus the partial string list would have been freed upon
             * g_object_set_qdata_full().
             * @param quark A #GQuark, naming the user data pointer
             * @returns The user data pointer set, or %NULL
             */
            steal_qdata(quark: GLib.Quark): any | null;
            /**
             * Reverts the effect of a previous call to
             * g_object_freeze_notify(). The freeze count is decreased on `object`
             * and when it reaches zero, queued "notify" signals are emitted.
             *
             * Duplicate notifications for each property are squashed so that at most one
             * #GObject::notify signal is emitted for each property, in the reverse order
             * in which they have been queued.
             *
             * It is an error to call this function when the freeze count is zero.
             */
            thaw_notify(): void;
            /**
             * Decreases the reference count of `object`. When its reference count
             * drops to 0, the object is finalized (i.e. its memory is freed).
             *
             * If the pointer to the #GObject may be reused in future (for example, if it is
             * an instance variable of another object), it is recommended to clear the
             * pointer to %NULL rather than retain a dangling pointer to a potentially
             * invalid #GObject instance. Use g_clear_object() for this.
             */
            unref(): void;
            /**
             * This function essentially limits the life time of the `closure` to
             * the life time of the object. That is, when the object is finalized,
             * the `closure` is invalidated by calling g_closure_invalidate() on
             * it, in order to prevent invocations of the closure with a finalized
             * (nonexisting) object. Also, g_object_ref() and g_object_unref() are
             * added as marshal guards to the `closure,` to ensure that an extra
             * reference count is held on `object` during invocation of the
             * `closure`.  Usually, this function will be called on closures that
             * use this `object` as closure data.
             * @param closure #GClosure to watch
             */
            watch_closure(closure: GObject.Closure): void;
            /**
             * the `constructed` function is called by g_object_new() as the
             *  final step of the object creation process.  At the point of the call, all
             *  construction properties have been set on the object.  The purpose of this
             *  call is to allow for object initialisation steps that can only be performed
             *  after construction properties have been set.  `constructed` implementors
             *  should chain up to the `constructed` call of their parent class to allow it
             *  to complete its initialisation.
             */
            vfunc_constructed(): void;
            /**
             * emits property change notification for a bunch
             *  of properties. Overriding `dispatch_properties_changed` should be rarely
             *  needed.
             * @param n_pspecs
             * @param pspecs
             */
            vfunc_dispatch_properties_changed(n_pspecs: number, pspecs: GObject.ParamSpec): void;
            /**
             * the `dispose` function is supposed to drop all references to other
             *  objects, but keep the instance otherwise intact, so that client method
             *  invocations still work. It may be run multiple times (due to reference
             *  loops). Before returning, `dispose` should chain up to the `dispose` method
             *  of the parent class.
             */
            vfunc_dispose(): void;
            /**
             * instance finalization function, should finish the finalization of
             *  the instance begun in `dispose` and chain up to the `finalize` method of the
             *  parent class.
             */
            vfunc_finalize(): void;
            /**
             * the generic getter for all properties of this type. Should be
             *  overridden for every type with properties.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_get_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Emits a "notify" signal for the property `property_name` on `object`.
             *
             * When possible, eg. when signaling a property change from within the class
             * that registered the property, you should use g_object_notify_by_pspec()
             * instead.
             *
             * Note that emission of the notify signal may be blocked with
             * g_object_freeze_notify(). In this case, the signal emissions are queued
             * and will be emitted (in reverse order) when g_object_thaw_notify() is
             * called.
             * @param pspec
             */
            vfunc_notify(pspec: GObject.ParamSpec): void;
            /**
             * the generic setter for all properties of this type. Should be
             *  overridden for every type with properties. If implementations of
             *  `set_property` don't emit property change notification explicitly, this will
             *  be done implicitly by the type system. However, if the notify signal is
             *  emitted explicitly, the type system will not emit it a second time.
             * @param property_id
             * @param value
             * @param pspec
             */
            vfunc_set_property(property_id: number, value: GObject.Value | any, pspec: GObject.ParamSpec): void;
            /**
             * Disconnects a handler from an instance so it will not be called during any future or currently ongoing emissions of the signal it has been connected to.
             * @param id Handler ID of the handler to be disconnected
             */
            disconnect(id: number): void;
            /**
             * Sets multiple properties of an object at once. The properties argument should be a dictionary mapping property names to values.
             * @param properties Object containing the properties to set
             */
            set(properties: { [key: string]: any }): void;
            /**
             * Blocks a handler of an instance so it will not be called during any signal emissions
             * @param id Handler ID of the handler to be blocked
             */
            block_signal_handler(id: number): void;
            /**
             * Unblocks a handler so it will be called again during any signal emissions
             * @param id Handler ID of the handler to be unblocked
             */
            unblock_signal_handler(id: number): void;
            /**
             * Stops a signal's emission by the given signal name. This will prevent the default handler and any subsequent signal handlers from being invoked.
             * @param detailedName Name of the signal to stop emission of
             */
            stop_emission_by_name(detailedName: string): void;
        }

        type AdjustmentClass = typeof Adjustment;
        type BinClass = typeof Bin;
        type BorderImageClass = typeof BorderImage;
        type BoxLayoutClass = typeof BoxLayout;
        abstract class BoxLayoutPrivate {
            static $gtype: GObject.GType<BoxLayoutPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type ButtonClass = typeof Button;
        type ClipboardClass = typeof Clipboard;
        type DrawingAreaClass = typeof DrawingArea;
        type EntryClass = typeof Entry;
        type FocusManagerClass = typeof FocusManager;
        type GenericAccessibleClass = typeof GenericAccessible;
        type IconClass = typeof Icon;
        /**
         * The #StIconColors structure encapsulates colors for colorizing a symbolic
         * icon.
         */
        class IconColors {
            static $gtype: GObject.GType<IconColors>;

            // Fields

            foreground: Cogl.Color;
            warning: Cogl.Color;
            error: Cogl.Color;
            success: Cogl.Color;

            // Constructors

            constructor(
                properties?: Partial<{
                    foreground: Cogl.Color;
                    warning: Cogl.Color;
                    error: Cogl.Color;
                    success: Cogl.Color;
                }>,
            );
            _init(...args: any[]): void;

            static ['new'](): IconColors;

            // Methods

            /**
             * Creates a new StIconColors structure that is a copy of the passed
             * in `colors`. You would use this function instead of st_icon_colors_ref()
             * if you were planning to change colors in the result.
             * @returns a newly created #StIconColors.
             */
            copy(): IconColors;
            /**
             * Check if two #StIconColors objects are identical.
             * @param other another #StIconColors
             * @returns %TRUE if the #StIconColors are equal
             */
            equal(other: IconColors): boolean;
            /**
             * Atomically increments the reference count of `colors` by one.
             * @returns the passed in #StIconColors.
             */
            ref(): IconColors;
            /**
             * Atomically decrements the reference count of `colors` by one.
             * If the reference count drops to 0, all memory allocated by the
             * #StIconColors is released.
             */
            unref(): void;
        }

        type IconInfoClass = typeof IconInfo;
        abstract class IconPrivate {
            static $gtype: GObject.GType<IconPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type IconThemeClass = typeof IconTheme;
        type ImageContentClass = typeof ImageContent;
        type LabelClass = typeof Label;
        abstract class LabelPrivate {
            static $gtype: GObject.GType<LabelPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type PasswordEntryClass = typeof PasswordEntry;
        type ScrollBarClass = typeof ScrollBar;
        type ScrollViewClass = typeof ScrollView;
        type ScrollViewFadeClass = typeof ScrollViewFade;
        type ScrollableInterface = typeof Scrollable;
        type SettingsClass = typeof Settings;
        /**
         * A type representing -st-shadow attributes
         *
         * #StShadow is a boxed type for storing attributes of the -st-shadow
         * property, modelled liberally after the CSS3 box-shadow property.
         * See http://www.css3.info/preview/box-shadow/
         */
        class Shadow {
            static $gtype: GObject.GType<Shadow>;

            // Fields

            color: Cogl.Color;
            xoffset: number;
            yoffset: number;
            blur: number;
            spread: number;
            inset: boolean;

            // Constructors

            constructor(
                properties?: Partial<{
                    color: Cogl.Color;
                    xoffset: number;
                    yoffset: number;
                    blur: number;
                    spread: number;
                    inset: boolean;
                }>,
            );
            _init(...args: any[]): void;

            static ['new'](
                color: Cogl.Color,
                xoffset: number,
                yoffset: number,
                blur: number,
                spread: number,
                inset: boolean,
            ): Shadow;

            // Methods

            /**
             * Check if two shadow objects are identical. Note that two shadows may
             * compare non-identically if they differ only by floating point rounding
             * errors.
             * @param other a different #StShadow
             * @returns %TRUE if the two shadows are identical
             */
            equal(other: Shadow): boolean;
            /**
             * Gets the box used to paint `shadow,` which will be partly
             * outside of `actor_box`
             * @param actor_box the box allocated to a #ClutterAlctor
             * @param shadow_box computed box occupied by @shadow
             */
            get_box(actor_box: Clutter.ActorBox, shadow_box: Clutter.ActorBox): void;
            /**
             * Atomically increments the reference count of `shadow` by one.
             * @returns the passed in #StShadow.
             */
            ref(): Shadow;
            /**
             * Atomically decrements the reference count of `shadow` by one.
             * If the reference count drops to 0, all memory allocated by the
             * #StShadow is released.
             */
            unref(): void;
        }

        /**
         * A helper for implementing a drop shadow on a actor.
         * The actor is expected to recreate the helper whenever its contents
         * or size change. Then, it would call st_shadow_helper_paint() inside
         * its paint() virtual function.
         */
        class ShadowHelper {
            static $gtype: GObject.GType<ShadowHelper>;

            // Constructors

            constructor(shadow: Shadow);
            _init(...args: any[]): void;

            static ['new'](shadow: Shadow): ShadowHelper;

            // Methods

            copy(): ShadowHelper;
            /**
             * Free resources associated with `helper`.
             */
            free(): void;
            /**
             * Paints the shadow associated with `helper` This must only
             * be called from the implementation of ClutterActor::paint().
             * @param node a #ClutterPaintNode
             * @param actor_box the bounding box of the shadow
             * @param paint_opacity the opacity at which the shadow is painted
             */
            paint(node: Clutter.PaintNode, actor_box: Clutter.ActorBox, paint_opacity: number): void;
            /**
             * Update `helper` from `source`.
             * @param source a #ClutterActor
             * @param paint_context a #ClutterPaintContext
             */
            update(source: Clutter.Actor, paint_context: Clutter.PaintContext): void;
        }

        type TextureCacheClass = typeof TextureCache;
        type ThemeClass = typeof Theme;
        type ThemeContextClass = typeof ThemeContext;
        type ThemeNodeClass = typeof ThemeNode;
        class ThemeNodePaintState {
            static $gtype: GObject.GType<ThemeNodePaintState>;

            // Fields

            node: ThemeNode;
            alloc_width: number;
            alloc_height: number;
            box_shadow_width: number;
            box_shadow_height: number;
            resource_scale: number;
            box_shadow_pipeline: Cogl.Pipeline;
            prerendered_texture: Cogl.Texture;
            prerendered_pipeline: Cogl.Pipeline;
            corner_pipeline: Cogl.Pipeline[];

            // Constructors

            _init(...args: any[]): void;

            // Methods

            copy(other: ThemeNodePaintState): void;
            free(): void;
            init(): void;
            invalidate(): void;
            invalidate_for_file(file: Gio.File): boolean;
            set_node(node: ThemeNode): void;
        }

        type ViewportClass = typeof Viewport;
        type WidgetAccessibleClass = typeof WidgetAccessible;
        type WidgetClass = typeof Widget;
        namespace Scrollable {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                hadjustment: Adjustment;
                vadjustment: Adjustment;
            }
        }

        export interface ScrollableNamespace {
            $gtype: GObject.GType<Scrollable>;
            prototype: Scrollable;
        }
        interface Scrollable extends GObject.Object {
            // Properties

            /**
             * The horizontal #StAdjustment used by the #StScrollable.
             *
             * Implementations should override this property to provide read-write
             * access to the #StAdjustment.
             *
             * JavaScript code may override this as demonstrated below:
             *
             * ```js
             * export const MyScrollable = GObject.registerClass({
             *     Properties: {
             *         'hadjustment': GObject.ParamSpec.override(
             *             'hadjustment',
             *             St.Scrollable
             *         )
             *     }
             * }, class MyScrollable extends St.Scrollable {
             *
             *     get hadjustment() {
             *         return this._hadjustment || null;
             *     }
             *
             *     set hadjustment(adjustment) {
             *         if (this.hadjustment === adjustment)
             *             return;
             *
             *         this._hadjustment = adjustment;
             *         this.notify('hadjustment');
             *     }
             * });
             * ```
             */
            get hadjustment(): Adjustment;
            set hadjustment(val: Adjustment);
            /**
             * The vertical #StAdjustment used by the #StScrollable.
             *
             * Implementations should override this property to provide read-write
             * access to the #StAdjustment.
             *
             * See #StScrollable:hadjustment for an example of how to override this
             * property in JavaScript code.
             */
            get vadjustment(): Adjustment;
            set vadjustment(val: Adjustment);

            // Methods

            get_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * This method should be implemented by classes implementing the #StScrollable
             * interface.
             *
             * JavaScript code should do this by overriding the `vfunc_set_adjustments()`
             * method.
             * @param hadjustment the horizontal #StAdjustment
             * @param vadjustment the vertical #StAdjustment
             */
            set_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;

            // Virtual methods

            vfunc_get_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
            /**
             * This method should be implemented by classes implementing the #StScrollable
             * interface.
             *
             * JavaScript code should do this by overriding the `vfunc_set_adjustments()`
             * method.
             * @param hadjustment the horizontal #StAdjustment
             * @param vadjustment the vertical #StAdjustment
             */
            vfunc_set_adjustments(hadjustment: Adjustment, vadjustment: Adjustment): void;
        }

        export const Scrollable: ScrollableNamespace & {
            new (): Scrollable; // This allows `obj instanceof Scrollable`
        };

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

    export default St;
}

declare module 'gi://St' {
    import St15 from 'gi://St?version=15';
    export default St15;
}
// END
