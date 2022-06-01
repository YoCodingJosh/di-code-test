const Color = require("../models/Color");

class ColorService {
  /**
   * @type {ColorService}
   */
  static impl;

  /**
   * @type {Color[]}
   */
  #list = [];
  
  constructor() {
    if (!this.impl) {
      this.impl = this;
    }

    return this.impl;
  }

  /**
   * Generates a random color
   * @returns {Color} A random color
   */
  getRandomColor() {
    let color = new Color();

    color.r = this.#randomUnsignedByte();
    color.g = this.#randomUnsignedByte();
    color.b = this.#randomUnsignedByte();

    return color;
  }

  get list() {
    return this.#list;
  }

  /**
   * Pushes a color to the list but removes the oldest entry if there are more than 5.
   * @param {Color} color Color to add to the list
   */
  pushList(color) {
    if (this.#list.length == 5) {
      this.#list.shift();
      this.#list.push(color);
    } else {
      this.#list.push(color);
    }
  }

  #randomUnsignedByte() {
    return Math.floor(Math.random() * 256);
  }
}

module.exports = ColorService;
