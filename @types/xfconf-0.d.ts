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

declare module 'gi://Xfconf?version=0' {
    // Module dependencies
    import type Gio from 'gi://Gio?version=2.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type GModule from 'gi://GModule?version=2.0';

    export namespace Xfconf {
        /**
         * Xfconf-0
         */

        /**
         * An enumeration listing the different kinds of errors under the XFCONF_ERROR domain.
         */
        class Error extends GLib.Error {
            static $gtype: GObject.GType<Error>;

            // Static fields

            /**
             * An unknown error occurred
             */
            static UNKNOWN: number;
            /**
             * The specified channel does not exist
             */
            static CHANNELNOTFOUND: number;
            /**
             * The specified property does not exist on the channel
             */
            static PROPERTYNOTFOUND: number;
            /**
             * There was a failure reading from the configuration store
             */
            static READFAILURE: number;
            /**
             * There was a failure writing to the configuration store
             */
            static WRITEFAILURE: number;
            /**
             * The user is not allowed to read or write to the channel or property
             */
            static PERMISSIONDENIED: number;
            /**
             * An internal error (likely a bug in xfconf) occurred
             */
            static INTERNALERROR: number;
            /**
             * No backends were found, or those found could not be loaded
             */
            static NOBACKEND: number;
            /**
             * The property name specified was invalid
             */
            static INVALIDPROPERTY: number;
            /**
             * The channel name specified was invalid
             */
            static INVALIDCHANNEL: number;

            // Constructors

            constructor(options: { message: string; code: number });
            _init(...args: any[]): void;

            // Static methods

            static quark(): GLib.Quark;
        }

