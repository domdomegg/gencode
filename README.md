# gencode

Implementation of the Sethi-Ullman Algorithm, gencode.

## Usage

1. Install [Node](https://nodejs.org/)
2. Clone this repo
3. Set the expression passed to `parser.parse` on line 7 of `index.mjs`
4. Modify the arguments passed to `gencode` or `modified_gencode` on line 67 of `index.mjs`
5. Run `node index.mjs`

## Sample output

For the expression `(((c/a)+c)*(d+e)-e)+((b+(d-c))-(d*e)` with 3 registers available

```
Tree:
{
  op: 'ADD',
  a: {
    op: 'SUB',
    a: {
      op: 'MUL',
      a: {
        op: 'ADD',
        a: {
          op: 'DIV',
          a: { op: 'LD', value: 'c', ershov: 1 },
          b: { op: 'LD', value: 'a', ershov: 1 },
          ershov: 2
        },
        b: { op: 'LD', value: 'c', ershov: 1 },
        ershov: 2
      },
      b: {
        op: 'ADD',
        a: { op: 'LD', value: 'd', ershov: 1 },
        b: { op: 'LD', value: 'e', ershov: 1 },
        ershov: 2
      },
      ershov: 3
    },
    b: { op: 'LD', value: 'e', ershov: 1 },
    ershov: 3
  },
  b: {
    op: 'SUB',
    a: {
      op: 'ADD',
      a: { op: 'LD', value: 'b', ershov: 1 },
      b: {
        op: 'SUB',
        a: { op: 'LD', value: 'd', ershov: 1 },
        b: { op: 'LD', value: 'c', ershov: 1 },
        ershov: 2
      },
      ershov: 2
    },
    b: {
      op: 'MUL',
      a: { op: 'LD', value: 'd', ershov: 1 },
      b: { op: 'LD', value: 'e', ershov: 1 },
      ershov: 2
    },
    ershov: 3
  },
  ershov: 4
}

Gencode result:
LD  R3, e
LD  R2, d
MUL R3, R2, R3
LD  R2, c
LD  R1, d
SUB R2, R1, R2
LD  R1, b
ADD R2, R1, R2
SUB R3, R2, R3
ST  t1, R3
LD  R3, e
LD  R2, d
ADD R3, R2, R3
LD  R2, a
LD  R1, c
DIV R2, R1, R2
LD  R1, c
ADD R2, R2, R1
MUL R3, R2, R3
LD  R1, e
SUB R3, R3, R1
LD  R2, t1
ADD R3, R3, R2
```