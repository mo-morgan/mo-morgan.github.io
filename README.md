
# mo-morgan.github.io
My github website https://mo-morgan.github.io/

## Local preview

Run `python -m http.server 8765` from this directory, then open
`http://localhost:8765/`. The site is static HTML, Bootstrap, CSS, and jQuery;
no install or build step is required to preview changes.

Presentation overrides live in `css/myCSS.css`. The page loads the readable
`js/stylish-portfolio.js` source for navigation behavior. The existing
`#side-project` and `#portfolio` anchors remain available for older links.

## Reused artwork

- `img/faunio/bear-walk.webp` and `img/faunio/rabbit-run.webp` are Faunio's
  grizzly walk and rabbit move cycles, cropped and laid out as 16-frame strips.
  The CSS frame durations and `SPEED` in `js/stylish-portfolio.js` come from
  the game's frame rates and top speeds, so the feet do not slide.
- `img/bg-masthead.webp` is an optimized copy of the existing pencil photograph.

Faunio's portfolio description is limited to its public identity and gameplay.
