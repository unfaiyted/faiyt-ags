/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://Libxfce4util?version=1.0' {
    // Module dependencies
    import type Gio from 'gi://Gio?version=2.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type GModule from 'gi://GModule?version=2.0';

    export namespace Libxfce4util {
        /**
         * Libxfce4util-1.0
         */

        /**
         * The license text to return from xfce_get_license_text().
         */

        /**
         * The license text to return from xfce_get_license_text().
         */
        export namespace LicenseTextType {
            export const $gtype: GObject.GType<LicenseTextType>;
        }

        enum LicenseTextType {
            /**
             * the BSD License.
             */
            BSD,
            /**
             * the GNU General Public License.
             */
            GPL,
            /**
             * the GNU Lesser General Public License.
             */
            LGPL,
        }

        export namespace ResourceType {
            export const $gtype: GObject.GType<ResourceType>;
        }

        enum ResourceType {
            /**
             * where applications store data.
             */
            DATA,
            /**
             * configuration files.
             */
            CONFIG,
            /**
             * cached information.
             */
            CACHE,
            /**
             * icon search path.
             */
            ICONS,
            /**
             * themes search path.
             */
            THEMES,
        }
        const LOCALE_FULL_MATCH: number;
        const LOCALE_NO_MATCH: number;
        /**
         * An alias of xfce_g_string_append_quoted().
         * @param string A #GString.
         * @param unquoted A literal string.
         */
        function append_quoted(string: GLib.String, unquoted: string): void;
        /**
         * Creates the shared thumbnail path for the file that corresponds to the given `uri`
         * and `size`. No checks are made regarding the existence of the thumbnail.
         *
         * It is the duty of the caller to free the returned string.
         * @param uri the uri of the file whose shared thumbnail we want to find.
         * @param size the thumbnail size (e.g. normal, large).
         * @returns a string with the thumbnail path or NULL if the @uri could not be converted to a local filename.
         */
        function create_shared_thumbnail_path(uri: string, size: string): string;
        /**
         * Expands field codes in `command` according to Freedesktop.org Desktop Entry Specification.
         * @param command Input string (command to expand) or %NULL.
         * @param uri_list Input string list (filename/URL field) or %NULL.
         * @param icon Input string (icon field) or %NULL.
         * @param name Input string (name field) or %NULL.
         * @param uri Input string (URI field) or %NULL.
         * @param requires_terminal Input boolean.
         * @returns %NULL on error, else the string, which should be freed using g_free() when               no longer needed.
         */
        function expand_desktop_entry_field_codes(
            command: string,
            uri_list: string[],
            icon: string,
            name: string,
            uri: string,
            requires_terminal: boolean,
        ): string;
        /**
         * Expands shell like environment variables and tilde (~/ and ~user/ are both supported)
         * in `command`.
         * @param command Input string or %NULL.
         * @param envp Addition environment variables to take into account. These            variables have higher priority than the ones in the process's            environment.
         * @returns %NULL on error, else the string, which should be freed using               g_free() when no longer needed.
         */
        function expand_variables(command: string, envp: string): string;
        /**
         * Generates an SHA-256 hash of the `file`.
         * @param file a #GFile.
         * @param cancellable optional #GCancellable object, %NULL to ignore.
         * @returns Checksum of the @file. If file read fails, returns %NULL. Free with g_free().
         */
        function g_file_create_checksum(file: Gio.File, cancellable?: Gio.Cancellable | null): string | null;
        /**
         * Compares the checksum stored in safety flag
         * with the actual file. If it matches, it
         * is considered safe.
         *
         * Read the documentation of
         * xfce_g_file_set_trusted() for details.
         * @param file a #GFile.
         * @param cancellable optional #GCancellable object, %NULL to ignore.
         * @returns %TRUE if safety flag is verified or not supported. %FALSE otherwise.
         */
        function g_file_is_trusted(file: Gio.File, cancellable?: Gio.Cancellable | null): boolean;
        /**
         * Checks if GVFS-metadata is available for
         * the `file` provided.
         * @param file a #GFile.
         * @returns %TRUE is GVFS-metadata is supported, %FALSE otherwise.
         */
        function g_file_metadata_is_supported(file: Gio.File): boolean;
        /**
         * Sets the "safety flag" on if `is_trusted`.
         *
         * Safety flag is a new concept introduced in
         * XFCE 4.17. It is basically an additional
         * execution flag stored in GVFS-metadata.
         * Unlike the execution flag (+x), it is safe
         * to assume that this flag did not come from
         * foreign location (for example, by downloading
         * an tar archive) and is set by user.
         *
         * The checksum of the file is stored, and
         * would be considered "on" only if checksum
         * matches with the file on execution.
         * @param file a #GFile.
         * @param is_trusted #TRUE if trusted, #FALSE if not
         * @param cancellable optional #GCancellable object, %NULL to ignore.
         * @returns %TRUE on success, %FALSE on error.
         */
        function g_file_set_trusted(file: Gio.File, is_trusted: boolean, cancellable?: Gio.Cancellable | null): boolean;
        /**
         * Quotes a string `unquoted` and appends to an existing
         * #GString `string`. The shell will interpret the quoted string
         * to mean `unquoted`. The quoting style used is undefined
         * (check g_shell_quote ()).
         * @param string A #GString.
         * @param unquoted A literal string.
         */
        function g_string_append_quoted(string: GLib.String, unquoted: string): void;
        /**
         * Similar to xfce_get_file_localized(), but works on directory instead of
         * a file.
         * @param directory directory name to check for a localized variant.
         * @returns path of the localized directory name or copy of @directory if               no such directory exists. Returned string should be freed using               g_free().
         */
        function get_dir_localized(directory: string): string;
        /**
         * Similar to #xfce_get_file_localized_r, but works on directory instead
         * of regular file.
         * @param buffer destination buffer to store the localized filename to.
         * @param length size of @buffer in bytes.
         * @param directory name of directory to check for localized variant of.
         * @returns pointer to @buffer or %NULL on error.
         */
        function get_dir_localized_r(buffer: string, length: number, directory: string): string;
        /**
         * Checks if theres a version of `filename` which is localized to the current
         * locale. This is done by appending the full locale name to `filename,` separated
         * by a '.'. If theres no file of that name, it retries using the full locale
         * name without the encoding (if any), then without the qualifier (if any) and
         * at last the base locale is tried. If all of those fails, a copy of `filename`
         * is returned.
         * @param filename name of a file to look for a localized version.
         * @returns path of the localized file or copy of @filename if no such               file exists. Returned string should be freed using g_free().
         */
        function get_file_localized(filename: string): string;
        /**
         * Similar in functionality to xfce_get_file_localized(), but stores the
         * result in `buffer` instead of allocating a new buffer.
         * @param buffer destination buffer to store the localized filename to.
         * @param length size of @buffer in bytes.
         * @param filename name of a file to look for a localized version.
         * @returns pointer to @buffer or %NULL on error.
         */
        function get_file_localized_r(buffer: string, length: number, filename: string): string;
        /**
         * Similar to g_get_home_dir() in functionality but will never return NULL.
         * While g_get_home_dir() may return NULL under certain circumstances, this
         * function is garantied to never ever return NULL, but always return a
         * valid character pointer with the absolute path to the user's home directory.
         *
         * The returned string is owned by libxfce4util and must not be freed by
         * the caller.
         * @returns the path to the current user's home directory.
         */
        function get_homedir(): string;
        /**
         * Returns the text of the software license specified in the
         * `license_type` translated to the current language. If no
         * translation is available, the english license text will
         * be returned.
         * @param license_type an #XfceLicenseTextType.
         * @returns the license text for @license_type.
         */
        function get_license_text(license_type: LicenseTextType | null): string;
        /**
         * `paths` is a ':'-separated list of pathnames, with:
         *
         * - `%F`: the `filename`
         * - `%L`: the language string, as returned by `setlocale(LC_MESSAGES, NULL)`
         * - `%l`: the language component of the language string
         * - `%N`: application name
         *
         * Example paths: `/usr/local/lib/%L/%F:/usr/local/share/%N/%l/%F`
         * @param dst destination buffer.
         * @param size size of @dst in bytes.
         * @param paths the path
         * @param filename the filename
         * @param test test
         */
        function get_path_localized(
            dst: string,
            size: number,
            paths: string,
            filename: string,
            test: GLib.FileTest | null,
        ): string;
        /**
         * Safe way to retrieve the path to the user's ".xfce4" directory. The path
         * to the current user's ".xfce4" directory is either taken from the
         * environment variable XFCE4HOME if defined, or if unset, is gained by
         * concatenating the path to the user's home directory and the ".xfce4".
         * That says, it will, by default, return the path "$HOME/.xfce4", where
         * $HOME is replaced with the absolute path to the user's home directory.
         *
         * The returned string is managed by libxfce4util and must not be freed by
         * the caller.
         * @returns the path to the current user's ".xfce4" directory.
         */
        function get_userdir(): string;
        /**
         * Portable way to query the hostname of the node running the process. This
         * function does not ever return %NULL, but always returns a string containing
         * the current node's hostname.
         * @returns the current node's hostname. The string has to be freed               by the caller using g_free().
         */
        function gethostname(): string;
        /**
         * The locale is of the general form LANG_COUNTRY.ENCODING @ MODIFIER, where
         * each of COUNTRY, ENCODING and MODIFIER can be absent.
         *
         * The match is done by actually removing the rightmost element one by one. This
         * is not entirely according to the freedesktop.org specification, but much easier.
         * Will probably be fixed in the future.
         * @param locale1 the current locale value as returned by setlocale(LC_MESSAGES,%NULL).
         * @param locale2 the locale value to match against.
         * @returns an integer value indicating the level of matching, where               the constant #XFCE_LOCALE_FULL_MATCH indicates a full match               and #XFCE_LOCALE_NO_MATCH means no match. Every other value               indicates a partial match, the higher the value, the better               the match. You should not rely on any specific value besides               the constants #XFCE_LOCALE_FULL_MATCH and #XFCE_LOCALE_NO_MATCH,               since the range of returned values may change in the future.
         */
        function locale_match(locale1: string, locale2: string): number;
        /**
         * Creates the specified directory `whole_path,` but unlike the mkdir()
         * function from the standard C library, if any of the parent directories
         * of the `whole_path` do not exists, they are created as well.
         *
         * If the directory specified by `whole_path` already exists, this function
         * performs no operation and simply returns %TRUE.
         * @param whole_path path to the directory to create.
         * @param mode file permissions to use for the newly created directories.
         * @returns %TRUE on success, else %FALSE.
         */
        function mkdirhier(whole_path: string, mode: number): boolean;
        /**
         * Initializes the POSIX signal handler system.  Must be called
         * before setting any POSIX signal handlers.
         * @returns %TRUE on success, %FALSE on failure, in which case          @error will be set.
         */
        function posix_signal_handler_init(): boolean;
        /**
         * Restores the default handler for `signal`.
         * @param signal A POSIX signal id number.
         */
        function posix_signal_handler_restore_handler(signal: number): void;
        /**
         * Sets `handler` to be called whenever `signal` is caught by the
         * application.  The `user_data` parameter will be passed as an argument
         * to `handler`.
         * @param signal A POSIX signal id number.
         * @param handler A callback function.
         * @returns %TRUE on success, %FALSE otherwise, in which case          @error will be set.
         */
        function posix_signal_handler_set_handler(signal: number, handler: PosixSignalHandler): boolean;
        /**
         * Frees all memory associated with the POSIX signal handling system
         * and restores all default signal handlers.
         */
        function posix_signal_handler_shutdown(): void;
        /**
         * If `readonly` is %TRUE parsing is generally faster, because only untranslated
         * entries and entries that match the current locale will be loaded. Also if
         * you pass %TRUE for `readonly,` #xfce_rc_config will fail if `resource`
         * does not reference a regular file.
         *
         * It is no error if `readonly` is %FALSE and the file referenced by `resource`
         * does not exists. In this case you'll start with a fresh config, which contains
         * only the default group and no entries.
         * @param type The resource type being opened
         * @param resource The resource name to open
         * @param readonly whether to open @resource readonly.
         * @returns the newly created #XfceRc object, or %NULL on error.
         */
        function rc_config_open(type: ResourceType | null, resource: string, readonly: boolean): Rc;
        /**
         * Parses the resource config file specified by `filename`.
         *
         * If `readonly` is %TRUE parsing is generally faster, because only untranslated
         * entries and entries that match the current locale will be loaded. Also if
         * you pass %TRUE for `readonly,` #xfce_rc_simple_open will fail if `filename`
         * does not reference a regular file.
         *
         * It is no error if `readonly` is %FALSE and the file referenced by `filename`
         * does not exists. In this case you'll start with a fresh config, which contains
         * only the default group and no entries.
         * @param filename name of the filename to open.
         * @param readonly whether to open @filename readonly.
         * @returns the newly created #XfceRc object, or %NULL on error.
         */
        function rc_simple_open(filename: string, readonly: boolean): Rc;
        /**
         * Queries the list of possible directories for the specified `type`. The
         * first element of the list is always the save location for `type`. None
         * of the directories returned in the list are garantied to exist.
         *
         * This function should be rarely used. You should consider using
         * xfce_resource_lookup() or xfce_resource_match() instead.
         *
         * The returned list must be freed using g_strfreev().
         * @param type type of the resource.
         * @returns list of possible directories for @type.
         */
        function resource_dirs(type: ResourceType | null): string[];
        /**
         * Looks for a resource of the specified `type` whose relative path matches
         * `filename`. `filename` can either reference a regular file, in which case
         * it must not end with a slash character ('/'), or a directory, when
         * `filename` contains a trailing slash character ('/').
         *
         * The caller is responsible to free the returned string using g_free()
         * when no longer needed.
         * @param type type of resource to lookup.
         * @param filename relative filename of the resource, e.g. "xfwm4/xfwmrc".
         * @returns the absolute path to the first file or directory in the               search path, that matches @filename or %NULL if no such               file or directory could be found.
         */
        function resource_lookup(type: ResourceType | null, filename: string): string;
        /**
         * Similar to xfce_resource_lookup(), but returns all resource of the specified `type,`
         * that whose name is `filename`.
         *
         * The caller is responsible to free the returned string array using g_strfreev()
         * when no longer needed.
         * @param type type of the resource to lookup.
         * @param filename relative file path. If @filename contains a trailing slash character             it is taken to reference a directory, else it is taken to reference             a file.
         * @returns list of possible resources for @type.
         */
        function resource_lookup_all(type: ResourceType | null, filename: string): string[];
        /**
         * Tries to find all resources with the specified `type`. The function will
         * look into all specified directories and return all filenames in these
         * directories. The returned filenames are given relative the base directories
         * specified by `type`.
         *
         * If `pattern` contains a trailing slash, #xfce_resource_match looks only for
         * directories that match `pattern,` else it'll only look for regular files. In
         * case you are looking for directories, the returned entries will contain a
         * trailing slash as well, so you can easily use them with other resource
         * functions like #xfce_resource_lookup or #xfce_resource_save_location.
         *
         * Example: xfce_resource_match (XFCE_RESOURCE_CONFIG, "foo/bar*") will probably
         * return ("foo/bar", "foo/barbaz", ...).
         * @param type type of the resource to locate directories for.
         * @param pattern only accept filenames that fit to the pattern. The pattern              needs to be a valid GPattern.
         * @param unique if %TRUE, only return items which have unique suffixes.
         * @returns string array of all the relative paths whose names matches the               given @pattern. The return value has to be freed using               g_strfreev() when no longer needed.
         */
        function resource_match(type: ResourceType | null, pattern: string, unique: boolean): string[];
        /**
         * Yet to be implemented!
         * @param type type of the resource to locate directories for.
         * @param unique if %TRUE, only return items which have unique suffixes.
         * @param func callback to determine if there was a match
         * @returns The caller is responsible to free          the returned string array using g_strfreev() when no longer needed.
         */
        function resource_match_custom(type: ResourceType | null, unique: boolean, func: MatchFunc): string[];
        /**
         * Undoes the effect of the latest call to xfce_resource_push_path(). You
         * should take special care to call xfce_resource_pop_path() exactly same
         * times as xfce_resource_push_path(), everything else might result in
         * unwanted and maybe even undefined behaviour. You have been warned!
         * @param type type of the resource which search list should be shrinked.
         */
        function resource_pop_path(type: ResourceType | null): void;
        /**
         * Appends `path` to the search path list for `type`. This function was
         * written primary for use within modules in larger applications, for example
         * MCS plugins.
         *
         * For example, if you need to add a specific path to the search path list
         * in your MCS, you should call xfce_resource_push_path() prior to calling
         * one of the resource search functions and call xfce_resource_pop_path()
         * right afterwards.
         * @param type type of the resource which search list should be expanded.
         * @param path search path to add.
         */
        function resource_push_path(type: ResourceType | null, path: string): void;
        /**
         * If `relpath` contains a trailing slash ('/') character, xfce_resource_save_location()
         * finds the directory to save files into for the given type in the user's
         * home directory. All directories needed (including those given by
         * `relpath)` will be created on demand if `create` if %TRUE.
         *
         * If `relpath` does not end with a slash ('/') character, it is taken to be
         * the name of a file to return the save location for. All the directories
         * needed will be created on demand if `create` is %TRUE.
         *
         * Specifying %NULL or the empty string for `relpath` allows you to discover
         * the base path for saving files of the specified `type,` though normally
         * you should not need this.
         * @param type type of location to return.
         * @param relpath relative path of the resource.
         * @param create whether to create missing directory.
         * @returns the path where resources of the specified @type should be               saved or %NULL on error. The returned string should be freed               when no longer needed.
         */
        function resource_save_location(type: ResourceType | null, relpath: string, create: boolean): string;
        /**
         * Searches `str` for occurances of `pattern` and replaces each
         * such occurance with `replacement`. Returns a newly allocated
         * copy of `str` on which the given replacement were performed.
         * The caller is responsible to free the returned string using
         * g_free() when no longer needed.
         *
         * Note that `pattern` and `replacement` don't need to be of the
         * same size. If `replacement` is %NULL, the pattern will be
         * removed from the string.
         *
         * Note for future Xfce developers: Deprecate this function when
         * g_string_replace() is available. (Added since Glib >= 2.68)
         * @param str the input string.
         * @param pattern a search pattern in @str.
         * @param replacement replacement string for @pattern.
         * @returns a newly allocated copy of @str where all occurrences of          @pattern are replaced with @replacement. Or %NULL if          @str is %NULL.
         */
        function str_replace(str: string, pattern: string, replacement: string): string | null;
        /**
         * Sets up the translations for `package`.
         * @param _package the package name.
         * @param localedir the @package<!---->s locale directory.
         * @param encoding the encoding to use the @package<!---->s translations              or %NULL to use "UTF-8".
         */
        function textdomain(_package: string, localedir: string, encoding: string): void;
        /**
         * Unescapes sequences in `value` according to Freedesktop.org Desktop Entry Specification.
         * @param value Value string to replace escape sequences.
         * @returns %NULL on error, else the string, which should be freed using g_free() when               no longer needed.
         */
        function unescape_desktop_entry_value(value: string): string;
        /**
         * Removes all control characters from `str` up to `end` or up to
         * `max_len` characters (note that characters does not mean bytes with
         * UTF-8), where both `str` and `max_len` may not be given.
         *
         * Control characters are replaced in `str` by whitespaces, no new string
         * will be allocated. The operation is done in-place.
         * @param str target string.
         * @param max_len max characters to check or -1 for no character limit.
         * @param end pointer to the endpoint in @str or %NULL for no endpoint.
         * @returns pointer to @str or %NULL on error.
         */
        function utf8_remove_controls(str: string, max_len: number, end: string): string;
        /**
         * Duplicates the `src` string up to `max_len` characters
         * (note that characters does not mean bytes with UTF-8).
         *
         * The caller is responsible to free the returned string
         * using g_free() when no longer needed.
         * @param src target string.
         * @param max_len max characters to duplicate or -1 for no character limit.
         * @returns pointer to the newly allocated string.
         */
        function utf8_strndup(src: string, max_len: number): string;
        /**
         * Queries the version string of the installed Xfce desktop environment.
         * @returns the overall version information of the installed Xfce desktop.
         */
        function version_string(): string;
        interface MatchFunc {
            (basedir: string, relpath: string): boolean;
        }
        interface PosixSignalHandler {
            (signal: number): void;
        }
        namespace Kiosk {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {}
        }

        class Kiosk extends GObject.Object {
            static $gtype: GObject.GType<Kiosk>;

            // Constructors

            constructor(properties?: Partial<Kiosk.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](module: string): Kiosk;

            // Methods

            /**
             * Frees the `kiosk` object.
             * In 4.13 and above, this is equivalent to calling g_clear_object.
             */
            free(): void;
            /**
             * Queries the `kiosk` object for a given capability and returns %TRUE if
             * the current user has the `capability,` else %FALSE.
             * @param capability The name of the capability to check.
             * @returns %TRUE if the current user has the @capability, else %FALSE.
             */
            query(capability: string): boolean;
        }

        type KioskClass = typeof Kiosk;
        abstract class Rc {
            static $gtype: GObject.GType<Rc>;

            // Constructors

            _init(...args: any[]): void;

            // Static methods

            /**
             * If `readonly` is %TRUE parsing is generally faster, because only untranslated
             * entries and entries that match the current locale will be loaded. Also if
             * you pass %TRUE for `readonly,` #xfce_rc_config will fail if `resource`
             * does not reference a regular file.
             *
             * It is no error if `readonly` is %FALSE and the file referenced by `resource`
             * does not exists. In this case you'll start with a fresh config, which contains
             * only the default group and no entries.
             * @param type The resource type being opened
             * @param resource The resource name to open
             * @param readonly whether to open @resource readonly.
             */
            static config_open(type: ResourceType, resource: string, readonly: boolean): Rc;
            /**
             * Parses the resource config file specified by `filename`.
             *
             * If `readonly` is %TRUE parsing is generally faster, because only untranslated
             * entries and entries that match the current locale will be loaded. Also if
             * you pass %TRUE for `readonly,` #xfce_rc_simple_open will fail if `filename`
             * does not reference a regular file.
             *
             * It is no error if `readonly` is %FALSE and the file referenced by `filename`
             * does not exists. In this case you'll start with a fresh config, which contains
             * only the default group and no entries.
             * @param filename name of the filename to open.
             * @param readonly whether to open @filename readonly.
             */
            static simple_open(filename: string, readonly: boolean): Rc;

            // Methods

            /**
             * Destructs `rc`.
             *
             * If `rc` was opened read-write and contains dirty (modified) entries, these
             * will be flushed to permanent storage first.
             */
            close(): void;
            /**
             * Similar to #xfce_rc_delete_group, but works on an entry in the current
             * group.
             * @param key the key to delete.
             * @param global whether to delete @key globally.
             */
            delete_entry(key: string, global: boolean): void;
            /**
             * If `rc` is a simple config object and `group` exists, it is deleted. All entries
             * within `group` will be deleted. For simple config objects, `global` is ignored.
             *
             * If `rc` is a complex config object and `group` exists, it will be deleted will
             * all entries. If `global` is %TRUE, the entry will be marked as deleted globally,
             * therefore all calls to #xfce_rc_read_entry and related functions will return
             * the fallback values. If `global` is %FALSE, the `group` will be deleted in the
             * per-user config file, and further calls to #xfce_rc_read_entry will most
             * probably return the system-wide config entries.
             * @param group name of the group to delete.
             * @param global whether to delete the group globally.
             */
            delete_group(group: string, global: boolean): void;
            /**
             * Flushes all changes that currently reside only in memory back to permanent
             * storage. Dirty configuration entries are written in the most specific file
             * available.
             */
            flush(): void;
            /**
             * Returns the names of all entries in `group` if any.
             *
             * %NULL is a valid input value for `group`. #xfce_rc_get_entries will
             * then return all entries in the so called "NULL group". Though this
             * "NULL group" should only be used for backward compatibility with old
             * applications. You should not use it in newly written code.
             * @param group the name of the group to get entries from.
             * @returns a NULL-terminated string array with all entries in @group. Has to               be freed using g_strfreev() if no longer needed. If the specified               @group does not exists, %NULL is returned. If the @group has no entries,               an empty string array is returned.
             */
            get_entries(group: string): string[];
            /**
             * Returns the name of the group in which we are searching for keys and
             * from which we are retrieving entries. If the currently active group is
             * the default group (the so called "NULL group"), %NULL will be returned.
             * @returns the name of the current group.
             */
            get_group(): string;
            /**
             * Returns the names of all known groups in `rc`.
             *
             * Since the default groups (the "NULL group") name is %NULL, it will not be
             * returned with this functions. But it does not matter at all, since the
             * default group is known to always exist.
             * @returns a NULL-terminated string array will the names of all groups in               @rc. Should be freed using g_strfreev() when no longer needed.
             */
            get_groups(): string[];
            /**
             * Returns current locale used by `rc` to lookup translated entries.
             * @returns a string representing the current locale.
             */
            get_locale(): string;
            /**
             * Checks whether the `key` has an entry in the current group.
             * @param key the key to search for.
             * @returns %TRUE if the @key is available, else %FALSE.
             */
            has_entry(key: string): boolean;
            /**
             * Returns %TRUE if the specified `group` is known about.
             * @param group the group to search for.
             * @returns %TRUE if the @group exists.
             */
            has_group(group: string): boolean;
            /**
             * Checks whether `rc` has any dirty (modified) entries.
             * @returns %TRUE if @rc has any dirty (modified) entries.
             */
            is_dirty(): boolean;
            /**
             * Returns the read-only status of `rc`.
             * @returns the read-only status.
             */
            is_readonly(): boolean;
            /**
             * Reads the value of an entry specified by `key` in the current group and interpret
             * it as a boolean value. Currently "on", "true" and "yes" are accepted as true,
             * everything else is false.
             * @param key the key to search for.
             * @param fallback a default value returned if the @key was not found.
             * @returns the value for this @key.
             */
            read_bool_entry(key: string, fallback: boolean): boolean;
            /**
             * Reads the value of an entry specified by `key` in the current group.
             * @param key the key to search for.
             * @param fallback a default value returned if the @key was not found.
             * @returns the value for this @key, or @fallback if @key was not found.
             */
            read_entry(key: string, fallback: string): string;
            /**
             * Reads the value of an entry specified by `key` in the current group. The
             * untranslated entry is returned. You normally do not need this.
             * @param key the key to search for.
             * @param fallback a default value returned if the @key was not found.
             * @returns the untranslated value for this @key, or @fallback if @key was not               found.
             */
            read_entry_untranslated(key: string, fallback: string): string;
            /**
             * Reads the value of an entry specified by `key` in the current group
             * and interprets it as an integer value.
             * @param key the key to search for.
             * @param fallback a default value returned if the @key was not found.
             * @returns the value for this @key.
             */
            read_int_entry(key: string, fallback: number): number;
            /**
             * Reads a list of strings in the entry specified by key in the current group.
             * The returned list has to be freed using g_strfreev() when no longer needed.
             *
             * This does not support delimiter escaping. If you need this feature, use
             * g_key_file_get_string_list() instead.
             * @param key the key to search for.
             * @param delimiter a string which specifies the places at which to split the string.              The delimiter is not included in any of the resulting strings.              If NULL, "," is used.
             * @returns the list or NULL if the entry does not exist.
             */
            read_list_entry(key: string, delimiter: string): string[];
            /**
             * Mark `rc` as "clean", i.e. don't write dirty entries at destruction time. If
             * you then call #xfce_rc_write_entry again, the dirty flag is set again and
             * dirty entries will be written at a subsequent #xfce_rc_flush call.
             */
            rollback(): void;
            /**
             * Specifies the group in which keys will be read and written. Subsequent calls
             * to #xfce_rc_read_entry and #xfce_rc_write_entry will be applied only in the
             * active group.
             *
             * If `group` references a group that does not exists, it will be created for
             * you. But note, that empty groups will not be synced to permanent storage.
             * @param group the name of the new group or %NULL to to switch back to the default group.
             */
            set_group(group: string): void;
            /**
             * Wrapper for #xfce_rc_write_entry, that stores a boolean `value`.
             * @param key the key to write.
             * @param value the value to write.
             */
            write_bool_entry(key: string, value: boolean): void;
            /**
             * Writes a `key/``value` pair. This has no effect if the resource config
             * was opened readonly, else the value will be written to permanent storage
             * on the next call to #xfce_rc_flush or when `rc` is destroyed using
             * #xfce_rc_close.
             *
             * If `rc` was opened using #xfce_rc_config_open, the value will be
             * written to the most specific config file.
             * @param key the key to write.
             * @param value the value to write.
             */
            write_entry(key: string, value: string): void;
            /**
             * Wrapper for #xfce_rc_write_entry, that stores an integer `value`.
             * @param key the key to write.
             * @param value the value to write.
             */
            write_int_entry(key: string, value: number): void;
            /**
             * Wrapper for #xfce_rc_write_entry, that stores a string list `value`.
             *
             * This does not support delimiter escaping. If you need this feature, use
             * g_key_file_set_string_list() instead.
             * @param key the key to write.
             * @param value a %NULL terminated list of strings to store in the entry specified by key.
             * @param separator the list separator. Defaults to "," if %NULL.
             */
            write_list_entry(key: string, value: string, separator: string): void;
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

    export default Libxfce4util;
}

declare module 'gi://Libxfce4util' {
    import Libxfce4util10 from 'gi://Libxfce4util?version=1.0';
    export default Libxfce4util10;
}
// END
