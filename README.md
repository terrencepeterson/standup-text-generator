# Stand up text generator

> Generates text to be pasted in the daily standup 

![Example usage](https://github.com/terrencepeterson/standup-text-generator/blob/main/generate-standup.gif)

## Installation
This package has not being uploaded to npm. In order to run the package from anywhere in your CLI please:

1. git clone this repo `git clone git@github.com:terrencepeterson/standup-text-generator.git` 
2. CD into the repo `cd /path/to/standup-text-generator`
3. Use the [npm link command](https://docs.npmjs.com/cli/v11/commands/npm-link) `npm link`

## Usage

Create a `./projects.mjs` file. In this file export an array of objects that contain a `name` and a (unique) `value` property.
```
export default [
    { "name": "Police Supplies", "value": "police-supplies" },
    { "name": "Utlity Design", "value": "utility-design" },
    { "name": "Killer Ink", "value": "killer-ink" },
    { "name": "Dock (internal)", "value": "dock" },
]
```

Run the `generate-standup` cmd.


