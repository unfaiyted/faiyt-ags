/// <reference path="./libxfce4util-1.0.d.ts" />
/// <reference path="./gio-2.0.d.ts" />
/// <reference path="./gobject-2.0.d.ts" />
/// <reference path="./glib-2.0.d.ts" />
/// <reference path="./gmodule-2.0.d.ts" />
/// <reference path="./gtk-3.0.d.ts" />
/// <reference path="./xlib-2.0.d.ts" />
/// <reference path="./gdk-3.0.d.ts" />
/// <reference path="./cairo-1.0.d.ts" />
/// <reference path="./cairo.d.ts" />
/// <reference path="./pango-1.0.d.ts" />
/// <reference path="./harfbuzz-0.0.d.ts" />
/// <reference path="./freetype2-2.0.d.ts" />
/// <reference path="./gdkpixbuf-2.0.d.ts" />
/// <reference path="./atk-1.0.d.ts" />

/**
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 *
 * The based EJS template file is used for the generated .d.ts file of each GIR module like Gtk-4.0, GObject-2.0, ...
 */

declare module 'gi://Libxfce4ui?version=2.0' {
    // Module dependencies
    import type Libxfce4util from 'gi://Libxfce4util?version=1.0';
    import type Gio from 'gi://Gio?version=2.0';
    import type GObject from 'gi://GObject?version=2.0';
    import type GLib from 'gi://GLib?version=2.0';
    import type GModule from 'gi://GModule?version=2.0';
    import type Gtk from 'gi://Gtk?version=3.0';
    import type xlib from 'gi://xlib?version=2.0';
    import type Gdk from 'gi://Gdk?version=3.0';
    import type cairo from 'cairo';
    import type Pango from 'gi://Pango?version=1.0';
    import type HarfBuzz from 'gi://HarfBuzz?version=0.0';
    import type freetype2 from 'gi://freetype2?version=2.0';
    import type GdkPixbuf from 'gi://GdkPixbuf?version=2.0';
    import type Atk from 'gi://Atk?version=1.0';

    export namespace Libxfce4ui {
        /**
         * Libxfce4ui-2.0
         */

        /**
         * List of item types which are supported by the #XfceGtkActionEntry.
         * To be extended if required.
         */

        /**
         * List of item types which are supported by the #XfceGtkActionEntry.
         * To be extended if required.
         */
        export namespace GtkMenuItem {
            export const $gtype: GObject.GType<GtkMenuItem>;
        }

        enum GtkMenuItem {
            /**
             * see #GtkMenuItem
             */
            MENU_ITEM,
            /**
             * see #GtkImageMenuItem
             */
            IMAGE_MENU_ITEM,
            /**
             * see #GtkCheckMenuItem
             */
            CHECK_MENU_ITEM,
            /**
             * see #GtkRadioMenuItem
             */
            RADIO_MENU_ITEM,
        }
        /**
         * Some sample priority values for use with xfce_sm_client_set_priority().
         */

        /**
         * Some sample priority values for use with xfce_sm_client_set_priority().
         */
        export namespace SMClientPriority {
            export const $gtype: GObject.GType<SMClientPriority>;
        }

        enum SMClientPriority {
            /**
             * A high priority value.  You probably
             *                                   don't want to use this.
             */
            HIGHEST,
            /**
             * A priority value for use by the window manager.
             */
            WM,
            /**
             * A priority value for use by applications that
             *                                place windows on the screen and possibly set
             *                                window manager struts.
             */
            CORE,
            /**
             * A priority value for use by applications
             *                                   that draw on the desktop.
             */
            DESKTOP,
            /**
             * A priority value for regular applications.
             */
            DEFAULT,
            /**
             * The lowest possible priority value.
             */
            LOWEST,
        }
        /**
         * An enumeration describing how the session manager should restart
         * the application.
         */

        /**
         * An enumeration describing how the session manager should restart
         * the application.
         */
        export namespace SMClientRestartStyle {
            export const $gtype: GObject.GType<SMClientRestartStyle>;
        }

        enum SMClientRestartStyle {
            /**
             * Only restart the application if it is
             *                                 still running when the session is next
             *                                 saved.
             */
            NORMAL,
            /**
             * Immediately restart the application
             *                                      if it ever quits.
             */
            IMMEDIATELY,
        }
        /**
         * Hints to the session manager what kind of shutdown the session manager
         * should perform.
         */

        /**
         * Hints to the session manager what kind of shutdown the session manager
         * should perform.
         */
        export namespace SMClientShutdownHint {
            export const $gtype: GObject.GType<SMClientShutdownHint>;
        }

        enum SMClientShutdownHint {
            /**
             * Prompt the user for a choice,
             */
            ASK,
            /**
             * End the current session,
             */
            LOGOUT,
            /**
             * Shut down the computer.
             */
            HALT,
            /**
             * Restart the computer.
             */
            REBOOT,
        }
        /**
         * Error codes returned by XfceSmCLient functions.
         */

        /**
         * Error codes returned by XfceSmCLient functions.
         */
        export namespace SmCLientErrorEnum {
            export const $gtype: GObject.GType<SmCLientErrorEnum>;
        }

