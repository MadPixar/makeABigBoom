/********************base64********************/
const base64js = (function() {
  const lookup = []
  const revLookup = []
  const Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

  const code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  for (let i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications
  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63

  function getLens(b64) {
    const len = b64.length

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    let validLen = b64.indexOf('=')
    if (validLen === -1) validLen = len

    const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4)

    return [validLen, placeHoldersLen]
  }

  // base64 is 4/3 + up to two characters of the original data
  function byteLength(b64) {
    const lens = getLens(b64)
    const validLen = lens[0]
    const placeHoldersLen = lens[1]
    return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
  }

  function _byteLength(b64, validLen, placeHoldersLen) {
    return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
  }

  function toByteArray(b64) {
    let tmp
    const lens = getLens(b64)
    const validLen = lens[0]
    const placeHoldersLen = lens[1]

    const arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

    let curByte = 0

    // if there are placeholders, only get up to the last complete 4 chars
    const len = placeHoldersLen > 0 ? validLen - 4 : validLen

    let i
    for (i = 0; i < len; i += 4) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)]
      arr[curByte++] = (tmp >> 16) & 0xff
      arr[curByte++] = (tmp >> 8) & 0xff
      arr[curByte++] = tmp & 0xff
    }

    if (placeHoldersLen === 2) {
      tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
      arr[curByte++] = tmp & 0xff
    }

    if (placeHoldersLen === 1) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2)
      arr[curByte++] = (tmp >> 8) & 0xff
      arr[curByte++] = tmp & 0xff
    }

    return arr
  }

  function tripletToBase64(num) {
    return lookup[(num >> 18) & 0x3f] + lookup[(num >> 12) & 0x3f] + lookup[(num >> 6) & 0x3f] + lookup[num & 0x3f]
  }

  function encodeChunk(uint8, start, end) {
    let tmp
    const output = []
    for (let i = start; i < end; i += 3) {
      tmp = ((uint8[i] << 16) & 0xff0000) + ((uint8[i + 1] << 8) & 0xff00) + (uint8[i + 2] & 0xff)
      output.push(tripletToBase64(tmp))
    }
    return output.join('')
  }

  function fromByteArray(uint8) {
    let tmp
    const len = uint8.length
    const extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    const parts = []
    const maxChunkLength = 16383 // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (let i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength))
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1]
      parts.push(lookup[tmp >> 2] + lookup[(tmp << 4) & 0x3f])
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1]
      parts.push(lookup[tmp >> 10] + lookup[(tmp >> 4) & 0x3f] + lookup[(tmp << 2) & 0x3f])
    }

    return parts.join('')
  }
  return {
    byteLength,
    toByteArray,
    fromByteArray
  }
})()
/**************************sm4************************ */
if (!Array.prototype.fill) {
  Object.defineProperty(Array.prototype, 'fill', {
    value: function(value) {
      // Steps 1-2.
      if (this === null) {
        throw new TypeError('this is null or not defined')
      }

      const O = Object(this)

      // Steps 3-5.
      const len = O.length >>> 0

      // Steps 6-7.
      // eslint-disable-next-line
      const start = arguments[1]
      const relativeStart = start >> 0

      // Step 8.
      let k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len)

      // Steps 9-10.
      // eslint-disable-next-line
      const end = arguments[2]
      const relativeEnd = end === undefined ? len : end >> 0

      // Step 11.
      const final = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len)

      // Step 12.
      while (k < final) {
        O[k] = value
        k++
      }

      // Step 13.
      return O
    }
  })
}

