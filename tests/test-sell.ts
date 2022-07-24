
import * as anchor from "@project-serum/anchor";
// ** Comment this to use solpg imported IDL **
import {
    createKeypairFromFile,
} from './util';
import { MintNft } from "../target/types/mint_nft";

describe("sell-nft", async () => {

    const provider = anchor.AnchorProvider.env();
    const wallet = provider.wallet as anchor.Wallet;
    anchor.setProvider(provider);

    const program = anchor.workspace.MintNft as anchor.Program<MintNft>;

    it("sell!", async () => {
        //Testing constants

        const saleAmount = 1 * anchor.web3.LAMPORTS_PER_SOL;
        const mint: anchor.web3.PublicKey = new anchor.web3.PublicKey(
            "HjY2iGNpfp5MPFnCA3t6CNELekDqA65zSJFNJQxQD6qE"
        )
        const buyer: anchor.web3.Keypair = await createKeypairFromFile(__dirname + "/keypairs/buyer1.json");
        console.log(`buyers public key: ${buyer.publicKey}`);

        //derive the associated token account address for owner and buyer
        const ownerTokenAddress = await anchor.utils.token.associatedAddress({
            mint: mint,
            owner: wallet.publicKey
        })
        const buyerTokenAddress = await anchor.utils.token.associatedAddress({
            mint: mint,
            owner: buyer.publicKey,
          });

          console.log(`Request to sell NFT: ${mint} at ${saleAmount} lamports.`);
          console.log(`Owner's Token address: ${ownerTokenAddress}`);
          console.log(`Owner's Token address: ${buyerTokenAddress}`);
          
          await program.methods.sell(
            new anchor.BN(saleAmount)
          )
          .accounts({
            mint: mint,
            ownerTokenAccount: ownerTokenAddress,
            ownerAuthority: wallet.publicKey,
            buyerTokenAccount: buyerTokenAddress,
            buyerAuthority: buyer.publicKey,
          })
          .signers([buyer])
          .rpc();

    })

})


///commands
// mkdir ~/desktop/myfiles/code/contracts/solana/mint-nft/tests/keypairs && solana-keygen new --no-bip39-passphrase -o ~/desktop/myfiles/code/contracts/solana/mint-nft/tests/keypairs/buyer1.json  
// Generating a new keypair