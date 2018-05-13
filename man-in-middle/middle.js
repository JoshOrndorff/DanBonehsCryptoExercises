// Not 1099512676352 apparently?

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // Set real problem values

  document.getElementById("p").value = "13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084171"
  document.getElementById("g").value = "11717829880366207009516117596335367088558084999998952205599979459063929499736583746670572176471460312928594829675428279466566527115212748467589894601965568"
  document.getElementById("h").value = "32394751040504504435652643787280657886490975209524495278347924529719819761432925580738569379585531805328789280014947060973941085775857324523076734440203333"


  // Set example values
  /*
  Example input taken from: https://www.coursera.org/learn/crypto/discussions/weeks/5/threads/so3WOgDWEeaa4BJaeUokOQ
  x0 = 1002 and x1 = 783. They meet in the middle at 658308031. The final solution should be x=1026831x
  
  document.getElementById("p").value = "1073676287"
  document.getElementById("g").value = "1010343267"
  document.getElementById("h").value = "857348958"
  */

  // Event Listener
  document.getElementById("calc").addEventListener("click", onInputChanged)


  /**
   * Checks to see whether the three inputs are valid, and if they are, updates the output.
   */
  function onInputChanged(){
    var p = bigInt(document.getElementById("p").value)
    var g = bigInt(document.getElementById("g").value)
    var h = bigInt(document.getElementById("h").value)
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
    var b = 1024 * 1024 // 2^20 without using Math.pow
    var ginv = g.modInv(p)
    var gtob = g.modPow(b, p)

    // Initial values for both sides
    var lhs = h.multiply(1) // copy
    var rhs = bigInt(1)

    // Make the hashtable
    var table = {}
    for(var x1 = 0; x1 < b; x1++){
      table[lhs] = x1
      lhs = lhs.multiply(ginv).mod(p)
    }
    console.log("table finished")

    // Lookup items in the hashtable
    for(var x0 = 0; x0 < b; x0++){
      if (table[rhs] !== undefined){
        // set x1 to the right thing (It was left at b from table generation)
        x1 = table[rhs]
        break
      }
      rhs = rhs.multiply(gtob).mod(p)
    }

    // Calculate and return the answer
    var x = bigInt(x0).multiply(b).add(x1).mod(p)
    console.log("final answer, x: " + x)
    return x
  }

})
