#! /usr/bin/python3

from sys import argv

a = int(argv[1])
b = int(argv[2])

print("{} div {} = {} r {}".format(a, b, a//b, a%b))