        /**
         * Properly frees a #GPtrArray structure containing a list of
         * #GValue<!-- -->s.  This will also cause the contents of the
         * values to be freed as well.
         * @param arr A #GPtrArray of #GValue<!-- -->s.
         */
        function array_free(arr: (GObject.Value | any)[]): void;
        function error_quark(): GLib.Quark;
        /**
         * Initializes the Xfconf library.  Can be called multiple times with no
         * adverse effects.
         * @returns %TRUE if the library was initialized succesfully, %FALSE on          error.  If there is an error @error will be set.
         */
        function init(): boolean;
        /**
         * Lists all channels known in the Xfconf configuration store.
         * @returns A newly-allocated array of strings.                                                                 Free with g_strfreev() when no longer needed.
         */
        function list_channels(): string[];
        /**
         * Registers a named struct for use with xfconf_channel_get_named_struct()
         * and xfconf_channel_set_named_struct().
         * @param struct_name The unique name of the struct to register.
         * @param n_members The number of data members in the struct.
         * @param member_types An array of the #GType<!-- -->s of the struct members.
         */
        function named_struct_register(struct_name: string, n_members: number, member_types: GObject.GType): void;
        /**
         * Binds an Xfconf property to a #GObject property.  If the property
         * is changed via either the #GObject or Xfconf, the corresponding
         * property will also be updated. The binding is initialized from the
         * Xfconf property, i.e. the initial value of the #GObject property is
         * overwritten.
         *
         * Note that `xfconf_property_type` is required since `xfconf_property`
         * may or may not already exist in the Xfconf store.  The type of
         * `object_property` will be determined automatically.  If the two
         * types do not match, a conversion will be attempted.
         * @param channel An #XfconfChannel.
         * @param xfconf_property A property on @channel.
         * @param xfconf_property_type The type of @xfconf_property.
         * @param object A #GObject.
         * @param object_property A valid property on @object.
         * @returns an ID number that can be used to later remove the          binding.
         */
        function property_bind(
            channel: Channel,
            xfconf_property: string,
            xfconf_property_type: GObject.GType,
            object: any | null,
            object_property: string,
        ): number;
        /**
         * Binds an Xfconf property to a #GObject property of type
         * GDK_TYPE_COLOR (aka a #GdkColor struct).  If the property
         * is changed via either the #GObject or Xfconf, the corresponding
         * property will also be updated. The binding is initialized from the
         * Xfconf property, i.e. the initial value of the #GObject property is
         * overwritten.
         *
         * This is a special-case binding; the GdkColor struct is not
         * ideal as-is for binding to a property, so it is stored in the
         * Xfconf store as four 16-bit unsigned ints (red, green, blue, alpha).
         * Since GdkColor (currently) only supports RGB and not RGBA,
         * the last value will always be set to 0xFFFF.
         * @param channel An #XfconfChannel.
         * @param xfconf_property A property on @channel.
         * @param object A #GObject.
         * @param object_property A valid property on @object.
         * @returns an ID number that can be used to later remove the          binding.
         */
        function property_bind_gdkcolor(
            channel: Channel,
            xfconf_property: string,
            object: any | null,
            object_property: string,
        ): number;
        /**
         * Binds an Xfconf property to a #GObject property of type
         * GDK_TYPE_RGBA (aka a #GdkRGBA struct).  If the property
         * is changed via either the #GObject or Xfconf, the corresponding
         * property will also be updated. The binding is initialized from the
         * Xfconf property, i.e. the initial value of the #GObject property is
         * overwritten.
         *
         * This is a special-case binding; the GdkRGBA struct is not
         * ideal as-is for binding to a property, so it is stored in the
         * Xfconf store as four 16-bit unsigned ints (red, green, blue, alpha).
         * @param channel An #XfconfChannel.
         * @param xfconf_property A property on @channel.
         * @param object A #GObject.
         * @param object_property A valid property on @object.
         * @returns an ID number that can be used to later remove the          binding.
         */
        function property_bind_gdkrgba(
            channel: Channel,
            xfconf_property: string,
            object: any | null,
            object_property: string,
        ): number;
        /**
         * Removes an Xfconf/GObject property binding based on the binding
         * ID number.  See xfconf_g_property_bind().
         * @param id A binding ID number.
         */
        function property_unbind(id: number): void;
        /**
         * Unbinds all Xfconf channel bindings (see xfconf_g_property_bind())
         * to `object`.  If `object` is an #XfconfChannel, it will unbind all
         * xfconf properties on that channel.  If `object` is a regular #GObject
         * with properties bound to a channel, all those bindings will be
         * removed.
         * @param channel_or_object A #GObject or #XfconfChannel.
         */
        function property_unbind_all(channel_or_object?: any | null): void;
        /**
         * Causes an Xfconf channel previously bound to a #GObject property
         * (see xfconf_g_property_bind()) to no longer be bound.
         * @param channel An #XfconfChannel.
         * @param xfconf_property A bound property on @channel.
         * @param object A #GObject.
         * @param object_property A bound property on @object.
         */
        function property_unbind_by_property(
            channel: Channel,
            xfconf_property: string,
            object: any | null,
            object_property: string,
        ): void;
        /**
         * Shuts down and frees any resources consumed by the Xfconf library.
         * If xfconf_init() is called multiple times, xfconf_shutdown() must be
         * called an equal number of times to shut down the library.
         */
        function shutdown(): void;
        /**
         * Retrieves a 16-bit signed value from `value`.
         * @param value A #GValue.
         * @returns A gint16.
         */
        function value_get_int16(value: GObject.Value | any): number;
        /**
         * Retrieves a 16-bit unsigned value from `value`.
         * @param value A #GValue.
         * @returns A guint16.
         */
        function value_get_uint16(value: GObject.Value | any): number;
        /**
         * Sets `value` using a signed 16-bit integer.
         * @param value A #GValue.
         * @param v_int16 A gint16.
         */
        function value_set_int16(value: GObject.Value | any, v_int16: number): void;
        /**
         * Sets `value` using an unsigned 16-bit integer.
         * @param value A #GValue.
         * @param v_uint16 A guint16.
         */
        function value_set_uint16(value: GObject.Value | any, v_uint16: number): void;
        namespace Channel {
            // Signal callback interfaces