const Sbox = [
  0xd6,
  0x90,
  0xe9,
  0xfe,
  0xcc,
  0xe1,
  0x3d,
  0xb7,
  0x16,
  0xb6,
  0x14,
  0xc2,
  0x28,
  0xfb,
  0x2c,
  0x05,
  0x2b,
  0x67,
  0x9a,
  0x76,
  0x2a,
  0xbe,
  0x04,
  0xc3,
  0xaa,
  0x44,
  0x13,
  0x26,
  0x49,
  0x86,
  0x06,
  0x99,
  0x9c,
  0x42,
  0x50,
  0xf4,
  0x91,
  0xef,
  0x98,
  0x7a,
  0x33,
  0x54,
  0x0b,
  0x43,
  0xed,
  0xcf,
  0xac,
  0x62,
  0xe4,
  0xb3,
  0x1c,
  0xa9,
  0xc9,
  0x08,
  0xe8,
  0x95,
  0x80,
  0xdf,
  0x94,
  0xfa,
  0x75,
  0x8f,
  0x3f,
  0xa6,
  0x47,
  0x07,
  0xa7,
  0xfc,
  0xf3,
  0x73,
  0x17,
  0xba,
  0x83,
  0x59,
  0x3c,
  0x19,
  0xe6,
  0x85,
  0x4f,
  0xa8,
  0x68,
  0x6b,
  0x81,
  0xb2,
  0x71,
  0x64,
  0xda,
  0x8b,
  0xf8,
  0xeb,
  0x0f,
  0x4b,
  0x70,
  0x56,
  0x9d,
  0x35,
  0x1e,
  0x24,
  0x0e,
  0x5e,
  0x63,
  0x58,
  0xd1,
  0xa2,
  0x25,
  0x22,
  0x7c,
  0x3b,
  0x01,
  0x21,
  0x78,
  0x87,
  0xd4,
  0x00,
  0x46,
  0x57,
  0x9f,
  0xd3,
  0x27,
  0x52,
  0x4c,
  0x36,
  0x02,
  0xe7,
  0xa0,
  0xc4,
  0xc8,
  0x9e,
  0xea,
  0xbf,
  0x8a,
  0xd2,
  0x40,
  0xc7,
  0x38,
  0xb5,
  0xa3,
  0xf7,
  0xf2,
  0xce,
  0xf9,
  0x61,
  0x15,
  0xa1,
  0xe0,
  0xae,
  0x5d,
  0xa4,
  0x9b,
  0x34,
  0x1a,
  0x55,
  0xad,
  0x93,
  0x32,
  0x30,
  0xf5,
  0x8c,
  0xb1,
  0xe3,
  0x1d,
  0xf6,
  0xe2,
  0x2e,
  0x82,
  0x66,
  0xca,
  0x60,
  0xc0,
  0x29,
  0x23,
  0xab,
  0x0d,
  0x53,
  0x4e,
  0x6f,
  0xd5,
  0xdb,
  0x37,
  0x45,
  0xde,
  0xfd,
  0x8e,
  0x2f,
  0x03,
  0xff,
  0x6a,
  0x72,
  0x6d,
  0x6c,
  0x5b,
  0x51,
  0x8d,
  0x1b,
  0xaf,
  0x92,
  0xbb,
  0xdd,
  0xbc,
  0x7f,
  0x11,
  0xd9,
  0x5c,
  0x41,
  0x1f,
  0x10,
  0x5a,
  0xd8,
  0x0a,
  0xc1,
  0x31,
  0x88,
  0xa5,
  0xcd,
  0x7b,
  0xbd,
  0x2d,
  0x74,
  0xd0,
  0x12,
  0xb8,
  0xe5,
  0xb4,
  0xb0,
  0x89,
  0x69,
  0x97,
  0x4a,
  0x0c,
  0x96,
  0x77,
  0x7e,
  0x65,
  0xb9,
  0xf1,
  0x09,
  0xc5,
  0x6e,
  0xc6,
  0x84,
  0x18,
  0xf0,
  0x7d,
  0xec,
  0x3a,
  0xdc,
  0x4d,
  0x20,
  0x79,
  0xee,
  0x5f,
  0x3e,
  0xd7,
  0xcb,
  0x39,
  0x48
]
const CK = [
  0x00070e15,
  0x1c232a31,
  0x383f464d,
  0x545b6269,
  0x70777e85,
  0x8c939aa1,
  0xa8afb6bd,
  0xc4cbd2d9,
  0xe0e7eef5,
  0xfc030a11,
  0x181f262d,
  0x343b4249,
  0x50575e65,
  0x6c737a81,
  0x888f969d,
  0xa4abb2b9,
  0xc0c7ced5,
  0xdce3eaf1,
  0xf8ff060d,
  0x141b2229,
  0x30373e45,
  0x4c535a61,
  0x686f767d,
  0x848b9299,
  0xa0a7aeb5,
  0xbcc3cad1,
  0xd8dfe6ed,
  0xf4fb0209,
  0x10171e25,
  0x2c333a41,
  0x484f565d,
  0x646b7279
]
const FK = [0xa3b1bac6, 0x56aa3350, 0x677d9197, 0xb27022dc]

