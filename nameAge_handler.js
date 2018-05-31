const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError} = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')
const crypto = require('crypto')

const _hash = (x) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase()

const TP_FAMILY = 'nameAge'
const TP_NAMESPACE=_hash(TP_FAMILY).substring(0,6)
const TP_VERSION = '1.0'

const _decodeCbor = buffer =>
    new Promise((resolve,reject) =>
        cbor.decodeFirst(buffer, (err, obj) => (err ? reject(err): resolve(obj)))
    )
const _toInternalError = (err) => {
    let message = (err.message) ? err.message : err
    throw new InternalError(message)
}

class nameAgeHandler extends TransactionHandler {
    constructor(){
        super(TP_FAMILY,[TP_VERSION],[TP_NAMESPACE])
    }
    apply (transactionProcessRequest, context){
        return _decodeCbor(transactionProcessRequest.payload)
        .catch(_toInternalError)
        .then((update)=>{
            let name = update.Name
            if(!name) {
                throw new InvalidTransaction('Name is Requried')
            }
            let age =update.Age
            if (!age) {
                throw new InvalidTransaction('Age is required')
            }
            console.log('Name: ${name} \n Age: ${age}')
        })
    }
}
module.exports=nameAgeHandler
