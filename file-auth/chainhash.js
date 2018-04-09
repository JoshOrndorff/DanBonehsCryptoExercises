"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // File chunks are 1kb
  var chunkSize = 1024

  // Respond to the user picking a file
  document.getElementById("file").addEventListener("change", e => {

    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);

    // When the reader finishes, do the hasing
    reader.addEventListener("load", e => {
      var answer = chainHash(reader.result)
      document.getElementById("hash").value = answer
    })
  })

  /**
   * Takes in an ArrayBuffer representing the file data, splits it into blocks, computes the chain hash,
   * and returns the hash of the first block.
   * @param buffer The Array buffer of the file
   * @return The hash of (first block || second block's hash)
   */
  function chainHash(buffer){
    // Split into blocks
    var blocks = []
    for(var start = 0; start < buffer.byteLength; start += chunkSize){
      blocks.push(buffer.slice(start, start + chunkSize))
    }

    // Do the chain hashing
    console.log("About to start chainhashing. Number of blocks: " + blocks.length)
    var lastBlock = blocks[blocks.length - 1]
    var curHash = sha256.arrayBuffer(lastBlock)
    for(var i = blocks.length - 2; i >= 0; i--){
      var augBlock = concatBuffers(blocks[i], curHash)
      curHash = sha256.arrayBuffer(augBlock)
    }

    // Give back the first augmented block's hash
    return buf2hex(curHash)
  }


  /**
   * Concatenates ArrayBuffers representing a file chunk and a hash.
   * Based on: https://stackoverflow.com/q/10786128/4184410
   * @param chunk The file chunk as an ArrayBuffer (1024 bytes)
   * @param nextHash The next chunk's hash as an ArrayBuffer (32 bytes)
   * @return A newly created ArrayBuffer of the concatenation
   */
  function concatBuffers(chunk, nextHash){
    var augmented = new Uint8Array(1056); // 1024 from chunk + 32 from hash
    augmented.set(new Uint8Array(chunk), 0);
    augmented.set(new Uint8Array(nextHash), 1024);
    return augmented.buffer;
  }

  /**
   * Converts an ArrayBuffer to a hex string.
   * Taken from: https://stackoverflow.com/questions/40031688/javascript-arraybuffer-to-hex
   * @param buffer An ArrayBuffer
   * @return A hex string of the data in the buffer
   */
  function buf2hex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }

})