        enum SmCLientErrorEnum {
            /**
             * Failed to connect to the session manager.
             */
            FAILED,
            /**
             * Session does not have a valid client id.
             */
            INVALID_CLIENT,
        }
        /**
         * This allows you to easily create mixed buttons in a dialog.
         * param1 is used for the stock_id, param2 for the label and
         * param3 for the response_id. See also xfce_gtk_button_new_mixed().
         */
        const BUTTON_TYPE_MIXED: string;
        /**
         * Creates a button with the #GdkPixbuf as button icon.
         * param1 is the #GdkPixbuf, param2 for the label and
         * param3 for the response_id.
         */
        const BUTTON_TYPE_PIXBUF: string;
        /**
         * Runs a dialog to ask the user whether they want to close the whole window,
         * close the current tab, or cancel.
         *
         * If `num_tabs` is non-negative, the message to the user will state that there
         * are `num_tabs` open tabs. If `num_tabs` is negative, then the message to the
         * user will state simply that there are "multiple open tabs".
         *
         * If `show_confirm_box` is %TRUE a checkbox is added to the dialog to allow
         * the user to set whether they wish to see this dialog in future. The initial
         * state of the checkbox is determined by the value stored at `confirm_box_checked`
         * and the value at `confirm_box_checked` after returning records the state of the
         * checkbox. If `show_confirm_box` is %FALSE, `confirm_box_checked` is ignored and
         * may be %NULL.
         * @param parent transient parent of the dialog, or %NULL.
         * @param num_tabs the number of open tabs for display to user
         * @param show_confirm_box whether to ask the user if this confirmation shall be shown in the future
         * @param confirm_box_checked state of confirmation checkbox
         * @returns #GTK_RESPONSE_CANCEL if cancelled, #GTK_RESPONSE_YES if the user wants to close the window, #GTK_RESPONSE_CLOSE if the user wants to close the tab, and #GTK_RESPONSE_NONE for an error.
         */
        function dialog_confirm_close_tabs(
            parent: Gtk.Window | null,
            num_tabs: number,
            show_confirm_box: boolean,
            confirm_box_checked?: boolean | null,
        ): number;
        /**
         * Asks the user to visit the online documentation. If confirmed, it will open
         * the webbrowser and redirect the user to the correct location.
         *
         * Appart from the `component,` `page` and `offset` the following information
         * is also send to the server: user language and the xfce_version_string().
         *
         * See also: xfce_dialog_show_help_with_version().
         * @param parent transient parent of the dialog, or %NULL.
         * @param component name of the component opening the help page or %NULL. If the              value is %NULL the target will be the main page of the              documentation website.
         * @param page subpage of the @component on the website or %NULL.
         * @param offset anchor offset in @page or %NULL.
         */
        function dialog_show_help(
            parent?: Gtk.Window | null,
            component?: string | null,
            page?: string | null,
            offset?: string | null,
        ): void;
        /**
         * Asks the user to visit the online documentation. If confirmed, it will open
         * the webbrowser and redirect the user to the correct location.
         *
         * Apart from the `component,` `page` and `offset` the following information
         * is also sent to the server: user language and the xfce_version_string()
         * or `version` if set.
         *
         * See also: xfce_dialog_show_help().
         * @param parent transient parent of the dialog, or %NULL.
         * @param component name of the component opening the help page or %NULL. If the              value is %NULL the target will be the main page of the              documentation website.
         * @param page subpage of the @component on the website or %NULL.
         * @param offset anchor offset in @page or %NULL.
         * @param version alternative version, or %NULL to use xfce_version_string().
         */
        function dialog_show_help_with_version(
            parent?: Gtk.Window | null,
            component?: string | null,
            page?: string | null,
            offset?: string | null,
            version?: string | null,
        ): void;
        /**
         * Similar to gdk_seat_grab but tries to grab the seat five times with 100ms
         * between each attempt.
         * @param seat A #GdkSeat.
         * @param window The #GdkWindow which will own the grab.
         * @param capabilities Capabilities that will be grabbed.
         * @param cursor The cursor to display while the grab is active. If this                      is %NULL then the normal cursors are used for window and                      its descendants, and the cursor for window is used                      elsewhere.
         * @returns %TRUE on success, %FALSE otherwise.
         */
        function gdk_device_grab(
            seat: Gdk.Seat,
            window: Gdk.Window,
            capabilities: Gdk.SeatCapabilities | null,
            cursor?: Gdk.Cursor | null,
        ): boolean;
        /**
         * Returns the currently active #GdkScreen, that is, the screen which
         * currently contains the pointer. If no active screen was found, the
         * default #GdkScreen is returned.
         * @returns the currently active #GdkScreen.
         */
        function gdk_screen_get_active(): [Gdk.Screen, number];
        /**
         * Returns the width and height of the default #GdkScreen.
         * This is a replacement for gdk_screen_width/gdk_screen_height.
         * @returns a newly created #GdkRectangle containing the width and height of the screen.
         */
        function gdk_screen_get_geometry(): Gdk.Rectangle;
        /**
         * This function will first look for a desktop file of `name` and if successful
         * use the value of the "Icon" property to return a #GIcon.
         * If no desktop file of `name` is found it will fallback to returning a #GIcon
         * based on #g_themed_icon_new_with_default_fallbacks and
         * #gtk_icon_theme_lookup_by_gicon.
         * @param name Name of the application.
         * @returns a new #GThemedIcon.
         */
        function gicon_from_name(name: string): Gio.Icon;
        /**
         * This method will connect each accel_path from the #XfceGtkActionEntry in action_entries
         * to its related callback. If the accelerator is pressed, the related callback will be called.
         * @param accel_group the #GtkAccelGroup to connect to
         * @param action_entries array of action_entries to be added
         * @param n_action_entries size of the action_entries array
         * @param callback_data data which should be passed to the callback of each #XfceGtkActionEntry
         */
        function gtk_accel_group_connect_action_entries(
            accel_group: Gtk.AccelGroup,
            action_entries: GtkActionEntry,
            n_action_entries: number,
            callback_data?: any | null,
        ): void;
        /**
         * This method will disconnect each accel_path from the #XfceGtkActionEntry in action_entries.
         * @param accel_group the #GtkAccelGroup to connect to
         * @param action_entries array of action_entries to be added
         * @param n_action_entries size of the action_entries array
         */
        function gtk_accel_group_disconnect_action_entries(
            accel_group: Gtk.AccelGroup,
            action_entries: GtkActionEntry,
            n_action_entries: number,
        ): void;
        /**
         * Adds the default key of each ActionEntry to the accel_map, if no key was defined for the related accel_path so far.
         * @param action_entries array of action_entries to be added
         * @param n_action_entries size of the action_entries array
         */
        function gtk_accel_map_add_entries(action_entries: GtkActionEntry, n_action_entries: number): void;
        /**
         * Creates a new #GtkButton containing a mnemonic label and a stock icon.
         * The `stock_id` could be something like #GTK_STOCK_OK or #GTK_STOCK_APPLY.
         *
         * When the `stock_id` is %NULL a normal mnemonic button will be created,
         * when `label` is %NULL a stock button will be created. This behaviour
         * is added for xfce_message_dialog_new().
         * @param stock_id the name of the stock item.
         * @param label the text of the button, with an underscore                        in front of the mnemonic character.
         * @returns the newly created #GtkButton widget.
         */
        function gtk_button_new_mixed(stock_id?: string | null, label?: string | null): Gtk.Widget;
        /**
         * Convenience method to create a #GtkCheckMenuItem and preconfigure it with the passed parameters.
         * @param label_text Label to use for the #GtkCheckMenuItem
         * @param tooltip_text Tooltip to add on the passed item, or NULL
         * @param accel_path Unique path, used to identify the accelerator, or NULL
         * @param callback #GCallback which will be triggered on activation, or NULL
         * @param callback_param optional callback parameter, or NULL.
         * @param active boolean value indicating whether the check box is active.
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkCheckMenuItem.
         */
        function gtk_check_menu_item_new(
            label_text: string,
            tooltip_text: string | null,
            accel_path: string | null,
            callback: GObject.Callback | null,
            callback_param: GObject.Object | null,
            active: boolean,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget;
        /**
         * Activates the callback function of the #XfceGtkActionEntry that corresponds to `accel_path`. If no such action
         * exists in `entries,` then nothing happens.
         * @param accel_path the accelerator path of the action that we want to activate
         * @param data a pointer of data that will be passed to the callback if a tab-shortcut is found
         * @param entries a #XfceGtkActionEntry[]
         * @param entry_count the number of entries in @entries
         * @returns a boolean that is TRUE if the action was found, otherwise it is FALSE
         */
        function gtk_execute_tab_accel(
            accel_path: string,
            data: any | null,
            entries: GtkActionEntry,
            entry_count: number,
        ): boolean;
        /**
         * Creates an Xfce-styled frame. The frame is a #GtkFrame, without
         * outline and an optional bolded text label.  The contents of the
         * frame are indented on the left.
         * The return value is the #GtkFrame itself.  The `container_return` is
         * a #GtkAlignment widget to which children of the frame should be added.
         *
         * See also: xfce_gtk_frame_box_new_with_content().
         * @param label the text to use as the label of the frame.
         * @returns the newly created #GtkFrame widget.
         */
        function gtk_frame_box_new(label: string): [Gtk.Widget, Gtk.Widget | null];
        /**
         * Creates a widget with xfce_gtk_frame_box_new() and adds the
         * `content` #GtkWidget to the frame.
         * @param label the text to use as the label of the frame.
         * @param content the #GtkWidget to put inside the frame.
         * @returns the newly created #GtkFrame widget.
         */
        function gtk_frame_box_new_with_content(label: string, content: Gtk.Widget): Gtk.Widget;
        /**
         * Convenience method to find a specific action_entry from an array of action_entries
         * @param action_entries array of action_entries to be searched
         * @param n_action_entries size of the action_entries array
         * @param id id of the action entry (usually enum values are used)
         * @returns The matching #XfceGtkActionEntry or NULL if not found
         */
        function gtk_get_action_entry_by_id(
            action_entries: GtkActionEntry,
            n_action_entries: number,
            id: number,
        ): GtkActionEntry | null;
        /**
         * The Tab key is used to navigate the interface by GTK+ so we need to handle shortcuts with the Tab accelerator manually.
         * Tab sometimes becomes ISO_Left_Tab (e.g. in Ctrl+Shift+Tab) so check both here.
         * @param key_event the #GdkEventKey that might trigger a shortcut
         * @param accel_group the #GtkAccelGroup that will be get queried
         * @param data a pointer of data that will be passed to the callback if a tab-shortcut is found
         * @param entries a #XfceGtkActionEntry[]
         * @param entry_count the number of entries in @entries
         * @returns a boolean that is GDK_EVENT_STOP (TRUE) if the event was handled, otherwise it is GDK_EVENT_PROPAGATE (FALSE)
         */
        function gtk_handle_tab_accels(
            key_event: Gdk.EventKey,
            accel_group: Gtk.AccelGroup,
            data: any | null,
            entries: GtkActionEntry,
            entry_count: number,
        ): boolean;
        /**
         * Convenience method to create a deprecated #GtkImageMenuItem and preconfigure it with the passed parameters.
         * In order to prevent G_GNUC_BEGIN_IGNORE_DEPRECATIONS in all xfce projects, this method can be used
         * @param label_text Label to use for the #GtkImageMenuItem
         * @param tooltip_text Tooltip to add on the passed item, or NULL
         * @param accel_path Unique path, used to identify the accelerator, or NULL
         * @param callback #GCallback which will be triggered on activation, or NULL
         * @param callback_param optional callback parameter, or NULL.
         * @param image a widget to set as the image for the menu item, or NULL
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkImageMenuItem.
         */
        function gtk_image_menu_item_new(
            label_text: string,
            tooltip_text?: string | null,
            accel_path?: string | null,
            callback?: GObject.Callback | null,
            callback_param?: GObject.Object | null,
            image?: Gtk.Widget | null,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget;
        /**
         * Convenience method to create a #GtkImageMenuItem and preconfigure it with the passed parameters.
         * @param label_text Label to use for the #GtkImageMenuItem
         * @param tooltip_text Tooltip to add on the passed item, or NULL
         * @param accel_path Unique path, used to identify the accelerator, or NULL
         * @param callback #GCallback which will be triggered on activation, or NULL
         * @param callback_param optional callback parameter, or NULL.
         * @param icon_name name of the icon to use for the #GtkImageMenuItem, or NULL
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkImageMenuItem.
         */
        function gtk_image_menu_item_new_from_icon_name(
            label_text: string,
            tooltip_text?: string | null,
            accel_path?: string | null,
            callback?: GObject.Callback | null,
            callback_param?: GObject.Object | null,
            icon_name?: string | null,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget;
        /**
         * Sets the `ATK_RELATION_LABEL_FOR` relation on `label` for `widget,` which means
         * accessiblity tools will identify `label` as descriptive item for the specified
         * `widget`.
         * @param label a #GtkLabel.
         * @param widget a #GtkWidget.
         */
        function gtk_label_set_a11y_relation(label: Gtk.Label, widget: Gtk.Widget): void;
        /**
         * Convenience method do add separators, used to prevent code duplication
         * @param menu #GtkMenuShell on which the separator should be appended
         */
        function gtk_menu_append_separator(menu: Gtk.MenuShell): void;
        /**
         * Convenience method do add separators, used to prevent code duplication
         * @param menu #GtkMenuShell on which the separator should be appended
         */
        function gtk_menu_append_seperator(menu: Gtk.MenuShell): void;
        /**
         * Convenience method to create a #GtkMenuItem and preconfigure it with the passed parameters.
         * @param label_text Label to use for the #GtkMenuItem
         * @param tooltip_text Tooltip to add on the passed item, or NULL
         * @param accel_path Unique path, used to identify the accelerator, or NULL
         * @param callback #GCallback which will be triggered on activation, or NULL
         * @param callback_param optional callback parameter, or NULL.
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkMenuItem.
         */
        function gtk_menu_item_new(
            label_text: string,
            tooltip_text?: string | null,
            accel_path?: string | null,
            callback?: GObject.Callback | null,
            callback_param?: GObject.Object | null,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget;
        /**
         * Method to create a menu item from the passed action entry
         * @param action_entry Label to use for the #GtkCheckMenuItem
         * @param callback_param optional callback parameter, or NULL.
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkMenuItem or NULL
         */
        function gtk_menu_item_new_from_action_entry(
            action_entry: GtkActionEntry,
            callback_param?: GObject.Object | null,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget | null;
        /**
         * Use the passed accel_path show the related #GtkAccelLabel with the correct accelerator on the item.
         * @param menu_item #GtkMenuItem on which the accel label is to set
         * @param accel_path Unique path, used to identify the accelerator, or NULL to show no accelerator
         */
        function gtk_menu_item_set_accel_label(menu_item: Gtk.MenuItem, accel_path?: string | null): void;
        /**
         * Attempts to pop up a #GtkMenu for a short duration. Unlike the original
         * gtk_menu_popup(), this function will verify that the menu has been mapped
         * or will keep trying for up to 250ms. It will also return a value indicating
         * whether the menu was eventually mapped or not. Following is an excerpt from
         * the GTK+ Documentation on #GtkMenu.
         *
         * Displays a menu and makes it available for selection.
         *
         * Applications can use this function to display context-sensitive menus, and will
         * typically supply %NULL for the `parent_menu_shell,` `parent_menu_item,` `func` and
         * `data` parameters. The default menu positioning function will position the menu
         * at the current mouse cursor position.
         *
         * The `button` parameter should be the mouse button pressed to initiate the menu
         * popup. If the menu popup was initiated by something other than a mouse button
         * press, such as a mouse button release or a keypress, button should be 0.
         *
         * The `activate_time` parameter is used to conflict-resolve initiation of concurrent
         * requests for mouse/keyboard grab requests. To function properly, this needs to
         * be the timestamp of the user event (such as a mouse click or key press) that
         * caused the initiation of the popup. Only if no such event is available,
         * gtk_get_current_event_time() can be used instead.
         * @param menu a #GtkMenu.
         * @param parent_menu_shell the menu shell containing the triggering menu item, or %NULL.
         * @param parent_menu_item the menu item whose activation triggered the popup, or %NULL.
         * @param func a user supplied function used to position the menu, or %NULL.
         * @param button the mouse button which was pressed to initiate the event.
         * @param activate_time the time at which the activation event occurred.
         * @returns %TRUE if the menu could be mapped, %FALSE otherwise.
         */
        function gtk_menu_popup_until_mapped(
            menu: Gtk.Menu,
            parent_menu_shell: Gtk.Widget | null,
            parent_menu_item: Gtk.Widget | null,
            func: Gtk.MenuPositionFunc | null,
            button: number,
            activate_time: number,
        ): boolean;
        /**
         * Convenience method to create a #GtkCheckMenuItem and preconfigure it with the passed parameters.
         * In order to simplify usage, a #GtkCheckMenuItem is created and drawn as radio-item
         * @param label_text Label to use for the #GtkCheckMenuItem
         * @param tooltip_text Tooltip to add on the passed item, or NULL
         * @param accel_path Unique path, used to identify the accelerator, or NULL
         * @param callback #GCallback which will be triggered on activation, or NULL
         * @param callback_param optional callback parameter, or NULL.
         * @param active boolean value indicating whether the check box is active.
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkCheckMenuItem.
         */
        function gtk_radio_menu_item_new(
            label_text: string,
            tooltip_text: string | null,
            accel_path: string | null,
            callback: GObject.Callback | null,
            callback_param: GObject.Object | null,
            active: boolean,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget;
        /**
         * Method to create a toggle menu item from the passed action entry
         * @param action_entry Label to use for the #GtkCheckMenuItem
         * @param callback_param optional callback parameter, or NULL.
         * @param active boolean value indicating whether the check box is active.
         * @param menu_to_append_item #GtkMenuShell on which the item should be appended, or NULL
         * @returns A new #GtkMenuItem or NULL
         */
        function gtk_toggle_menu_item_new_from_action_entry(
            action_entry: GtkActionEntry,
            callback_param: GObject.Object | null,
            active: boolean,
            menu_to_append_item?: Gtk.MenuShell | null,
        ): Gtk.Widget | null;
        /**
         * Method to create a toolbar toggle-button from the passed action entry.
         * @param action_entry Label to use for the #GtkToggleToolButton
         * @param callback_param optional callback parameter, or %NULL.
         * @param active boolean value indicating whether the toggle is initially active.
         * @param toolbar_to_append_item #GtkToolbar on which the item should be appended
         * @returns A new #GtkToggleToolButton
         */
        function gtk_toggle_tool_button_new_from_action_entry(
            action_entry: GtkActionEntry,
            callback_param: GObject.Object | null,
            active: boolean,
            toolbar_to_append_item: Gtk.Toolbar,
        ): Gtk.Widget;
        /**
         * Method to create a toolbar button from the passed action entry.
         * @param action_entry Label to use for the #GtkToolButton
         * @param callback_param optional callback parameter, or %NULL.
         * @param toolbar_to_append_item #GtkToolbar on which the item should be appended
         * @returns A new #GtkToolButton
         */
        function gtk_tool_button_new_from_action_entry(
            action_entry: GtkActionEntry,
            callback_param: GObject.Object | null,
            toolbar_to_append_item: Gtk.Toolbar,
        ): Gtk.Widget;
        /**
         * Convenience method to translate the label text and tooltip text of an array of action_entries
         * @param action_entries array of action_entries to be translated
         * @param n_action_entries size of the action_entries array
         */
        function gtk_translate_action_entries(action_entries: GtkActionEntry, n_action_entries: number): void;
        /**
         * Determines the screen that contains the pointer and centers the
         * `window` on it. If it failes to determine the current pointer position,
         * `window` is centered on the default screen.
         *
         * This function only works properly if you call it before realizing the
         * window and you haven't set a fixed window position using gtk_window_move().
         *
         * See also: xfce_gdk_screen_get_active().
         * @param window the #GtkWindow to center.
         */
        function gtk_window_center_on_active_screen(window: Gtk.Window): void;
        /**
         * This function can be called to determine if a #GdkWindow is using client-side decorations
         * which is indicated by the _GTK_FRAME_EXTENTS X11 atom. It furthermore sets a pointer
         * of type #GtkBorder to the actual extents.
         * @param window A #GdkWindow
         * @param extents A pointer to a #GtkBorder to copy to.
         * @returns TRUE if a #GdkWindow has the _GTK_FRAME_EXTENTS atom set.
         */
        function has_gtk_frame_extents(window: Gdk.Window, extents: Gtk.Border): boolean;
        function icon_name_from_desktop_id(desktop_id: string): string;
        /**
         * Like gdk_spawn_on_screen() (GDK 2), but also supports startup notification
         * (if Libxfce4ui was built with startup notification support).
         * @param screen a #GdkScreen or %NULL to use the active screen,                      see xfce_gdk_screen_get_active().
         * @param working_directory child's current working directory or %NULL to                      inherit parent's.
         * @param argv child's argument vector.
         * @param envp child's environment vector or %NULL to inherit                      parent's.
         * @param flags flags from #GSpawnFlags. #G_SPAWN_DO_NOT_REAP_CHILD                      is not allowed, use xfce_spawn_on_screen_with_child_watch()                      if you want a child watch.
         * @param startup_notify whether to use startup notification.
         * @param startup_timestamp the timestamp to pass to startup notification, use                      the event time here if possible to make focus                      stealing prevention work property. If you don't                      have direct access to the event time you could use                      gtk_get_current_event_time() or if nothing is                      available 0 is valid too.
         * @param startup_icon_name application icon or %NULL.
         * @param child_process %TRUE if the process should be a child process,                      %FALSE if it should be reparented to init.
         * @returns %TRUE on success, %FALSE if @error is set.
         */
        function spawn(
            screen: Gdk.Screen | null,
            working_directory: string | null,
            argv: string,
            envp: string | null,
            flags: GLib.SpawnFlags | null,
            startup_notify: boolean,
            startup_timestamp: number,
            startup_icon_name: string | null,
            child_process: boolean,
        ): boolean;
        /**
         * Executes the given `command_line` and returns %TRUE if the
         * command terminated successfully. Else, the `error` is set
         * to the standard error output.
         * @param screen a #GdkScreen or %NULL to use the active screen, see xfce_gdk_screen_get_active().
         * @param command_line command line to run.
         * @param in_terminal whether to run @command_line in a terminal.
         * @param startup_notify whether to use startup notification.
         * @param child_process %TRUE if the process should be a child process, %FALSE if it should be reparented to init.
         * @returns %TRUE if the @command_line was executed          successfully, %FALSE if @error is set.
         */
        function spawn_command_line(
            screen: Gdk.Screen | null,
            command_line: string,
            in_terminal: boolean,
            startup_notify: boolean,
            child_process: boolean,
        ): boolean;
        /**
         * Executes the given `command_line` and returns %TRUE if the
         * command terminated successfully. Else, the `error` is set
         * to the standard error output.
         * @param screen a #GdkScreen or %NULL to use the active screen, see xfce_gdk_screen_get_active().
         * @param command_line command line to run.
         * @param in_terminal whether to run @command_line in a terminal.
         * @param startup_notify whether to use startup notification.
         * @returns %TRUE if the @command_line was executed          successfully, %FALSE if @error is set.
         */
        function spawn_command_line_on_screen(
            screen: Gdk.Screen | null,
            command_line: string,
            in_terminal: boolean,
            startup_notify: boolean,
        ): boolean;
        /**
         * Like gdk_spawn_on_screen() (GDK 2), but also supports startup notification
         * (if Libxfce4ui was built with startup notification support).
         * @param screen a #GdkScreen or %NULL to use the active screen,                      see xfce_gdk_screen_get_active().
         * @param working_directory child's current working directory or %NULL to                      inherit parent's.
         * @param argv child's argument vector.
         * @param envp child's environment vector or %NULL to inherit                      parent's.
         * @param flags flags from #GSpawnFlags. #G_SPAWN_DO_NOT_REAP_CHILD                      is not allowed, use xfce_spawn_on_screen_with_child_watch()                      if you want a child watch.
         * @param startup_notify whether to use startup notification.
         * @param startup_timestamp the timestamp to pass to startup notification, use                      the event time here if possible to make focus                      stealing prevention work property. If you don't                      have direct access to the event time you could use                      gtk_get_current_event_time() or if nothing is                      available 0 is valid too.
         * @param startup_icon_name application icon or %NULL.
         * @returns %TRUE on success, %FALSE if @error is set.
         */
        function spawn_on_screen(
            screen: Gdk.Screen | null,
            working_directory: string | null,
            argv: string,
            envp: string | null,
            flags: GLib.SpawnFlags | null,
            startup_notify: boolean,
            startup_timestamp: number,
            startup_icon_name?: string | null,
        ): boolean;
        /**
         * Like xfce_spawn_on_screen(), but allows to attach a closure to watch the
         * child's exit status. This because only one g_child_watch_add() is allowed on
         * Unix (per PID) and this is already internally needed for a proper
         * startup notification implementation.
         *
         * <example>
         * <title>Spawning with a child watch</title>
         * <programlisting>
         * static void
         * child_watch_callback (GObject *object,
         *                       gint     status)
         * {
         *   g_message ("Child exit status is %d", status);
         * }
         *
         * static void
         * spawn_something (void)
         * {
         *   GClosure *child_watch;
         *
         *   child_watch = g_cclosure_new_swap (G_CALLBACK (child_watch_callback),
         *                                      object, NULL);
         *   xfce_spawn_on_screen_with_child_watch (...,
         *                                          child_watch,
         *                                          ...);
         * }
         * </programlisting>
         * </example>
         * @param screen a #GdkScreen or %NULL to use the active screen,                        see xfce_gdk_screen_get_active().
         * @param working_directory child's current working directory or %NULL to                        inherit parent's.
         * @param argv child's argument vector.
         * @param envp child's environment vector or %NULL to inherit                        parent's.
         * @param flags flags from #GSpawnFlags. #G_SPAWN_DO_NOT_REAP_CHILD                        is not allowed, you should use the                        @child_watch_closure for this.
         * @param startup_notify whether to use startup notification.
         * @param startup_timestamp the timestamp to pass to startup notification, use                        the event time here if possible to make focus                        stealing prevention work property. If you don't                        have direct access to the event time you could use                        gtk_get_current_event_time() or if nothing is                        available 0 is valid too.
         * @param startup_icon_name application icon or %NULL.
         * @param child_watch_closure closure that is triggered when the child exists                        or %NULL.
         * @returns %TRUE on success, %FALSE if @error is set.
         */
        function spawn_on_screen_with_child_watch(
            screen: Gdk.Screen | null,
            working_directory: string | null,
            argv: string,
            envp: string | null,
            flags: GLib.SpawnFlags | null,
            startup_notify: boolean,
            startup_timestamp: number,
            startup_icon_name?: string | null,
            child_watch_closure?: GObject.Closure | null,
        ): boolean;
        /**
         * Moves a widget from one GtkContainer to another, handling reference
         * count issues to avoid destroying the widget.
         * @param widget a #GtkWidget.
         * @param new_parent a #GtkContainer to move the widget into
         * @returns %TRUE if the widget could be moved, %FALSE otherwise.
         */
        function widget_reparent(widget: Gtk.Widget, new_parent: Gtk.Widget): boolean;
        namespace FilenameInput {
            // Signal callback interfaces

            interface TextInvalid {
                (): void;
            }

            interface TextValid {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps
                extends Gtk.Box.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Gtk.Buildable.ConstructorProps,
                    Gtk.Orientable.ConstructorProps {
                max_text_length: number;
                maxTextLength: number;
                original_filename: string;
                originalFilename: string;
            }
        }

        /**
         * An opaque structure with only private fields.
         */
        class FilenameInput extends Gtk.Box implements Atk.ImplementorIface, Gtk.Buildable, Gtk.Orientable {
            static $gtype: GObject.GType<FilenameInput>;

            // Properties

            /**
             * The maximum permitted length of a filename. A value of -1
             * indicates no maximum length.
             */
            set max_text_length(val: number);
            /**
             * The maximum permitted length of a filename. A value of -1
             * indicates no maximum length.
             */
            set maxTextLength(val: number);
            /**
             * The original name of the file, to be used as the initial text
             * displayed in the GtkEntry. A NULL value indicates no original
             * filename.
             */
            set original_filename(val: string);
            /**
             * The original name of the file, to be used as the initial text
             * displayed in the GtkEntry. A NULL value indicates no original
             * filename.
             */
            set originalFilename(val: string);

            // Constructors

            constructor(properties?: Partial<FilenameInput.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            // Signals

            connect(id: string, callback: (...args: any[]) => any): number;
            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect(signal: 'text-invalid', callback: (_source: this) => void): number;
            connect_after(signal: 'text-invalid', callback: (_source: this) => void): number;
            emit(signal: 'text-invalid'): void;
            connect(signal: 'text-valid', callback: (_source: this) => void): number;
            connect_after(signal: 'text-valid', callback: (_source: this) => void): number;
            emit(signal: 'text-valid'): void;

            // Static methods

            /**
             * A convenience function to be connected as a callback for the  "text-invalid" signal
             * (for example, using g_connect_swapped) for the simple case where the desired effect
             * of this signal is to set the sensitivity of a single GtkWidget (for example, a GtkButton).
             * @param widget a #GtkWidget
             */
            static desensitise_widget(widget: Gtk.Widget): void;
            /**
             * A convenience function to be connected as a callback for the  "text-valid" signal
             * (for example, using g_connect_swapped) for the simple case where the desired effect
             * of this signal is to set the sensitivity of a single GtkWidget (for example, a GtkButton).
             * @param widget a #GtkWidget
             */
            static sensitise_widget(widget: Gtk.Widget): void;

            // Methods

            /**
             * Forces a check of the current input text even when it has not changed.
             * This is useful to force the appropriate signal to be sent to indicate
             * whether the text is a valid filename or not, so that for example any
             * GtkWidgets whose sensitivity is controlled by this can be correctly updated
             * when they are first created.
             */
            check(): void;
            /**
             * Gets the #GtkEntry associated to filename_input
             * @returns A #GtkEntry
             */
            get_entry(): Gtk.Entry;
            /**
             * Gets the current text of the widget.
             * @returns the string representing the current text
             */
            get_text(): string;

            // Inherited properties
            /**
             * The orientation of the orientable.
             */
            get orientation(): Gtk.Orientation;
            set orientation(val: Gtk.Orientation);

            // Inherited methods
            /**
             * Retrieves the orientation of the `orientable`.
             * @returns the orientation of the @orientable.
             */
            get_orientation(): Gtk.Orientation;
            /**
             * Sets the orientation of the `orientable`.
             * @param orientation the orientable’s new orientation.
             */
            set_orientation(orientation: Gtk.Orientation | null): void;
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

        namespace SMClient {
            // Signal callback interfaces

            interface Quit {
                (): void;
            }

            interface QuitCancelled {
                (): void;
            }

            interface QuitRequested {
                (): boolean;
            }

            interface SaveState {
                (): void;
            }

            interface SaveStateExtended {
                (): void;
            }

            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                argc: number;
                argv: string[];
                client_id: string;
                clientId: string;
                current_directory: string;
                currentDirectory: string;
                desktop_file: string;
                desktopFile: string;
                priority: number;
                restart_command: string[];
                restartCommand: string[];
                restart_style: SMClientRestartStyle;
                restartStyle: SMClientRestartStyle;
                resumed: boolean;
            }
        }

        /**
         * An opaque struct with only private fields.
         */
        class SMClient extends GObject.Object {
            static $gtype: GObject.GType<SMClient>;

            // Properties

            set argc(val: number);
            set argv(val: string[]);
            get client_id(): string;
            get clientId(): string;
            get current_directory(): string;
            set current_directory(val: string);
            get currentDirectory(): string;
            set currentDirectory(val: string);
            get desktop_file(): string;
            set desktop_file(val: string);
            get desktopFile(): string;
            set desktopFile(val: string);
            get priority(): number;
            set priority(val: number);
            get restart_command(): string[];
            set restart_command(val: string[]);
            get restartCommand(): string[];
            set restartCommand(val: string[]);
            get restart_style(): SMClientRestartStyle;
            set restart_style(val: SMClientRestartStyle);
            get restartStyle(): SMClientRestartStyle;
            set restartStyle(val: SMClientRestartStyle);
            get resumed(): boolean;

            // Constructors

            constructor(properties?: Partial<SMClient.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static get(): SMClient;

            static get_full(
                restart_style: SMClientRestartStyle,
                priority: number,
                resumed_client_id: string,
                current_directory: string,
                restart_command: string,
                desktop_file: string,
            ): SMClient;

            static get_with_argv(
                argc: number,
                argv: string,
                restart_style: SMClientRestartStyle,
                priority: number,
            ): SMClient;

            // Signals

            connect_after(id: string, callback: (...args: any[]) => any): number;
            emit(id: string, ...args: any[]): void;
            connect_after(signal: 'quit', callback: (_source: this) => void): number;
            emit(signal: 'quit'): void;
            connect_after(signal: 'quit-cancelled', callback: (_source: this) => void): number;
            emit(signal: 'quit-cancelled'): void;
            connect_after(signal: 'quit-requested', callback: (_source: this) => boolean): number;
            emit(signal: 'quit-requested'): void;
            connect_after(signal: 'save-state', callback: (_source: this) => void): number;
            emit(signal: 'save-state'): void;
            connect_after(signal: 'save-state-extended', callback: (_source: this) => void): number;
            emit(signal: 'save-state-extended'): void;

            // Static methods

            /**
             * Gets the XfceSmClient Error Quark.
             */
            static error_quark(): GLib.Quark;
            /**
             * Constructs a #GOptionGroup suitable for use with Glib's
             * command-line option parser.
             *
             * This function is a bit sneaky in that it will make a copy of
             * the program's argc and argv <emphasis>before</emphasis> GTK+ etc.
             * has a chance to mess around with it, so #XfceSMClient can later
             * construct an accurate restart command.  Instead of calling
             * gtk_init() or gtk_init_with_args(), instead you'd do something
             * like:
             *
             * <informalexample><programlisting>
             * GOptionContext *context = g_option_context_new("");
             * g_option_context_add_group(context, gtk_get_option_group(TRUE));
             * g_option_context_add_group(context, xfce_sm_client_get_option_group(argc, argv);
             * g_option_context_parse(context, &argc, &argv, NULL);
             * </programlisting></informalexample>
             *
             * Error checking is omitted here for brevity, and of course you could
             * add your app's own options with g_option_context_add_main_entries()
             * or similar.
             * @param argc The application's argument count
             * @param argv The application's argument vector
             */
            static get_option_group(argc: number, argv: string): GLib.OptionGroup;

            // Methods

            /**
             * Attempts to connect to the session manager.
             * @returns %TRUE on success, %FALSE otherwise.  If an error          occurs, @error will be set.
             */
            connect(): boolean;
            connect(...args: never[]): any;
            /**
             * Disconnects the application from the session manager.
             *
             * <note><para>
             * This may not remove the application from the saved
             * session (if any) if the user later does not choose to save
             * the session when logging out.
             * </para></note>
             */
            disconnect(): void;
            /**
             * Retrieves the session client's unique ID.  This ID can
             * be used to construct a filename used to restore the
             * application's state.  Note that this value is only
             * guaranteed to be valid if connected to the session manager.
             *
             * <note><para>
             * Instead of constructing a state filename, it is
             * recommended to use xfce_sm_client_get_state_file().
             * </para></note>
             * @returns an opaque object-owned string
             */
            get_client_id(): string;
            /**
             * Retrieves the session client's working directory.  See
             * xfce_sm_client_set_current_directory() for more information.
             * @returns an object-owned string
             */
            get_current_directory(): string;
            /**
             * Retrieves the session client's restart priority.  See
             * xfce_sm_client_set_priority() for more information.
             * @returns a value from #G_MININT8 to #G_MAXINT8
             */
            get_priority(): number;
            /**
             * Retrieves the session client's restart command.  See
             * xfce_sm_client_set_restart_command() for more information.
             * @returns an object-owned string vector
             */
            get_restart_command(): string[];
            /**
             * Retrieves the session client's restart style.  See
             * xfce_sm_client_set_restart_style() for more information.
             * @returns a value from the #XfceSMClientRestartStyle enum
             */
            get_restart_style(): SMClientRestartStyle;
            /**
             * Constructs a filename that can be used to restore or save
             * state information.
             *
             * When saving state, ote that this file may already exist (and
             * may have been used for saving previous state for the
             * application), so the application should first remove or empty
             * the file if it requires a fresh state file.
             *
             * On the next application start, this function can be used to
             * check to see if there is any previous saved state, and, if so,
             * the state can be restored from the file.
             *
             * This function will use a standard location and naming scheme
             * and handle state cleanup (setting of the discard command) for you.
             *
             * Before calling this function, the application must have a
             * valid client ID (see xfce_sm_client_get_client_id()).
             * @returns a file name string, owned by the object or %NULL if          the session client is disabled.
             */
            get_state_file(): string;
            /**
             * Determines whether or not the application has connected to the
             * session manager.
             * @returns %TRUE if connected to the session manager, %FALSE otherwise
             */
            is_connected(): boolean;
            /**
             * Determines whether the application was resumed from a previous
             * session, or if the application has been started fresh with no
             * state information associated with it.
             * @returns %TRUE if resumed from a previous session, %FALSE otherwise
             */
            is_resumed(): boolean;
            /**
             * Sends a request to the session manager to end the session.
             * Depending on `hint,` the session manager may prompt for a
             * certain action (log out, halt, reboot, etc.) or may take the
             * requested action without user intervention.
             *
             * <note><para>
             * The session manager may or may not support all requested
             * actions, and is also free to ignore the requested action.
             * </para></note>
             * @param shutdown_hint The type of shutdown requested
             */
            request_shutdown(shutdown_hint: SMClientShutdownHint | null): void;
            /**
             * Sets the startup working directory of `sm_client` to
             * `current_directory`.  If unset, defaults to the user's
             * home directory.
             * @param current_directory A valid path name
             */
            set_current_directory(current_directory: string): void;
            /**
             * Sets the application's .desktop file.  In addition to informing
             * the session manager of the .desktop file so it can present localized
             * names and an icon in session listings and the splash screen, this
             * also calls g_set_application_name() and
             * gtk_window_set_default_icon_name() (or
             * gtk_window_set_default_icon_from_file()) if the Name and Icon
             * keys are present, respectively.
             *
             * If a relative path to the file is provided, this function will search
             * the standard application directories as specified by the
             * <ulink type="http" url="http://standards.freedesktop.org/menu-spec/latest/">XDG
             * Desktop Menu Specification</ulink>.
             * @param desktop_file The path to the application's .desktop file
             */
            set_desktop_file(desktop_file: string): void;
            /**
             * Sets the startup priority for `sm_client` to `priority`.  Note
             * that the default priority for applications is 50; lower values
             * should be reserved for components of the desktop environment.
             * @param priority A 8-bit signed priority value
             */
            set_priority(priority: number): void;
            /**
             * Sets the application's "restart" command, which is used to restart
             * the application and restore any saved state from the previous
             * run.
             *
             * If unset, defaults to the command used to start this instance
             * of the application, with session management related arguments
             * added (if not already present).
             * @param restart_command An argument vector
             */
            set_restart_command(restart_command: string): void;
            /**
             * Sets the restart style hint to `restart_style`.
             * @param restart_style An #XfceSMClientRestartStyle value
             */
            set_restart_style(restart_style: SMClientRestartStyle | null): void;
        }

        namespace Screensaver {
            // Constructor properties interface

            interface ConstructorProps extends GObject.Object.ConstructorProps {
                heartbeat_command: string;
                heartbeatCommand: string;
                lock_command: string;
                lockCommand: string;
                lock_on_sleep: boolean;
                lockOnSleep: boolean;
            }
        }

        class Screensaver extends GObject.Object {
            static $gtype: GObject.GType<Screensaver>;

            // Properties

            get heartbeat_command(): string;
            set heartbeat_command(val: string);
            get heartbeatCommand(): string;
            set heartbeatCommand(val: string);
            get lock_command(): string;
            set lock_command(val: string);
            get lockCommand(): string;
            set lockCommand(val: string);
            get lock_on_sleep(): boolean;
            set lock_on_sleep(val: boolean);
            get lockOnSleep(): boolean;
            set lockOnSleep(val: boolean);

            // Constructors

            constructor(properties?: Partial<Screensaver.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): Screensaver;

            // Methods

            /**
             * Calling this function with `inhibit` as %TRUE will prevent the user's
             * screensaver from activating. This is useful when the user is watching
             * a movie or giving a presentation.
             *
             * Calling this function with `inhibit` as %FALSE will remove any current
             * screensaver inhibit the #XfceScreensaver object has.
             * @param inhibit whether to inhibit the screensaver from activating
             */
            inhibit(inhibit: boolean): void;
            /**
             * Attempts to lock the screen, either with one of the screensaver
             * D-Bus proxies, the Xfconf lock command, or one of the
             * fallback scripts such as xdg-screensaver.
             * @returns %TRUE if the lock attempt returns success, %FALSE otherwise.
             */
            lock(): boolean;
        }

        namespace TitledDialog {
            // Constructor properties interface

            interface ConstructorProps
                extends Gtk.Dialog.ConstructorProps,
                    Atk.ImplementorIface.ConstructorProps,
                    Gtk.Buildable.ConstructorProps {
                subtitle: string;
            }
        }

        /**
         * An opaque struct with only private fields.
         */
        class TitledDialog extends Gtk.Dialog implements Atk.ImplementorIface, Gtk.Buildable {
            static $gtype: GObject.GType<TitledDialog>;

            // Properties

            /**
             * The subtitle displayed below the main dialog title.
             */
            get subtitle(): string;
            set subtitle(val: string);

            // Constructors

            constructor(properties?: Partial<TitledDialog.ConstructorProps>, ...args: any[]);

            _init(...args: any[]): void;

            static ['new'](): TitledDialog;

            // Methods

            /**
             * This function is a replacement for #gtk_dialog_add_action_widget and assumes that
             * you have called #xfce_titled_dialog_create_action_area before.
             *
             * Children with #GTK_RESPONSE_HELP will be added to the secondary group of children
             * (see #gtk_button_box_set_child_secondary for reference).
             * @param child an activatable widget.
             * @param response_id response ID for @child.
             */
            add_action_widget(child: Gtk.Widget, response_id: number): void;
            /**
             * This function is a replacement for #gtk_dialog_add_button and assumes that
             * you have called #xfce_titled_dialog_create_action_area before.
             *
             * Buttons with #GTK_RESPONSE_HELP will be added to the secondary group of children
             * (see #gtk_button_box_set_child_secondary for reference).
             * @param button_text text of button.
             * @param response_id response ID for @child.
             * @returns the GtkButton widget that was added.
             */
            add_button(button_text: string, response_id: number): Gtk.Widget;
            /**
             * This function creates a custom action area (of type #GtkButtonBox) and has to
             * be used in combination with #xfce_titled_dialog_add_action_widget.
             *
             * When using the XfceTitledDialogClass directly to create dialogs this function is
             * useful to keep action widgets out of the #GtkHeaderBar in which they would
             * normally end up by calling #gtk_dialog_add_action_widget.
             */
            create_action_area(): void;
            /**
             * Returns the subtitle of the `titled_dialog,` or %NULL
             * if no subtitle is displayed in the `titled_dialog`.
             * This is just a convenience function around #gtk_header_bar_get_subtitle.
             * @returns the subtitle of @titled_dialog, or %NULL.
             */
            get_subtitle(): string;
            /**
             * Sets the last widget in the dialog’s action area with the given `response_id`
             * as the default widget for the dialog. Pressing “Enter” normally activates
             * the default widget.
             *
             * This function is a replacement for #gtk_dialog_set_default_response, which does
             * not work with #XfceTitledDialog.
             * @param response_id a response ID
             */
            set_default_response(response_id: number): void;
            /**
             * Sets the subtitle displayed by `titled_dialog` to `subtitle;` if
             * `subtitle` is %NULL no subtitle will be displayed by the `titled_dialog`.
             * This is just a convenience function around #gtk_header_bar_set_subtitle
             * when dialogs use header bars. Otherwise a simple label and separator are
             * shown at the top of dialog.
             * @param subtitle the new subtitle for the @titled_dialog, or %NULL.
             */
            set_subtitle(subtitle?: string | null): void;

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

        type FilenameInputClass = typeof FilenameInput;
        /**
         * Replacement for the deprecated #GtkActionEntry.
         * The idea is to provide a fixed list of #XfceGtkActionEntrys:
         * - use xfce_gtk_translate_action_entries() once to translate the list
         * - use xfce_gtk_accel_map_add_entries() once to register the provided accelerators
         * - use xfce_gtk_get_action_entry_by_id() to find a single entry, e.g. by using a enumeration
         * - use xfce_gtk_*_new_from_action_entry() to create the specific menu- or tool-items from the entry
         */
        class GtkActionEntry {
            static $gtype: GObject.GType<GtkActionEntry>;

            // Fields

            id: number;
            accel_path: string;
            default_accelerator: string;
            menu_item_type: GtkMenuItem;
            menu_item_label_text: string;
            menu_item_tooltip_text: string;
            menu_item_icon_name: string;
            callback: GObject.Callback;

            // Constructors

            _init(...args: any[]): void;
        }

        type ScreensaverClass = typeof Screensaver;
        type TitledDialogClass = typeof TitledDialog;
        abstract class TitledDialogPrivate {
            static $gtype: GObject.GType<TitledDialogPrivate>;

            // Constructors

            _init(...args: any[]): void;
        }

        type ScreenSaver = Screensaver;
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

    export default Libxfce4ui;
}

declare module 'gi://Libxfce4ui' {
    import Libxfce4ui20 from 'gi://Libxfce4ui?version=2.0';
    export default Libxfce4ui20;
}
// END
