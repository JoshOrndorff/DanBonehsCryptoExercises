"use strict";

document.addEventListener("DOMContentLoaded", function(event){

  // Globals for four textareas
  var hex1 = document.getElementById("hex1")
  var hex2 = document.getElementById("hex2")
  var ascii1 = document.getElementById("ascii1")
  var ascii2 = document.getElementById("ascii2")

  // Attach event listeners to both ciphertext boxes
  hex1.addEventListener("input", ()=>update("hex", 1))
  hex2.addEventListener("input", ()=>update("hex", 2))
  ascii1.addEventListener("input", ()=>update("ascii", 1))
  ascii2.addEventListener("input", ()=>update("ascii", 2))

  /**
   * Updates the textboxes whenever any of them changes and then
   * displays the XORed text.
   * @param enc Which encoding changed "ascii" or "hex"
   * @param num Which of the inputs changed 1, or 2
   */
  function update(enc, num){
    // Update whichever box is necessary
    if (enc === "hex"){
      var hexstr = document.getElementById("hex" + num).value
      document.getElementById("ascii" + num).value = hex2ascii(hexstr)
    }
    else{
      var asciistr = document.getElementById("ascii" + num).value
      document.getElementById("hex" + num).value = ascii2hex(asciistr)
    }

    var XORed = xorString(ascii1.value, ascii2.value)
    var final = ""

    for(var i = 0; i < XORed.length; i++){
      var code = XORed.charCodeAt(i)
      if (code < 32){
        final += "<span class=\"ctrl\">.</span>"
      }
      else if (code < 64){
        final += "<span class=\"num\">" + XORed.charAt(i) + "</span>"
      }
      else if (code < 96){
        final += "<span class=\"upper\">" + XORed.charAt(i) + "</span>"
      }
      else if (code < 128){
        final += "<span class=\"lower\">" + XORed.charAt(i) + "</span>"
      }
      else {
        final += "<span class=\"ext\">" + XORed.charAt(i) + "</span>"
      }
    }

    document.getElementById("result-p").innerHTML = final
  }

  /**
   * Computes the bitwise XOR of the two strings given. If the strings are of unequal length, the longer is truncated.
   * @param s1 The first string to be XORed
   * @param s2 The second string to be XORed
   * @return The ascii encoded XOR of the two strings
   */
  function xorString(s1, s2){
    // Slice the longer string down to the shorter length
    if (s1.length > s2.length){
      s1 = s1.slice(0, s2.length)
    }
    else{
      s2 = s2.slice(0, s1.length)
    }

    // Now XOR character by character
    var answer = ""
    for (var i = 0; i < s1.length; i++){
      answer += String.fromCharCode(s1.charCodeAt(i) ^ s2.charCodeAt(i))
    }
    return answer

  }

  /**
   * Converts the given string from hex encoding to regular ascii.
   * @param hex The hex string to be converted
   * @return A regular ascii string
   */
  function hex2ascii(hex){
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
})
