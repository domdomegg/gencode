/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
[a-z]+\b              return 'VARIABLE'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"("                   return '('
")"                   return ')'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e
    : e '+' e
        {$$ = { op: 'ADD', a: $1, b: $3, ershov: $1.ershov == $3.ershov ? $1.ershov + 1 : Math.max($1.ershov, $3.ershov) } ;}
    | e '-' e
        {$$ = { op: 'SUB', a: $1, b: $3, ershov: $1.ershov == $3.ershov ? $1.ershov + 1 : Math.max($1.ershov, $3.ershov) } ;}
    | e '*' e
        {$$ = { op: 'MUL', a: $1, b: $3, ershov: $1.ershov == $3.ershov ? $1.ershov + 1 : Math.max($1.ershov, $3.ershov) } ;}
    | e '/' e
        {$$ = { op: 'DIV', a: $1, b: $3, ershov: $1.ershov == $3.ershov ? $1.ershov + 1 : Math.max($1.ershov, $3.ershov) } ;}
    | '(' e ')'
        {$$ = $2;}
    | VARIABLE
        {$$ = { op: 'LD', value: yytext, ershov: 1 } ;}
    ;