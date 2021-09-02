import { relative } from '../lib/mod.ts';
import { assertEquals } from './deps.js';

Deno.test('different protocol', () => {
  assertEquals(
    relative(new URL('http://a.com:12/a'), new URL('https://a.com:12/a')),
    'https://a.com:12/a');
  assertEquals(
    relative(new URL('http://a.com:12/a/'), new URL('https://a.com:12/a/')),
    'https://a.com:12/a/');
});


Deno.test('file protocol', () => {
  let rel = relative(new URL('file:///a'), new URL('file:///b'));
  assertEquals(rel, 'b');
});

Deno.test('different domain', () => {
  let rel1 = relative(new URL('http://a.com:12/a'), new URL('http://b.com/a'));
  assertEquals(rel1, 'http://b.com/a');
  
  let rel2 = relative(new URL('http://a.com:12/a/'), new URL('http://b.com/a/'));
  assertEquals(rel2, 'http://b.com/a/');
});

Deno.test('same domain', () => {
  let rel1 = relative(new URL('http://a.com/a'), new URL('http://a.com/b'));
  assertEquals(rel1, 'b');

  let rel2 = relative(new URL('http://a.com/a/'), new URL('http://a.com/b/'));
  assertEquals(rel2, '../b/');
});

Deno.test('divergent paths, longer from', function (t) {
  let rel1 = relative(new URL('http://a.com/a/b/c/d'), new URL('http://a.com/a/b/d'));
  assertEquals(rel1, '../d');
  
  let rel2 = relative(new URL('http://a.com/a/b/c/d/e'), new URL('http://a.com/a/d/e'));
  assertEquals(rel2, '../../../d/e');
  
  let rel3 = relative(new URL('http://a.com/a/b/c/d/'), new URL('http://a.com/a/b/d/'));
  assertEquals(rel3, '../../d/');

  let rel4 = relative(new URL('http://a.com/a/b/c/d/e/'), new URL('http://a.com/a/d/e/'))
  assertEquals(rel4, '../../../../d/e/');
});

Deno.test('divergent paths, longer to', () => {
  let rel1 = relative(new URL('http://a.com/a/b/c/d'), new URL('http://a.com/a/b/c/d/e'));
  assertEquals(rel1, 'd/e');

  let rel2 = relative(new URL('http://a.com/a/b/c/d'), new URL('http://a.com/a/b/c/d/e/f'));
  assertEquals(rel2, 'd/e/f');

  let rel3 = relative(new URL('http://a.com/'), new URL('http://a.com/a/b'));
  assertEquals(rel3, 'a/b');

  let rel4 = relative(new URL('http://a.com/a/b/c/d/'), new URL('http://a.com/a/b/c/d/e/'));
  assertEquals(rel4, 'e/');

  let rel5 = relative(new URL('http://a.com/a/b/c/d/'), new URL('http://a.com/a/b/c/d/e/f/'));
  assertEquals(rel5, 'e/f/');

  let rel6 = relative(new URL('http://a.com/'), new URL('http://a.com/a/b/'));
  assertEquals(rel6, 'a/b/');
});

Deno.test('divergent paths, equal length', () => {
  let rel1 = relative(new URL('http://a.com/a/b/c/d/e/f'), new URL('http://a.com/a/b/c/g/h/j'));
  assertEquals(rel1, '../../g/h/j');

  let rel2 = relative(new URL('http://a.com/a/b/c/d/e/f/'), new URL('http://a.com/a/b/c/g/h/j/')); 
  assertEquals(rel2, '../../../g/h/j/');
});

Deno.test('identical', () => {
  let rel1 = relative(new URL('https://a.com/a'), new URL('https://a.com/a'));
  assertEquals(rel1, '');

  let rel2 = relative(new URL('https://a.com/a/'), new URL('https://a.com/a/'));
  assertEquals(rel2, '');
});
