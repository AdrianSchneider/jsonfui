# JSON FUI

jsonfui is a command-line JSON viewer.

## Installation

For the standalone application:

    npm install -g jsonfui

And `jsonfui` will be available in your bin path.

## Usage

To start jsonfui, pass a filename to it:

    jsonfui /path/to/file.json

Since you'd typically want to pipe in data from another source, you can also denote reading from stdin with the `-` character:

    curl -s https://api.github.com/users/adrianschneider/repos | jsonfui -

When the application is open, you are in an interactive [blessed](https://github.com/chjj/blessed)-powered navigator.

### Hotkeys (vim mode)

`j`: down  
`k`: up  
`h`: go back/up one level  
`l`: enter (open node)  
`<Enter>`: enter (open node)  
`y` or `c`: copy current value to clipboard (OSX)  
`-`: toggle expansion  
`/`: search for string recursively
`*`: search for value under cursor
`n`: next search result at current depth
`N`: prev search result at current depth
`<space>`: clear highlight  
