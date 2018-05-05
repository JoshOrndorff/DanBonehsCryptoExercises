"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // Event Listeners
  document.getElementById("p").addEventListener("input", onInputChanged)
  document.getElementById("h").addEventListener("input", onInputChanged)
  document.getElementById("g").addEventListener("input", onInputChanged)


  /**
   * Checks to see whether the three inputs are valid, and if they are, updates the output.
   */
  function onInputChanged(){
    var p = parseInt(document.getElementById("p").value, 10)
    var g = parseInt(document.getElementById("g").value, 10)
    var h = parseInt(document.getElementById("h").value, 10)

    if(isNaN(p) || isNaN(g) || isNaN(h)){
      return
    }
    //TODO confirm p is prime

    // Inputs validate. Go ahead and run the attack.
    document.getElementById("x").value = meetInMiddle(p, g, h)
  }


  /**
   * Performs the meet in the middle attack by building a hashmap for the left side
   * and searching against it for the right side.
   * @param p The prime
   * @param g g
   * @param h h
   * @return The exponent value, x
   */
  function meetInMiddle(p, g, h){
    return "here"
  }

})
