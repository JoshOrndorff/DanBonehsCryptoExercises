from gmpy2 import mpz, mpfr, isqrt, sqrt, floor, get_context, powmod

def N_to_pq(N):
    """
    Given N, calculates p and q  according to the
    attack listed at: https://www.coursera.org/learn/crypto/quiz/cZHEY/
    Scans for A when necessary.
    Returns (p, q)
    """
    A = isqrt(N) + 1
    while A < N:
        x = isqrt(A * A - N)
        p = A - x
        q = A + x
        if p * q == N:
            return (p, q)
        A += 1
    raise Exception("Scanning for A failed")

def modified(N):
    """
    Modified version of above for attack in part 3
    """
    A = floor(sqrt(6 * N)) + 0.5
    x = sqrt(A * A - 6 * N)
    p = (A - x) / 3
    q = (A + x) / 2
    return (p, q)

def egcd(b, n):
    '''
    solves xb + yn = g, returning g, x, y
    '''
    # Terminating case is trivial when b is zero, g = 1n
    if b == 0:
        return (n, 0, 1)

    # Recursive call
    # gcd gets passed all the way up the stack
    # magic
    # current y is previous x
    g, x, y = egcd(n % b, b)
    return g, y - n // b * x, x

def mulinv(b, n):
    '''
    egcd will solve xb + yn = 1, returning gcd, x, y
    the yn term goes away mod n, so xb = 1 which is what we want.
    To make sure x is in Zn, take the mod.
    '''
    gcd, x, y = egcd(b, n)
    if gcd != 1:
        raise Exception("There is no inverse of {} mod {}".format(b, n))
    return x % n

######### Main Program ##########
get_context().precision = 2048


# Solve Part 1 (saving result for part 4)
with open("n1.txt", "r") as f:
    N = mpz(int(f.read()))

(p, q) = N_to_pq(N)
print(min((p, q)))


# Solve Part 2
with open("n2.txt", "r") as f:
    N2 = mpz(int(f.read()))

print(min(N_to_pq(N2)))


# Solve Part 3
with open("n3.txt", "r") as f:
    N3 = mpfr(int(f.read()))

print(min(modified(N3)))


# Solve Part 4
with open("c4.txt", "r") as f:
    ct = mpz(int(f.read()))

e = 65537
phi = (p - 1) * (q - 1)
d = mulinv(e, phi)

# Decrypt the actual message (to hex encoding)
pthex = hex(powmod(ct, d, N))
msgStart = pthex.index('00') + 2

# Finally, convert to ascii
for index in range(msgStart, len(pthex), 2):
    print(chr(int(pthex[index : index + 2], 16)), end="")
print()
