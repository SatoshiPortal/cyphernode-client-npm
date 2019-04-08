let Cyphernode = {
  baseURL: null,
  h64:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9Cg==',
  apiId: null,
  apiKey: null,

  isMock: false,
};

const generateToken = () => {
  let current = Math.round(new Date().getTime()/1000) + 10
  let p = '{"id":"' + Cyphernode.apiId + '","exp":' + current + '}'
  let p64 = Buffer.from(p).toString('base64')
  let msg = Cyphernode.h64 + '.' + p64
  let s = CryptoJS.HmacSHA256(msg, Cyphernode.apiKey).toString()
  let token = msg + '.' + s

  return token
};

const post = (url, postdata, cb, addedOptions) => {
  let urlr = Cyphernode.baseURL + url;
  let httpOptions = {
    data: postdata,
    npmRequestOptions: {
      strictSSL: false,
      agentOptions: {
        rejectUnauthorized: false
      }
    },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + generateToken()
    }
  }
  if (addedOptions) {
    Object.assign(httpOptions.npmRequestOptions, addedOptions)
  }

  HTTP.post(urlr, httpOptions,
    function (err, resp) {
      cb(err, resp.data || resp.content)
    }
  )
};

const get = (url, cb, addedOptions) => {
  let urlr = Cyphernode.baseURL + url;
  let httpOptions = {
    npmRequestOptions: {
      strictSSL: false,
      agentOptions: {
        rejectUnauthorized: false
      }
    },
    headers: {
      'Authorization': 'Bearer ' + generateToken()
    }
  }
  if (addedOptions) {
    Object.assign(httpOptions.npmRequestOptions, addedOptions)
  }

  HTTP.get(urlr, httpOptions,
    function (err, resp) {
      cb(err, resp.data || resp.content)
    }
  )
};

