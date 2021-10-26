ct = bytearray.fromhex("20814804c1767293b99f1d9cab3bc3e7ac1e37bfb15599e5f40eef805488281d")

# ciphertext is just two blocks -- IV and data
#  IV : 20814804c1767293b99f1d9cab3bc3e7
# data: ac1e37bfb15599e5f40eef805488281d
# data: P a y   B o b   1 0 0 $

iv   = ct[0 :16]
data = ct[16:32]
pt = "Pay Bob 100$"

# Figure out where the desired character is
index = pt.index("1")

# XOR The same location in IV
print("Original IV: {}".format(iv))
iv[index] = iv[index] ^ ord('1') ^ ord('5')
print("Updated  IV: {}".format(iv))

# Print the final ciphertext
newct = iv + data
print()
print("Original ct: {}".format(ct.hex()))
print("Updated  ct: {}".format(newct.hex()))
