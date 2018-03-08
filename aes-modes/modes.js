/*

CTR Mode is not working correctly. My suspicion is that the pad is not being generated correctly. Maybe a better approach would be to use an actual int as IV (gotta figure out how to get a random one) and then make it into bytes by toString-ing it to a hex string and then using aesjs.utils.hex.toBytes.

*/

"use strict";

document.addEventListener("DOMContentLoaded", event => {

  // Global blocksize
  var bs = 16

  document.getElementById("cbc-encrypt").addEventListener("click", cbcEncrypt)
  document.getElementById("cbc-decrypt").addEventListener("click", cbcDecrypt)
  document.getElementById("ctr-encrypt").addEventListener("click", ctrEncrypt)
  document.getElementById("ctr-decrypt").addEventListener("click", ctrDecrypt)

  /**
   * Grabs plaintext and key from DOM, performs encryption in CBC mode, and writes
   * ciphertext back to DOM.
   */
  function cbcEncrypt(){
    // Initialize ctBlocks with a random initialization vector
    var ctBlocks = [getIV()]

    // Grab pt and key from DOM
    var pt = aesjs.utils.utf8.toBytes(document.getElementById("cbc-pt").value)
    var key = aesjs.utils.hex.toBytes(document.getElementById("cbc-key").value)

    // Pad and split into blocks
    var ptBlocks = blockify(pt, true)

    // Loop through encrypting each block
    var aes = new aesjs.AES(key)
    for (var i = 0; i < ptBlocks.length; i++){
      var xored = xorBlocks(ptBlocks[i], ctBlocks[i])
      var ctBlock = aes.encrypt(xored)
      ctBlocks.push(ctBlock)
    }

    // Reassemble blocks
    var ct = deblockify(ctBlocks, false)

    // Write ciphertext to DOM
    document.getElementById("cbc-ct").value = aesjs.utils.hex.fromBytes(ct)
  }

  /**
   * Grabs ciphertext and key from DOM, performs decryption in CBC mode, and writes
   * plaintext back to DOM.
   */
  function cbcDecrypt(){
    // Grab iv, ct, and key from DOM and convert to blocks
    var key = aesjs.utils.hex.toBytes(document.getElementById("cbc-key").value)
    var ct = aesjs.utils.hex.toBytes(document.getElementById("cbc-ct").value)
    var ctBlocks = blockify(ct, false)

    // Loop through blocks decrypting (don't do 0th block because it is IV)
    var aes = new aesjs.AES(key)
    var ptBlocks = []
    for (var i = ctBlocks.length - 1; i > 0; i--){
      var decr = aes.decrypt(ctBlocks[i])
      var ptBlock = xorBlocks(decr, ctBlocks[i - 1])
      ptBlocks[i - 1] = ptBlock // Shift them left one because we won't decrypt IV
    }

    // Reassemble blocks, remove padding, and write to DOM
    var pt = deblockify(ptBlocks, true)
    document.getElementById("cbc-pt").value = aesjs.utils.utf8.fromBytes(pt)
  }

  function ctrEncrypt(){
    // Generate a random initialization vector and copy it into ct
    var iv = getIV()
    var ct = aesjs.utils.utf8.fromBytes(iv)

    // Grab pt and key from DOM
    var pt = document.getElementById("ctr-pt").value
    var key = aesjs.utils.hex.toBytes(document.getElementById("ctr-key").value)

    // Generate pad at least as long as plaintext
    var aes = new aesjs.AES(key)
    var pad = ""
    while(pad.length < pt.length){
      incBytes(iv)
      pad += aesjs.utils.utf8.fromBytes(aes.encrypt(iv))
    }

    // Encrypt by XOR
    ct += xorString(pt, pad)

    // Write ciphertext to DOM
    document.getElementById("ctr-ct").value = ascii2hex(ct)
  }

  function ctrDecrypt(){
    // Grab ctr, ct, and key from DOM
    var key = aesjs.utils.hex.toBytes(document.getElementById("ctr-key").value)
    var ct = document.getElementById("ctr-ct").value
    var ctr = aesjs.utils.hex.toBytes(ct.slice(0, bs * 2)) //2 hex chars per byte
    ct = hex2ascii(ct.slice(32))

    // Generate pad at least as long as plaintext
    var aes = new aesjs.AES(key)
    var pad = ""
    while(pad.length < ct.length){
      incBytes(ctr)
      pad += aesjs.utils.utf8.fromBytes(aes.encrypt(ctr))
    }

    // Decrypt by XOR and write to DOM
    var pt = xorString(ct, pad)
    document.getElementById("ctr-pt").value = pt
  }

  /**
   * Increments a Byte array as if it were a single number.
   * @param bytes The byte array to be incremented
   */
  function incBytes(bytes){
    for (var i = bytes.length - 1; i > 0; i--){
      bytes[i]++
      // If no overflow, we're done. But if overflow, go again to handle carry
      if (bytes[i] !== 0){
        break
      }
    }
  }

  /**
   * Generates random initialization vector of proper block size using OS's random features.
   * (See the global bs variable; 16 bytes for AES)
   * https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto
   * @return The random vector
   */
  function getIV(){
    var iv = new Uint8Array(bs)
    window.crypto.getRandomValues(iv)
    return iv
  }

  /**
   * XORs two blocks. A block is an Array-like of size bs.
   * (See the global bs variable; 16 bytes for AES)
   * @param a The first block
   * @param b The second block
   * @return The results
   */
  function xorBlocks(a, b){
    if (a.length !== bs || b.length !== bs){
      console.warn("Attempting to XOR blocks of incorrect blocksize.")
    }

    var result = []
    for (var i = 0; i < bs; i++){
      result[i] = a[i] ^ b[i]
    }

    return result
  }

  /**
   * Converts a 1D Array-like of bytes to 2D, optionally adding padding
   * according to RFC 1432. Blocksize is taken from global `bs`
   * @param stream The data to pad and blockify
   * @param pad Whether or not to add padding
   * @return The 2D of Blocks of bytes.
   */
  function blockify(stream, pad){
    stream = Array.from(stream)
    // Compute padding
    if (pad){
      var nPadBytes = bs - stream.length % bs
      for (var i = nPadBytes; i > 0; i --){
        stream.push(nPadBytes)
      }
    }

    // Chop into blocks
    var blocks = []
    for (var i = 0; i < stream.length; i += bs){
      var block = stream.slice(i, i + bs)
      blocks.push(block)
    }

    return blocks
  }

  /**
   * Convers a 2D Array-like of blocks to 1D, optionally removing padding
   * according to RFC 1432. Blocksize is taken from global `bs`
   * @param blocks
   * @param pad Whether or not to remove padding
   * @return The 1D of bytes
   */
  function deblockify(blocks, pad){
    // Reassemble blocks
    var stream = []
    for (var block of blocks){
      for (var byte of block){
        stream.push(byte)
      }
    }

    // Remove padding
    if (pad){
      var nPadBytes = stream[stream.length - 1]
      stream = stream.slice(0, -nPadBytes)
    }

    return stream
  }

})