module.exports = {

  // Set new cyphernode' settings
  // - settings {Object}
  set(settings) {
    Cyphernode = Object.assign(Cyphernode, settings)
  },

  watch(btcaddr, cb0conf, cb1conf, next) {
    // BODY {"address":"2N8DcqzfkYi8CkYzvNNS5amoq3SbAcQNXKp","unconfirmedCallbackURL":"192.168.122.233:1111/callback0conf","confirmedCallbackURL":"192.168.122.233:1111/callback1conf"}
    if (Cyphernode.isMock) {
      let data='{"id":"23","event":"watch","imported":"1","inserted":"1",'
      data += '"address":"' + btcaddr + '","unconfirmedCallbackURL":"' + cb0conf + '",'
      data += '"confirmedCallbackURL":"' + cb1conf + '","estimatesmartfee2blocks":"456",'
      data += '"estimatesmartfee6blocks":"345","estimatesmartfee36blocks":"234",'
      data += '"estimatesmartfee144blocks":"123"}'
      next(null, JSON.parse(data));
      return;
    }
    let data = { address: btcaddr, unconfirmedCallbackURL: cb0conf, confirmedCallbackURL: cb1conf }
    post('/watch', data, next);
  },

  unwatch(btcaddr, next) {
    // 192.168.122.152:8080/unwatch/2N8DcqzfkYi8CkYzvNNS5amoq3SbAcQNXKp
    if (Cyphernode.isMock) {
      next(null, {"event":"unwatch","address":btcaddr});
      return;
    }
    get('/unwatch/' + btcaddr, next);
  },

  getActiveWatches(next) {
    // 192.168.122.152:8080/getactivewatches
    if (Cyphernode.isMock) {
      next(null, {"watches":[]});
      return;
    }
    get('/getactivewatches', next);
  },

  getTransaction(txid, next) {
    // http://192.168.122.152:8080/gettransaction/af867c86000da76df7ddb1054b273ca9e034e8c89d049b5b2795f9f590f67648
    if (Cyphernode.isMock) {
      let data = '{"result":{"txid":"1c6e22f9982ea3bb33b4a1c42880a1f394998826758e73f6c15ab28d98799fd6",'
      data += '"hash":"1c6e22f9982ea3bb33b4a1c42880a1f394998826758e73f6c15ab28d98799fd6","version":1,'
      data += '"size":370,"vsize":370,"locktime":0,"vin":[{"txid":"41f2933bd6bae2a19e05b7c6477bf044251368008c63bc8e472dcc8315e5d852",'
      data += '"vout":1,"scriptSig":{"asm":'
      data += '"304402204c41fbce56d579709f408a38c305e8715d429cbc9c7c9cc8a1aa854d7199c262022043a53f308d618c2392395f9faa32205f73273724ca50854a61aa3085b6be0294[ALL]0393902450184641fe0cfe6d2f5e8a828d177f5dd8417fb648ac6859bfc2ec1743","hex":'
      data += '"47304402204c41fbce56d579709f408a38c305e8715d429cbc9c7c9cc8a1aa854d7199c262022043a53f308d618c2392395f9faa32205f73273724ca50854a61aa3085b6be029401210393902450184641fe0cfe6d2f5e8a828d177f5dd8417fb648ac6859bfc2ec1743"},'
      data += '"sequence":4294967295},{"txid":"fce8ed73e6c17838617e7272235fff45ba59a0e8507ebfaa76dd62c4f364bc85","vout":1,"scriptSig":{"asm":'
      data += '"304402201b1951bc119386814e72804f870b8c3fdb8dc68af9f9396a685674f5431abd9002201b71daf1a048bb06b26e785ed754beb07010ddef07203277cbc32a8eaf202a71[ALL]0381d75a28f6aa47978204a1622c29c0a0ff9711d5d9dc821dbb4b8d4dc8710fd0","hex":'
      data += '"47304402201b1951bc119386814e72804f870b8c3fdb8dc68af9f9396a685674f5431abd9002201b71daf1a048bb06b26e785ed754beb07010ddef07203277cbc32a8eaf202a7101210381d75a28f6aa47978204a1622c29c0a0ff9711d5d9dc821dbb4b8d4dc8710fd0"},'
      data += '"sequence":4294967295}],"vout":[{"value":0.00316247,"n":0,"scriptPubKey":{"asm":"OP_HASH160 dbbd535c7cd9d9843807391bcfdfe586a97f7df1 OP_EQUAL","hex":"a914dbbd535c7cd9d9843807391bcfdfe586a97f7df187","reqSigs":1,'
      data += '"type":"scripthash","addresses":["2NDH6msRcUgvsvo6oazWMLRRQHbcCkDYrHK"]}},{"value":0.09757000,"n":1,"scriptPubKey":{"asm":"OP_DUP OP_HASH160 1f479d45a4af29c39538780b3e3bba72f4d9fe73 OP_EQUALVERIFY OP_CHECKSIG",'
      data += '"hex":"76a9141f479d45a4af29c39538780b3e3bba72f4d9fe7388ac","reqSigs":1,"type":"pubkeyhash","addresses":["miNM2rQSZ3JGpxHHM1ad4CCHKjTmKVDMig"]}}],"hex":'
      data += '"010000000252d8e51583cc2d478ebc638c0068132544f07b47c6b7059ea1e2bad63b93f241010000006a47304402204c41fbce56d579709f408a38c305e8715d429cbc9c7c9cc8a1aa854d7199c262022043a53f308d618c2392395f9faa32205f73273724ca50854'
      data += 'a61aa3085b6be029401210393902450184641fe0cfe6d2f5e8a828d177f5dd8417fb648ac6859bfc2ec1743ffffffff85bc64f3c462dd76aabf7e50e8a059ba45ff5f2372727e613878c1e673ede8fc010000006a47304402201b1951bc119386814e72804f870b8c3f'
      data += 'db8dc68af9f9396a685674f5431abd9002201b71daf1a048bb06b26e785ed754beb07010ddef07203277cbc32a8eaf202a7101210381d75a28f6aa47978204a1622c29c0a0ff9711d5d9dc821dbb4b8d4dc8710fd0ffffffff0257d304000000000017a914dbbd535c7'
      data += 'cd9d9843807391bcfdfe586a97f7df18748e19400000000001976a9141f479d45a4af29c39538780b3e3bba72f4d9fe7388ac00000000"},"error":null,"id":null}'
      next(null, JSON.parse(data));
      return;
    }
    get('/gettransaction/' + txid, next);
  },

  spend(btcaddr, amnt, next) {
    // BODY {"address":"2N8DcqzfkYi8CkYzvNNS5amoq3SbAcQNXKp","amount":0.00233}
    if (Cyphernode.isMock) {
      next(null, {"status":"accepted","hash":"41f2933bd6bae2a19e05b7c6477bf044251368008c63bc8e472dcc8315e5d852"});
      return;
    }
    let data = { address: btcaddr, amount: amnt }
    post('/spend', data, next);
  },

  getBalance(next) {
    // http://192.168.122.152:8080/getbalance
    if (Cyphernode.isMock) {
      next(null, {"balance":0.45133110})
      return
    }
    get('/getbalance', next);
  },

  getNewAddress(next) {
    // http://192.168.122.152:8080/getnewaddress
    if (Cyphernode.isMock) {
      next(null, {"address":"2NDH6msRcUgvsvo6oazWMLRRQHbcCkDYrHK"})
      return;
    }
    get('/getnewaddress', next);
  },

  derive(xpub32, path, next) {
    // BODY {"pub32":"upub5GtUcgGed1aGH4HKQ3vMYrsmLXwmHhS1AeX33ZvDgZiyvkGhNTvGd2TA5Lr4v239Fzjj4ZY48t6wTtXUy2yRgapf37QHgt6KWEZ6bgsCLpb","path":"0/25-30"}
    if (Cyphernode.isMock) {
      let data = '{"addresses":[{"address":"mz3bWMW3BWGT9YGDjJwS8TfhJMMtZ91Frm"},{"address":"mkjmKEX3KJrVpiqLSSxKB6jjgm3WhPnrv8"},{"address":"mk43Tmf6E5nsmETTaNMTZK9TikaeVJRJ4a"},'
      data += '{"address":"n1SEcVHHKpHyNr695JpXNdH6b9cWQ26qkt"},{"address":"mzWqwZkA31kYVy1kpMoZgvfzSDyGgEi7Yg"},{"address":"mp5jtEDNa88xfSQGs5yYQGk7guGWvaG4ci"}]}'
      next(null, JSON.parse(data));
      return;
    }
    let data = { pub32: xpub32, path: path }
    post('/derivepubpath', data, next);
  },

  otsStamp(hash, callbackUrl, next) {
    // POST https://cyphernode/ots_stamp
    // BODY {"hash":"1ddfb769eb0b8876bc570e25580e6a53afcf973362ee1ee4b54a807da2e5eed7","callbackUrl":"192.168.111.233:1111/callbackUrl"}
    if (Cyphernode.isMock) {
      next(null, {"method":"ots_stamp","hash":hash,"id":"123","result":"success"});
      return;
    }
    let data = { hash: hash, callbackUrl: callbackUrl }
    post('/ots_stamp', data, next);
  },

  otsGetFile(hash, next) {
    // http://192.168.122.152:8080/ots_getfile/1ddfb769eb0b8876bc570e25580e6a53afcf973362ee1ee4b54a807da2e5eed7
    if (Cyphernode.isMock) {
      next(null, null);
      return;
    }

    // encoding: null is for HTTP get to not convert the binary data to the default encoding
    get('/ots_getfile/' + hash, next, { encoding: null });
  },
};
