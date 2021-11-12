import { parser } from './grammar.js';

/**
 * @typedef {{ op: 'ADD' | 'SUB' | 'MUL' | 'DIV', a: Tree, b: Tree, ershov: number } | { op: 'LD', value: string, ershov: number }} Tree
 * @type {Tree}
 */
const tree = parser.parse('(((c/a)+c)*(d+e)-e)+((b+(d-c))-(d*e))');

console.log('Tree:');
console.dir(tree, { depth: Infinity });
console.log('');

console.log('Gencode result:')
/**
 * The Sethi Ullman algorithm
 * @param {Tree} tree abstract syntax tree representing the expression
 */
const gencode = (tree, b = 1) => {
    if (tree.op == 'LD') {
        console.log(`LD  R${b}, ${tree.value}`);
        return;
    }

    const k = tree.ershov;
    if (tree.a.ershov == tree.b.ershov) {
        gencode(tree.b, b + 1);
        gencode(tree.a, b);
        console.log(`${tree.op} R${b+k-1}, R${b+k-2}, R${b+k-1}`);
    } else if (tree.a.ershov > tree.b.ershov) {
        gencode(tree.a, b);
        gencode(tree.b, b);
        console.log(`${tree.op} R${b+k-1}, R${b+k-1}, R${b+tree.b.ershov-1}`);
    } else if (tree.a.ershov < tree.b.ershov) {
        gencode(tree.b, b);
        gencode(tree.a, b);
        console.log(`${tree.op} R${b+k-1}, R${b+tree.a.ershov-1}, R${b+k-1}`);
    }
}

/**
 * The Sethi Ullman algorithm, with register spilling
 * @param {Tree} tree abstract syntax tree representing the expression
 */
let temp = 1;
const modified_gencode = (tree, b = 1, r = Infinity) => {
    if (tree.ershov <= r) {
        gencode(tree, b);
        return;
    }

    const k = temp++;
    if (tree.a.ershov > tree.b.ershov) {
        modified_gencode(tree.a, 1, r);
        console.log(`ST  t${k}, R${r}`);
        modified_gencode(tree.b, Math.max(1, r - tree.b.ershov), r);
        console.log(`LD  R${r-1}, t${k}`);
        console.log(`${tree.op} R${r}, R${r-1}, R${r}`);
    } else {
        modified_gencode(tree.b, 1, r);
        console.log(`ST  t${k}, R${r}`);
        modified_gencode(tree.a, Math.max(1, r - tree.a.ershov), r);
        console.log(`LD  R${r-1}, t${k}`);
        console.log(`${tree.op} R${r}, R${r}, R${r-1}`);
    }
}

modified_gencode(tree, undefined, 3);