            interface PropertyChanged {
                (property: string, value: GObject.Value | any): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                channel_name: string;
                channelName: string;
                is_singleton: boolean;
                isSingleton: boolean;
                property_base: string;
                propertyBase: string;
            }
        }

        /**
         * An opaque structure that holds state about a channel.
         */
        class Channel extends GObject.Object {
            static $gtype: GObject.GType<Channel>;

            // Properties

            /**
             * The string identifier used for this channel.
             */
            get channel_name(): string;
            /**
             * The string identifier used for this channel.
             */
            get channelName(): string;
            /**
             * Identifies the instance of the class as a singleton instance
             * or not.  This is mainly used internally by #XfconfChannel
             * but may be useful for API users.
             */
            get is_singleton(): boolean;
            /**
             * Identifies the instance of the class as a singleton instance
             * or not.  This is mainly used internally by #XfconfChannel
             * but may be useful for API users.
             */
            get isSingleton(): boolean;
            /**
             * The string identifier used for the property base inside a channel.
             * This can be used to restrict a channel to a subset of properties.
             */
            get property_base(): string;
            /**
             * The string identifier used for the property base inside a channel.
             * This can be used to restrict a channel to a subset of properties.
             */
            get propertyBase(): string;

            // Constructors

            constructor(properties?: Partial<Channel.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](channel_name: string): Channel;

            static new_with_property_base(channel_name: string, property_base: string): Channel;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(
                signal: 'property-changed',
                callback: (_source: this, property: string, value: GObject.Value) => void,
            ): number;
            connect_after(
                signal: 'property-changed',
                callback: (_source: this, property: string, value: GObject.Value) => void,
            ): number;
            emit(signal: 'property-changed', property: string, value: GObject.Value | any): void;

            // Static methods

            /**
             * Either creates a new channel, or fetches a singleton object for
             * `channel_name`.  This function always returns a valid object; no
             * checking is done to see if the channel exists or has a valid name.
             *
             * The reference count of the returned channel is owned by libxfconf.
             * @param channel_name A channel name.
             */
            static get(channel_name: string): Channel;

            // Methods

