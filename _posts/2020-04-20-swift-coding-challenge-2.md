---
title: 'Swift Coding Challenges: Challenge 2'
tags:
- programming
- ios
- swift
- coding-challenges
category: coding-challenges
date: 2020-04-20 15:28 +0100
---
Second one within 13 hours, good lord, that would never do.

So this challenge was to test if a string matched against the reverse of itself. Basically a palindrome checker.

This took me less time, partly because my first approach was similar to the approach for challenge 1. I used a copy of the string as a ``Character`` Array with two indexes (one counting up from 0, the other down from the max number of characters), and compared each character of the array against the one at the opposite end of the array. 

So for ```['R', 'A', 'R']```, my solution compared if the character at index ```[0]``` was equal to the one at index ```[2]```, then ```[1]``` to ```[1]```. If at any point there wasn't a match, then it would have returned ```false```, otherwise it would have returned ```true```.

So ```['R', 'A', 'R', 'E']``` would fail on the first check because ```[0]``` and ```[3]``` do not match.
However ```['b', 'o', 'y', ' ', 'y', 'o', 'b']``` would return true because ```[0] == [6]```, ```[1] == [5]```, ```[2] == [4]``` and ```[3] == [3]``` doesn't need to be tested because its obviously the same character.

A very mechanical way to do it, and there is a simpler way to do it that makes use of Swift's String class.

Anyway, this was my first attempt at the challenge

```swift
func challenge2(input: String) -> Bool {
    let arrayOfCharacters = Array(input.lowercased())
    
    //start from either end of the string, return false the first time they don't match
    var index = 0
    var reverseIndex = arrayOfCharacters.count - 1
    
    while index != reverseIndex {
        if (arrayOfCharacters[index] != arrayOfCharacters[reverseIndex]) {
            return false
        }
        reverseIndex -= 1
        index += 1
    }
    
    return true
}
```

(As an aside, to my mind index, reverseIndex and arrayOfCharacters should be highlighted the same color the whole way through the code, not in two different colors. Not sure what I can do about that.)