/**
 * 将字符串转为Unicode数组
 * @example "1234" => [49, 50, 51, 52];
 * @param {String} str 要转换的字符串
 * @returns {Number[]} 转换后的数组
 */
const stringToArray = function(str) {
  if (!/string/gi.test(Object.prototype.toString.call(str))) {
    str = JSON.stringify(str)
  }
  return unescape(encodeURIComponent(str))
    .split('')
    .map(function(val) {
      return val.charCodeAt()
    })
}
const hexString2Array = function(str) {
  const result = []
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16))
    str = str.substring(2, str.length)
  }

  return result
}
const rotateLeft = function(x, y) {
  return (x << y) | (x >>> (32 - y))
}

const tauTransform = function(a) {
  return (
    (Sbox[(a >>> 24) & 0xff] << 24) | (Sbox[(a >>> 16) & 0xff] << 16) | (Sbox[(a >>> 8) & 0xff] << 8) | Sbox[a & 0xff]
  )
}

const tTransform1 = function(z) {
  const b = tauTransform(z)
  const c = b ^ rotateLeft(b, 2) ^ rotateLeft(b, 10) ^ rotateLeft(b, 18) ^ rotateLeft(b, 24)
  return c
}

const tTransform2 = function(z) {
  const b = tauTransform(z)
  const c = b ^ rotateLeft(b, 13) ^ rotateLeft(b, 23)
  return c
}

const EncryptRoundKeys = function(key) {
  const keys = []
  const mk = [
    (key[0] << 24) | (key[1] << 16) | (key[2] << 8) | key[3],
    (key[4] << 24) | (key[5] << 16) | (key[6] << 8) | key[7],
    (key[8] << 24) | (key[9] << 16) | (key[10] << 8) | key[11],
    (key[12] << 24) | (key[13] << 16) | (key[14] << 8) | key[15]
  ]

  const k = new Array(36)
  k[0] = mk[0] ^ FK[0]
  k[1] = mk[1] ^ FK[1]
  k[2] = mk[2] ^ FK[2]
  k[3] = mk[3] ^ FK[3]

  for (let i = 0; i < 32; i++) {
    k[i + 4] = k[i] ^ tTransform2(k[i + 1] ^ k[i + 2] ^ k[i + 3] ^ CK[i])
    keys[i] = k[i + 4]
  }

  return keys
}

const UINT8_BLOCK = 16
const getChainBlock = function(arr, baseIndex) {
  baseIndex = baseIndex || 0
  const block = [
    (arr[baseIndex] << 24) | (arr[baseIndex + 1] << 16) | (arr[baseIndex + 2] << 8) | arr[baseIndex + 3],
    (arr[baseIndex + 4] << 24) | (arr[baseIndex + 5] << 16) | (arr[baseIndex + 6] << 8) | arr[baseIndex + 7],
    (arr[baseIndex + 8] << 24) | (arr[baseIndex + 9] << 16) | (arr[baseIndex + 10] << 8) | arr[baseIndex + 11],
    (arr[baseIndex + 12] << 24) | (arr[baseIndex + 13] << 16) | (arr[baseIndex + 14] << 8) | arr[baseIndex + 15]
  ]
  return block
}

const doBlockCrypt = function(blockData, roundKeys) {
  const xBlock = new Array(36)
  blockData.forEach(function(val, index) {
    xBlock[index] = val
  })
  // loop to process 32 rounds crypt
  for (let i = 0; i < 32; i++) {
    xBlock[i + 4] = xBlock[i] ^ tTransform1(xBlock[i + 1] ^ xBlock[i + 2] ^ xBlock[i + 3] ^ roundKeys[i])
  }
  const yBlock = [xBlock[35], xBlock[34], xBlock[33], xBlock[32]]
  return yBlock
}

