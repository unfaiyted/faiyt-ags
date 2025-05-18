/// <reference path="./graphene-1.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://Mtk?version=15' {
    // Module dependencies
    import type Graphene from 'gi://Graphene?version=1.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';

    export namespace Mtk {
        /**
         * Mtk-15
         */

        class MonitorTransform {
            static $gtype: GObject.GType<MonitorTransform>;

            // Static fields

            static NORMAL: number;
            static '90': number;
            static '180': number;
            static '270': number;
            static FLIPPED: number;
            static FLIPPED_90: number;
            static FLIPPED_180: number;
            static FLIPPED_270: number;

            // Constructors

            _init(...args: any[]): void;
        }

        export namespace RegionOverlap {
            export const $gtype: GObject.GType<RegionOverlap>;
        }

        enum RegionOverlap {
            OUT,
            IN,
            PART,
        }

        export namespace RoundingStrategy {
            export const $gtype: GObject.GType<RoundingStrategy>;
        }

        enum RoundingStrategy {
            SHRINK,
            GROW,
            ROUND,
        }
        const MONITOR_ALL_TRANSFORMS: number;
        const MONITOR_N_TRANSFORMS: number;
        const RECTANGLE_MAX_STACK_RECTS: number;
        const REGION_BUILDER_MAX_LEVELS: number;
        function compute_viewport_matrix(
            matrix: Graphene.Matrix,
            width: number,
            height: number,
            scale: number,
            transform: MonitorTransform | null,
            src_rect: Graphene.Rect,
        ): void;
        function monitor_transform_from_string(name: string): MonitorTransform;
        function monitor_transform_invert(transform: MonitorTransform | null): MonitorTransform;
        function monitor_transform_to_string(transform: MonitorTransform | null): string;
        function monitor_transform_transform(
            transform: MonitorTransform | null,
            other: MonitorTransform | null,
        ): MonitorTransform;
        function monitor_transform_transform_matrix(transform: MonitorTransform | null, matrix: Graphene.Matrix): void;
        function monitor_transform_transform_point(
            transform: MonitorTransform | null,
            area_width: number,
            area_height: number,
            point_x: number,
            point_y: number,
        ): void;
        function rectangle_from_graphene_rect(
            rect: Graphene.Rect,
            rounding_strategy: RoundingStrategy | null,
        ): Rectangle;
        function region_create(): Region;
        function region_create_rectangle(rect: Rectangle): Region;
        function region_create_rectangles(rects: Rectangle, n_rects: number): Region;
        function x11_errors_deinit(): void;
        class Rectangle {
            static $gtype: GObject.GType<Rectangle>;

            // Fields

            x: number;
            y: number;
            width: number;
            height: number;

            // Constructors

            constructor(
                properties?: Partial<{
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                }>,
            );
            _init(...args: any[]): void;

            static ['new'](x: number, y: number, width: number, height: number): Rectangle;

            static new_empty(): Rectangle;

            // Static methods

            static from_graphene_rect(rect: Graphene.Rect, rounding_strategy: RoundingStrategy): Rectangle;

            // Methods

            area(): number;
            contains_point(x: number, y: number): boolean;
            contains_pointf(x: number, y: number): boolean;
            contains_rect(inner_rect: Rectangle): boolean;
            copy(): Rectangle;
            could_fit_rect(inner_rect: Rectangle): boolean;
            crop_and_scale(src_rect: Graphene.Rect, dst_width: number, dst_height: number, dest: Rectangle): void;
            /**
             * Compares the two rectangles
             * @param src2 The second rectangle
             * @returns Whether the two rectangles are equal
             */
            equal(src2: Rectangle): boolean;
            free(): void;
            /**
             * Similar to [method`Rectangle`.overlap] but ignores the vertical location.
             * @param rect2 The second rectangle
             * @returns Whether the two rectangles overlap horizontally
             */
            horiz_overlap(rect2: Rectangle): boolean;
            /**
             * Find the intersection between the two rectangles
             * @param src2 another #MtkRectangle
             * @returns TRUE is some intersection exists and is not degenerate, FALSE   otherwise.
             */
            intersect(src2: Rectangle): [boolean, Rectangle];
            is_adjacent_to(other: Rectangle): boolean;
            /**
             * Similar to [method`Rectangle`.intersect] but doesn't provide
             * the location of the intersection.
             * @param rect2 The second rectangle
             * @returns Whether the two rectangles overlap
             */
            overlap(rect2: Rectangle): boolean;
            scale_double(scale: number, rounding_strategy: RoundingStrategy | null, dest: Rectangle): void;
            to_graphene_rect(): Graphene.Rect;
            /**
             * This function transforms the values in `rect` in order to compensate for
             * `transform` applied to a #MetaMonitor, making them match the viewport. Note
             * that compensating implies that for a clockwise rotation of the #MetaMonitor
             * an anti-clockwise rotation has to be applied to `rect`.
             * @param transform the #MtkMonitorTransform
             * @param width the width of the target space
             * @param height the height of the target space
             * @param dest the transformed #MtkRectangle
             */
            transform(transform: MonitorTransform | null, width: number, height: number, dest: Rectangle): void;
            /**
             * Computes the union of the two rectangles
             * @param rect2 another #MtkRectangle
             */
            union(rect2: Rectangle): Rectangle;
            /**
             * Similar to [method`Rectangle`.overlap] but ignores the horizontal location.
             * @param rect2 The second rectangle
             * @returns Whether the two rectangles overlap vertically
             */
            vert_overlap(rect2: Rectangle): boolean;
        }

        abstract class Region {
            static $gtype: GObject.GType<Region>;

            // Constructors

            _init(...args: any[]): void;

            // Static methods

            static create(): Region;
            static create_rectangle(rect: Rectangle): Region;
            static create_rectangles(rects: Rectangle, n_rects: number): Region;

            // Methods

            apply_matrix_transform_expand(transform: Graphene.Matrix): Region;
            contains_point(x: number, y: number): boolean;
            contains_rectangle(rect: Rectangle): RegionOverlap;
            copy(): Region;
            crop_and_scale(src_rect: Graphene.Rect, dst_width: number, dst_height: number): Region;
            equal(other: Region): boolean;
            get_extents(): Rectangle;
            get_rectangle(nth: number): Rectangle;
            intersect(other: Region): void;
            intersect_rectangle(rect: Rectangle): void;
            is_empty(): boolean;
            num_rectangles(): number;
            /**
             * Increases the reference count
             * @returns The region
             */
            ref(): Region;
            scale(scale: number): Region;
            subtract(other: Region): void;
            subtract_rectangle(rect: Rectangle): void;
            translate(dx: number, dy: number): void;
            union(other: Region): void;
            union_rectangle(rect: Rectangle): void;
            unref(): void;
        }

        class RegionBuilder {
            static $gtype: GObject.GType<RegionBuilder>;

            // Fields

            n_levels: number;

            // Constructors

            _init(...args: any[]): void;

            // Methods

            add_rectangle(x: number, y: number, width: number, height: number): void;
            finish(): Region;
            init(): void;
        }

        /**
         * MtkRegion is a yx banded region; sometimes its useful to iterate through
         * such a region treating the start and end of each horizontal band in a distinct
         * fashion.
         *
         * Usage:
         *
         * ```c
         *  MtkRegionIterator iter;
         *  for (mtk_region_iterator_init (&iter, region);
         *       !mtk_region_iterator_at_end (&iter);
         *       mtk_region_iterator_next (&iter))
         *  {
         *    [ Use iter.rectangle, iter.line_start, iter.line_end ]
         *  }
         * ```
         */
        class RegionIterator {
            static $gtype: GObject.GType<RegionIterator>;

            // Fields

            rectangle: Rectangle;
            line_start: boolean;
            line_end: boolean;
            i: number;

            // Constructors

            _init(...args: any[]): void;

            // Methods

            at_end(): boolean;
            init(region: Region): void;
            next(): void;
        }

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

    export default Mtk;
}

declare module 'gi://Mtk' {
    import Mtk15 from 'gi://Mtk?version=15';
    export default Mtk15;
}
// END
