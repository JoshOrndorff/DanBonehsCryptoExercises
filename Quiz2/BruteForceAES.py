#! /usr/bin/env python3

budget = 4 * 10 ** 12  # 4 trillion dollars
pcPrice = 200          # 200 dollars
singlePcRate = 10 ** 9 # 1 billion keys per secod
nTotalKeys = 2 ** 128

nPcs = budget // pcPrice
totalRate = nPcs * singlePcRate

totalSeconds = nTotalKeys / totalRate
totalYears = totalSeconds / 60 / 60 / 24 / 356.25

print(totalYears)
