import Vue from 'vue'
import CryptoJS from 'crypto-js'
// import JSEncrypt from 'jsencrypt'
import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

const publicKey =
  `-----BEGIN PUBLIC KEY-----
	MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCh5Nk2GLiyQFMIU+h3OEA4UeFb
u3dCH5sjd/sLTxxvwjXq7JLqJbt2rCIdzpAXOi4jL+FRGQnHaxUlHUBZsojnCcHv
hrz2knV6rXNogt0emL7f7ZMRo8IsQGV8mlKIC9xLnlOQQdRNUssmrROrCG99wpTR
RNZjOmLvkcoXdeuaCQIDAQAB
	-----END PUBLIC KEY-----`

const privateKey = ``

/**
 * 加密解密的工具类
 */
export default {
  //RSA加密
  encryptRSA(word) {
    let jse = new JSEncrypt()
    jse.setPublicKey(publicKey)
    let encrypted = jse.encrypt(word)
    // 输出加密结果
    return encrypted
  },
  //RSA解密
  decryptRSA(encrypted) {
    let jse = new JSEncrypt()
    // 设置密钥
    jse.setPrivateKey(privateKey)
    // 解密加密过的字符串
    let decrypted = jse.decrypt(encrypted)
    return decrypted
  },
  //RSA公钥加密
  encryptRSAByPublicKey(word, publicKey1) {
    //console.log('公钥加密, 内容: ' + word + ', ' + '公钥: ' + publicKey1)
    if (publicKey1 == null || publicKey1 == '') {
      publicKey1 = publicKey
    }
    let jse = new JSEncrypt()
    jse.setPublicKey(publicKey1)
    let encrypted = jse.encrypt(word)
    // 输出加密结果
    return encrypted
  },
}
