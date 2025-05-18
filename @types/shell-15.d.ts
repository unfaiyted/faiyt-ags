/// <reference path="./st-15.d.ts" />
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
/// <reference path="./polkitagent-1.0.d.ts" />
/// <reference path="./polkit-1.0.d.ts" />
/// <reference path="./nm-1.0.d.ts" />
/// <reference path="./gvc-1.0.d.ts" />
/// <reference path="./gcr-4.d.ts" />
/// <reference path="./gck-2.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://Shell?version=15' {
    // Module dependencies
    import type St from 'gi://St?version=15';
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
    import type PolkitAgent from 'gi://PolkitAgent?version=1.0';
    import type Polkit from 'gi://Polkit?version=1.0';
    import type NM from 'gi://NM?version=1.0';
    import type Gvc from 'gi://Gvc?version=1.0';
    import type Gcr from 'gi://Gcr?version=4';
    import type Gck from 'gi://Gck?version=2';

    export namespace Shell {
        /**
         * Shell-15
         */

        export namespace AppLaunchGpu {
            export const $gtype: GObject.GType<AppLaunchGpu>;
        }

        enum AppLaunchGpu {
            APP_PREF,
            DISCRETE,
            DEFAULT,
        }

        export namespace AppState {
            export const $gtype: GObject.GType<AppState>;
        }

        enum AppState {
            STOPPED,
            STARTING,
            RUNNING,
        }
        /**
         * The mode of blurring of the effect.
         */

        /**
         * The mode of blurring of the effect.
         */
        export namespace BlurMode {
            export const $gtype: GObject.GType<BlurMode>;
        }

        enum BlurMode {
            /**
             * blur the actor contents, and its children
             */
            ACTOR,
            /**
             * blur what's beneath the actor
             */
            BACKGROUND,
        }

        export namespace NetworkAgentResponse {
            export const $gtype: GObject.GType<NetworkAgentResponse>;
        }

        enum NetworkAgentResponse {
            CONFIRMED,
            USER_CANCELED,
            INTERNAL_ERROR,
        }
        /**
         * Temporary hack to work around Cogl not exporting CoglSnippetHook in
         * the 1.0 API. Don't use.
         */

        /**
         * Temporary hack to work around Cogl not exporting CoglSnippetHook in
         * the 1.0 API. Don't use.
         */
        export namespace SnippetHook {
            export const $gtype: GObject.GType<SnippetHook>;
        }

        enum SnippetHook {
            VERTEX,
            VERTEX_TRANSFORM,
            FRAGMENT,
            TEXTURE_COORD_TRANSFORM,
            LAYER_FRAGMENT,
            TEXTURE_LOOKUP,
        }
        const KEYRING_SK_TAG: string;
        const KEYRING_SN_TAG: string;
        const KEYRING_UUID_TAG: string;
        /**
         * Synchronously load the contents of a file as a NUL terminated
         * string, validating it as UTF-8.  Embedded NUL characters count as
         * invalid content.
         * @param path UTF-8 encoded filename path
         * @returns File contents
         */
        function get_file_contents_utf8_sync(path: string): string;
        /**
         * Walk over all open file descriptors. Check them for the FD_CLOEXEC flag.
         * If this flag is not set, log the offending file descriptor number.
         *
         * It is important that gnome-shell's file descriptors are all marked CLOEXEC,
         * so that the shell's open file descriptors are not passed to child processes
         * that we launch.
         */
        function util_check_cloexec_fds(): void;
        /**
         * Workaround for non-introspectability of gdk_pixbuf_from_data().
         * @param data
         * @param colorspace
         * @param has_alpha
         * @param bits_per_sample
         * @param width
         * @param height
         * @param rowstride
         */
        function util_create_pixbuf_from_data(
            data: Uint8Array | string,
            colorspace: GdkPixbuf.Colorspace | null,
            has_alpha: boolean,
            bits_per_sample: number,
            width: number,
            height: number,
            rowstride: number,
        ): GdkPixbuf.Pixbuf;
        /**
         * Attempts to translate the folder `name` using translations provided
         * by .directory files.
         * @param name the untranslated folder name
         * @returns a translated string or %NULL
         */
        function util_get_translated_folder_name(name: string): string | null;
        /**
         * A wrapper around getuid() so that it can be used from JavaScript. This
         * function will always succeed.
         * @returns the real user ID of the calling process
         */
        function util_get_uid(): number;
        /**
         * Gets the first week day for the current locale, expressed as a
         * number in the range 0..6, representing week days from Sunday to
         * Saturday.
         * @returns A number representing the first week day for the current          locale
         */
        function util_get_week_start(): number;
        /**
         * If the corresponding X11 display provides the passed extension, return %TRUE,
         * otherwise %FALSE. If there is no X11 display, %FALSE is passed.
         * @param display A #MetaDisplay
         * @param extension An X11 extension
         */
        function util_has_x11_display_extension(display: Meta.Display, extension: string): boolean;
        /**
         * A wrapper around g_regex_escape_string() that takes its argument as
         * \0-terminated string rather than a byte-array that confuses gjs.
         * @param str a UTF-8 string to escape
         * @returns @str with all regex-special characters escaped
         */
        function util_regex_escape(str: string): string;
        function util_sd_notify(): void;
        /**
         * If `hidden` is %TRUE, hide `actor` from pick even with a mode of
         * %CLUTTER_PICK_ALL; if `hidden` is %FALSE, unhide `actor`.
         * @param actor A #ClutterActor
         * @param hidden Whether @actor should be hidden from pick
         */
        function util_set_hidden_from_pick(actor: Clutter.Actor, hidden: boolean): void;
        /**
         * A wrapper around g_spawn_async() with async-signal-safe implementation of
         * #GSpawnChildSetupFunc to launch a child program asynchronously resetting the
         * rlimit nofile on child setup.
         * @param working_directory child's current working     directory, or %NULL to inherit parent's
         * @param argv child's argument vector
         * @param envp child's environment, or %NULL to inherit parent's
         * @param flags flags from #GSpawnFlags
         * @returns the PID of the child on success, 0 if error is set
         */
        function util_spawn_async(
            working_directory: string | null,
            argv: string[],
            envp: string[] | null,
            flags: GLib.SpawnFlags | null,
        ): GLib.Pid;
        /**
         * A wrapper around g_spawn_async_with_fds() with async-signal-safe
         * implementation of #GSpawnChildSetupFunc to launch a child program
         * asynchronously resetting the rlimit nofile on child setup.
         * @param working_directory child's current working     directory, or %NULL to inherit parent's
         * @param argv child's argument vector
         * @param envp child's environment, or %NULL to inherit parent's
         * @param flags flags from #GSpawnFlags
         * @param stdin_fd file descriptor to use for child's stdin, or `-1`
         * @param stdout_fd file descriptor to use for child's stdout, or `-1`
         * @param stderr_fd file descriptor to use for child's stderr, or `-1`
         * @returns the PID of the child on success, 0 if error is set
         */
        function util_spawn_async_with_fds(
            working_directory: string | null,
            argv: string[],
            envp: string[] | null,
            flags: GLib.SpawnFlags | null,
            stdin_fd: number,
            stdout_fd: number,
            stderr_fd: number,
        ): GLib.Pid;
        /**
         * A wrapper around g_spawn_async_with_pipes() with async-signal-safe
         * implementation of #GSpawnChildSetupFunc to launch a child program
         * asynchronously resetting the rlimit nofile on child setup.
         * @param working_directory child's current working     directory, or %NULL to inherit parent's
         * @param argv child's argument vector
         * @param envp child's environment, or %NULL to inherit parent's
         * @param flags flags from #GSpawnFlags
         * @returns the PID of the child on success, 0 if error is set
         */
        function util_spawn_async_with_pipes(
            working_directory: string | null,
            argv: string[],
            envp: string[] | null,
            flags: GLib.SpawnFlags | null,
        ): [GLib.Pid, number, number, number];
        /**
         * A wrapper around g_spawn_async_with_pipes_and_fds() with async-signal-safe
         * implementation of #GSpawnChildSetupFunc to launch a child program
         * asynchronously resetting the rlimit nofile on child setup.
         * @param working_directory child's current working     directory, or %NULL to inherit parent's, in the GLib file name encoding
         * @param argv child's argument     vector, in the GLib file name encoding; it must be non-empty and %NULL-terminated
         * @param envp child's environment, or %NULL to inherit parent's, in the GLib file     name encoding
         * @param flags flags from #GSpawnFlags
         * @param stdin_fd file descriptor to use for child's stdin, or `-1`
         * @param stdout_fd file descriptor to use for child's stdout, or `-1`
         * @param stderr_fd file descriptor to use for child's stderr, or `-1`
         * @param source_fds array of FDs from the parent    process to make available in the child process
         * @param target_fds array of FDs to remap    @source_fds to in the child process
         * @returns the PID of the child on success, 0 if error is set
         */
        function util_spawn_async_with_pipes_and_fds(
            working_directory: string | null,
            argv: string[],
            envp: string[] | null,
            flags: GLib.SpawnFlags | null,
            stdin_fd: number,
            stdout_fd: number,
            stderr_fd: number,
            source_fds: number[] | null,
            target_fds: number[] | null,
        ): [GLib.Pid, number, number, number];
        function util_start_systemd_unit(
            unit: string,
            mode: string,
            cancellable?: Gio.Cancellable | null,
        ): Promise<boolean>;
        function util_start_systemd_unit(
            unit: string,
            mode: string,
            cancellable: Gio.Cancellable | null,
            callback: Gio.AsyncReadyCallback<string> | null,
        ): void;
        function util_start_systemd_unit(
            unit: string,
            mode: string,
            cancellable?: Gio.Cancellable | null,
            callback?: Gio.AsyncReadyCallback<string> | null,
        ): Promise<boolean> | void;
        function util_start_systemd_unit_finish(res: Gio.AsyncResult): boolean;
        function util_stop_systemd_unit(
            unit: string,
            mode: string,
            cancellable?: Gio.Cancellable | null,
        ): Promise<boolean>;
        function util_stop_systemd_unit(
            unit: string,
            mode: string,
            cancellable: Gio.Cancellable | null,
            callback: Gio.AsyncReadyCallback<string> | null,
        ): void;
        function util_stop_systemd_unit(
            unit: string,
            mode: string,
            cancellable?: Gio.Cancellable | null,
            callback?: Gio.AsyncReadyCallback<string> | null,
        ): Promise<boolean> | void;
        function util_stop_systemd_unit_finish(res: Gio.AsyncResult): boolean;
        function util_systemd_unit_exists(unit: string, cancellable?: Gio.Cancellable | null): Promise<boolean>;
        function util_systemd_unit_exists(
            unit: string,
            cancellable: Gio.Cancellable | null,
            callback: Gio.AsyncReadyCallback<string> | null,
        ): void;
        function util_systemd_unit_exists(
            unit: string,
            cancellable?: Gio.Cancellable | null,
            callback?: Gio.AsyncReadyCallback<string> | null,
        ): Promise<boolean> | void;
        function util_systemd_unit_exists_finish(res: Gio.AsyncResult): boolean;
        function util_touch_file_async(file: Gio.File): Promise<boolean>;
        function util_touch_file_async(file: Gio.File, callback: Gio.AsyncReadyCallback<Gio.File> | null): void;
        function util_touch_file_async(
            file: Gio.File,
            callback?: Gio.AsyncReadyCallback<Gio.File> | null,
        ): Promise<boolean> | void;
        function util_touch_file_finish(file: Gio.File, res: Gio.AsyncResult): boolean;
        /**
         * Translate `str` according to the locale defined by LC_TIME; unlike
         * dcgettext(), the translations is still taken from the LC_MESSAGES
         * catalogue and not the LC_TIME one.
         * @param str String to translate
         * @returns the translated string
         */
        function util_translate_time_string(str: string): string;
        /**
         * Implements libc standard WIFEXITED, that cannot be used JS
         * code.
         * @param status the status returned by wait() or waitpid()
         * @returns TRUE if the process exited normally, FALSE otherwise
         */
        function util_wifexited(status: number): [boolean, number];
        /**
         * Write a string to a GOutputStream as UTF-8. This is a workaround
         * for not having binary buffers in GJS.
         * @param stream a #GOutputStream
         * @param str a UTF-8 string to write to @stream
         * @returns %TRUE if write succeeded
         */
        function write_string_to_stream(stream: Gio.OutputStream, str: string): boolean;
        interface LeisureFunction {
            (data?: any | null): void;
        }
        interface PerfReplayFunction {
            (time: number, name: string, signature: string, arg: GObject.Value | any): void;
        }
        interface PerfStatisticsCallback {
            (perf_log: PerfLog, data?: any | null): void;
        }
        /**
         * Controls in which GNOME Shell states an action (like keybindings and gestures)
         * should be handled.
         */

        /**
         * Controls in which GNOME Shell states an action (like keybindings and gestures)
         * should be handled.
         */
        export namespace ActionMode {
            export const $gtype: GObject.GType<ActionMode>;
        }

        enum ActionMode {
            /**
             * block action
             */
            NONE,
            /**
             * allow action when in window mode,
             *     e.g. when the focus is in an application window
             */
            NORMAL,
            /**
             * allow action while the overview
             *     is active
             */
            OVERVIEW,
            /**
             * allow action when the screen
             *     is locked, e.g. when the screen shield is shown
             */
            LOCK_SCREEN,
            /**
             * allow action in the unlock
             *     dialog
             */
            UNLOCK_SCREEN,
            /**
             * allow action in the login screen
             */
            LOGIN_SCREEN,
            /**
             * allow action when a system modal
             *     dialog (e.g. authentication or session dialogs) is open
             */
            SYSTEM_MODAL,
            /**
             * allow action in looking glass
             */
            LOOKING_GLASS,
            /**
             * allow action while a shell menu is open
             */
            POPUP,
            /**
             * always allow action
             */
            ALL,
        }
        namespace App {
            // Signal callback interfaces

            interface WindowsChanged {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                action_group: Gio.ActionGroup;
                actionGroup: Gio.ActionGroup;
                app_info: Gio.DesktopAppInfo;
                appInfo: Gio.DesktopAppInfo;
                busy: boolean;
                icon: Gio.Icon;
                id: string;
                state: AppState;
            }
        }

        /**
         * Object representing an application
         *
         * This object wraps a #GDesktopAppInfo, providing methods and signals
         * primarily useful for running applications.
         */
        class App extends GObject.Object {
            static $gtype: GObject.GType<App>;

            // Properties

            /**
             * The #GDBusActionGroup associated with this ShellApp, if any. See the
             * documentation of #GApplication and #GActionGroup for details.
             */
            get action_group(): Gio.ActionGroup;
            /**
             * The #GDBusActionGroup associated with this ShellApp, if any. See the
             * documentation of #GApplication and #GActionGroup for details.
             */
            get actionGroup(): Gio.ActionGroup;
            /**
             * The #GDesktopAppInfo associated with this ShellApp, if any.
             */
            get app_info(): Gio.DesktopAppInfo;
            /**
             * The #GDesktopAppInfo associated with this ShellApp, if any.
             */
            get appInfo(): Gio.DesktopAppInfo;
            /**
             * Whether the application has marked itself as busy.
             */
            get busy(): boolean;
            /**
             * The #GIcon representing this ShellApp
             */
            get icon(): Gio.Icon;
            /**
             * The id of this application (a desktop filename, or a special string
             * like window:0xabcd1234)
             */
            get id(): string;
            /**
             * The high-level state of the application, effectively whether it's
             * running or not, or transitioning between those states.
             */
            get state(): AppState;

            // Constructors

            constructor(properties?: Partial<App.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'windows-changed', callback: (_source: this) => void): number;
            connect_after(signal: 'windows-changed', callback: (_source: this) => void): number;
            emit(signal: 'windows-changed'): void;

            // Methods

            /**
             * Like shell_app_activate_full(), but using the default workspace and
             * event timestamp.
             */
            activate(): void;
            /**
             * This activates an action using 'org.freedesktop.Application' DBus interface.
             *
             * This function will fail if this #ShellApp doesn't have a valid #GDesktopAppInfo
             * with a valid id.
             * @param action_name the name of an action to activate
             * @param parameter the parameter to the activation
             * @param timestamp Event timestamp, or 0 for current event timestamp
             * @param workspace Start on this workspace, or -1 for default
             * @param cancellable a #GCancellable or %NULL
             */
            activate_action(
                action_name: string,
                parameter: GLib.Variant | null,
                timestamp: number,
                workspace: number,
                cancellable?: Gio.Cancellable | null,
            ): Promise<boolean>;
            /**
             * This activates an action using 'org.freedesktop.Application' DBus interface.
             *
             * This function will fail if this #ShellApp doesn't have a valid #GDesktopAppInfo
             * with a valid id.
             * @param action_name the name of an action to activate
             * @param parameter the parameter to the activation
             * @param timestamp Event timestamp, or 0 for current event timestamp
             * @param workspace Start on this workspace, or -1 for default
             * @param cancellable a #GCancellable or %NULL
             * @param callback A #GAsyncReadyCallback to call when the request is satisfied.
             */
            activate_action(
                action_name: string,
                parameter: GLib.Variant | null,
                timestamp: number,
                workspace: number,
                cancellable: Gio.Cancellable | null,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * This activates an action using 'org.freedesktop.Application' DBus interface.
             *
             * This function will fail if this #ShellApp doesn't have a valid #GDesktopAppInfo
             * with a valid id.
             * @param action_name the name of an action to activate
             * @param parameter the parameter to the activation
             * @param timestamp Event timestamp, or 0 for current event timestamp
             * @param workspace Start on this workspace, or -1 for default
             * @param cancellable a #GCancellable or %NULL
             * @param callback A #GAsyncReadyCallback to call when the request is satisfied.
             */
            activate_action(
                action_name: string,
                parameter: GLib.Variant | null,
                timestamp: number,
                workspace: number,
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<boolean> | void;
            /**
             * Finish the asynchronous operation started by shell_app_activate_action()
             * and obtain its result.
             * @param result
             * @returns whether the operation was successful
             */
            activate_action_finish(result: Gio.AsyncResult): boolean;
            /**
             * Perform an appropriate default action for operating on this application,
             * dependent on its current state.  For example, if the application is not
             * currently running, launch it.  If it is running, activate the most
             * recently used NORMAL window (or if that window has a transient, the most
             * recently used transient for that window).
             * @param workspace launch on this workspace, or -1 for default. Ignored if   activating an existing window
             * @param timestamp Event timestamp
             */
            activate_full(workspace: number, timestamp: number): void;
            /**
             * Bring all windows for the given app to the foreground,
             * but ensure that `window` is on top.  If `window` is %NULL,
             * the window with the most recent user time for the app
             * will be used.
             *
             * This function has no effect if `app` is not currently running.
             * @param window Window to be focused
             * @param timestamp Event timestamp
             */
            activate_window(window: Meta.Window | null, timestamp: number): void;
            /**
             * Returns %TRUE if the app supports opening a new window through
             * shell_app_open_new_window() (ie, if calling that function will
             * result in actually opening a new window and not something else,
             * like presenting the most recently active one)
             */
            can_open_new_window(): boolean;
            /**
             * Compare one #ShellApp instance to another, in the following way:
             *   - Running applications sort before not-running applications.
             *   - If one of them has non-minimized windows and the other does not,
             *     the one with visible windows is first.
             *   - Finally, the application which the user interacted with most recently
             *     compares earlier.
             * @param other A #ShellApp
             */
            compare(other: App): number;
            /**
             * Order two applications by name.
             * @param other The other app
             * @returns -1, 0, or 1; suitable for use as a comparison function for e.g. g_slist_sort()
             */
            compare_by_name(other: App): number;
            /**
             * Look up the icon for this application, and create a #ClutterActor
             * for it at the given size.
             * @param size
             * @returns A floating #ClutterActor
             */
            create_icon_texture(size: number): Clutter.Actor;
            get_app_info(): Gio.DesktopAppInfo;
            get_busy(): boolean;
            get_description(): string;
            /**
             * Look up the icon for this application
             * @returns A #GIcon
             */
            get_icon(): Gio.Icon;
            get_id(): string;
            get_n_windows(): number;
            get_name(): string;
            get_pids(): number[];
            get_state(): AppState;
            /**
             * Get the windows which are associated with this application. The
             * returned list will be sorted first by whether they're on the
             * active workspace, then by whether they're visible, and finally
             * by the time the user last interacted with them.
             * @returns List of windows
             */
            get_windows(): Meta.Window[];
            is_on_workspace(workspace: Meta.Workspace): boolean;
            /**
             * A window backed application is one which represents just an open
             * window, i.e. there's no .desktop file association, so we don't know
             * how to launch it again.
             */
            is_window_backed(): boolean;
            launch(timestamp: number, workspace: number, gpu_pref: AppLaunchGpu | null): boolean;
            launch_action(action_name: string, timestamp: number, workspace: number): void;
            /**
             * Request that the application create a new window.
             * @param workspace open on this workspace, or -1 for default
             */
            open_new_window(workspace: number): void;
            /**
             * Initiate an asynchronous request to quit this application.
             * The application may interact with the user, and the user
             * might cancel the quit request from the application UI.
             *
             * This operation may not be supported for all applications.
             * @returns %TRUE if a quit request is supported for this application
             */
            request_quit(): boolean;
            update_app_actions(window: Meta.Window): void;
            update_window_actions(window: Meta.Window): void;
        }

        namespace AppSystem {
            // Signal callback interfaces

            interface AppStateChanged {
                (object: App): void;
            }

            interface InstalledChanged {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class AppSystem extends GObject.Object {
            static $gtype: GObject.GType<AppSystem>;

            // Constructors

            constructor(properties?: Partial<AppSystem.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'app-state-changed', callback: (_source: this, object: App) => void): number;
            connect_after(signal: 'app-state-changed', callback: (_source: this, object: App) => void): number;
            emit(signal: 'app-state-changed', object: App): void;
            connect(signal: 'installed-changed', callback: (_source: this) => void): number;
            connect_after(signal: 'installed-changed', callback: (_source: this) => void): number;
            emit(signal: 'installed-changed'): void;

            // Static methods

            static get_default(): AppSystem;
            /**
             * Wrapper around g_desktop_app_info_search() that replaces results that
             * don't validate as UTF-8 with the empty string.
             * @param search_string the search string to use
             */
            static search(search_string: string): string[][];

            // Methods

            /**
             * Returns all installed apps, as a list of #GAppInfo
             * @returns a list of #GAppInfo   describing all known applications. This memory is owned by the   #ShellAppSystem and should not be freed.
             */
            get_installed(): Gio.AppInfo[];
            /**
             * Returns the set of applications which currently have at least one
             * open window.  The returned list will be sorted by shell_app_compare().
             * @returns Active applications
             */
            get_running(): App[];
            /**
             * Find a #ShellApp corresponding to an id.
             * @param id
             * @returns The #ShellApp for id, or %NULL if none
             */
            lookup_app(id: string): App;
            /**
             * Find a valid application whose .desktop file, without the extension
             * and properly canonicalized, matches `wmclass`.
             * @param wmclass A WM_CLASS value
             * @returns A #ShellApp for @wmclass
             */
            lookup_desktop_wmclass(wmclass?: string | null): App;
            /**
             * Find a valid application corresponding to a given
             * heuristically determined application identifier
             * string, or %NULL if none.
             * @param id Probable application identifier
             * @returns A #ShellApp for @name
             */
            lookup_heuristic_basename(id: string): App;
            /**
             * Find a valid application whose .desktop file contains a
             * StartupWMClass entry matching `wmclass`.
             * @param wmclass A WM_CLASS value
             * @returns A #ShellApp for @wmclass
             */
            lookup_startup_wmclass(wmclass?: string | null): App;
        }

        namespace AppUsage {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * Track application usage/state data
         *
         * This class maintains some usage and state statistics for
         * applications by keeping track of the approximate time an application's
         * windows are focused, as well as the last workspace it was seen on.
         * This time tracking is implemented by watching for focus notifications,
         * and computing a time delta between them.  Also we watch the
         * GNOME Session "StatusChanged" signal which by default is emitted after 5
         * minutes to signify idle.
         */
        class AppUsage extends GObject.Object {
            static $gtype: GObject.GType<AppUsage>;

            // Constructors

            constructor(properties?: Partial<AppUsage.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Static methods

            static get_default(): AppUsage;

            // Methods

            /**
             * Compare `id_a` and `id_b` based on frequency of use.
             * @param id_a ID of first app
             * @param id_b ID of second app
             * @returns -1 if @id_a ranks higher than @id_b, 1 if @id_b ranks higher          than @id_a, and 0 if both rank equally.
             */
            compare(id_a: string, id_b: string): number;
            get_most_used(): App[];
        }

        namespace BlurEffect {
            // Constructor properties interface

            interface ConstructorProps extends Clutter.Effect.ConstructorProps {
                brightness: number;
                mode: BlurMode;
                radius: number;
            }
        }

        /**
         * Blur effect for actors
         *
         * #ShellBlurEffect is a blur implementation based on Clutter. It also has
         * an optional brightness property.
         *
         * # Modes
         *
         * #ShellBlurEffect can work in `SHELL_BLUR_MODE_BACKGROUND` and `SHELL_BLUR_MODE_ACTOR`
         * modes. The actor mode blurs the actor itself, and all of its children. The
         * background mode blurs the pixels beneath the actor, but not the actor itself.
         *
         * `SHELL_BLUR_MODE_BACKGROUND` can be computationally expensive, since the contents
         * beneath the actor cannot be cached, so beware of the performance implications
         * of using this blur mode.
         */
        class BlurEffect extends Clutter.Effect {
            static $gtype: GObject.GType<BlurEffect>;

            // Properties

            get brightness(): number;
            set brightness(val: number);
            get mode(): BlurMode;
            set mode(val: BlurMode);
            get radius(): number;
            set radius(val: number);

            // Constructors

            constructor(properties?: Partial<BlurEffect.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): BlurEffect;

            // Methods

            get_brightness(): number;
            get_mode(): BlurMode;
            get_radius(): number;
            set_brightness(brightness: number): void;
            set_mode(mode: BlurMode | null): void;
            set_radius(radius: number): void;
        }

        namespace CameraMonitor {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                cameras_in_use: boolean;
                camerasInUse: boolean;
            }
        }

        class CameraMonitor extends GObject.Object {
            static $gtype: GObject.GType<CameraMonitor>;

            // Properties

            get cameras_in_use(): boolean;
            get camerasInUse(): boolean;

            // Constructors

            constructor(properties?: Partial<CameraMonitor.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;
        }

        namespace GLSLEffect {
            // Constructor properties interface

            interface ConstructorProps extends Clutter.OffscreenEffect.ConstructorProps {}
        }

        /**
         * An offscreen effect using GLSL
         *
         * A #ShellGLSLEffect is a #ClutterOffscreenEffect that allows
         * running custom GLSL to the vertex and fragment stages of the
         * graphic pipeline.
         */
        class GLSLEffect extends Clutter.OffscreenEffect {
            static $gtype: GObject.GType<GLSLEffect>;

            // Constructors

            constructor(properties?: Partial<GLSLEffect.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Virtual methods

            vfunc_build_pipeline(): void;

            // Methods

            /**
             * Adds a GLSL snippet to the pipeline used for drawing the effect texture.
             * See #CoglSnippet for details.
             *
             * This is only valid inside the a call to the build_pipeline() virtual
             * function.
             * @param hook where to insert the code
             * @param declarations GLSL declarations
             * @param code GLSL code
             * @param is_replace whether Cogl code should be replaced by the custom shader
             */
            add_glsl_snippet(
                hook: (SnippetHook | Cogl.SnippetHook) | null,
                declarations: string,
                code: string,
                is_replace: boolean,
            ): void;
            get_uniform_location(name: string): number;
            set_uniform_float(uniform: number, n_components: number, value: number[]): void;
            set_uniform_matrix(uniform: number, transpose: boolean, dimensions: number, value: number[]): void;
        }

        namespace Global {
            // Signal callback interfaces

            interface LocatePointer {
                (): void;
            }

            interface NotifyError {
                (object: string, p0: string): void;
            }

            interface Shutdown {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                automation_script: Gio.File;
                automationScript: Gio.File;
                backend: Meta.Backend;
                compositor: Meta.Compositor;
                context: Meta.Context;
                datadir: string;
                display: Meta.Display;
                focus_manager: St.FocusManager;
                focusManager: St.FocusManager;
                force_animations: boolean;
                forceAnimations: boolean;
                frame_finish_timestamp: boolean;
                frameFinishTimestamp: boolean;
                frame_timestamps: boolean;
                frameTimestamps: boolean;
                imagedir: string;
                screen_height: number;
                screenHeight: number;
                screen_width: number;
                screenWidth: number;
                session_mode: string;
                sessionMode: string;
                settings: Gio.Settings;
                stage: Clutter.Actor;
                switcheroo_control: Gio.DBusProxy;
                switcherooControl: Gio.DBusProxy;
                top_window_group: Clutter.Actor;
                topWindowGroup: Clutter.Actor;
                userdatadir: string;
                window_group: Clutter.Actor;
                windowGroup: Clutter.Actor;
                window_manager: WM;
                windowManager: WM;
                workspace_manager: Meta.WorkspaceManager;
                workspaceManager: Meta.WorkspaceManager;
            }
        }

        class Global extends GObject.Object {
            static $gtype: GObject.GType<Global>;

            // Properties

            get automation_script(): Gio.File;
            get automationScript(): Gio.File;
            get backend(): Meta.Backend;
            get compositor(): Meta.Compositor;
            get context(): Meta.Context;
            get datadir(): string;
            get display(): Meta.Display;
            get focus_manager(): St.FocusManager;
            get focusManager(): St.FocusManager;
            get force_animations(): boolean;
            set force_animations(val: boolean);
            get forceAnimations(): boolean;
            set forceAnimations(val: boolean);
            get frame_finish_timestamp(): boolean;
            set frame_finish_timestamp(val: boolean);
            get frameFinishTimestamp(): boolean;
            set frameFinishTimestamp(val: boolean);
            get frame_timestamps(): boolean;
            set frame_timestamps(val: boolean);
            get frameTimestamps(): boolean;
            set frameTimestamps(val: boolean);
            get imagedir(): string;
            get screen_height(): number;
            get screenHeight(): number;
            get screen_width(): number;
            get screenWidth(): number;
            get session_mode(): string;
            get sessionMode(): string;
            get settings(): Gio.Settings;
            get stage(): Clutter.Actor;
            get switcheroo_control(): Gio.DBusProxy;
            get switcherooControl(): Gio.DBusProxy;
            get top_window_group(): Clutter.Actor;
            get topWindowGroup(): Clutter.Actor;
            get userdatadir(): string;
            get window_group(): Clutter.Actor;
            get windowGroup(): Clutter.Actor;
            get window_manager(): WM;
            get windowManager(): WM;
            get workspace_manager(): Meta.WorkspaceManager;
            get workspaceManager(): Meta.WorkspaceManager;

            // Constructors

            constructor(properties?: Partial<Global.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'locate-pointer', callback: (_source: this) => void): number;
            connect_after(signal: 'locate-pointer', callback: (_source: this) => void): number;
            emit(signal: 'locate-pointer'): void;
            connect(signal: 'notify-error', callback: (_source: this, object: string, p0: string) => void): number;
            connect_after(
                signal: 'notify-error',
                callback: (_source: this, object: string, p0: string) => void,
            ): number;
            emit(signal: 'notify-error', object: string, p0: string): void;
            connect(signal: 'shutdown', callback: (_source: this) => void): number;
            connect_after(signal: 'shutdown', callback: (_source: this) => void): number;
            emit(signal: 'shutdown'): void;

            // Static methods

            /**
             * Gets the singleton global object that represents the desktop.
             */
            static get(): Global;

            // Methods

            /**
             * Marks that we are currently doing work. This is used to to track
             * whether we are busy for the purposes of shell_global_run_at_leisure().
             * A count is kept and shell_global_end_work() must be called exactly
             * as many times as shell_global_begin_work().
             */
            begin_work(): void;
            /**
             * Create a #GAppLaunchContext set up with the correct timestamp, and
             * targeted to activate on `workspace`.
             * @param timestamp the timestamp for the launch (or 0 for current time)
             * @param workspace a workspace index, or -1 to indicate no specific one
             * @returns A new #GAppLaunchContext
             */
            create_app_launch_context(timestamp: number, workspace: number): Gio.AppLaunchContext;
            /**
             * Marks the end of work that we started with shell_global_begin_work().
             * If no other work is ongoing and functions have been added with
             * shell_global_run_at_leisure(), they will be run at the next
             * opportunity.
             */
            end_work(): void;
            /**
             * Gets app system.
             * @returns the app system
             */
            get_app_system(): AppSystem;
            /**
             * Gets app usage.
             * @returns the app usage
             */
            get_app_usage(): AppUsage;
            get_context(): Meta.Context;
            get_current_time(): number;
            get_display(): Meta.Display;
            /**
             * The shell maintains "persistent" state which will persist after
             * logout or reboot.
             * @param property_type Expected data type
             * @param property_name Name of the property
             * @returns The value of a serialized property, or %NULL if none stored
             */
            get_persistent_state(property_type: string, property_name: string): GLib.Variant;
            /**
             * Gets the pointer coordinates and current modifier key state.
             */
            get_pointer(): [number, number, Clutter.ModifierType];
            /**
             * The shell maintains "runtime" state which does not persist across
             * logout or reboot.
             * @param property_type Expected data type
             * @param property_name Name of the property
             * @returns The value of a serialized property, or %NULL if none stored
             */
            get_runtime_state(property_type: string, property_name: string): GLib.Variant;
            get_session_mode(): string;
            /**
             * Get the global GSettings instance.
             * @returns The GSettings object
             */
            get_settings(): Gio.Settings;
            get_stage(): Clutter.Stage;
            /**
             * Get the global #GDBusProxy instance for the switcheroo-control
             * daemon.
             * @returns the #GDBusProxy for the daemon,   or %NULL on error.
             */
            get_switcheroo_control(): Gio.DBusProxy;
            /**
             * Gets the list of #MetaWindowActor for the plugin's screen
             * @returns the list of windows
             */
            get_window_actors(): Meta.WindowActor[];
            /**
             * Gets window tracker.
             * @returns the window tracker
             */
            get_window_tracker(): WindowTracker;
            get_workspace_manager(): Meta.WorkspaceManager;
            /**
             * Show a system error notification.  Use this function
             * when a user-initiated action results in a non-fatal problem
             * from causes that may not be under system control.  For
             * example, an application crash.
             * @param msg Error message
             * @param details Error details
             */
            notify_error(msg: string, details: string): void;
            /**
             * Restart the current process.  Only intended for development purposes.
             */
            reexec_self(): void;
            /**
             * Schedules a function to be called the next time the shell is idle.
             * Idle means here no animations, no redrawing, and no ongoing background
             * work. Since there is currently no way to hook into the Clutter master
             * clock and know when is running, the implementation here is somewhat
             * approximation. Animations may be detected as terminating early if they
             * can be drawn fast enough so that the event loop goes idle between frames.
             *
             * The intent of this function is for performance measurement runs
             * where a number of actions should be run serially and each action is
             * timed individually. Using this function for other purposes will
             * interfere with the ability to use it for performance measurement so
             * should be avoided.
             * @param func function to call at leisure
             */
            run_at_leisure(func: LeisureFunction): void;
            /**
             * Change the value of serialized persistent state.
             * @param property_name Name of the property
             * @param variant A #GVariant, or %NULL to unset
             */
            set_persistent_state(property_name: string, variant?: GLib.Variant | null): void;
            /**
             * Change the value of serialized runtime state.
             * @param property_name Name of the property
             * @param variant A #GVariant, or %NULL to unset
             */
            set_runtime_state(property_name: string, variant?: GLib.Variant | null): void;
            /**
             * Sets the area of the stage that is responsive to mouse clicks when
             * we don't have a modal or grab.
             * @param rectangles a list of #MtkRectangle describing the input region.
             */
            set_stage_input_region(rectangles: Mtk.Rectangle[]): void;
        }

        namespace InvertLightnessEffect {
            // Constructor properties interface

            interface ConstructorProps extends Clutter.OffscreenEffect.ConstructorProps {}
        }

        /**
         * A colorization effect where lightness is inverted but
         * color is not.
         *
         * #ShellInvertLightnessEffect is a sub-class of #ClutterEffect that enhances
         * the appearance of a clutter actor.  Specifically it inverts the lightness
         * of a #ClutterActor (e.g., darker colors become lighter, white becomes black,
         * and white, black).
         */
        class InvertLightnessEffect extends Clutter.OffscreenEffect {
            static $gtype: GObject.GType<InvertLightnessEffect>;

            // Constructors

            constructor(properties?: Partial<InvertLightnessEffect.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): InvertLightnessEffect;
        }

        namespace KeyringPrompt {
            // Signal callback interfaces

            interface ShowConfirm {
                (): void;
            }

            interface ShowPassword {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps, Gcr.Prompt.ConstructorProps {
                choice_visible: boolean;
                choiceVisible: boolean;
                confirm_actor: Clutter.Text;
                confirmActor: Clutter.Text;
                confirm_visible: boolean;
                confirmVisible: boolean;
                password_actor: Clutter.Text;
                passwordActor: Clutter.Text;
                password_visible: boolean;
                passwordVisible: boolean;
                warning_visible: boolean;
                warningVisible: boolean;
            }
        }

        class KeyringPrompt extends GObject.Object implements Gcr.Prompt {
            static $gtype: GObject.GType<KeyringPrompt>;

            // Properties

            /**
             * Whether the choice check box is visible or not.
             */
            get choice_visible(): boolean;
            /**
             * Whether the choice check box is visible or not.
             */
            get choiceVisible(): boolean;
            /**
             * Text field for confirmation password
             */
            get confirm_actor(): Clutter.Text;
            set confirm_actor(val: Clutter.Text);
            /**
             * Text field for confirmation password
             */
            get confirmActor(): Clutter.Text;
            set confirmActor(val: Clutter.Text);
            /**
             * Whether the password confirm entry is visible or not.
             */
            get confirm_visible(): boolean;
            /**
             * Whether the password confirm entry is visible or not.
             */
            get confirmVisible(): boolean;
            /**
             * Text field for password
             */
            get password_actor(): Clutter.Text;
            set password_actor(val: Clutter.Text);
            /**
             * Text field for password
             */
            get passwordActor(): Clutter.Text;
            set passwordActor(val: Clutter.Text);
            /**
             * Whether the password entry is visible or not.
             */
            get password_visible(): boolean;
            /**
             * Whether the password entry is visible or not.
             */
            get passwordVisible(): boolean;
            /**
             * Whether the warning label is visible or not.
             */
            get warning_visible(): boolean;
            /**
             * Whether the warning label is visible or not.
             */
            get warningVisible(): boolean;

            // Constructors

            constructor(properties?: Partial<KeyringPrompt.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): KeyringPrompt;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'show-confirm', callback: (_source: this) => void): number;
            connect_after(signal: 'show-confirm', callback: (_source: this) => void): number;
            emit(signal: 'show-confirm'): void;
            connect(signal: 'show-password', callback: (_source: this) => void): number;
            connect_after(signal: 'show-password', callback: (_source: this) => void): number;
            emit(signal: 'show-password'): void;

            // Methods

            /**
             * Called by implementation when the prompt is cancelled.
             */
            cancel(): void;
            /**
             * Called by the implementation when the prompt completes. There are various
             * checks done. %TRUE is returned if the prompt actually should complete.
             * @returns whether the prompt completed
             */
            complete(): boolean;
            /**
             * Get the prompt password text actor
             * @returns the password actor
             */
            get_confirm_actor(): Clutter.Text | null;
            /**
             * Get the prompt password text actor
             * @returns the password actor
             */
            get_password_actor(): Clutter.Text | null;
            /**
             * Set the prompt password confirmation text actor
             * @param confirm_actor the confirm password actor
             */
            set_confirm_actor(confirm_actor?: Clutter.Text | null): void;
            /**
             * Set the prompt password text actor
             * @param password_actor the password actor
             */
            set_password_actor(password_actor?: Clutter.Text | null): void;

            // Inherited properties
            /**
             * The string handle of the caller's window.
             *
             * The caller window indicates to the prompt which window is prompting the
             * user. The prompt may choose to ignore this information or use it in whatever
             * way it sees fit.
             *
             * In X11, this will be a stringified version of the XWindow handle; in
             * Wayland this is the result of an export using the XDG foreign
             * protocol.
             */
            get caller_window(): string;
            set caller_window(val: string);
            /**
             * The string handle of the caller's window.
             *
             * The caller window indicates to the prompt which window is prompting the
             * user. The prompt may choose to ignore this information or use it in whatever
             * way it sees fit.
             *
             * In X11, this will be a stringified version of the XWindow handle; in
             * Wayland this is the result of an export using the XDG foreign
             * protocol.
             */
            get callerWindow(): string;
            set callerWindow(val: string);
            /**
             * The label for the cancel button in the prompt.
             */
            get cancel_label(): string;
            set cancel_label(val: string);
            /**
             * The label for the cancel button in the prompt.
             */
            get cancelLabel(): string;
            set cancelLabel(val: string);
            /**
             * Whether the additional choice is chosen or not.
             *
             * The additional choice would have been setup using #GcrPrompt:choice-label.
             */
            get choice_chosen(): boolean;
            set choice_chosen(val: boolean);
            /**
             * Whether the additional choice is chosen or not.
             *
             * The additional choice would have been setup using #GcrPrompt:choice-label.
             */
            get choiceChosen(): boolean;
            set choiceChosen(val: boolean);
            /**
             * The label for the additional choice.
             *
             * If this is a non-%NULL value then an additional boolean choice will be
             * displayed by the prompt allowing the user to select or deselect it.
             *
             * If %NULL, then no additional choice is displayed.
             *
             * The initial value of the choice can be set with #GcrPrompt:choice-chosen.
             */
            get choice_label(): string;
            set choice_label(val: string);
            /**
             * The label for the additional choice.
             *
             * If this is a non-%NULL value then an additional boolean choice will be
             * displayed by the prompt allowing the user to select or deselect it.
             *
             * If %NULL, then no additional choice is displayed.
             *
             * The initial value of the choice can be set with #GcrPrompt:choice-chosen.
             */
            get choiceLabel(): string;
            set choiceLabel(val: string);
            /**
             * The label for the continue button in the prompt.
             */
            get continue_label(): string;
            set continue_label(val: string);
            /**
             * The label for the continue button in the prompt.
             */
            get continueLabel(): string;
            set continueLabel(val: string);
            /**
             * The detailed description of the prompt.
             *
             * A prompt implementation may choose not to display this detailed description.
             * The prompt message should contain relevant information.
             */
            get description(): string;
            set description(val: string);
            /**
             * The prompt message for the user.
             *
             * A prompt implementation should always display this message.
             */
            get message(): string;
            set message(val: string);
            /**
             * Whether the prompt will prompt for a new password.
             *
             * This will cause the prompt implementation to ask the user to confirm the
             * password and/or display other relevant user interface for creating a new
             * password.
             */
            get password_new(): boolean;
            set password_new(val: boolean);
            /**
             * Whether the prompt will prompt for a new password.
             *
             * This will cause the prompt implementation to ask the user to confirm the
             * password and/or display other relevant user interface for creating a new
             * password.
             */
            get passwordNew(): boolean;
            set passwordNew(val: boolean);
            /**
             * Indication of the password strength.
             *
             * Prompts will return a zero value if the password is empty, and a value
             * greater than zero if the password has any characters.
             *
             * This is only valid after a successful prompt for a password.
             */
            get password_strength(): number;
            /**
             * Indication of the password strength.
             *
             * Prompts will return a zero value if the password is empty, and a value
             * greater than zero if the password has any characters.
             *
             * This is only valid after a successful prompt for a password.
             */
            get passwordStrength(): number;
            /**
             * The title of the prompt.
             *
             * A prompt implementation may choose not to display the prompt title. The
             * #GcrPrompt:message should contain relevant information.
             */
            get title(): string;
            set title(val: string);
            /**
             * A prompt warning displayed on the prompt, or %NULL for no warning.
             *
             * This is a warning like "The password is incorrect." usually displayed to the
             * user about a previous 'unsuccessful' prompt.
             */
            get warning(): string;
            set warning(val: string);

            // Inherited methods
            /**
             * Closes the prompt so that in can no longer be used to prompt. The various
             * prompt methods will return results as if the user dismissed the prompt.
             *
             * The prompt may also be closed by the implementor of the prompt object.
             *
             * This emits the [signal`Prompt:`:prompt-close] signal on the prompt object.
             */
            close(): void;
            /**
             * Prompts for confirmation asking a cancel/continue style question.
             * Set the various properties on the prompt before calling this function to
             * represent the question correctly.
             *
             * This method will block until the a response is returned from the prompter.
             *
             * %GCR_PROMPT_REPLY_CONTINUE will be returned if the user confirms the prompt. The
             * return value will also be %GCR_PROMPT_REPLY_CANCEL if the user cancels or if
             * an error occurs. Check the `error` argument to tell the difference.
             * @param cancellable optional cancellation object
             * @returns the reply from the prompt
             */
            confirm(cancellable?: Gio.Cancellable | null): Gcr.PromptReply;
            /**
             * Prompts for confirmation asking a cancel/continue style question.
             * Set the various properties on the prompt before calling this method to
             * represent the question correctly.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             */
            confirm_async(cancellable?: Gio.Cancellable | null): Promise<Gcr.PromptReply>;
            /**
             * Prompts for confirmation asking a cancel/continue style question.
             * Set the various properties on the prompt before calling this method to
             * represent the question correctly.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             * @param callback called when the operation completes
             */
            confirm_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void;
            /**
             * Prompts for confirmation asking a cancel/continue style question.
             * Set the various properties on the prompt before calling this method to
             * represent the question correctly.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             * @param callback called when the operation completes
             */
            confirm_async(
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<Gcr.PromptReply> | void;
            /**
             * Complete an operation to prompt for confirmation.
             *
             * %GCR_PROMPT_REPLY_CONTINUE will be returned if the user confirms the prompt. The
             * return value will also be %GCR_PROMPT_REPLY_CANCEL if the user cancels or if
             * an error occurs. Check the `error` argument to tell the difference.
             * @param result asynchronous result passed to callback
             * @returns the reply from the prompt
             */
            confirm_finish(result: Gio.AsyncResult): Gcr.PromptReply;
            /**
             * Prompts for confirmation asking a cancel/continue style question.
             * Set the various properties on the prompt before calling this function to
             * represent the question correctly.
             *
             * This method will block until the a response is returned from the prompter
             * and will run a main loop similar to a `gtk_dialog_run()`. The application
             * will remain responsive but care must be taken to handle reentrancy issues.
             *
             * %GCR_PROMPT_REPLY_CONTINUE will be returned if the user confirms the prompt. The
             * return value will also be %GCR_PROMPT_REPLY_CANCEL if the user cancels or if
             * an error occurs. Check the `error` argument to tell the difference.
             * @param cancellable optional cancellation object
             * @returns the reply from the prompt
             */
            confirm_run(cancellable?: Gio.Cancellable | null): Gcr.PromptReply;
            /**
             * Get the string handle of the caller's window.
             *
             * The caller window indicates to the prompt which window is prompting the
             * user. The prompt may choose to ignore this information or use it in whatever
             * way it sees fit.
             * @returns a newly allocated string containing the string          handle of the window.
             */
            get_caller_window(): string;
            /**
             * Get the label for the cancel button.
             *
             * This is the button that results in a %GCR_PROMPT_REPLY_CANCEL reply
             * from the prompt.
             * @returns a newly allocated string containing the label
             */
            get_cancel_label(): string;
            /**
             * Get whether the additional choice was chosen or not.
             *
             * The additional choice would have been setup using
             * gcr_prompt_set_choice_label().
             * @returns whether chosen
             */
            get_choice_chosen(): boolean;
            /**
             * Get the label for the additional choice.
             *
             * This will be %NULL if no additional choice is being displayed.
             * @returns a newly allocated string containing the additional          choice or %NULL
             */
            get_choice_label(): string;
            /**
             * Get the label for the continue button.
             *
             * This is the button that results in a %GCR_PROMPT_REPLY_CONTINUE reply
             * from the prompt.
             * @returns a newly allocated string containing the label
             */
            get_continue_label(): string;
            /**
             * Get the detailed description of the prompt.
             *
             * A prompt implementation may choose not to display this detailed description.
             * The prompt message should contain relevant information.
             * @returns a newly allocated string containing the detailed          description of the prompt
             */
            get_description(): string;
            /**
             * Gets the prompt message for the user.
             *
             * A prompt implementation should always display this message.
             * @returns a newly allocated string containing the detailed          description of the prompt
             */
            get_message(): string;
            /**
             * Get whether the prompt will prompt for a new password.
             *
             * This will cause the prompt implementation to ask the user to confirm the
             * password and/or display other relevant user interface for creating a new
             * password.
             * @returns whether in new password mode or not
             */
            get_password_new(): boolean;
            /**
             * Get indication of the password strength.
             *
             * Prompts will return a zero value if the password is empty, and a value
             * greater than zero if the password has any characters.
             *
             * This is only valid after a successful prompt for a password.
             * @returns zero if the password is empty, greater than zero if not
             */
            get_password_strength(): number;
            /**
             * Gets the title of the prompt.
             *
             * A prompt implementation may choose not to display the prompt title. The
             * prompt message should contain relevant information.
             * @returns a newly allocated string containing the prompt          title.
             */
            get_title(): string;
            /**
             * Get a prompt warning displayed on the prompt.
             *
             * This is a warning like "The password is incorrect." usually displayed to the
             * user about a previous 'unsuccessful' prompt.
             *
             * If this string is %NULL then no warning is displayed.
             * @returns a newly allocated string containing the prompt          warning, or %NULL if no warning
             */
            get_warning(): string;
            /**
             * Prompts for password. Set the various properties on the prompt before calling
             * this method to explain which password should be entered.
             *
             * This method will block until the a response is returned from the prompter.
             *
             * A password will be returned if the user enters a password successfully.
             * The returned password is valid until the next time a method is called
             * to display another prompt.
             *
             * %NULL will be returned if the user cancels or if an error occurs. Check the
             * `error` argument to tell the difference.
             * @param cancellable optional cancellation object
             * @returns the password owned by the prompt, or %NULL
             */
            password(cancellable?: Gio.Cancellable | null): string;
            /**
             * Prompts for password. Set the various properties on the prompt before calling
             * this method to explain which password should be entered.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             */
            password_async(cancellable?: Gio.Cancellable | null): Promise<string>;
            /**
             * Prompts for password. Set the various properties on the prompt before calling
             * this method to explain which password should be entered.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             * @param callback called when the operation completes
             */
            password_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void;
            /**
             * Prompts for password. Set the various properties on the prompt before calling
             * this method to explain which password should be entered.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             * @param callback called when the operation completes
             */
            password_async(
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<string> | void;
            /**
             * Complete an operation to prompt for a password.
             *
             * A password will be returned if the user enters a password successfully.
             * The returned password is valid until the next time a method is called
             * to display another prompt.
             *
             * %NULL will be returned if the user cancels or if an error occurs. Check the
             * `error` argument to tell the difference.
             * @param result asynchronous result passed to callback
             * @returns the password owned by the prompt, or %NULL
             */
            password_finish(result: Gio.AsyncResult): string;
            /**
             * Prompts for password. Set the various properties on the prompt before calling
             * this method to explain which password should be entered.
             *
             * This method will block until the a response is returned from the prompter
             * and will run a main loop similar to a gtk_dialog_run(). The application
             * will remain responsive but care must be taken to handle reentrancy issues.
             *
             * A password will be returned if the user enters a password successfully.
             * The returned password is valid until the next time a method is called
             * to display another prompt.
             *
             * %NULL will be returned if the user cancels or if an error occurs. Check the
             * `error` argument to tell the difference.
             * @param cancellable optional cancellation object
             * @returns the password owned by the prompt, or %NULL
             */
            password_run(cancellable?: Gio.Cancellable | null): string;
            /**
             * Reset the contents and properties of the prompt.
             */
            reset(): void;
            /**
             * Set the string handle of the caller's window.
             *
             * The caller window indicates to the prompt which window is prompting the
             * user. The prompt may choose to ignore this information or use it in whatever
             * way it sees fit.
             * @param window_id the window id
             */
            set_caller_window(window_id: string): void;
            /**
             * Set the label for the continue button.
             *
             * This is the button that results in a %GCR_PROMPT_REPLY_CANCEL reply
             * from the prompt.
             * @param cancel_label the label
             */
            set_cancel_label(cancel_label: string): void;
            /**
             * Set whether the additional choice is chosen or not.
             *
             * The additional choice should be set up using gcr_prompt_set_choice_label().
             * @param chosen whether chosen
             */
            set_choice_chosen(chosen: boolean): void;
            /**
             * Set the label for the additional choice.
             *
             * If this is a non-%NULL value then an additional boolean choice will be
             * displayed by the prompt allowing the user to select or deselect it.
             *
             * The initial value of the choice can be set with the
             * gcr_prompt_set_choice_label() method.
             *
             * If this is %NULL, then no additional choice is being displayed.
             * @param choice_label the additional choice or %NULL
             */
            set_choice_label(choice_label?: string | null): void;
            /**
             * Set the label for the continue button.
             *
             * This is the button that results in a %GCR_PROMPT_REPLY_CONTINUE reply
             * from the prompt.
             * @param continue_label the label
             */
            set_continue_label(continue_label: string): void;
            /**
             * Set the detailed description of the prompt.
             *
             * A prompt implementation may choose not to display this detailed description.
             * Use gcr_prompt_set_message() to set a general message containing relevant
             * information.
             * @param description the detailed description
             */
            set_description(description: string): void;
            /**
             * Sets the prompt message for the user.
             *
             * A prompt implementation should always display this message.
             * @param message the prompt message
             */
            set_message(message: string): void;
            /**
             * Set whether the prompt will prompt for a new password.
             *
             * This will cause the prompt implementation to ask the user to confirm the
             * password and/or display other relevant user interface for creating a new
             * password.
             * @param new_password whether in new password mode or not
             */
            set_password_new(new_password: boolean): void;
            /**
             * Sets the title of the prompt.
             *
             * A prompt implementation may choose not to display the prompt title. The
             * prompt message should contain relevant information.
             * @param title the prompt title
             */
            set_title(title: string): void;
            /**
             * Set a prompt warning displayed on the prompt.
             *
             * This is a warning like "The password is incorrect." usually displayed to the
             * user about a previous 'unsuccessful' prompt.
             *
             * If this string is %NULL then no warning is displayed.
             * @param warning the warning or %NULL
             */
            set_warning(warning?: string | null): void;
            /**
             * close a prompt
             */
            vfunc_prompt_close(): void;
            /**
             * Prompts for confirmation asking a cancel/continue style question.
             * Set the various properties on the prompt before calling this method to
             * represent the question correctly.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             * @param callback called when the operation completes
             */
            vfunc_prompt_confirm_async(
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Complete an operation to prompt for confirmation.
             *
             * %GCR_PROMPT_REPLY_CONTINUE will be returned if the user confirms the prompt. The
             * return value will also be %GCR_PROMPT_REPLY_CANCEL if the user cancels or if
             * an error occurs. Check the `error` argument to tell the difference.
             * @param result asynchronous result passed to callback
             */
            vfunc_prompt_confirm_finish(result: Gio.AsyncResult): Gcr.PromptReply;
            /**
             * Prompts for password. Set the various properties on the prompt before calling
             * this method to explain which password should be entered.
             *
             * This method will return immediately and complete asynchronously.
             * @param cancellable optional cancellation object
             * @param callback called when the operation completes
             */
            vfunc_prompt_password_async(
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Complete an operation to prompt for a password.
             *
             * A password will be returned if the user enters a password successfully.
             * The returned password is valid until the next time a method is called
             * to display another prompt.
             *
             * %NULL will be returned if the user cancels or if an error occurs. Check the
             * `error` argument to tell the difference.
             * @param result asynchronous result passed to callback
             */
            vfunc_prompt_password_finish(result: Gio.AsyncResult): string;
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

        namespace MountOperation {
            // Signal callback interfaces

            interface ShowProcesses2 {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends Gio.MountOperation.ConstructorProps {}
        }

        class MountOperation extends Gio.MountOperation {
            static $gtype: GObject.GType<MountOperation>;

            // Constructors

            constructor(properties?: Partial<MountOperation.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): MountOperation;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'show-processes-2', callback: (_source: this) => void): number;
            connect_after(signal: 'show-processes-2', callback: (_source: this) => void): number;
            emit(signal: 'show-processes-2'): void;

            // Methods

            get_show_processes_choices(): string[];
            get_show_processes_message(): string;
            get_show_processes_pids(): GLib.Pid[];
        }

        namespace NetworkAgent {
            // Signal callback interfaces

            interface CancelRequest {
                (object: string): void;
            }

            interface NewRequest {
                (object: string, p0: NM.Connection, p1: string, p2: string[], p3: number): void;
            }

            // Constructor properties interface

            interface ConstructorProps
                extends NM.SecretAgentOld.ConstructorProps,
                    Gio.AsyncInitable.ConstructorProps,
                    Gio.Initable.ConstructorProps {
                force_always_ask: boolean;
                forceAlwaysAsk: boolean;
            }
        }

        class NetworkAgent extends NM.SecretAgentOld implements Gio.AsyncInitable<NetworkAgent>, Gio.Initable {
            static $gtype: GObject.GType<NetworkAgent>;

            // Properties

            get force_always_ask(): boolean;
            get forceAlwaysAsk(): boolean;

            // Constructors

            constructor(properties?: Partial<NetworkAgent.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'cancel-request', callback: (_source: this, object: string) => void): number;
            connect_after(signal: 'cancel-request', callback: (_source: this, object: string) => void): number;
            emit(signal: 'cancel-request', object: string): void;
            connect(
                signal: 'new-request',
                callback: (
                    _source: this,
                    object: string,
                    p0: NM.Connection,
                    p1: string,
                    p2: string[],
                    p3: number,
                ) => void,
            ): number;
            connect_after(
                signal: 'new-request',
                callback: (
                    _source: this,
                    object: string,
                    p0: NM.Connection,
                    p1: string,
                    p2: string[],
                    p3: number,
                ) => void,
            ): number;
            emit(signal: 'new-request', object: string, p0: NM.Connection, p1: string, p2: string[], p3: number): void;

            // Methods

            add_vpn_secret(request_id: string, setting_key: string, setting_value: string): void;
            respond(request_id: string, response: NetworkAgentResponse | null): void;
            search_vpn_plugin(service: string): Promise<NM.VpnPluginInfo | null>;
            search_vpn_plugin(service: string, callback: Gio.AsyncReadyCallback<this> | null): void;
            search_vpn_plugin(
                service: string,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<NM.VpnPluginInfo | null> | void;
            search_vpn_plugin_finish(result: Gio.AsyncResult): NM.VpnPluginInfo | null;
            set_password(request_id: string, setting_key: string, setting_value: string): void;

            // Inherited methods
            /**
             * Starts asynchronous initialization of the object implementing the
             * interface. This must be done before any real use of the object after
             * initial construction. If the object also implements #GInitable you can
             * optionally call g_initable_init() instead.
             *
             * This method is intended for language bindings. If writing in C,
             * g_async_initable_new_async() should typically be used instead.
             *
             * When the initialization is finished, `callback` will be called. You can
             * then call g_async_initable_init_finish() to get the result of the
             * initialization.
             *
             * Implementations may also support cancellation. If `cancellable` is not
             * %NULL, then initialization can be cancelled by triggering the cancellable
             * object from another thread. If the operation was cancelled, the error
             * %G_IO_ERROR_CANCELLED will be returned. If `cancellable` is not %NULL, and
             * the object doesn't support cancellable initialization, the error
             * %G_IO_ERROR_NOT_SUPPORTED will be returned.
             *
             * As with #GInitable, if the object is not initialized, or initialization
             * returns with an error, then all operations on the object except
             * g_object_ref() and g_object_unref() are considered to be invalid, and
             * have undefined behaviour. They will often fail with g_critical() or
             * g_warning(), but this must not be relied on.
             *
             * Callers should not assume that a class which implements #GAsyncInitable can
             * be initialized multiple times; for more information, see g_initable_init().
             * If a class explicitly supports being initialized multiple times,
             * implementation requires yielding all subsequent calls to init_async() on the
             * results of the first call.
             *
             * For classes that also support the #GInitable interface, the default
             * implementation of this method will run the g_initable_init() function
             * in a thread, so if you want to support asynchronous initialization via
             * threads, just implement the #GAsyncInitable interface without overriding
             * any interface methods.
             * @param io_priority the [I/O priority](iface.AsyncResult.html#io-priority) of the operation
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             */
            init_async(io_priority: number, cancellable?: Gio.Cancellable | null): Promise<boolean>;
            /**
             * Starts asynchronous initialization of the object implementing the
             * interface. This must be done before any real use of the object after
             * initial construction. If the object also implements #GInitable you can
             * optionally call g_initable_init() instead.
             *
             * This method is intended for language bindings. If writing in C,
             * g_async_initable_new_async() should typically be used instead.
             *
             * When the initialization is finished, `callback` will be called. You can
             * then call g_async_initable_init_finish() to get the result of the
             * initialization.
             *
             * Implementations may also support cancellation. If `cancellable` is not
             * %NULL, then initialization can be cancelled by triggering the cancellable
             * object from another thread. If the operation was cancelled, the error
             * %G_IO_ERROR_CANCELLED will be returned. If `cancellable` is not %NULL, and
             * the object doesn't support cancellable initialization, the error
             * %G_IO_ERROR_NOT_SUPPORTED will be returned.
             *
             * As with #GInitable, if the object is not initialized, or initialization
             * returns with an error, then all operations on the object except
             * g_object_ref() and g_object_unref() are considered to be invalid, and
             * have undefined behaviour. They will often fail with g_critical() or
             * g_warning(), but this must not be relied on.
             *
             * Callers should not assume that a class which implements #GAsyncInitable can
             * be initialized multiple times; for more information, see g_initable_init().
             * If a class explicitly supports being initialized multiple times,
             * implementation requires yielding all subsequent calls to init_async() on the
             * results of the first call.
             *
             * For classes that also support the #GInitable interface, the default
             * implementation of this method will run the g_initable_init() function
             * in a thread, so if you want to support asynchronous initialization via
             * threads, just implement the #GAsyncInitable interface without overriding
             * any interface methods.
             * @param io_priority the [I/O priority](iface.AsyncResult.html#io-priority) of the operation
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @param callback a #GAsyncReadyCallback to call when the request is satisfied
             */
            init_async(
                io_priority: number,
                cancellable: Gio.Cancellable | null,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Starts asynchronous initialization of the object implementing the
             * interface. This must be done before any real use of the object after
             * initial construction. If the object also implements #GInitable you can
             * optionally call g_initable_init() instead.
             *
             * This method is intended for language bindings. If writing in C,
             * g_async_initable_new_async() should typically be used instead.
             *
             * When the initialization is finished, `callback` will be called. You can
             * then call g_async_initable_init_finish() to get the result of the
             * initialization.
             *
             * Implementations may also support cancellation. If `cancellable` is not
             * %NULL, then initialization can be cancelled by triggering the cancellable
             * object from another thread. If the operation was cancelled, the error
             * %G_IO_ERROR_CANCELLED will be returned. If `cancellable` is not %NULL, and
             * the object doesn't support cancellable initialization, the error
             * %G_IO_ERROR_NOT_SUPPORTED will be returned.
             *
             * As with #GInitable, if the object is not initialized, or initialization
             * returns with an error, then all operations on the object except
             * g_object_ref() and g_object_unref() are considered to be invalid, and
             * have undefined behaviour. They will often fail with g_critical() or
             * g_warning(), but this must not be relied on.
             *
             * Callers should not assume that a class which implements #GAsyncInitable can
             * be initialized multiple times; for more information, see g_initable_init().
             * If a class explicitly supports being initialized multiple times,
             * implementation requires yielding all subsequent calls to init_async() on the
             * results of the first call.
             *
             * For classes that also support the #GInitable interface, the default
             * implementation of this method will run the g_initable_init() function
             * in a thread, so if you want to support asynchronous initialization via
             * threads, just implement the #GAsyncInitable interface without overriding
             * any interface methods.
             * @param io_priority the [I/O priority](iface.AsyncResult.html#io-priority) of the operation
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @param callback a #GAsyncReadyCallback to call when the request is satisfied
             */
            init_async(
                io_priority: number,
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<boolean> | void;
            /**
             * Finishes asynchronous initialization and returns the result.
             * See g_async_initable_init_async().
             * @param res a #GAsyncResult.
             * @returns %TRUE if successful. If an error has occurred, this function will return %FALSE and set @error appropriately if present.
             */
            init_finish(res: Gio.AsyncResult): boolean;
            /**
             * Finishes the async construction for the various g_async_initable_new
             * calls, returning the created object or %NULL on error.
             * @param res the #GAsyncResult from the callback
             * @returns a newly created #GObject,      or %NULL on error. Free with g_object_unref().
             */
            new_finish(res: Gio.AsyncResult): NetworkAgent;
            /**
             * Starts asynchronous initialization of the object implementing the
             * interface. This must be done before any real use of the object after
             * initial construction. If the object also implements #GInitable you can
             * optionally call g_initable_init() instead.
             *
             * This method is intended for language bindings. If writing in C,
             * g_async_initable_new_async() should typically be used instead.
             *
             * When the initialization is finished, `callback` will be called. You can
             * then call g_async_initable_init_finish() to get the result of the
             * initialization.
             *
             * Implementations may also support cancellation. If `cancellable` is not
             * %NULL, then initialization can be cancelled by triggering the cancellable
             * object from another thread. If the operation was cancelled, the error
             * %G_IO_ERROR_CANCELLED will be returned. If `cancellable` is not %NULL, and
             * the object doesn't support cancellable initialization, the error
             * %G_IO_ERROR_NOT_SUPPORTED will be returned.
             *
             * As with #GInitable, if the object is not initialized, or initialization
             * returns with an error, then all operations on the object except
             * g_object_ref() and g_object_unref() are considered to be invalid, and
             * have undefined behaviour. They will often fail with g_critical() or
             * g_warning(), but this must not be relied on.
             *
             * Callers should not assume that a class which implements #GAsyncInitable can
             * be initialized multiple times; for more information, see g_initable_init().
             * If a class explicitly supports being initialized multiple times,
             * implementation requires yielding all subsequent calls to init_async() on the
             * results of the first call.
             *
             * For classes that also support the #GInitable interface, the default
             * implementation of this method will run the g_initable_init() function
             * in a thread, so if you want to support asynchronous initialization via
             * threads, just implement the #GAsyncInitable interface without overriding
             * any interface methods.
             * @param io_priority the [I/O priority](iface.AsyncResult.html#io-priority) of the operation
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @param callback a #GAsyncReadyCallback to call when the request is satisfied
             */
            vfunc_init_async(
                io_priority: number,
                cancellable?: Gio.Cancellable | null,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Finishes asynchronous initialization and returns the result.
             * See g_async_initable_init_async().
             * @param res a #GAsyncResult.
             */
            vfunc_init_finish(res: Gio.AsyncResult): boolean;
            /**
             * Initializes the object implementing the interface.
             *
             * This method is intended for language bindings. If writing in C,
             * g_initable_new() should typically be used instead.
             *
             * The object must be initialized before any real use after initial
             * construction, either with this function or g_async_initable_init_async().
             *
             * Implementations may also support cancellation. If `cancellable` is not %NULL,
             * then initialization can be cancelled by triggering the cancellable object
             * from another thread. If the operation was cancelled, the error
             * %G_IO_ERROR_CANCELLED will be returned. If `cancellable` is not %NULL and
             * the object doesn't support cancellable initialization the error
             * %G_IO_ERROR_NOT_SUPPORTED will be returned.
             *
             * If the object is not initialized, or initialization returns with an
             * error, then all operations on the object except g_object_ref() and
             * g_object_unref() are considered to be invalid, and have undefined
             * behaviour. See the [introduction][ginitable] for more details.
             *
             * Callers should not assume that a class which implements #GInitable can be
             * initialized multiple times, unless the class explicitly documents itself as
             * supporting this. Generally, a class’ implementation of init() can assume
             * (and assert) that it will only be called once. Previously, this documentation
             * recommended all #GInitable implementations should be idempotent; that
             * recommendation was relaxed in GLib 2.54.
             *
             * If a class explicitly supports being initialized multiple times, it is
             * recommended that the method is idempotent: multiple calls with the same
             * arguments should return the same results. Only the first call initializes
             * the object; further calls return the result of the first call.
             *
             * One reason why a class might need to support idempotent initialization is if
             * it is designed to be used via the singleton pattern, with a
             * #GObjectClass.constructor that sometimes returns an existing instance.
             * In this pattern, a caller would expect to be able to call g_initable_init()
             * on the result of g_object_new(), regardless of whether it is in fact a new
             * instance.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             * @returns %TRUE if successful. If an error has occurred, this function will     return %FALSE and set @error appropriately if present.
             */
            init(cancellable?: Gio.Cancellable | null): boolean;
            /**
             * Initializes the object implementing the interface.
             *
             * This method is intended for language bindings. If writing in C,
             * g_initable_new() should typically be used instead.
             *
             * The object must be initialized before any real use after initial
             * construction, either with this function or g_async_initable_init_async().
             *
             * Implementations may also support cancellation. If `cancellable` is not %NULL,
             * then initialization can be cancelled by triggering the cancellable object
             * from another thread. If the operation was cancelled, the error
             * %G_IO_ERROR_CANCELLED will be returned. If `cancellable` is not %NULL and
             * the object doesn't support cancellable initialization the error
             * %G_IO_ERROR_NOT_SUPPORTED will be returned.
             *
             * If the object is not initialized, or initialization returns with an
             * error, then all operations on the object except g_object_ref() and
             * g_object_unref() are considered to be invalid, and have undefined
             * behaviour. See the [introduction][ginitable] for more details.
             *
             * Callers should not assume that a class which implements #GInitable can be
             * initialized multiple times, unless the class explicitly documents itself as
             * supporting this. Generally, a class’ implementation of init() can assume
             * (and assert) that it will only be called once. Previously, this documentation
             * recommended all #GInitable implementations should be idempotent; that
             * recommendation was relaxed in GLib 2.54.
             *
             * If a class explicitly supports being initialized multiple times, it is
             * recommended that the method is idempotent: multiple calls with the same
             * arguments should return the same results. Only the first call initializes
             * the object; further calls return the result of the first call.
             *
             * One reason why a class might need to support idempotent initialization is if
             * it is designed to be used via the singleton pattern, with a
             * #GObjectClass.constructor that sometimes returns an existing instance.
             * In this pattern, a caller would expect to be able to call g_initable_init()
             * on the result of g_object_new(), regardless of whether it is in fact a new
             * instance.
             * @param cancellable optional #GCancellable object, %NULL to ignore.
             */
            vfunc_init(cancellable?: Gio.Cancellable | null): boolean;
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

        namespace PerfLog {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * Event recorder for performance measurement
         *
         * ShellPerfLog provides a way for different parts of the code to
         * record information for subsequent analysis and interactive
         * exploration. Events exist of a timestamp, an event ID, and
         * arguments to the event.
         *
         * Emphasis is placed on storing recorded events in a compact
         * fashion so log recording disturbs the execution of the program
         * as little as possible, however events should not be recorded
         * at too fine a granularity - an event that is recorded once
         * per frame or once per user action is appropriate, an event that
         * occurs many times per frame is not.
         *
         * Arguments are identified by a D-Bus style signature; at the moment
         * only a limited number of event signatures are supported to
         * simplify the code.
         */
        class PerfLog extends GObject.Object {
            static $gtype: GObject.GType<PerfLog>;

            // Constructors

            constructor(properties?: Partial<PerfLog.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Static methods

            /**
             * Gets the global singleton performance log. This is initially disabled
             * and must be explicitly enabled with shell_perf_log_set_enabled().
             */
            static get_default(): PerfLog;

            // Methods

            /**
             * Adds a function that will be called before statistics are recorded.
             * The function would typically compute one or more statistics values
             * and call a function such as shell_perf_log_update_statistic_i()
             * to update the value that will be recorded.
             * @param callback function to call before recording statistics
             */
            add_statistics_callback(callback: PerfStatisticsCallback): void;
            /**
             * Calls all the update functions added with
             * shell_perf_log_add_statistics_callback() and then records events
             * for all statistics, followed by a perf.statisticsCollected event.
             */
            collect_statistics(): void;
            /**
             * Defines a performance event for later recording.
             * @param name name of the event. This should of the form   '<namespace>.<specific eventf'>, for example   'clutter.stagePaintDone'.
             * @param description human readable description of the event.
             * @param signature signature defining the arguments that event takes.   This is a string of type characters, using the same characters   as D-Bus or GVariant. Only a very limited number of signatures   are supported: , '', 's', 'i', and 'x'. This mean respectively:   no arguments, one string, one 32-bit integer, and one 64-bit   integer.
             */
            define_event(name: string, description: string, signature: string): void;
            /**
             * Defines a statistic. A statistic is a numeric value that is stored
             * by the performance log and recorded periodically or when
             * shell_perf_log_collect_statistics() is called explicitly.
             *
             * Code that defines a statistic should update it by calling
             * the update function for the particular data type of the statistic,
             * such as shell_perf_log_update_statistic_i(). This can be done
             * at any time, but would normally done inside a function registered
             * with shell_perf_log_add_statistics_callback(). These functions
             * are called immediately before statistics are recorded.
             * @param name name of the statistic and of the corresponding event.  This should follow the same guidelines as for shell_perf_log_define_event()
             * @param description human readable description of the statistic.
             * @param signature The type of the data stored for statistic. Must  currently be 'i' or 'x'.
             */
            define_statistic(name: string, description: string, signature: string): void;
            /**
             * Dump the definition of currently defined events and statistics, formatted
             * as JSON, to the specified output stream. The JSON output is an array,
             * with each element being a dictionary of the form:
             *
             * { name: <name of event>,
             *   description: <description of string,
             *   statistic: true } (only for statistics)
             * @param out output stream into which to write the event definitions
             * @returns %TRUE if the dump succeeded. %FALSE if an IO error occurred
             */
            dump_events(out: Gio.OutputStream): boolean;
            /**
             * Writes the performance event log, formatted as JSON, to the specified
             * output stream. For performance reasons, the output stream passed
             * in should generally be a buffered (or memory) output stream, since
             * it will be written to in small pieces. The JSON output is an array
             * with the elements of the array also being arrays, of the form
             * '[' <time>, <event name> [, <event_arg>... ] ']'.
             * @param out output stream into which to write the event log
             * @returns %TRUE if the dump succeeded. %FALSE if an IO error occurred
             */
            dump_log(out: Gio.OutputStream): boolean;
            /**
             * Records a performance event with no arguments.
             * @param name name of the event
             */
            event(name: string): void;
            /**
             * Records a performance event with one 32-bit integer argument.
             * @param name name of the event
             * @param arg the argument
             */
            event_i(name: string, arg: number): void;
            /**
             * Records a performance event with one string argument.
             * @param name name of the event
             * @param arg the argument
             */
            event_s(name: string, arg: string): void;
            /**
             * Records a performance event with one 64-bit integer argument.
             * @param name name of the event
             * @param arg the argument
             */
            event_x(name: string, arg: number): void;
            /**
             * Replays the log by calling the given function for each event
             * in the log.
             * @param replay_function function to call for each event in the log
             */
            replay(replay_function: PerfReplayFunction): void;
            /**
             * Sets whether events are currently being recorded.
             * @param enabled whether to record events
             */
            set_enabled(enabled: boolean): void;
            /**
             * Updates the current value of an 32-bit integer statistic.
             * @param name name of the statistic
             * @param value new value for the statistic
             */
            update_statistic_i(name: string, value: number): void;
            /**
             * Updates the current value of an 64-bit integer statistic.
             * @param name name of the statistic
             * @param value new value for the statistic
             */
            update_statistic_x(name: string, value: number): void;
        }

        namespace PolkitAuthenticationAgent {
            // Signal callback interfaces

            interface Cancel {
                (): void;
            }

            interface Initiate {
                (object: string, p0: string, p1: string, p2: string, p3: string[]): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends PolkitAgent.Listener.ConstructorProps {}
        }

        class PolkitAuthenticationAgent extends PolkitAgent.Listener {
            static $gtype: GObject.GType<PolkitAuthenticationAgent>;

            // Constructors

            constructor(properties?: Partial<PolkitAuthenticationAgent.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): PolkitAuthenticationAgent;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'cancel', callback: (_source: this) => void): number;
            connect_after(signal: 'cancel', callback: (_source: this) => void): number;
            emit(signal: 'cancel'): void;
            connect(
                signal: 'initiate',
                callback: (_source: this, object: string, p0: string, p1: string, p2: string, p3: string[]) => void,
            ): number;
            connect_after(
                signal: 'initiate',
                callback: (_source: this, object: string, p0: string, p1: string, p2: string, p3: string[]) => void,
            ): number;
            emit(signal: 'initiate', object: string, p0: string, p1: string, p2: string, p3: string[]): void;

            // Methods

            complete(dismissed: boolean): void;
            register(): void;
            // Conflicted with PolkitAgent.Listener.register
            register(...args: never[]): any;
            unregister(): void;
        }

        namespace Screenshot {
            // Signal callback interfaces

            interface ScreenshotTaken {
                (object: Mtk.Rectangle): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        /**
         * Grabs screenshots of areas and/or windows
         *
         * The #ShellScreenshot object is used to take screenshots of screen
         * areas or windows and write them out as png files.
         */
        class Screenshot extends GObject.Object {
            static $gtype: GObject.GType<Screenshot>;

            // Constructors

            constructor(properties?: Partial<Screenshot.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): Screenshot;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'screenshot-taken', callback: (_source: this, object: Mtk.Rectangle) => void): number;
            connect_after(signal: 'screenshot-taken', callback: (_source: this, object: Mtk.Rectangle) => void): number;
            emit(signal: 'screenshot-taken', object: Mtk.Rectangle): void;

            // Static methods

            /**
             * Composite a rectangle defined by x, y, width, height from the texture to a
             * pixbuf and write it as a PNG image into the stream.
             * @param texture the source texture
             * @param x x coordinate of the rectangle
             * @param y y coordinate of the rectangle
             * @param width width of the rectangle, or -1 to use the full texture
             * @param height height of the rectangle, or -1 to use the full texture
             * @param scale scale of the source texture
             * @param cursor the cursor texture
             * @param cursor_x x coordinate to put the cursor texture at, relative to the full source texture
             * @param cursor_y y coordinate to put the cursor texture at, relative to the full source texture
             * @param cursor_scale scale of the cursor texture
             * @param stream the stream to write the PNG image into
             * @param callback function to call returning success or failure
             */
            static composite_to_stream(
                texture: Cogl.Texture,
                x: number,
                y: number,
                width: number,
                height: number,
                scale: number,
                cursor: Cogl.Texture | null,
                cursor_x: number,
                cursor_y: number,
                cursor_scale: number,
                stream: Gio.OutputStream,
                callback?: Gio.AsyncReadyCallback<Screenshot> | null,
            ): void;
            /**
             * Finish the asynchronous operation started by
             * shell_screenshot_composite_to_stream () and obtain its result.
             * @param result the #GAsyncResult that was provided to the callback
             */
            static composite_to_stream_finish(result: Gio.AsyncResult): GdkPixbuf.Pixbuf | null;

            // Methods

            /**
             * Picks the pixel at `x,` `y` and returns its color as #CoglColor.
             * @param x The X coordinate to pick
             * @param y The Y coordinate to pick
             */
            pick_color(x: number, y: number): Promise<Cogl.Color>;
            /**
             * Picks the pixel at `x,` `y` and returns its color as #CoglColor.
             * @param x The X coordinate to pick
             * @param y The Y coordinate to pick
             * @param callback function to call returning success or failure of the async grabbing
             */
            pick_color(x: number, y: number, callback: Gio.AsyncReadyCallback<this> | null): void;
            /**
             * Picks the pixel at `x,` `y` and returns its color as #CoglColor.
             * @param x The X coordinate to pick
             * @param y The Y coordinate to pick
             * @param callback function to call returning success or failure of the async grabbing
             */
            pick_color(
                x: number,
                y: number,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<Cogl.Color> | void;
            /**
             * Finish the asynchronous operation started by shell_screenshot_pick_color()
             * and obtain its result.
             * @param result the #GAsyncResult that was provided to the callback
             * @returns whether the operation was successful
             */
            pick_color_finish(result: Gio.AsyncResult): [boolean, Cogl.Color];
            /**
             * Takes a screenshot of the whole screen
             * in `stream` as png image.
             * @param include_cursor Whether to include the cursor or not
             * @param stream The stream for the screenshot
             */
            screenshot(include_cursor: boolean, stream: Gio.OutputStream): Promise<Mtk.Rectangle>;
            /**
             * Takes a screenshot of the whole screen
             * in `stream` as png image.
             * @param include_cursor Whether to include the cursor or not
             * @param stream The stream for the screenshot
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot(
                include_cursor: boolean,
                stream: Gio.OutputStream,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Takes a screenshot of the whole screen
             * in `stream` as png image.
             * @param include_cursor Whether to include the cursor or not
             * @param stream The stream for the screenshot
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot(
                include_cursor: boolean,
                stream: Gio.OutputStream,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<Mtk.Rectangle> | void;
            /**
             * Takes a screenshot of the passed in area and saves it
             * in `stream` as png image.
             * @param x The X coordinate of the area
             * @param y The Y coordinate of the area
             * @param width The width of the area
             * @param height The height of the area
             * @param stream The stream for the screenshot
             */
            screenshot_area(
                x: number,
                y: number,
                width: number,
                height: number,
                stream: Gio.OutputStream,
            ): Promise<Mtk.Rectangle>;
            /**
             * Takes a screenshot of the passed in area and saves it
             * in `stream` as png image.
             * @param x The X coordinate of the area
             * @param y The Y coordinate of the area
             * @param width The width of the area
             * @param height The height of the area
             * @param stream The stream for the screenshot
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot_area(
                x: number,
                y: number,
                width: number,
                height: number,
                stream: Gio.OutputStream,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Takes a screenshot of the passed in area and saves it
             * in `stream` as png image.
             * @param x The X coordinate of the area
             * @param y The Y coordinate of the area
             * @param width The width of the area
             * @param height The height of the area
             * @param stream The stream for the screenshot
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot_area(
                x: number,
                y: number,
                width: number,
                height: number,
                stream: Gio.OutputStream,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<Mtk.Rectangle> | void;
            /**
             * Finish the asynchronous operation started by shell_screenshot_screenshot_area()
             * and obtain its result.
             * @param result the #GAsyncResult that was provided to the callback
             * @returns whether the operation was successful
             */
            screenshot_area_finish(result: Gio.AsyncResult): [boolean, Mtk.Rectangle];
            /**
             * Finish the asynchronous operation started by shell_screenshot_screenshot()
             * and obtain its result.
             * @param result the #GAsyncResult that was provided to the callback
             * @returns whether the operation was successful
             */
            screenshot_finish(result: Gio.AsyncResult): [boolean, Mtk.Rectangle];
            /**
             * Takes a screenshot of the whole screen as #ClutterContent.
             */
            screenshot_stage_to_content(): Promise<
                [Clutter.Content, number, Clutter.Content | null, Graphene.Point | null, number]
            >;
            /**
             * Takes a screenshot of the whole screen as #ClutterContent.
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot_stage_to_content(callback: Gio.AsyncReadyCallback<this> | null): void;
            /**
             * Takes a screenshot of the whole screen as #ClutterContent.
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot_stage_to_content(
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<[Clutter.Content, number, Clutter.Content | null, Graphene.Point | null, number]> | void;
            /**
             * Finish the asynchronous operation started by
             * shell_screenshot_screenshot_stage_to_content() and obtain its result.
             * @param result the #GAsyncResult that was provided to the callback
             * @returns the #ClutterContent, or NULL
             */
            screenshot_stage_to_content_finish(
                result: Gio.AsyncResult,
            ): [Clutter.Content, number, Clutter.Content | null, Graphene.Point | null, number];
            /**
             * Takes a screenshot of the focused window (optionally omitting the frame)
             * in `stream` as png image.
             * @param include_frame Whether to include the frame or not
             * @param include_cursor Whether to include the cursor or not
             * @param stream The stream for the screenshot
             */
            screenshot_window(
                include_frame: boolean,
                include_cursor: boolean,
                stream: Gio.OutputStream,
            ): Promise<Mtk.Rectangle>;
            /**
             * Takes a screenshot of the focused window (optionally omitting the frame)
             * in `stream` as png image.
             * @param include_frame Whether to include the frame or not
             * @param include_cursor Whether to include the cursor or not
             * @param stream The stream for the screenshot
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot_window(
                include_frame: boolean,
                include_cursor: boolean,
                stream: Gio.OutputStream,
                callback: Gio.AsyncReadyCallback<this> | null,
            ): void;
            /**
             * Takes a screenshot of the focused window (optionally omitting the frame)
             * in `stream` as png image.
             * @param include_frame Whether to include the frame or not
             * @param include_cursor Whether to include the cursor or not
             * @param stream The stream for the screenshot
             * @param callback function to call returning success or failure of the async grabbing
             */
            screenshot_window(
                include_frame: boolean,
                include_cursor: boolean,
                stream: Gio.OutputStream,
                callback?: Gio.AsyncReadyCallback<this> | null,
            ): Promise<Mtk.Rectangle> | void;
            /**
             * Finish the asynchronous operation started by shell_screenshot_screenshot_window()
             * and obtain its result.
             * @param result the #GAsyncResult that was provided to the callback
             * @returns whether the operation was successful
             */
            screenshot_window_finish(result: Gio.AsyncResult): [boolean, Mtk.Rectangle];
        }

        namespace SecureTextBuffer {
            // Constructor properties interface

            interface ConstructorProps extends Clutter.TextBuffer.ConstructorProps {}
        }

        class SecureTextBuffer extends Clutter.TextBuffer {
            static $gtype: GObject.GType<SecureTextBuffer>;

            // Constructors

            constructor(properties?: Partial<SecureTextBuffer.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): SecureTextBuffer;
        }

        namespace SquareBin {
            // Constructor properties interface

            interface ConstructorProps<A extends Clutter.Actor = Clutter.Actor>
                extends St.Bin.ConstructorProps<A>,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {}
        }

        class SquareBin<A extends Clutter.Actor = Clutter.Actor>
            extends St.Bin<A>
            implements Atk.ImplementorIface, Clutter.Animatable
        {
            static $gtype: GObject.GType<SquareBin>;

            // Constructors

            constructor(properties?: Partial<SquareBin.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

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

        namespace Stack {
            // Constructor properties interface

            interface ConstructorProps
                extends St.Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {}
        }

        /**
         * Pure "Z-axis" container class
         *
         * A #ShellStack draws its children on top of each other,
         * aligned to the top left.  It will be sized in width/height
         * according to the largest such dimension of its children, and
         * all children will be allocated that size.  This differs
         * from #ClutterGroup which allocates its children their natural
         * size, even if that would overflow the size allocated to the stack.
         */
        class Stack extends St.Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<Stack>;

            // Constructors

            constructor(properties?: Partial<Stack.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

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

        namespace TrayIcon {
            // Constructor properties interface

            interface ConstructorProps<A extends Clutter.Actor = Clutter.Actor>
                extends Clutter.Clone.ConstructorProps<A>,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                pid: number;
                title: string;
                wm_class: string;
                wmClass: string;
            }
        }

        class TrayIcon<A extends Clutter.Actor = Clutter.Actor>
            extends Clutter.Clone<A>
            implements Atk.ImplementorIface, Clutter.Animatable
        {
            static $gtype: GObject.GType<TrayIcon>;

            // Properties

            get pid(): number;
            get title(): string;
            get wm_class(): string;
            get wmClass(): string;

            // Constructors

            constructor(properties?: Partial<TrayIcon.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Methods

            /**
             * Fakes a press and release on `icon`. `event` must be a
             * %CLUTTER_BUTTON_RELEASE, %CLUTTER_KEY_PRESS or %CLUTTER_KEY_RELEASE event.
             * Its relevant details will be passed on to the icon, but its
             * coordinates will be ignored; the click is
             * always made on the center of `icon`.
             * @param event the #ClutterEvent triggering the fake click
             */
            click(event: Clutter.Event): void;

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

        namespace TrayManager {
            // Signal callback interfaces

            interface TrayIconAdded {
                (object: Clutter.Actor): void;
            }

            interface TrayIconRemoved {
                (object: Clutter.Actor): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                bg_color: Cogl.Color;
                bgColor: Cogl.Color;
            }
        }

        class TrayManager extends GObject.Object {
            static $gtype: GObject.GType<TrayManager>;

            // Properties

            get bg_color(): Cogl.Color;
            get bgColor(): Cogl.Color;

            // Constructors

            constructor(properties?: Partial<TrayManager.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): TrayManager;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'tray-icon-added', callback: (_source: this, object: Clutter.Actor) => void): number;
            connect_after(signal: 'tray-icon-added', callback: (_source: this, object: Clutter.Actor) => void): number;
            emit(signal: 'tray-icon-added', object: Clutter.Actor): void;
            connect(signal: 'tray-icon-removed', callback: (_source: this, object: Clutter.Actor) => void): number;
            connect_after(
                signal: 'tray-icon-removed',
                callback: (_source: this, object: Clutter.Actor) => void,
            ): number;
            emit(signal: 'tray-icon-removed', object: Clutter.Actor): void;

            // Methods

            manage_screen(theme_widget: St.Widget): void;
            unmanage_screen(): void;
        }

        namespace WM {
            // Signal callback interfaces

            interface ConfirmDisplayChange {
                (): void;
            }

            interface CreateCloseDialog {
                (window: Meta.Window): Meta.CloseDialog;
            }

            interface CreateInhibitShortcutsDialog {
                (window: Meta.Window): Meta.InhibitShortcutsDialog;
            }

            interface Destroy {
                (object: Meta.WindowActor): void;
            }

            interface FilterKeybinding {
                (object: Meta.KeyBinding): boolean;
            }

            interface HideTilePreview {
                (): void;
            }

            interface KillSwitchWorkspace {
                (): void;
            }

            interface KillWindowEffects {
                (object: Meta.WindowActor): void;
            }

            interface Map {
                (object: Meta.WindowActor): void;
            }

            interface Minimize {
                (object: Meta.WindowActor): void;
            }

            interface ShowTilePreview {
                (object: Meta.Window, p0: Mtk.Rectangle, p1: number): void;
            }

            interface ShowWindowMenu {
                (object: Meta.Window, p0: number, p1: Mtk.Rectangle): void;
            }

            interface SizeChange {
                (object: Meta.WindowActor, p0: Meta.SizeChange, p1: Mtk.Rectangle, p2: Mtk.Rectangle): void;
            }

            interface SizeChanged {
                (object: Meta.WindowActor): void;
            }

            interface SwitchWorkspace {
                (object: number, p0: number, p1: number): void;
            }

            interface Unminimize {
                (object: Meta.WindowActor): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class WM extends GObject.Object {
            static $gtype: GObject.GType<WM>;

            // Constructors

            constructor(properties?: Partial<WM.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](plugin: Meta.Plugin): WM;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'confirm-display-change', callback: (_source: this) => void): number;
            connect_after(signal: 'confirm-display-change', callback: (_source: this) => void): number;
            emit(signal: 'confirm-display-change'): void;
            connect(
                signal: 'create-close-dialog',
                callback: (_source: this, window: Meta.Window) => Meta.CloseDialog,
            ): number;
            connect_after(
                signal: 'create-close-dialog',
                callback: (_source: this, window: Meta.Window) => Meta.CloseDialog,
            ): number;
            emit(signal: 'create-close-dialog', window: Meta.Window): void;
            connect(
                signal: 'create-inhibit-shortcuts-dialog',
                callback: (_source: this, window: Meta.Window) => Meta.InhibitShortcutsDialog,
            ): number;
            connect_after(
                signal: 'create-inhibit-shortcuts-dialog',
                callback: (_source: this, window: Meta.Window) => Meta.InhibitShortcutsDialog,
            ): number;
            emit(signal: 'create-inhibit-shortcuts-dialog', window: Meta.Window): void;
            connect(signal: 'destroy', callback: (_source: this, object: Meta.WindowActor) => void): number;
            connect_after(signal: 'destroy', callback: (_source: this, object: Meta.WindowActor) => void): number;
            emit(signal: 'destroy', object: Meta.WindowActor): void;
            connect(signal: 'filter-keybinding', callback: (_source: this, object: Meta.KeyBinding) => boolean): number;
            connect_after(
                signal: 'filter-keybinding',
                callback: (_source: this, object: Meta.KeyBinding) => boolean,
            ): number;
            emit(signal: 'filter-keybinding', object: Meta.KeyBinding): void;
            connect(signal: 'hide-tile-preview', callback: (_source: this) => void): number;
            connect_after(signal: 'hide-tile-preview', callback: (_source: this) => void): number;
            emit(signal: 'hide-tile-preview'): void;
            connect(signal: 'kill-switch-workspace', callback: (_source: this) => void): number;
            connect_after(signal: 'kill-switch-workspace', callback: (_source: this) => void): number;
            emit(signal: 'kill-switch-workspace'): void;
            connect(signal: 'kill-window-effects', callback: (_source: this, object: Meta.WindowActor) => void): number;
            connect_after(
                signal: 'kill-window-effects',
                callback: (_source: this, object: Meta.WindowActor) => void,
            ): number;
            emit(signal: 'kill-window-effects', object: Meta.WindowActor): void;
            connect(signal: 'map', callback: (_source: this, object: Meta.WindowActor) => void): number;
            connect_after(signal: 'map', callback: (_source: this, object: Meta.WindowActor) => void): number;
            emit(signal: 'map', object: Meta.WindowActor): void;
            connect(signal: 'minimize', callback: (_source: this, object: Meta.WindowActor) => void): number;
            connect_after(signal: 'minimize', callback: (_source: this, object: Meta.WindowActor) => void): number;
            emit(signal: 'minimize', object: Meta.WindowActor): void;
            connect(
                signal: 'show-tile-preview',
                callback: (_source: this, object: Meta.Window, p0: Mtk.Rectangle, p1: number) => void,
            ): number;
            connect_after(
                signal: 'show-tile-preview',
                callback: (_source: this, object: Meta.Window, p0: Mtk.Rectangle, p1: number) => void,
            ): number;
            emit(signal: 'show-tile-preview', object: Meta.Window, p0: Mtk.Rectangle, p1: number): void;
            connect(
                signal: 'show-window-menu',
                callback: (_source: this, object: Meta.Window, p0: number, p1: Mtk.Rectangle) => void,
            ): number;
            connect_after(
                signal: 'show-window-menu',
                callback: (_source: this, object: Meta.Window, p0: number, p1: Mtk.Rectangle) => void,
            ): number;
            emit(signal: 'show-window-menu', object: Meta.Window, p0: number, p1: Mtk.Rectangle): void;
            connect(
                signal: 'size-change',
                callback: (
                    _source: this,
                    object: Meta.WindowActor,
                    p0: Meta.SizeChange,
                    p1: Mtk.Rectangle,
                    p2: Mtk.Rectangle,
                ) => void,
            ): number;
            connect_after(
                signal: 'size-change',
                callback: (
                    _source: this,
                    object: Meta.WindowActor,
                    p0: Meta.SizeChange,
                    p1: Mtk.Rectangle,
                    p2: Mtk.Rectangle,
                ) => void,
            ): number;
            emit(
                signal: 'size-change',
                object: Meta.WindowActor,
                p0: Meta.SizeChange,
                p1: Mtk.Rectangle,
                p2: Mtk.Rectangle,
            ): void;
            connect(signal: 'size-changed', callback: (_source: this, object: Meta.WindowActor) => void): number;
            connect_after(signal: 'size-changed', callback: (_source: this, object: Meta.WindowActor) => void): number;
            emit(signal: 'size-changed', object: Meta.WindowActor): void;
            connect(
                signal: 'switch-workspace',
                callback: (_source: this, object: number, p0: number, p1: number) => void,
            ): number;
            connect_after(
                signal: 'switch-workspace',
                callback: (_source: this, object: number, p0: number, p1: number) => void,
            ): number;
            emit(signal: 'switch-workspace', object: number, p0: number, p1: number): void;
            connect(signal: 'unminimize', callback: (_source: this, object: Meta.WindowActor) => void): number;
            connect_after(signal: 'unminimize', callback: (_source: this, object: Meta.WindowActor) => void): number;
            emit(signal: 'unminimize', object: Meta.WindowActor): void;

            // Methods

            /**
             * The plugin must call this after the user responded to the confirmation dialog.
             * @param ok if the new configuration was OK
             */
            complete_display_change(ok: boolean): void;
            /**
             * The plugin must call this when it has completed a window destroy effect.
             * @param actor the MetaWindowActor actor
             */
            completed_destroy(actor: Meta.WindowActor): void;
            /**
             * The plugin must call this when it has completed a window map effect.
             * @param actor the MetaWindowActor actor
             */
            completed_map(actor: Meta.WindowActor): void;
            /**
             * The plugin must call this when it has completed a window minimize effect.
             * @param actor the MetaWindowActor actor
             */
            completed_minimize(actor: Meta.WindowActor): void;
            completed_size_change(actor: Meta.WindowActor): void;
            /**
             * The plugin must call this when it has finished switching the
             * workspace.
             */
            completed_switch_workspace(): void;
            /**
             * The plugin must call this when it has completed a window unminimize effect.
             * @param actor the MetaWindowActor actor
             */
            completed_unminimize(actor: Meta.WindowActor): void;
        }

        namespace WindowPreview {
            // Constructor properties interface

            interface ConstructorProps
                extends St.Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                window_container: Clutter.Actor;
                windowContainer: Clutter.Actor;
            }
        }

        class WindowPreview extends St.Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<WindowPreview>;

            // Properties

            get window_container(): Clutter.Actor;
            set window_container(val: Clutter.Actor);
            get windowContainer(): Clutter.Actor;
            set windowContainer(val: Clutter.Actor);

            // Constructors

            constructor(properties?: Partial<WindowPreview.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

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

        namespace WindowPreviewLayout {
            // Constructor properties interface

            interface ConstructorProps extends Clutter.LayoutManager.ConstructorProps {
                bounding_box: Clutter.ActorBox;
                boundingBox: Clutter.ActorBox;
            }
        }

        class WindowPreviewLayout extends Clutter.LayoutManager {
            static $gtype: GObject.GType<WindowPreviewLayout>;

            // Properties

            get bounding_box(): Clutter.ActorBox;
            get boundingBox(): Clutter.ActorBox;

            // Constructors

            constructor(properties?: Partial<WindowPreviewLayout.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Methods

            /**
             * Creates a ClutterActor drawing the texture of `window` and adds it
             * to the container. If `window` is already part of the preview, this
             * function will do nothing.
             * @param window the #MetaWindow
             * @returns The newly created actor drawing @window
             */
            add_window(window: Meta.Window): Clutter.Actor | null;
            /**
             * Gets an array of all MetaWindows that were added to the layout
             * using shell_window_preview_layout_add_window(), ordered by the
             * insertion order.
             * @returns The list of windows
             */
            get_windows(): Meta.Window[];
            /**
             * Removes a MetaWindow `window` from the preview which has been added
             * previously using shell_window_preview_layout_add_window().
             * If `window` is not part of preview, this function will do nothing.
             * @param window the #MetaWindow
             */
            remove_window(window: Meta.Window): void;
        }

        namespace WindowTracker {
            // Signal callback interfaces

            interface StartupSequenceChanged {
                (object: Meta.StartupSequence): void;
            }

            interface TrackedWindowsChanged {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                focus_app: App;
                focusApp: App;
            }
        }

        /**
         * Associate windows with applications
         *
         * Maintains a mapping from windows to applications (.desktop file ids).
         * It currently implements this with some heuristics on the WM_CLASS X11
         * property (and some static override regexps); in the future, we want to
         * have it also track through startup-notification.
         */
        class WindowTracker extends GObject.Object {
            static $gtype: GObject.GType<WindowTracker>;

            // Properties

            get focus_app(): App;
            get focusApp(): App;

            // Constructors

            constructor(properties?: Partial<WindowTracker.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(
                signal: 'startup-sequence-changed',
                callback: (_source: this, object: Meta.StartupSequence) => void,
            ): number;
            connect_after(
                signal: 'startup-sequence-changed',
                callback: (_source: this, object: Meta.StartupSequence) => void,
            ): number;
            emit(signal: 'startup-sequence-changed', object: Meta.StartupSequence): void;
            connect(signal: 'tracked-windows-changed', callback: (_source: this) => void): number;
            connect_after(signal: 'tracked-windows-changed', callback: (_source: this) => void): number;
            emit(signal: 'tracked-windows-changed'): void;

            // Static methods

            static get_default(): WindowTracker;

            // Methods

            /**
             * Look up the application corresponding to a process.
             * @param pid A Unix process identifier
             * @returns A #ShellApp, or %NULL if none
             */
            get_app_from_pid(pid: number): App;
            get_startup_sequences(): Meta.StartupSequence[];
            get_window_app(metawin: Meta.Window): App;
        }

        namespace WorkspaceBackground {
            // Constructor properties interface

            interface ConstructorProps
                extends St.Widget.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Clutter.Animatable.ConstructorProps {
                monitor_index: number;
                monitorIndex: number;
                state_adjustment_value: number;
                stateAdjustmentValue: number;
            }
        }

        class WorkspaceBackground extends St.Widget implements Atk.ImplementorIface, Clutter.Animatable {
            static $gtype: GObject.GType<WorkspaceBackground>;

            // Properties

            get monitor_index(): number;
            get monitorIndex(): number;
            get state_adjustment_value(): number;
            set state_adjustment_value(val: number);
            get stateAdjustmentValue(): number;
            set stateAdjustmentValue(val: number);

            // Constructors

            constructor(properties?: Partial<WorkspaceBackground.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

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

        type AppClass = typeof App;
        type AppSystemClass = typeof AppSystem;
        type AppUsageClass = typeof AppUsage;
        type BlurEffectClass = typeof BlurEffect;
        type CameraMonitorClass = typeof CameraMonitor;
        type GLSLEffectClass = typeof GLSLEffect;
        type GlobalClass = typeof Global;
        type InvertLightnessEffectClass = typeof InvertLightnessEffect;
        type KeyringPromptClass = typeof KeyringPrompt;
        class MemoryInfo {
            static $gtype: GObject.GType<MemoryInfo>;

            // Fields

            glibc_uordblks: number;
            js_bytes: number;
            gjs_boxed: number;
            gjs_gobject: number;
            gjs_function: number;
            gjs_closure: number;
            last_gc_seconds_ago: number;

            // Constructors

            constructor(
                properties?: Partial<{
                    glibc_uordblks: number;
                    js_bytes: number;
                    gjs_boxed: number;
                    gjs_gobject: number;
                    gjs_function: number;
                    gjs_closure: number;
                    last_gc_seconds_ago: number;
                }>,
            );
            _init(...args: any[]): void;
        }

        type MountOperationClass = typeof MountOperation;
        type NetworkAgentClass = typeof NetworkAgent;
        type PerfLogClass = typeof PerfLog;
        type PolkitAuthenticationAgentClass = typeof PolkitAuthenticationAgent;
        type ScreenshotClass = typeof Screenshot;
        type SecureTextBufferClass = typeof SecureTextBuffer;
        type SquareBinClass = typeof SquareBin;
        type StackClass = typeof Stack;
        type TrayIconClass = typeof TrayIcon;
        type TrayManagerClass = typeof TrayManager;
        type WMClass = typeof WM;
        type WindowPreviewClass = typeof WindowPreview;
        type WindowPreviewLayoutClass = typeof WindowPreviewLayout;
        abstract class WindowPreviewLayoutPrivate {
            static $gtype: GObject.GType<WindowPreviewLayoutPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type WindowTrackerClass = typeof WindowTracker;
        type WorkspaceBackgroundClass = typeof WorkspaceBackground;
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

    export default Shell;
}

declare module 'gi://Shell' {
    import Shell15 from 'gi://Shell?version=15';
    export default Shell15;
}
// END
