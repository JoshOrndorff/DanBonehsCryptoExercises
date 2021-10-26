#! /usr/bin/env python3

messages = [
'The most direct computation would be for the enemy to try all 2^r possible keys, one by one.',
'We see immediately that one needs little information to begin to break down the process.',
'In this letter I make some remarks on a general principle relevant to enciphering in general and my machine.',
'To consider the resistance of an enciphering process to being broken we should assume that at same times the enemy knows everything but the key being used and to break it needs only discover the key from this information.']

for m in messages:
    print(m[0:10] + "... : " + str(len(m)) + " characters")
