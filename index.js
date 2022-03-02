
const express = require('express')
const app = express()
const port = 3000

app.get('/claim/:privateKey', (req, res) => {
    claim(req.params.privateKey).then(resp => res.send(resp))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


const { default: Neon, api, wallet } = require("@cityofzion/neon-js");

async function claim(claimingPrivateKey) {

    const network = "MainNet";

    console.log("\n\n--- Private Key ---")
    console.log(claimingPrivateKey)

    /**
    ## Selecting the API provider and network
    Like in `sendAsset`, we establish the network we are interacting with through the selection of a API provider.
    */

    const apiProvider = new api.neoscan.instance("MainNet");

    console.log("\n\n--- API Provider ---");
    console.log(apiProvider);

    /**
    ## Creating the Account
    Similar to `sendAsset`, we are using an Account object to encapsulate our private key.
    This account will be the account to claim gas from.
    */

    const account = new wallet.Account(claimingPrivateKey);

    console.log("\n\n--- Claiming Address ---");
    console.log(account);

    /**
    ## Execute
    We assemble the config object and claimGas will do the following:
    1. Retrieve the claims of claimingPrivateKey from apiProvider.
    2. Retrieve a good rpc url from apiProvider.
    3. Assemble the transaction using the claims.
    4. Sign the transaction using the claimingPrivateKey
    5. Submit the transaction to the network using the `sendrawtransaction` RPC call to the rpc url.
    */

    const config = {
        api: apiProvider, // The API Provider that we rely on for balance and rpc information
        account: account // The claiming Account
    };


    let err = await Neon.claimGas(config)
        .then(config => {
            console.log("\n\n--- Response ---");
            console.log(config.response);
        })
        .catch(error => {
            console.log(error)
            return error
        })

    if (err) {
        return err.message
    }
    return 'ok'
}