const padding = function(originalBuffer) {
  if (originalBuffer === null) {
    return null
  }
  const paddingLength = UINT8_BLOCK - (originalBuffer.length % UINT8_BLOCK)
  const paddedBuffer = new Array(originalBuffer.length + paddingLength)

  originalBuffer.forEach(function(val, index) {
    paddedBuffer[index] = val
  })
  paddedBuffer.fill(paddingLength, originalBuffer.length)
  return paddedBuffer
}

const dePadding = function(paddedBuffer) {
  if (paddedBuffer === null) {
    return null
  }
  const paddingLength = paddedBuffer[paddedBuffer.length - 1]
  const originalBuffer = paddedBuffer.slice(0, paddedBuffer.length - paddingLength)
  return originalBuffer
}

const check = function(name, str) {
  if (!str || str.length !== 32) {
    return false
  }
  return true
}

/**
 * CBC加密模式
 * @example encrypt_cbc("1234", "1234567890123456", "1234567890123456") => "K++iI4IhSGMnEJZT/jv1ow=="
 * @param {any} plaintext 要加密的数据
 * @param {String} key
 * @param {String} iv
 * @param {String} mode base64 | "text"
 * @returns {String} 加密后的字符串
 */
const encrypt_cbc = function(plaintext, key, iv, mode) {
  mode = mode || 'base64'

  if (!check('iv', iv) && !check('key', key)) {
    return
  }

  const encryptRoundKeys = EncryptRoundKeys(hexString2Array(key))
  // ["202,32,96,77,41,149,132,147,129,83,59,218,172,23,93,104"]
  const plainByteArray = stringToArray(plaintext)
  const padded = padding(plainByteArray)
  const blockTimes = padded.length / UINT8_BLOCK
  const outArray = []
  // init chain with iv (transform to uint32 block)
  let chainBlock = getChainBlock(hexString2Array(iv))
  for (let i = 0; i < blockTimes; i++) {
    // extract the 16 bytes block data for this round to encrypt
    const roundIndex = i * UINT8_BLOCK
    const block = getChainBlock(padded, roundIndex)
    // xor the chain block
    chainBlock[0] = chainBlock[0] ^ block[0]
    chainBlock[1] = chainBlock[1] ^ block[1]
    chainBlock[2] = chainBlock[2] ^ block[2]
    chainBlock[3] = chainBlock[3] ^ block[3]
    // use chain block to crypt
    const cipherBlock = doBlockCrypt(chainBlock, encryptRoundKeys)
    // make the cipher block be part of next chain block
    chainBlock = cipherBlock
    for (let l = 0; l < UINT8_BLOCK; l++) {
      outArray[roundIndex + l] = (cipherBlock[parseInt(l / 4)] >> (((3 - l) % 4) * 8)) & 0xff
    }
  }

  // cipher array to string
  if (mode === 'base64') {
    return base64js.fromByteArray(outArray)
  } else {
    // text
    //return decodeURIComponent(escape(String.fromCharCode(...outArray)));

    const transformed = String.fromCharCode.apply(this, outArray)
    return decodeURIComponent(escape(transformed))
  }
}
/**
 * ECB加密模式
 * @example encrypt_cbc("1234", "1234567890123456") => "woPrxebr8Xvyo1qG8QxAUA=="
 * @param {any} plaintext 要加密的数据
 * @param {String} key
 * @param {String} iv
 * @param {String} mode base64 | "text"
 * @returns {String} 加密后的字符串
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const encrypt_ecb = function(plaintext, key, iv, mode) {
  mode = mode || 'base64'
  if (!check('iv', iv)) {
    return
  }

  const encryptRoundKeys = EncryptRoundKeys(stringToArray(key))
  const plainByteArray = stringToArray(plaintext)
  const padded = padding(plainByteArray)
  const blockTimes = padded.length / UINT8_BLOCK
  const outArray = []
  // CBC mode
  // init chain with iv (transform to uint32 block)
  for (let i = 0; i < blockTimes; i++) {
    // extract the 16 bytes block data for this round to encrypt
    const roundIndex = i * UINT8_BLOCK
    const block = getChainBlock(padded, roundIndex)
    const cipherBlock = doBlockCrypt(block, encryptRoundKeys)
    for (let l = 0; l < UINT8_BLOCK; l++) {
      outArray[roundIndex + l] = (cipherBlock[parseInt(l / 4)] >> (((3 - l) % 4) * 8)) & 0xff
    }
  }

  // cipher array to string
  if (mode === 'base64') {
    return base64js.fromByteArray(outArray)
  } else {
    // text
    //return decodeURIComponent(escape(String.fromCharCode(...outArray)));

    const transformed = String.fromCharCode.apply(this, outArray)
    return decodeURIComponent(escape(transformed))
  }
}
/**
 * CBC解密模式
 * @example decrypt_cbc("K++iI4IhSGMnEJZT/jv1ow==", "1234567890123456", "1234567890123456") => "1234"
 * @param {any} plaintext 要解密的数据
 * @param {String} key
 * @param {String} iv
 * @param {String} mode base64 | "text"
 * @returns {String} 解密后的字符串
 */
