class Color {
  #red = 0;
  #green = 0;
  #blue = 0;

  /**
   * Constructs a new color.
   * @param {number?} red The red component of the color [0-255]
   * @param {number?} green The green component of the color [0-255]
   * @param {number?} blue The blue component of the color [0-255]
   */
  constructor(red, green, blue) {
    if (!red) red = 0;
    if (!green) green = 0;
    if (!blue) blue = 0;

    this.#red = red;
    this.#blue = blue;
    this.#green = green;
  }

  /**
   * Returns the red component of the color.
   */
  get r() {
    return this.#red;
  }

  /**
   * Sets a new red component of the color.
   */
  set r(r) {
    this.#red = this.#clampComponent(r);
  }

  /**
   * Returns the green component of the color.
   */
  get g() {
    return this.#green;
  }

  /**
   * Sets a new green component of the color.
   */
  set g(g) {
    this.#green = this.#clampComponent(g);
  }

  /**
    * Returns the blue component of the color.
    */
  get b() {
    return this.#blue;
  }

  /**
   * Sets a new blue component of the color.
   */
  set b(b) {
    this.#blue = this.#clampComponent(b);
  }

  /**
   * @returns {string} A string containing the color represented in hex
   */
  toHex() {
    return "#" + this.#componentToHex(this.r) + this.#componentToHex(this.g) + this.#componentToHex(this.b);
  }

  /**
   * @returns {number[]} An array of numbers for the different components. Order matters: [0] = r, [1] = g, [2] = b.
   */
  getComponents() {
    return [
      this.r,
      this.g,
      this.b,
    ]
  }

  get average() {
    return (this.r + this.g + this.b) / 3;
  }

  /**
   * Creates a new color from a hex string.
   * "Borrowed" from StackOverflow: https://stackoverflow.com/a/5624139
   * @param {string} hex A hex string for the color you want created 
   * @returns {Color?} a new color created from the hex string, if the string can't be parsed null is returned.
   */
  static createFromHex(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) : null;
  }

  // also borrowed from stackoverflow lol
  // https://stackoverflow.com/a/5624139
  #componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  #clampComponent(c) {
    if (!c || c < 0) return 0;
    else if (c > 255) return 255;
    else return c;
  }
}

module.exports = Color;
