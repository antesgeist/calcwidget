# TODO LIST

REFACTOR CODE TO ES6

<!-- Identify Design Pattern -->

<!-- Add Button Values -->

<!-- Add Event Handler - Input -->

<!-- Display Values on Click -->

<!-- Save Expression to Data Structure -->

<!-- Add Event Handler - Operators -->

Validate the Expression

Parse the Expression

Calculate The Expression

Apply Regex function to the Result

Split the Result in three parts

Save Result in Data Structure

Create function to for decimals and commas

Display the Result in the Input field

Insert new HTML results row

Display the Result in the new Results row

---

# REGEX

to use:

\d
\D
[a-zA-Z]
(...)
\
/href="[^"]+"/ | href= | " | everything !" | " |


https://regex101.com/

\           This may be used to match the literal value of any metacharacter, or the / delimiter.
                /\\w/ > match \w literally > "\w"

(?=...)     Asserts that the given subpattern can be matched here, without consuming characters
                POSITIVE LOOKAHEAD
                /foo(?=bar)/ > foobar foobaz > "foo"bar

(?!...)     Starting at the current position in the expression, ensures that the given pattern will not match. Does not consume characters.
                NEGATIVE LOOKAHEAD
                /foo(?!bar)/ > foobar foobaz > "foo"baz

(?<=...)    Ensures that the given pattern will match, ending at the current position in the expression. The pattern must have a fixed width. Does not consume any characters.
            Note that this feature is not yet supported on all browsers; use at your own discretion!
                POSITIVE LOOKBEHIND
                /(?<=foo)bar/ > foobar fuubar > foo"bar"

(?<!...) >  Ensures that the given pattern would not match and end at the current position in the expression. The pattern must have a fixed width. Does not consume characters.
            Note that this feature is not yet supported on all browsers; use at your own discretion!
                NEGATIVE LOOKBEHIND
                /(?<!not )foo/ > not foo but foo > 

[abc]       Matches either an a, b or c character
                /[abc]+/g > a bb ccc > MATCH all except "whitespace"

[^abc]      Matches any character except for an a, b or c
                /[^abc]+/g > Anything but abc. > MATCH except "a, b or c"

[a-z]       Matches any characters between a and z, including a and z
                /[a-z]+/g > Only a-z > MATCH all except "O"

[^a-z]      Matches any characters except those in the range a-z. (e.g, whitespace, special chars)
                /[^a-z]+/g > Anything but a-z. > MATCH all but a-z

[a-zA-Z]    Matches any characters between a-z or A-Z. You can combine as much as you please
                /[a-zA-Z]+/g > abc123DEF > MATCH "abc" and "DEF"

.           Matches any character other than newline (or including newline with the /s flag)
                /.+/ > a b c > MATCH all chars including whitespace

\s          Matches any space, tab or newline character.
                /\s/g > any whitespace character > MATCH whitespace

\S          Matches anything other than a space, tab or newline.
                /\S+/ > any non-whitespace

\d          Matches any decimal digit. Equivalent to [0-9].
                /\d/g > one: 1, two: 2 > MATCH "1" and "2"

\D          Matches anything other than a decimal digit.
                /\D+/ > one: 1, two: 2 > MATCH all non-digit/decimal

\w          Matches any letter, digit or underscore. Equivalent to [a-zA-Z0-9_].
                WORD
                /\w+/g > any word character > MATCH all except whitespace

(...)       Parts of the regex enclosed in parentheses may be referred to later in the expression or extracted from the results of a successful match.
                /(he)+/g > heheh he heh > all "he"

(a|b)       Matches the a or the b part of the subexpression.
                /(a|b)/g > beach > "b" and "a"

a?          Matches an `a` character or nothing.
                /ba?/g ba b a > match "ba" and "b"

a*          Matches zero or more consecutive `a` characters.
                GREEDY QUANTIFIER
                /ba*/g > a ba baa aaa ba b > "ba" "baa" "ba" "b"*

a*?         Matches as few characters as possible.*
                LAZY QUANTIFIER
                /r\w*?/ > r re regex > "r" "r"e "r"egex*

a+          Matches one or more consecutive `a` characters.
                /a+/g > a aa aaa aaaa bab baab > a aa aaa ...

a{3}        Matches exactly 3 consecutive `a` characters.
                /a{3}/g > a aa aaa aaaa > 3 "a"

a{3,}       Matches at least 3 consecutive `a` characters.
                /a{3,}/ > a aa aaa aaaa aaaaaa > min 3 "a"

a{3,6}      Matches between 3 and 6 (inclusive) consecutive `a` characters.
                /a{3,6}/ > a aa aaa aaaa aaaaaaaaaa > 3 to 6 "a"

^           Matches the start of a string without consuming any characters. If multiline mode is used, this will also match immediately after a newline character.
                /^\w+/ > start of string > "start"

$           Matches the end of a string without consuming any characters. If multiline mode is used, this will also match immediately before a newline character.
                /\w+$/ > end of string > "string"

\b          Matches, without consuming any characters, immediately between a character matched by \w and a character not matched by \w (in either order). It cannot be used to separate non words from words.
                /d\b/g > word boundaries are odd > wor"d" od"d" | won't match if string is inside a word

\B          Matches, without consuming any characters, at the position between two characters matched by \w.
                /r\B/g > regex is really cool > "r"egex "r"eally | start of the word