const decrypt_cbc = function(ciphertext, key, iv, mode) {
  mode = mode || 'base64'

  if (!check('iv', iv) && !check('key', key)) {
    return
  }
  // get cipher byte array
  let cipherByteArray = null
  const decryptRoundKeys = EncryptRoundKeys(stringToArray(key)).reverse()
  if (mode === 'base64') {
    // cipher is base64 string
    cipherByteArray = base64js.toByteArray(ciphertext)
  } else {
    // cipher is text
    cipherByteArray = stringToArray(ciphertext)
  }

  const blockTimes = cipherByteArray.length / UINT8_BLOCK
  const outArray = []

  // init chain with iv (transform to uint32 block)
  let chainBlock = getChainBlock(stringToArray(iv))
  for (let i = 0; i < blockTimes; i++) {
    // extract the 16 bytes block data for this round to encrypt
    const roundIndex = i * UINT8_BLOCK
    // make Uint8Array to Uint32Array block
    const block = getChainBlock(cipherByteArray, roundIndex)
    // reverse the round keys to decrypt
    const plainBlockBeforeXor = doBlockCrypt(block, decryptRoundKeys)
    // xor the chain block
    const plainBlock = [
      chainBlock[0] ^ plainBlockBeforeXor[0],
      chainBlock[1] ^ plainBlockBeforeXor[1],
      chainBlock[2] ^ plainBlockBeforeXor[2],
      chainBlock[3] ^ plainBlockBeforeXor[3]
    ]
    // make the cipher block be part of next chain block
    chainBlock = block
    for (let l = 0; l < UINT8_BLOCK; l++) {
      outArray[roundIndex + l] = (plainBlock[parseInt(l / 4)] >> (((3 - l) % 4) * 8)) & 0xff
    }
  }
  // depadding the decrypted data
  const depaddedPlaintext = dePadding(outArray)
  // transform data to utf8 string

  //return decodeURIComponent(escape(String.fromCharCode(...depaddedPlaintext)));

  const transformed = String.fromCharCode.apply(this, depaddedPlaintext)

  return decodeURIComponent(escape(transformed))
}
/**
 * ECB解密模式
 * @example decrypt_ecb("woPrxebr8Xvyo1qG8QxAUA==", "1234567890123456") => "1234"
 * @param {any} plaintext 要解密的数据
 * @param {String} key
 * @param {String} iv
 * @param {String} mode base64 | "text"
 * @returns {String} 解密后的字符串
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const decrypt_ecb = function(ciphertext, key, iv, mode) {
  mode = mode || 'base64'

  if (!check('iv', iv)) {
    return
  }
  // get cipher byte array
  const decryptRoundKeys = EncryptRoundKeys(stringToArray(key)).reverse()
  let cipherByteArray = null
  if (mode === 'base64') {
    // cipher is base64 string
    cipherByteArray = base64js.toByteArray(ciphertext)
  } else {
    // cipher is text
    cipherByteArray = stringToArray(ciphertext)
  }
  const blockTimes = cipherByteArray.length / UINT8_BLOCK
  const outArray = []

  for (let i = 0; i < blockTimes; i++) {
    // extract the 16 bytes block data for this round to encrypt
    const roundIndex = i * UINT8_BLOCK
    // make Uint8Array to Uint32Array block
    const block = getChainBlock(cipherByteArray, roundIndex)
    // reverse the round keys to decrypt
    const plainBlock = doBlockCrypt(block, decryptRoundKeys)
    for (let l = 0; l < UINT8_BLOCK; l++) {
      outArray[roundIndex + l] = (plainBlock[parseInt(l / 4)] >> (((3 - l) % 4) * 8)) & 0xff
    }
  }

  // depadding the decrypted data
  const depaddedPlaintext = dePadding(outArray)
  // transform data to utf8 string
  //return decodeURIComponent(escape(String.fromCharCode(...depaddedPlaintext)));

  const transformed = String.fromCharCode.apply(this, depaddedPlaintext)
  return decodeURIComponent(escape(transformed))
}
/******************************sm3加密***************************************/
/**
 * 左补0到指定长度
 */
