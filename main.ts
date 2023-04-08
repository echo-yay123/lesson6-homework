
const {ApiPromise, WsProvider, Keyring} = require('@polkadot/api');


async function main(){

	const wsProvider = new WsProvider('ws://127.0.0.1:9944');

	const api = await ApiPromise.create({ provider:wsProvider });

	const keyring = new Keyring({type:'sr25519'});

	const alice = keyring.addFromUri('//Alice',{name:'Alice default'});
	
	const bob = keyring.addFromUri('//BOB',{name:'Bob default'});
		
	const unsub = await api.tx.balances
		.transfer(bob.address,12345)
		.signAndSend(alice,(result) => {
			console.log(`Current status is ${result.status}`);

		if (result.status.isInBlock){
			console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
		} else if (result.status.isFinalized){
			console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);
			unsub();
		}
	});

	

}

main()
	.then(() => {
		console.log("successfully.exited");
		
		// process.exit(0);
	})
	.catch(err => {
		console.log('error occur:', err);
		process.exit(1);
	})