const express = require('express');
const ColorService = require('./services/ColorService');
const Color = require('./models/Color');
const app = express();
const port = 3000;

const colorService = new ColorService();

// All responses should be sent as JSON
// All responses should send an error respsonse if required query parameters are missing or invalid

/**
 * Sends back a 400 with a custom error message.
 * @param {any} res 
 * @param {string?} message 
 * @returns Response that contains the bad request error.
 */
const badRequest = function(res, message) {
  res.statusCode = 400;

  return res.send(message ?? "Bad request!");
};

app.get('/api/color/random', (req, res) => {
  // This endpoint should return a random color in HEX format
  // i.e. { "color": "#B4DA55" }

  return res.send({
    "color": colorService.getRandomColor().toHex(),
  });
});

app.get('/api/color/to-rgb', (req, res) => {
  // This endpoint should receive a color via query string, for example `?color=B4DA55`
  // It should then return the color as an array of RGB values [RED, GREEN, BLUE],
  // i.e. { "color": [180, 218, 85] }

  if (!req.query.color) {
    res.statusCode = 400;
    return badRequest(res, "Bad request. Provide a color parameter to the query string in hex format (ie: FFFFFF)");
  }

  const color = Color.createFromHex(req.query.color);

  if (!color) {
    res.statusCode = 400;
    return badRequest(res, "Bad request. The color hex string provided could not be parsed correctly.");
  }

  return res.send({
    "color": color.getComponents(),
  });
});

app.get('/api/color/to-hex', (req, res) => {
  // This endpoint should receive a color via query string in the format R-G-B, for example `?color=180-218-85`
  // It should then return the color as a hex string
  // i.e. { "color": "#B4DA55" }

  if (!req.query.color) {
    return badRequest(res, "Bad request. Provide a color parameter to the query string in this format: 255-255-255 (r-g-b)");
  }

  /** @type {string[]} */
  let colorComponentStrings = req.query.color.split("-");

  // bit of a sanity check
  if (colorComponentStrings.length != 3) {
    return badRequest(res, "Bad request. Provide a color parameter to the query string in this format: 255-255-255 (r-g-b)");
  }

  /** @type {number[]} */
  let colorComponents = []; 

  colorComponentStrings.forEach((str) => {
    const component = Number.parseInt(str);

    if (isNaN(component)) {
      return badRequest(`Bad request. Could not parse color component for ${component}. Please make sure it is an integer`);
    }

    colorComponents.push(component);
  });

  const color = new Color(colorComponents[0], colorComponents[1], colorComponents[2]);

  return res.send({
    "color": color.toHex(),
  });
});

app.get('/api/color/brightest', (req, res) => {
  // This endpoint should recieve two hex colors via a query string, for example `?color1=B4DA55&color2=FFFFFF`
  // It should then evaluate which color is brighter and return that color in hex format
  // i.e. { "color": "#FFFFFF" }
  // For our purposes, a color can be considered 'brighter' if the average of its RGB values is greater

  if (!req.query.color1 || !req.query.color2) {
    return badRequest(res, "Bad request. You should provide 2 colors (color1, color2) in the query string in hex format");;
  }

  const color1 = Color.createFromHex(req.query.color1);
  const color2 = Color.createFromHex(req.query.color2);

  if (!color1 || !color2) {
    return badRequest(res, "Bad request. Unable to parse the colors correctly.");
  }

  return res.send({
    "color": color1.average >= color2.average ? color1.toHex() : color2.toHex(),
  });
});

app.get('/api/color/list', (req, res) => {
  // When this endpoint is called with the query param `color`, it should validate add that color to an
  // in-memory array of hex color values. For example, `?color=B4DA55`
  // When this endpoint is called with no query params, it should return the in-memory color list
  // For example { "colors": ["#FFFFFF", "#B4DA55"]}
  // The in-memory color list should never contain more than 5 items, new colors push old colors out

  if (!req.query.color) {
    return res.send({
      "colors": colorService.list,
    });
  } else {
    const color = Color.createFromHex(req.query.color);

    if (!color) return badRequest(res, "Bad request. Unable to parse the color's hex string correctly.");

    colorService.pushList(color.toHex());

    res.statusCode = 204;

    return res.send();
  }
});

app.get('/api/color/dealers-choice', (req, res) => {
  // Make something up! This endpoint should accept some values and return JSON.
  // Stick with the theme of "color".

  // Interpolate between two colors given a number of steps.

  // Returns the steps between the two colors

  if (!req.query.color1 || !req.query.color2 || !req.query.steps) {
    return badRequest(res, "Bad request! You should pass in color1 and color2 (as hex) and how many steps")
  }

  const color1 = Color.createFromHex(req.query.color1);
  const color2 = Color.createFromHex(req.query.color2);

  if (!color1 || !color2) {
    return badRequest("Bad request! Could not properly parse the colors.");
  }

  const steps = Number.parseInt(req.query.steps);

  if (isNaN(steps)) {
    return badRequest("Bad request. Could not parse the steps parameter.");
  }

  const rDiff = (color2.r - color1.r);
  const gDiff = (color2.g - color1.g);
  const bDiff = (color2.b - color1.b);

  /** @type {Color[]} */
  const stepsToTake = [];

  for (let i = 1; i <= steps - 1; i++) {
    const newR = rDiff * (i / steps) + color1.r;
    const newG = gDiff * (i / steps) + color1.g;
    const newB = bDiff * (i / steps) + color1.b;

    const tempColor = new Color(Math.floor(newR), Math.floor(newG), Math.floor(newB));
    stepsToTake.push(tempColor);
  }

  /** @type {string[]} */
  const results = [];

  stepsToTake.forEach((step) => {
    results.push(step.toHex());
  })

  return res.send({
    "steps": results,
  });
});

app.listen(port, () => {
  console.log(`Test app listening at http://localhost:${port}`)
});

