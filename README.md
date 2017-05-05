# jsonfui

jsonfui is an interactive command-line JSON viewer. [Examples](#examples)

## Installation

### Download Binary

Download [latest release](https://github.com/AdrianSchneider/jsonfui/releases) from GitHub (does not require node.js).

### npm Release

Or, install via npm (requires node.js):

```
npm install -g jsonfui
```

## Usage

To start jsonfui, pass a filename to it:

    jsonfui /path/to/file.json

You can also read from stdin instead of a file:

    curl -s https://api.github.com/users/adrianschneider/repos | jsonfui

When the application is open, you are in an interactive [blessed](https://github.com/chjj/blessed)-powered navigator.

### Hotkeys (vim mode)

`j`: down  
`k`: up  
`h`: go back/up one level  
`l`: enter (open node)  
`<Enter>`: enter (open node)  
`y` or `c`: copy current value to clipboard
`-`: toggle expansion  
`/`: search for string recursively  
`*`: search for value under cursor  
`n`: next search result at current depth  
`N`: prev search result at current depth  
`<space>`: clear highlight  

## Examples

### Reading from Standard In

![Piped Content](./examples/jsonfui_curl.gif)

### Reading from a File

![Local File](./examples/jsonfui_local.gif)
