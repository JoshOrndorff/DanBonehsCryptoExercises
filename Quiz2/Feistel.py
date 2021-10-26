#! /usr/bin/env python3

def bitnot(num):
    """ unsigned bitwise not """
    numbits = 16 * 4
    return (1 << numbits) - 1 - num

print("First halves should be Logical NOT of each other.")

pairs = ((0xe86d2de2e1387ae9, 0x1792d21db645c008),
         (0x5f67abaf5210722b, 0xbbe033c00bc9330e),
         (0x7c2822ebfdc48bfb, 0x325032a9c5e2364b),
         (0x7b50baab07640c3d, 0xac343a22cea46d60))

for pair in pairs:
    print(hex(pair[0]))
    print(hex(bitnot(pair[1])))
    print()

