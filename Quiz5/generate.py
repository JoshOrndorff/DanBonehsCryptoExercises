#! /usr/bin/python3

g = int(input("generator: "))
p = int(input("modulo: "))

current = g
visited = set()
while current not in visited:
    visited.add(current)
    current = (current * g) % p

print("{}, <{}>".format(len(visited), visited))
