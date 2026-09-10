// Headless regression tests for RotCipher pure functions.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');

const js = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => m[1]).sort((a, b) => b.length - a.length)[0];

function el(){ return {value:'',textContent:'',innerHTML:'',style:{},className:'',
  appendChild(){},getAttribute(){return null;},setAttribute(){},removeAttribute(){},
  addEventListener(){},querySelectorAll(){return[];},closest(){return null;}}; }
globalThis.document = {
  getElementById: () => el(), createElement: () => el(),
  querySelectorAll: () => [], documentElement: el()
};
globalThis.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
globalThis.matchMedia = () => ({ matches:false });
globalThis.window = { matchMedia: globalThis.matchMedia };

eval(js.replace('if(typeof module !== \'undefined\') module.exports =',
  'globalThis.__t =') );
const { caesar, rot13, rot47, atbash, apply } = globalThis.__t;

let n = 0;
const check = (name, fn) => { fn(); n++; console.log('  ok -', name); };

check('caesar basic shifts, wrap, case, punctuation', () => {
  assert.equal(caesar('abc', 1), 'bcd');
  assert.equal(caesar('xyz', 3), 'abc');
  assert.equal(caesar('XYZ', 3), 'ABC');
  assert.equal(caesar('Hello, World!', 3), 'Khoor, Zruog!');
  assert.equal(caesar('abc', 0), 'abc');
});

check('caesar negative and >26 shifts normalize', () => {
  assert.equal(caesar('abc', -1), 'zab');
  assert.equal(caesar('abc', 27), 'bcd');
  assert.equal(caesar('bcd', -1), 'abc');
});

check('caesar decode = caesar with negative shift', () => {
  const enc = caesar('Secret Message', 7);
  assert.equal(caesar(enc, -7), 'Secret Message');
});

check('rot13 is its own inverse and matches known vector', () => {
  assert.equal(rot13('Hello, World!'), 'Uryyb, Jbeyq!');
  assert.equal(rot13(rot13('The quick brown fox')), 'The quick brown fox');
});

check('rot47 known vector and involution', () => {
  assert.equal(rot47('Hello'), 'w6==@');
  assert.equal(rot47(rot47('Hello, World! 123')), 'Hello, World! 123');
  // digits and symbols shift too
  assert.equal(rot47('rot47') !== 'rot47', true);
});

check('atbash maps a<->z and is its own inverse', () => {
  assert.equal(atbash('abc'), 'zyx');
  assert.equal(atbash('ABC'), 'ZYX');
  assert.equal(atbash('Hello'), 'Svool');
  assert.equal(atbash(atbash('Attack at dawn')), 'Attack at dawn');
});

check('non-letters pass through unchanged', () => {
  assert.equal(caesar('a1b2 c3!', 1), 'b1c2 d3!');
  assert.equal(atbash('a1b2', 0), 'z1y2');
});

check('apply dispatches on mode', () => {
  assert.equal(apply('abc', 'caesar', 1, false), 'bcd');
  assert.equal(apply('bcd', 'caesar', 1, true), 'abc');       // decode
  assert.equal(apply('Hello', 'rot13', 0, false), rot13('Hello'));
  assert.equal(apply('Hello', 'rot47', 0, false), 'w6==@');
  assert.equal(apply('abc', 'atbash', 0, false), 'zyx');
});

console.log(`\n${n} checks passed.`);
