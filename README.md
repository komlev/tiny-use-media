# tiny-use-media

Small (0.7 kb) react hook for getting media breakpoints state info in runtime

## Usage

```
npm i tiny-use-media --save
```

Adn in your react code

```js
import { useMedia } from "tiny-use-media";

// ...

const { current, md, lg } = useMedia({
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
});

console.log({ current, md, lg });
/*
  if you current screen size is 900px
  it will print:
  { current: 'md', md: true, lg: false }
*/
```

## API

Input:

```js
// object with breakpoints names/values
const breakpointsConfig = {
  mobile: 320, // min-width for mobile
  tablet: 640, // min-width for tablet
  desktop: 1024, // min-width for desktop
};

useMedia(breakpointsConfig);
```

Output:

```js
const output = useMedia(breakpointsConfig);
```

Output contains "**current**" field which corresponds to a current breakpoint.

It also contains boolean values for each provided breakpoint.

E.g. output for screen size of 900px

```js
{
    current: "tablet",
    mobile: true,
    tablet: true,
    desktop: false
}
```

## License

MIT