            /**
             * Gets an array property on `channel` and returns it as
             * a #GPtrArray, which can be freed with xfconf_array_free()
             * when no longer needed.
             * @param property A property string.
             * @returns A newly-allocated #GPtrArray on success, or %NULL on failure.
             */
            get_arrayv(property: string): GObject.Value[] | null;
            /**
             * Retrieves the boolean value associated with `property` on `channel`.
             * @param property A property name.
             * @param default_value A fallback value.
             * @returns The boolean value, or, if @property is not in @channel,          @default_value is returned.
             */
            get_bool(property: string, default_value: boolean): boolean;
            /**
             * Retrieves the double value associated with `property` on `channel`.
             * @param property A property name.
             * @param default_value A fallback value.
             * @returns The double value, or, if @property is not in @channel,          @default_value is returned.
             */
            get_double(property: string, default_value: number): number;
            /**
             * Retrieves the int value associated with `property` on `channel`.
             * @param property A property name.
             * @param default_value A fallback value.
             * @returns The int value, or, if @property is not in @channel,          @default_value is returned.
             */
            get_int(property: string, default_value: number): number;
            /**
             * Gets a property from `channel` and fills in `value_struct` using
             * the retrieved values.  The `struct_name` parameter is the same
             * name that must have been used to register the struct's layout
             * with xfconf_named_struct_register().
             * @param property A string property name.
             * @param struct_name A string struct name.
             * @param value_struct A pointer to a struct.
             * @returns %TRUE if the property was retrieved successfully,          %FALSE otherwise.
             */
            get_named_struct(property: string, struct_name: string, value_struct?: any | null): boolean;
            /**
             * Retrieves multiple properties from `channel` and stores
             * them in a #GHashTable in which the keys correspond to
             * the string (gchar *) property names, and the values
             * correspond to variant (GValue *) values.  The keys and
             * values are owned by the hash table and should be copied
             * if needed.  The value of the property specified by
             * `property_base` (if it exists) and all sub-properties are
             * retrieved.  To retrieve all properties in the channel,
             * specify "/" or %NULL for `property_base`.
             * @param property_base The base property name of properties to retrieve.
             * @returns A newly-allocated #GHashTable, which should be freed with          g_hash_table_destroy() when no longer needed.
             */
            get_properties(property_base: string): GLib.HashTable<string, GObject.Value>;
            /**
             * Gets a property on `channel` and stores it in `value`.  The caller is
             * responsible for calling g_value_unset() when finished with `value`.
             *
             * This function can be called with an initialized or uninitialized
             * `value`.  If `value` is initialized to a particular type, libxfconf
             * will attempt to convert the value returned from the configuration
             * store to that type if they don't match.  If the value type returned
             * from the configuration store is an array type, each element of the
             * array will be converted to the type of `value`.  If `value` is
             * uninitialized, the value in the configuration store will be returned
             * in its native type.
             * @param property A string property name.
             * @param value A #GValue.
             * @returns %TRUE if the property was retrieved successfully,          %FALSE otherwise.
             */
            get_property(property: string, value: GObject.Value | any): boolean;
            // Conflicted with GObject.Object.get_property
            get_property(...args: never[]): any;
            /**
             * Retrieves the string value associated with `property` on `channel`.
             * @param property A property name.
             * @param default_value A fallback value.
             * @returns A newly-allocated string which should be freed with g_free()          when no longer needed.  If @property is not in @channel,          a g_strdup()ed copy of @default_value is returned.
             */
            get_string(property: string, default_value: string): string;
            /**
             * Retrieves the string list value associated with `property` on `channel`.
             * @param property A property name.
             * @returns A newly-allocated string list which should be freed with          g_strfreev() when no longer needed.  If @property is not in          @channel, %NULL is returned.
             */
            get_string_list(property: string): string[];
            /**
             * Gets a property on `channel` and stores it as members of the
             * `value_struct` struct.  The `member_types` array should hold
             * a #GType for each member of the struct.
             *
             * Note: Struct members can only be non-pointer types such as int,
             * boolean, double, etc.
             * @param property A string property name.
             * @param value_struct A pointer to a struct in which to store values.
             * @param n_members The number of data members in the struct.
             * @param member_types An array of @n_members #GType<!-- -->s.
             * @returns %TRUE if the property was retrieved successfully,          %FALSE oherwise.
             */
            get_structv(
                property: string,
                value_struct: any | null,
                n_members: number,
                member_types: GObject.GType,
            ): boolean;
            /**
             * Retrieves the unsigned int value associated with `property` on `channel`.
             * @param property A property name.
             * @param default_value A fallback value.
             * @returns The uint value, or, if @property is not in @channel,          @default_value is returned.
             */
            get_uint(property: string, default_value: number): number;
            /**
             * Retrieves the 64-bit int value associated with `property` on `channel`.
             * @param property A property name.
             * @param default_value A fallback value.
             * @returns The uint64 value, or, if @property is not in @channel,          @default_value is returned.
             */
            get_uint64(property: string, default_value: number): number;
            /**
             * Checks to see if `property` exists on `channel`.
             * @param property A property name.
             * @returns %TRUE if @property exists, %FALSE otherwise.
             */
            has_property(property: string): boolean;
            /**
             * Queries whether or not `property` on `channel` is locked by system
             * policy.  If the property is locked, calls to
             * xfconf_channel_set_property() (or any of the "set" family of functions)
             * or xfconf_channel_reset_property() will fail.
             * @param property A property name.
             * @returns %TRUE if the property is locked, %FALSE otherwise.
             */
            is_property_locked(property: string): boolean;
            /**
             * Resets properties starting at (and including) `property_base`.
             * If `recursive` is %TRUE, will also reset all properties that are
             * under `property_base` in the property hierarchy.
             *
             * A bit of an explanation as to what this function actually does:
             * Since Xfconf backends are expected to support setting defaults
             * via what you might call "optional schema," you can't really
             * "remove" properties.  Since the client library can't know if a
             * channel provides default values (or even if the backend supports
             * it!), at best it can only reset properties to their default values.
             *
             * The `property_base` parameter can be %NULL or the empty string (""),
             * in which case the channel root ("/") will be assumed.  Of course,
             * %TRUE must be passed for `recursive` in this case.
             * @param property_base A property tree root or property name.
             * @param recursive Whether to reset properties recursively.
             */
            reset_property(property_base: string, recursive: boolean): void;
            /**
             * Sets an array property on `channel,` using the values in the
             * provided `values` array.
             * @param property A property string.
             * @param values A #GPtrArray of #GValue<!-- -->s.
             * @returns %TRUE if the property was set successfully, %FALSE otherwise.
             */
            set_arrayv(property: string, values: (GObject.Value | any)[]): boolean;
            /**
             * Sets `value` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param value The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_bool(property: string, value: boolean): boolean;
            /**
             * Sets `value` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param value The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_double(property: string, value: number): boolean;
            /**
             * Sets `value` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param value The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_int(property: string, value: number): boolean;
            /**
             * Sets a property on `channel` using the members of `value_struct`
             * as the array of values.  The `struct_name` parameter is the same
             * name that must have been used to register the struct's layout
             * with xfconf_named_struct_register().
             * @param property A string property name.
             * @param struct_name A string struct name.
             * @param value_struct A pointer to a struct.
             * @returns %TRUE if the property was set successfully,          %FALSE otherwise.
             */
            set_named_struct(property: string, struct_name: string, value_struct?: any | null): boolean;
            /**
             * Sets the value stored in `value`  to a property on `channel`.
             *
             * Note: The configuration store backend almost certainly supports
             * only a restricted set of value types.
             * @param property A string property name.
             * @param value A #GValue.
             * @returns %TRUE if the property was set successfully, %FALSE otherwise.
             */
            set_property(property: string, value: GObject.Value | any): boolean;
            // Conflicted with GObject.Object.set_property
            set_property(...args: never[]): any;
            /**
             * Sets `value` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param value The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_string(property: string, value: string): boolean;
            /**
             * Sets `values` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param values The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_string_list(property: string, values: string): boolean;
            /**
             * Sets a property on `channel` using the members of `value_struct`
             * as a value array.  The `member_types` array should hold a #GType
             * for each member of the struct.
             * @param property A string property name.
             * @param value_struct A pointer to a struct from which to take values.
             * @param n_members The number of data members in the struct.
             * @param member_types An array of @n_members #GType<!-- -->s.
             * @returns %TRUE if the property was set successfully,          %FALSE oherwise.
             */
            set_structv(
                property: string,
                value_struct: any | null,
                n_members: number,
                member_types: GObject.GType,
            ): boolean;
            /**
             * Sets `value` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param value The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_uint(property: string, value: number): boolean;
            /**
             * Sets `value` for `property` on `channel` in the configuration store.
             * @param property A property name.
             * @param value The value to set.
             * @returns %TRUE on success, %FALSE if an error occured.
             */
            set_uint64(property: string, value: number): boolean;
        }

        class Int16 {
            static $gtype: GObject.GType<Int16>;

            // Constructors

            _init(...args: any[]): void;
        }

        class Uint16 {
            static $gtype: GObject.GType<Uint16>;

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

    export default Xfconf;
}

declare module 'gi://Xfconf' {
    import Xfconf0 from 'gi://Xfconf?version=0';
    export default Xfconf0;
}
// END
