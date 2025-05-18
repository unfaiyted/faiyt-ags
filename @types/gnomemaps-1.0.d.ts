/// <reference path="./shumate-1.0.d.ts" />
/// <reference path="./gtk-4.0.d.ts" />
/// <reference path="./gsk-4.0.d.ts" />
/// <reference path="./graphene-1.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gdk-4.0.d.ts" />
/// <reference path="./cairo-1.0.d.ts" />
/// <reference path="./cairo.d.ts" />
/// <reference path="./pangocairo-1.0.d.ts" />
/// <reference path="./pango-1.0.d.ts" />
/// <reference path="./harfbuzz-0.0.d.ts" />
/// <reference path="./freetype2-2.0.d.ts" />
/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />
/// <reference path="./gdkpixbuf-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://GnomeMaps?version=1.0' {
    // Module dependencies
    import type Shumate from 'gi://Shumate?version=1.0';
    import type Gtk from 'gi://Gtk?version=4.0';
    import type Gsk from 'gi://Gsk?version=4.0';
    import type Graphene from 'gi://Graphene?version=1.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type Gdk from 'gi://Gdk?version=4.0';
    import type cairo from 'cairo';
    import type PangoCairo from 'gi://PangoCairo?version=1.0';
    import type Pango from 'gi://Pango?version=1.0';
    import type HarfBuzz from 'gi://HarfBuzz?version=0.0';
    import type freetype2 from 'gi://freetype2?version=2.0';
    import type Gio from 'gi://Gio?version=2.0';
    import type GModule from 'gi://GModule?version=2.0';
    import type GdkPixbuf from 'gi://GdkPixbuf?version=2.0';

    export namespace GnomeMaps {
        /**
         * GnomeMaps-1.0
         */

        function osm_finalize(): void;
        function osm_init(): void;
        function osm_parse(content: string, length: number): OSMObject;
        function osm_parse_user_details(content: string): string;
        namespace FileDataSource {
            // Constructor properties interface

            interface ConstructorProps extends Shumate.DataSource.ConstructorProps {
                max_zoom: number;
                maxZoom: number;
                min_zoom: number;
                minZoom: number;
                path: string;
            }
        }

        /**
         * The #MapsFileDataSource structure contains only private data
         * and should be accessed using the provided API
         */
        class FileDataSource extends Shumate.DataSource {
            static $gtype: GObject.GType<FileDataSource>;

            // Properties

            /**
             * The maximum zoom level of the tile source.
             */
            get max_zoom(): number;
            /**
             * The maximum zoom level of the tile source.
             */
            get maxZoom(): number;
            /**
             * The minimum zoom level of the tile source.
             */
            get min_zoom(): number;
            /**
             * The minimum zoom level of the tile source.
             */
            get minZoom(): number;
            /**
             * The path to the tile source.
             */
            get path(): string;
            set path(val: string);

            // Constructors

            constructor(properties?: Partial<FileDataSource.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Methods

            prepare(): boolean;
        }

        namespace OSMChangeset {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                comment: string;
                created_by: string;
                createdBy: string;
            }
        }

        class OSMChangeset extends GObject.Object {
            static $gtype: GObject.GType<OSMChangeset>;

            // Properties

            /**
             * The comment of the changes.
             */
            get comment(): string;
            set comment(val: string);
            get created_by(): string;
            set created_by(val: string);
            get createdBy(): string;
            set createdBy(val: string);

            // Constructors

            constructor(properties?: Partial<OSMChangeset.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](comment?: string | null, created_by?: string | null): OSMChangeset;

            // Methods

            serialize(): string;
        }

        namespace OSMNode {
            // Constructor properties interface

            interface ConstructorProps extends OSMObject.ConstructorProps {
                latitude: number;
                longitude: number;
            }
        }

        class OSMNode extends OSMObject {
            static $gtype: GObject.GType<OSMNode>;

            // Properties

            /**
             * The latitude of the node.
             */
            get latitude(): number;
            set latitude(val: number);
            /**
             * The longitude of the node.
             */
            get longitude(): number;
            set longitude(val: number);

            // Constructors

            constructor(properties?: Partial<OSMNode.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](
                id: number,
                version: number,
                changeset: number,
                longitude: number,
                latitude: number,
            ): OSMNode;
        }

        namespace OSMObject {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                changeset: number;
                id: number;
                version: number;
            }
        }

        abstract class OSMObject extends GObject.Object {
            static $gtype: GObject.GType<OSMObject>;

            // Properties

            /**
             * The OSM changeset for the current upload of the object.
             */
            get changeset(): number;
            set changeset(val: number);
            /**
             * The OSM id of the object.
             */
            get id(): number;
            set id(val: number);
            /**
             * The latest OSM version of the object.
             */
            get version(): number;
            set version(val: number);

            // Constructors

            constructor(properties?: Partial<OSMObject.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Methods

            delete_tag(key: string): void;
            get_tag(key: string): string;
            get_tags(): GLib.HashTable<string, string>;
            serialize(): string;
            set_tag(key: string, value: string): void;
        }

        namespace OSMRelation {
            // Constructor properties interface

            interface ConstructorProps extends OSMObject.ConstructorProps {}
        }

        class OSMRelation extends OSMObject {
            static $gtype: GObject.GType<OSMRelation>;

            // Constructors

            constructor(properties?: Partial<OSMRelation.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](id: number, version: number, changeset: number): OSMRelation;

            // Methods

            add_member(role: string, type: number, ref: number): void;
        }

        namespace OSMWay {
            // Constructor properties interface

            interface ConstructorProps extends OSMObject.ConstructorProps {}
        }

        class OSMWay extends OSMObject {
            static $gtype: GObject.GType<OSMWay>;

            // Constructors

            constructor(properties?: Partial<OSMWay.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](id: number, version: number, changeset: number): OSMWay;

            // Methods

            add_node_id(id: number): void;
        }

        namespace Shield {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class Shield extends GObject.Object {
            static $gtype: GObject.GType<Shield>;

            // Constructors

            constructor(properties?: Partial<Shield.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Methods

            draw(ref: string, name: string, color: string, scale: number): Shumate.VectorSprite;
        }

        namespace SpriteSource {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                color_scheme: string;
                colorScheme: string;
            }
        }

        class SpriteSource extends GObject.Object {
            static $gtype: GObject.GType<SpriteSource>;

            // Properties

            get color_scheme(): string;
            get colorScheme(): string;

            // Constructors

            constructor(properties?: Partial<SpriteSource.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](color_scheme: string): SpriteSource;

            // Methods

            /**
             * Loads shield definitions from a JSON string.
             * @param json a JSON string
             */
            load_shield_defs(json: string): void;
            /**
             * Sets the sprite sheet's fallback function.
             * @param sprite_sheet a [class@Shumate.VectorSpriteSheet]
             */
            set_fallback(sprite_sheet: Shumate.VectorSpriteSheet): void;
        }

        namespace SyncMapSource {
            // Constructor properties interface

            interface ConstructorProps extends Shumate.MapSource.ConstructorProps {}
        }

        /**
         * Wrapper of ShumateMapSource encapsulating fill_tile_async and
         * fill_tile_finish into a synchronous file_tile vfunc as work-around for
         * https://gitlab.gnome.org/GNOME/gjs/-/issues/72
         *
         * The #MapsSyncMapSource structure contains only private data
         * and should be accessed using the provided API
         */
        abstract class SyncMapSource extends Shumate.MapSource {
            static $gtype: GObject.GType<SyncMapSource>;

            // Constructors

            constructor(properties?: Partial<SyncMapSource.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Virtual methods

            vfunc_fill_tile(tile: Shumate.Tile): void;
        }

        type FileDataSourceClass = typeof FileDataSource;
        abstract class FileDataSourcePrivate {
            static $gtype: GObject.GType<FileDataSourcePrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type OSMChangesetClass = typeof OSMChangeset;
        abstract class OSMChangesetPrivate {
            static $gtype: GObject.GType<OSMChangesetPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type OSMNodeClass = typeof OSMNode;
        abstract class OSMNodePrivate {
            static $gtype: GObject.GType<OSMNodePrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type OSMObjectClass = typeof OSMObject;
        abstract class OSMObjectPrivate {
            static $gtype: GObject.GType<OSMObjectPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type OSMRelationClass = typeof OSMRelation;
        abstract class OSMRelationPrivate {
            static $gtype: GObject.GType<OSMRelationPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type OSMWayClass = typeof OSMWay;
        abstract class OSMWayPrivate {
            static $gtype: GObject.GType<OSMWayPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type ShieldClass = typeof Shield;
        type SpriteSourceClass = typeof SpriteSource;
        type SyncMapSourceClass = typeof SyncMapSource;
        abstract class SyncMapSourcePrivate {
            static $gtype: GObject.GType<SyncMapSourcePrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        abstract class _OSMChangesetClass {
            static $gtype: GObject.GType<_OSMChangesetClass>;

            // Constructors

            _init(...args: any[]): void;
        }

        abstract class _OSMNodeClass {
            static $gtype: GObject.GType<_OSMNodeClass>;

            // Constructors

            _init(...args: any[]): void;
        }

        abstract class _OSMRelationClass {
            static $gtype: GObject.GType<_OSMRelationClass>;

            // Constructors

            _init(...args: any[]): void;
        }

        abstract class _OSMWayClass {
            static $gtype: GObject.GType<_OSMWayClass>;

            // Constructors

            _init(...args: any[]): void;
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

    export default GnomeMaps;
}

declare module 'gi://GnomeMaps' {
    import GnomeMaps10 from 'gi://GnomeMaps?version=1.0';
    export default GnomeMaps10;
}
// END
