# PyREPL
PyREPL is a simple web based Python REPL created using the [Pyodide](https://pyodide.org/) WASM Python interpreter.

## How
By using Pyodide there is no need server/backend for running any code, it is all done in the client's browser. This reduces complexity and make's it super portable. 

Code contents are compressed and base64 encoded into the URL using [fflate](https://github.com/101arrowz/fflate). This means your code is not stored on any server, but still shareable with unique links.

## Why
I primarily developed this for my own classroom when I teach a small Python foundations unit, it allows me to introduce students to the Python language without needing to setup and entire development environment. 

I also personally want to quickly just test/share some Python code and I couldn't find a solution that fit my use case.

## Current Limitations
- Single file only
- No 3rd party packages
- [Pyodide Python compatibility](https://pyodide.org/en/stable/usage/wasm-constraints.html)

## Acknowledgements
- The amazing [Pyodide](https://github.com/pyodide) team who without their WASM port of CPython none of this would be possible
- [Vue's REPL](https://github.com/vuejs/repl), which was the final piece of the puzzle to make the app as portable as possible