# url-relative

Create relative paths from two URLs.

```js
import { relative } from 'https://cdn.spooky.click/url-relative/0.0.1/mod.ts';

console.log(relative(
  new URL('http://example.com/a/b/c/d'),
  new URL('http://example.com/a/b/c/d/e')
));
// d/e
```

## License

BSD-2-Clause