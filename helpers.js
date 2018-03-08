"use strict"

/**
 * Computes the bitwise XOR of the two strings given. If the strings are of unequal length, the
 * s1 will never be padded, but s2 will be padded with nulls to match s1's length
 * @param s1 The first string to be XORed (never padded)
 * @param s2 The second string to be XORed (may be padded)
 * @return The ascii encoded XOR of the two strings
 */
function xorString(s1, s2){

  // Iterate XORing char-wise
  var answer = ""
  for (var i = 0; i < s1.length; i++){
    if (i < s2.length){
      answer += String.fromCharCode(s1.charCodeAt(i) ^ s2.charCodeAt(i))
    }
    else{
      answer += s1.charAt(i)
    }
  }
  return answer
}

/**
 * Converts the given string from hex encoding to regular ascii.
 * @param hex The hex string to be converted
 * @return A regular ascii string
 */
function hex2ascii(hex){
  if (hex.length % 2 != 0){
    console.warn("hex2ascii: Hex string starting with " + hex.slice(0, 6) + "is not an even number of characters")
  }
  var answer = ""
  for (var i = 0; i < hex.length; i += 2){
    answer += String.fromCharCode(parseInt(hex.slice(i, i+2), 16))
  }
  return answer
}

/**
 * Converts the given ascii string to a hex encoding.
 * @param ascii The regular ascii string
 * @return A hex encoded version
 */
function ascii2hex(ascii){
  var answer = ""
  for (var i = 0; i < ascii.length; i++){
    answer += ascii.charCodeAt(i).toString(16)
  }
  return answer
}
