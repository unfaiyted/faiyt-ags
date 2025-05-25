import { type Subscribable } from "astal/binding";
import Gtk from "gi://Gtk";

export class VarMap<K, T = Gtk.Widget> implements Subscribable {
  #subs = new Set<(v: Array<[K, T]>) => void>();
  #map: Map<K, T>;

  #notifiy() {
    const value = this.get();
    for (const sub of this.#subs) {
      sub(value);
    }
  }

  #delete(key: K) {
    const v = this.#map.get(key);

    if (v instanceof Gtk.Widget) {
      v.destroy();
    }

    this.#map.delete(key);
  }

  #deleteAll() {
    for (const key of this.#map.keys()) {
      this.#delete(key);
    }
    this.#notifiy();
  }

  constructor(initial?: Iterable<[K, T]>) {
    this.#map = new Map(initial);
  }

  set(key: K, value: T) {
    this.#delete(key);
    this.#map.set(key, value);
    this.#notifiy();
  }

  setMany(entries: [K, T][]) {
    for (const [key, value] of entries) {
      this.set(key, value);
    }
  }

  delete(key: K) {
    this.#delete(key);
    this.#notifiy();
  }

  deleteAll() {
    this.#deleteAll();
    this.#notifiy();
  }

  get() {
    return [...this.#map.entries()];
  }

  get value() {
    return this.get();
  }

  getByKey(key: K) {
    return this.#map.get(key);
  }

  subscribe(callback: (v: Array<[K, T]>) => void) {
    this.#subs.add(callback);
    return () => this.#subs.delete(callback);
  }
}
