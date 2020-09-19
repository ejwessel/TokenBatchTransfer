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
      console.log("Approval YFV")
      const AKRO = await IERC20.at('0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7')
      console.log("Approval AKRO")
      const BSND = await IERC20.at('0x668DbF100635f593A3847c0bDaF21f0a09380188')
      console.log("Approval BSND")
      const ADEL = await IERC20.at('0x94d863173ee77439e4292284ff13fad54b3ba182')
      console.log("Approval ADEL")
      const BPT_1 = await IERC20.at('0x433d0c33288b985cf232a7e312bcfafd372460a8')
      console.log("Approval BPT_1")
      const BPT_2 = await IERC20.at('0xbfdef139103033990082245c24ff4b23dafd88cf')
      console.log("Approval BPT_2")
      const UNI_V2_1 = await IERC20.at('0x76333b38567f78240d6276e5b3985baa6fa5fda5')
      console.log("Approval UNI_V2_1")
      const UNI_V2_2 = await IERC20.at('0xa478c2975ab1ea89e8196811f51a7b7ade33eb11')
      console.log("Approval UNI_V2_2")

      const distributor = await TokenBatchTransfer.new()
      console.log("Contract Deployed")

      assert.equal(await distributor.owner.call(), owner)

      let cumulativeGas = 0
      // let trx
      const tokens = [YFV, AKRO, BSND, ADEL, BPT_1, BPT_2, UNI_V2_1, UNI_V2_2]

      await asyncForEach(tokens, async (token) => {
        const trx = await token.approve(distributor.address, constants.MAX_UINT256)
        cumulativeGas += trx.receipt.gasUsed
        console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      })

      // trx = await YFV.approve(distributor.address, constants.MAX_UINT256)
      // cumulativeGas += trx.receipt.gasUsed
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)

      // trx = await AKRO.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

      // trx = await BSND.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

      // trx = await ADEL.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

      // trx = await BPT_1.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

      // trx = await BPT_2.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

      // trx = await UNI_V2_1.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

      // trx = await UNI_V2_2.approve(distributor.address, constants.MAX_UINT256)
      // console.log(`Gas Used: ${trx.receipt.gasUsed}`)
      // cumulativeGas += trx.receipt.gasUsed

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
  })
});
