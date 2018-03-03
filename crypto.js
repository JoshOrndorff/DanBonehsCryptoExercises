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
      final += decorate(XORed.charAt(i), true)
        final += decorate(XORed.charAt(++i), false)
    }

    document.getElementById("result-p").innerHTML = final
  }

  /**
   * Decorates a character with an HTML span based on its ascii code and
   * whether the caller requests it be highlighted.
   * @param char The character to be annotated
   * @param highlight Whether the character should be highlighted
   * @return A string like <span class="num highlight">5</span>
   */
  function decorate(char, highlight){
    var classes
    var renderChar = char
    var code = char.charCodeAt(0)

    // Determine the right class for each character
    if (code < 32){
      classes = "ctrl"
      renderChar = "." // because control chars are non-printing
    }
    else if (code < 64){
      classes = "num"
    }
    else if (code < 96){
      classes = "upper"
    }
    else if (code < 128){
      classes = "lower"
    }
    else {
      classes = "ext"
    }

    // Highlight if necessary
    if (highlight){
      classes += " highlight"
    }

    return '<span class="' + classes + '">' + renderChar + '</span>'

  }

  /**
   * Computes the bitwise XOR of the two strings given. If the strings are of unequal length, the
   * shorter string is right-padded with nulls. That is, the end of the longer string remains
   * unchanged.
   * @param s1 The first string to be XORed
   * @param s2 The second string to be XORed
   * @return The ascii encoded XOR of the two strings
   */
  function xorString(s1, s2){
    // Determine which string is shorter
    var shorter = s1.length < s2.length ? s1 : s2
    var longer  = s1.length < s2.length ? s2 : s1

    // Iterate XORing char-wise
    var answer = ""
    for (var i = 0; i < longer.length; i++){
      if (i < shorter.length){
        answer += String.fromCharCode(s1.charCodeAt(i) ^ s2.charCodeAt(i))
      }
      else{
        answer += longer.charAt(i)
      }
    }
    return answer
  }

  /**
   * Computes the XOR or a text with a crib at the specified index. If the index is such that
   * the crib is partly or fully beyond the end of the text, the overhanging part of the crib
   * is not used.
   * @param text The text over which the crib is being dragged
   * @param crib The crib to XOR with the specified part of the text
   * @param start The index where the crib should be aligned with the text
   * @return The original text altered only at the characters that align with the crib
   */
  function xorCrib(text, crib, start){

    // Grab initial uncribbed part
    var answer = text.slice(0, start)

    // Do the actual XORing
    var aligned = text.slice(start, start + crib.length)
    crib = crib.slice(0, aligned.length)
    answer += xorString(aligned, crib)

    // Grab final uncribbed part
    answer += text.slice(start + crib.length)
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
