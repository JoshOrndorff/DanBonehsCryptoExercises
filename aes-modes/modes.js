"use strict";

document.addEventListener("DOMContentLoaded", event => {

  // Global blocksize
  var bs = 16

  document.getElementById("cbc-encrypt").addEventListener("click", cbcEncrypt)
  document.getElementById("cbc-decrypt").addEventListener("click", cbcDecrypt)
  //document.getElementById("ctr-encrypt").addEventListener("click", ctrEncrypt)
  //document.getElementById("ctr-decrypt").addEventListener("click", ctrDecrypt)

  /**
   * Grabs plaintext and key from DOM, performs encryption in CBC mode, and writes
   * ciphertext back to DOM.
   */
  function cbcEncrypt(){
    // Choose IV and initialize ctBlocks with it
    // (https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto)
    var iv = new Uint8Array(bs)
    window.crypto.getRandomValues(iv)
    var ctBlocks = [iv]

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
    //TODO
  }

  function ctrDecrypt(){
    //TODO
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