function leftPad(input, num) {
  if (input.length >= num) return input

  return new Array(num - input.length + 1).join('0') + input
}

/**
 * 二进制转化为十六进制
 */
function binary2hex(binary) {
  const binaryLength = 8
  let hex = ''
  for (let i = 0; i < binary.length / binaryLength; i++) {
    hex += leftPad(parseInt(binary.substr(i * binaryLength, binaryLength), 2).toString(16), 2)
  }
  return hex
}

/**
 * 十六进制转化为二进制
 */
function hex2binary(hex) {
  const hexLength = 2
  let binary = ''
  for (let i = 0; i < hex.length / hexLength; i++) {
    binary += leftPad(parseInt(hex.substr(i * hexLength, hexLength), 16).toString(2), 8)
  }
  return binary
}

/**
 * 普通字符串转化为二进制
 */
function str2binary(str) {
  let binary = ''
  for (let i = 0, len = str.length; i < len; i++) {
    const ch = str[i]
    binary += leftPad(ch.codePointAt(0).toString(2), 8)
  }
  return binary
}

/**
 * 循环左移
 */
function rol(str, n) {
  return str.substring(n % str.length) + str.substr(0, n % str.length)
}

/**
 * 二进制运算
 */
function binaryCal(x, y, method) {
  const a = x || ''
  const b = y || ''
  const result = []
  let prevResult

  for (let i = a.length - 1; i >= 0; i--) {
    // 大端
    prevResult = method(a[i], b[i], prevResult)
    result[i] = prevResult[0]
  }
  return result.join('')
}

/**
 * 二进制异或运算
 */
function xor(x, y) {
  return binaryCal(x, y, (a, b) => [a === b ? '0' : '1'])
}

/**
 * 二进制与运算
 */
function and(x, y) {
  return binaryCal(x, y, (a, b) => [a === '1' && b === '1' ? '1' : '0'])
}

/**
 * 二进制或运算
 */
function or(x, y) {
  return binaryCal(x, y, (a, b) => [a === '1' || b === '1' ? '1' : '0']) // a === '0' && b === '0' ? '0' : '1'
}

/**
 * 二进制与运算
 */
function add(x, y) {
  const result = binaryCal(x, y, (a, b, prevResult) => {
    const carry = prevResult ? prevResult[1] : '0' || '0'

    // a,b不等时,carry不变，结果与carry相反
    // a,b相等时，结果等于原carry，新carry等于a
    if (a !== b) return [carry === '0' ? '1' : '0', carry]

    return [carry, a]
  })

  return result
}

/**
 * 二进制非运算
 */
function not(x) {
  return binaryCal(x, undefined, a => [a === '1' ? '0' : '1'])
}

function calMulti(method) {
  return (...arr) => arr.reduce((prev, curr) => method(prev, curr))
}

