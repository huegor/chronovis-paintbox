# Humanistic Approaches to Visualization of Temporality and Chronology

By Johanna Drucker, developed by Skye Hoffman

## Overview
 (insert blurb)

## ChronoJSON: Structure and Convention

At the top level of the ChronoJSON are: `imgs`, `instants`, `zones`, and `scales`. `imgs` is an array containing paths that reference user-uploaded images stored in the server. The rest are all temporal objects that can be created and defined by the user.

`{
  "imgs": [...],
  "instants": [
    [...],
    [...],
    ...
  ],
  "zones": [...],
  "scales" {...}:
}
`

### Scales

Almost all graphical objects require a scale to determine its position on screen. The `scales` array contain all scales used in the dataset, with the following being an individual scale:

`"biggie": {
  "min": 0,
  "max": 1637,
  "units": "Years since first unicorn domesticated",
  "yPos": 1,
  "segments": [
    {"max": 120, "label": "Early Dynastic"},
    {"min": 120, "max": 1000, "label": "Old Kingdom"},
    {"min": 1300, "label": "Late Period"}
  ]
}`

The following properties are required:

`min` sets the lower limit of the entire scale. Accepts any numerical value less than the value of `max`.
`max` sets the upper limit of the entire scale. Accepts any numerical value greater than the value of `min`.
`units` accepts any string of unicode characters.
`yPos` declares the vertical position of the timeline relative to the height of the screen. Accepts any numerical value between 0 and 1; defaults to 1 (bottom of the screen).

The following properties are optional:

`segments` contain an array of objects that define scale segments that override the main scale.
Each segment can specify its own `min` and `max`, which follows the same conventions as that of the main scale. If unspecified, the values default to that of the main scale.
`label` accepts any string of unicode characters.


### Instances and Intervals

In accordance with Time Ontology in OWL (https://www.w3.org/TR/2020/CR-owl-time-20200326/#time-position), intervals are defined as "things with extent," whereas instants are "point-like in that they have no interior points, but it is generally safe to think of an instant as an interval with zero length, where the beginning and end are the same." Because of the way D3 renders graphical elements (paths structured around points), interval data are embedded within instances, then extracted during the rendering process.

The structure of an instance is as follows:

`{
  "id":0,
  "name": "Lorem",
  "x":1620,
  "y":15,
  "target": [1],
  "scale": "smalls",
  "layer": 1,
  "color":"#4DA6FF",
  "opacity": 0.5,
  "radius": 8,
  "cancelled": false,
  "foreshadowing": false,
  "connections": [6, 0],
  "intervalColor":"red",
  "intervalWidth": 5,
  "intervalOpacity": 0.8,
  "intervalDashed": "5 2"
}`

The following properties are required:

`id` accepts integer values. They do not have to be sequential or continuous. Creating a new instant will automatically assign its id to be the last id + 1.
`name` accepts any string of unicode characters.
`x` accepts any numerical value.
`target` accepts an array of instant ids between which an interval beginning with the current instant is generated (branching, not chaining). If the interval ends with this instant, put `null`.
`scale` accepts a string that corresponds to any defined scale as specified in the scale section.

The following are optional:

`y` accepts any numerical value. Defaults to the `y` value of the previous instant.
`layer` specifies the layer on which the temporal object resides, which can be toggled on and off. Defaults to 1.
`color` accepts hex codes, RGB values, CSS colors, etc. Defaults to black.
`opacity` accepts a float between 0 and 1. Defaults to 1.
`radius` accepts a numerical value. Defaults to 5. Accessibility size adjustments do not affect underlying data.

The following correspond to inflections:
`cancelled` accepts a boolean.
`foreshadowing` accepts a boolean.
`connections` accepts an array. The first value can either be a point ID or, in the case of intervals and points, a Javascript Object. The second value indicates the order (0 first, 1 second), which is used for the causality inflection.

All intervals are generated using instants as anchors; therefore, all interval attributes are attached to the instant from which they are generated. `intervalColor` and `intervalOpacity` follow the same conventions as their instant counterparts. `intervalWidth` accepts a numerical value when specified, but otherwise defaults to 1/3 of `radius`. `intervalDashed` specifies a dashed line, and [syntax documentation can be found here](https://www.w3docs.com/learn-css/stroke-dasharray.html).

### Zones



# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
