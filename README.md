# RotCipher

**Classic letter ciphers** — encode and decode text with a Caesar shift, ROT13, ROT47, or Atbash. One offline HTML file, no signup, no tracking.

👉 **[Open RotCipher](https://awictor.github.io/rot-cipher/)**

## Features
- Caesar shift (0–25) with an Encode/Decode toggle
- ROT13 (letters) and ROT47 (all printable ASCII)
- Atbash (reverse alphabet)
- Preserves case and punctuation
- Live output, one-click copy, dark mode, remembers your input
- 100% client-side; works offline

## Why
Classic ciphers are everywhere in puzzles, CTFs, and light obfuscation. RotCipher does them all in one place, instantly and offline. (These are for fun and puzzles — not real encryption; for that, see [CipherNote](https://awictor.github.io/cipher-note/).) Part of the [Toolkit](https://awictor.github.io/toolkit/).

## Tests
```
node tests/selftest.mjs
```
Pure functions (`caesar`, `rot13`, `rot47`, `atbash`, `apply`) are covered by headless regression tests: shift/wrap/case, known ROT13 & ROT47 vectors, and involution round-trips; CI runs them on every push.

## License
MIT © Alex Wictor