/**
 * 压缩函数中的置换函数 P1(X) = X xor (X <<< 9) xor (X <<< 17)
 */
function P0(X) {
  return calMulti(xor)(X, rol(X, 9), rol(X, 17))
}

/**
 * 消息扩展中的置换函数 P1(X) = X xor (X <<< 15) xor (X <<< 23)
 */
function P1(X) {
  return calMulti(xor)(X, rol(X, 15), rol(X, 23))
}

function FF(X, Y, Z, j) {
  return j >= 0 && j <= 15 ? calMulti(xor)(X, Y, Z) : calMulti(or)(and(X, Y), and(X, Z), and(Y, Z))
}

function GG(X, Y, Z, j) {
  return j >= 0 && j <= 15 ? calMulti(xor)(X, Y, Z) : or(and(X, Y), and(not(X), Z))
}

function T(j) {
  return j >= 0 && j <= 15 ? hex2binary('79cc4519') : hex2binary('7a879d8a')
}

/**
 * 压缩函数
 */
function CF(V, Bi) {
  // 消息扩展
  const wordLength = 32
  const W = []
  const M = [] // W'

  // 将消息分组B划分为16个字W0， W1，…… ，W15 （字为长度为32的比特串）
  for (let i = 0; i < 16; i++) {
    W.push(Bi.substr(i * wordLength, wordLength))
  }

  // W[j] <- P1(W[j−16] xor W[j−9] xor (W[j−3] <<< 15)) xor (W[j−13] <<< 7) xor W[j−6]
  for (let j = 16; j < 68; j++) {
    W.push(calMulti(xor)(P1(calMulti(xor)(W[j - 16], W[j - 9], rol(W[j - 3], 15))), rol(W[j - 13], 7), W[j - 6]))
  }

  // W′[j] = W[j] xor W[j+4]
  for (let j = 0; j < 64; j++) {
    M.push(xor(W[j], W[j + 4]))
  }

  // 压缩
  const wordRegister = [] // 字寄存器
  for (let j = 0; j < 8; j++) {
    wordRegister.push(V.substr(j * wordLength, wordLength))
  }

  let A = wordRegister[0]
  let B = wordRegister[1]
  let C = wordRegister[2]
  let D = wordRegister[3]
  let E = wordRegister[4]
  let F = wordRegister[5]
  let G = wordRegister[6]
  let H = wordRegister[7]

  // 中间变量
  let SS1
  let SS2
  let TT1
  let TT2
  for (let j = 0; j < 64; j++) {
    SS1 = rol(calMulti(add)(rol(A, 12), E, rol(T(j), j)), 7)
    SS2 = xor(SS1, rol(A, 12))

    TT1 = calMulti(add)(FF(A, B, C, j), D, SS2, M[j])
    TT2 = calMulti(add)(GG(E, F, G, j), H, SS1, W[j])

    D = C
    C = rol(B, 9)
    B = A
    A = TT1
    H = G
    G = rol(F, 19)
    F = E
    E = P0(TT2)
  }

  return xor([A, B, C, D, E, F, G, H].join(''), V)
}

function sm3(str) {
  const binary = str2binary(str)

  // 填充
  const len = binary.length

  // k是满足len + 1 + k = 448mod512的最小的非负整数
  let k = len % 512

  // 如果 448 <= (512 % len) < 512，需要多补充 (len % 448) 比特'0'以满足总比特长度为512的倍数
  k = k >= 448 ? 512 - (k % 448) - 1 : 448 - k - 1

  const m = `${binary}1${leftPad('', k)}${leftPad(len.toString(2), 64)}`.toString() // k个0

  // 迭代压缩
  const n = (len + k + 65) / 512

  let V = hex2binary('7380166f4914b2b9172442d7da8a0600a96f30bc163138aae38dee4db0fb0e4e')
  for (let i = 0; i <= n - 1; i++) {
    const B = m.substr(512 * i, 512)
    V = CF(V, B)
  }
  return binary2hex(V)
}

module.exports = { encrypt_cbc, decrypt_cbc, sm3 }
