/// <reference path="./xlib-2.0.d.ts" />
/// <reference path="./xfixes-4.0.d.ts" />
/// <reference path="./mtk-15.d.ts" />
/// <reference path="./graphene-1.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./meta-15.d.ts" />
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

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://MetaTest?version=15' {
    // Module dependencies
    import type xlib from 'gi://xlib?version=2.0';
    import type xfixes from 'gi://xfixes?version=4.0';
    import type Mtk from 'gi://Mtk?version=15';
    import type Graphene from 'gi://Graphene?version=1.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type Meta from 'gi://Meta?version=15';
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

    export namespace MetaTest {
        /**
         * MetaTest-15
         */

        export namespace ContextTestType {
            export const $gtype: GObject.GType<ContextTestType>;
        }

        enum ContextTestType {
            HEADLESS,
            VKMS,
            TEST,
        }

        export namespace ContextTestFlag {
            export const $gtype: GObject.GType<ContextTestFlag>;
        }

        enum ContextTestFlag {
            NONE,
            TEST_CLIENT,
            NO_X11,
            NO_ANIMATIONS,
        }

        export namespace TestRunFlags {
            export const $gtype: GObject.GType<TestRunFlags>;
        }

        enum TestRunFlags {
            NONE,
            CAN_SKIP,
        }
        namespace ContextTest {
            // Signal callback interfaces

            interface AfterTests {
                (): void;
            }

            interface BeforeTests {
                (): void;
            }

            interface RunTests {
                (): number;
            }

            // Constructor properties interface

            interface ConstructorProps extends Meta.Context.ConstructorProps {}
        }

        class ContextTest extends Meta.Context {
            static $gtype: GObject.GType<ContextTest>;

            // Constructors

            constructor(properties?: Partial<ContextTest.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'after-tests', callback: (_source: this) => void): number;
            connect_after(signal: 'after-tests', callback: (_source: this) => void): number;
            emit(signal: 'after-tests'): void;
            connect(signal: 'before-tests', callback: (_source: this) => void): number;
            connect_after(signal: 'before-tests', callback: (_source: this) => void): number;
            emit(signal: 'before-tests'): void;
            connect(signal: 'run-tests', callback: (_source: this) => number): number;
            connect_after(signal: 'run-tests', callback: (_source: this) => number): number;
            emit(signal: 'run-tests'): void;

            // Methods

            run_tests(flags: TestRunFlags | null): number;
            set_background_color(color: Cogl.Color): void;
            wait_for_x11_display(): void;
        }

        namespace TestMonitor {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class TestMonitor extends GObject.Object {
            static $gtype: GObject.GType<TestMonitor>;

            // Constructors

            constructor(properties?: Partial<TestMonitor.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](context: Meta.Context, width: number, height: number, refresh_rate: number): TestMonitor;

            // Methods

            destroy(): void;
        }

        type ContextTestClass = typeof ContextTest;
        type TestMonitorClass = typeof TestMonitor;
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

    export default MetaTest;
}

declare module 'gi://MetaTest' {
    import MetaTest15 from 'gi://MetaTest?version=15';
    export default MetaTest15;
}
// END
