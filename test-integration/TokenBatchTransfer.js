const { ethers, web3, artifacts, contract } = require("@nomiclabs/buidler");
const {
  constants,
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const IERC20 = artifacts.require("IERC20");
const TokenBatchTransfer = artifacts.require("TokenBatchTransfer");

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

contract("TokenBatchTransfer Unit Test", async (accounts) => {
  const [owner] = accounts;
  console.log(`Sender: ${owner}`)
  const target = '0xc63fc0aE83555e2553762EdD887433573F77CFc2'
  console.log(`Target: ${target}`)


  describe("Execute", async () => {
    it("Send Funds", async () => {
      const YFV = await IERC20.at('0x45f24BaEef268BB6d63AEe5129015d69702BCDfa')
      const AKRO = await IERC20.at('0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7')
      const BSND = await IERC20.at('0x668DbF100635f593A3847c0bDaF21f0a09380188')
      const ADEL = await IERC20.at('0x94d863173ee77439e4292284ff13fad54b3ba182')
      const BPT_1 = await IERC20.at('0x433d0c33288b985cf232a7e312bcfafd372460a8')
      const BPT_2 = await IERC20.at('0xbfdef139103033990082245c24ff4b23dafd88cf')
      const UNI_V2_1 = await IERC20.at('0x76333b38567f78240d6276e5b3985baa6fa5fda5')
      const UNI_V2_2 = await IERC20.at('0xa478c2975ab1ea89e8196811f51a7b7ade33eb11')

      const distributor = await TokenBatchTransfer.new()
      // const distributor = await TokenBatchTransfer.at('0x6562b0b62ff7d3a3a454df07737aef7850884793')
      // console.log("Contract Deployed")

      assert.equal(await distributor.owner.call(), owner)

      let cumulativeGas = 0
      let trx
      const tokens = [YFV, AKRO, BSND, ADEL, BPT_1, BPT_2, UNI_V2_1, UNI_V2_2]

      await asyncForEach(tokens, async (token) => {
        const trx = await token.approve(distributor.address, constants.MAX_UINT256)
        console.log(`Approved ${token.address}`)
        cumulativeGas += trx.receipt.gasUsed
        console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      })

      trx = await distributor.distributeTokens(
        [
          YFV.address,
          AKRO.address,
          BSND.address,
          ADEL.address,
          BPT_1.address,
          BPT_2.address,
          UNI_V2_1.address,
          UNI_V2_2.address
        ],
        target
      )
      console.log(`Funds Sent ${owner} -> ${target}`)
      console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      cumulativeGas += trx.receipt.gasUsed

      console.log(`Total Gas: ${cumulativeGas}`)

      expectEvent.inTransaction(trx.tx, YFV, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, AKRO, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, BSND, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, ADEL, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, BPT_1, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, BPT_2, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, UNI_V2_1, 'Transfer', { from: owner, to: target })
      expectEvent.inTransaction(trx.tx, UNI_V2_2, 'Transfer', { from: owner, to: target })

    })

    it("Destroy", async () => {
      const distributor = await TokenBatchTransfer.at('0x6562b0b62ff7d3a3a454df07737aef7850884793')
      await distributor.destroy()
    })
  })
});
