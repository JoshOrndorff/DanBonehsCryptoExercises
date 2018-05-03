import requests

baseurl = "http://crypto-class.appspot.com/po?er="
ct = bytes.fromhex("f20bdba6ff29eed7b046d1df9fb7000058b1ffb4210a580f748b4ac714c001bd4a61044426fb515dad3f21f18aa577c0bdf302936266926ff37dbf7035d5eeb4")



def rxor(s1, s2):
    """ XORs two right-aligned strings. Extends shorter string by prepending 0's """
    # Make sure s1 is shorter
    if len(s1) > len(s2):
        s1, s2 = s2, s1

    # Prepend 0s
    padded = bytearray(len(s2) - len(s1))
    padded.extend(s1)

    # Return XOR
    return bytearray([n ^ m for (n, m) in zip(padded, s2)])


def generate_pad(n):
    """ Generates a valid pad of the form 0x01, 0x0202, 0x030303, etc
    Returns generated pad expressed as bytes """

    if n > 16:
        raise Exception("pad should not exceed block size")

    return bytes([n] * n)


def make_guess(guess):
    """ Using the supplied guess, constructs a proper request, sends it to the
    server and reports whether the guess was correct."""

    # Do the proper XORing
    mask = rxor(guess, generate_pad(len(guess)))
    mask.extend([0]*16) # Offest by one block
    query = rxor(mask, ct)

    # Send request
    code = call_oracle(baseurl + query.hex())
    if code == 403:
        return False # Invalid pad. Doesn't even decrypt. Guess is wrong.
    elif code == 404:
        return True  # Decrypted to check MAC. Guess is right.
    else:
        raise Exception("Didn't understand oracle's response: {}".format(code))

def call_oracle(q):
    """ Query the oracle with the given string. Return http code."""
    r = requests.get(q)
    return r.status_code


def discover_block(partialCt):
    """ Takes the first several blocks of an intercepted ciphertext, and
    uses the padding oracle to discover the contents of the last block.
    Returns a bytearray of the last block's contents. """

    known = bytearray()

    # Loop to find the correct character
    i = 0 #TODO It would be nice to loop through most frequent characters first.
    while len(known) < 16:
        guess = bytearray([i])
        guess.extend(known)
        print("{}: {}".format(i, guess))
        if make_guess(guess):
            known.insert(0, i)
            print("Known so far: {}".format(known))
            i = 0
        else:
            i += 1

    return known


############ Main #############

print("Intercepted ciphertext is {} bytes ({} blocks).".format(len(ct), len(ct)//16))

# Cut off last block of ciphertext (it already has a valid pad)
#TODO Figure out how to handle this last block
ct = ct[0:-16]
print("Truncated ciphertext is {} bytes ({} blocks).".format(len(ct), len(ct)//16))

answer = bytearray()

# Loop through the intercepted ciphertext one block at a time
# But don't do the IV
while len(ct) > 16:
    newlyDiscoveredBlock = discover_block(ct)
    newlyDiscoveredBlock.extend(answer)
    answer = newlyDiscoveredBlock

# Print result
print(answer)


############ Tests ############
'''
# Test generate_pad
for i in range(15):
    print(generate_pad(i))
'''

'''
# Test rxor
print(rxor(bytes.fromhex('01020304'), generate_pad(1)))
print(rxor(bytes.fromhex("090905"), generate_pad(0)))
print(rxor(bytes([]), bytes([])))
'''

'''
#Test make_guess
#TODO
'''
