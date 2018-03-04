"use strict";

document.addEventListener("DOMContentLoaded", function(event){

  // Globals for DOM input
  var cts
  var crib
  var cribLocation = 0
  var ctReference = 0
  var resultElem = document.getElementById("result-p")

  // Scan and render once in case browser has stored input from last session
  scan();
  render();

  // Attach event listeners
  document.getElementById("cts") .addEventListener("input", ()=>{scan(); render()})
  document.getElementById("crib").addEventListener("input", ()=>{scan(); render()})

  document.getElementById("crib-left") .addEventListener("click", ()=>{cribLocation--; render()})
  document.getElementById("crib-right").addEventListener("click", ()=>{cribLocation++; render()})
  document.getElementById("ref-up")    .addEventListener("click", ()=>{updateRef(-1);  render()})
  document.getElementById("ref-down")  .addEventListener("click", ()=>{updateRef(+1);  render()})

  /**
   * Reads input from the DOM and populates global variables
   */
  function scan(){
    cts  = document.getElementById("cts").value.split("\n").filter(x=>x!=="").map(hex2ascii)
    crib = document.getElementById("crib").value
  }

  /**
   * Updates the ctReference. And changes the crib to match the new reference.
   * @param delta How much to chage the ctReference by.
   */
  function updateRef(delta){
    var oldRef = ctReference

    // Do the bounded reference update.
    ctReference += delta
    if (ctReference < 0){
      ctReference = 0
    }
    if (ctReference >= cts.length){
      ctReference = cts.length - 1
    }

    // Change the crib
    var newCt = cts[ctReference].slice(cribLocation, cribLocation + crib.length)
    var oldCt = cts[oldRef]     .slice(cribLocation, cribLocation + crib.length)
    var newCrib = xorString(xorString(newCt, oldCt), crib)

    document.getElementById("crib").value = newCrib
    crib = newCrib
  }

  /**
   * Updates the UI when the user interacts with the DOM.
   */
  function render(enc, num){

    // Loop through each ct and xor with the reference
    var result = ""
    for (var ct of cts){
      var XORed = xorString(ct, cts[ctReference])
      XORed = xorCrib(XORed, crib, cribLocation)

      for(var i = 0; i < XORed.length; i++){
        // Highlight iff i falls within the crib location
        result += decorate(XORed.charAt(i), i >= cribLocation && i < cribLocation + crib.length)
      }

      result += "<br />"
    }
  resultElem.innerHTML = result
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
})
