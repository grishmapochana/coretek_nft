import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { deployContractsAndGetAccounts } from "../scripts/deploy";

describe("MNFT", function () {
  it("increases token's id after each mint", async function () {
    const { nftContract, marketplaceContract } = await loadFixture(
      deployContractsAndGetAccounts
    );
    await expect(nftContract.mintToken(""))
      .to.emit(nftContract, "TokenMinted")
      .withArgs(1, "", marketplaceContract.address);

    await expect(nftContract.mintToken(""))
      .to.emit(nftContract, "TokenMinted")
      .withArgs(2, "", marketplaceContract.address);
  });

  it("gets token ids owned by msg.sender", async function () {
    const { nftContract, owner, acc1 } = await loadFixture(
      deployContractsAndGetAccounts
    );
    await nftContract.mintToken("");
    await nftContract.connect(acc1).mintToken("");
    await nftContract.mintToken("");
    await nftContract.transferFrom(owner.address, acc1.address, 1);

    const nftIds = await nftContract.getTokensOwnedByMe();

    expect(nftIds).to.have.length(1);

    expect(nftIds).to.eql([BigNumber.from(3)]);
  });

  it("gets token ids created by msg.sender", async function () {
    const { nftContract, acc1 } = await loadFixture(
      deployContractsAndGetAccounts
    );
    await nftContract.mintToken("");
    await nftContract.connect(acc1).mintToken("");
    await nftContract.mintToken("");

    const nftIds = await nftContract.getTokensCreatedByMe();

    expect(nftIds).to.have.length(2);

    expect(nftIds).to.eql([BigNumber.from(1), BigNumber.from(3)]);
  });

  it("gets token creator by id", async function () {
    const { nftContract, owner } = await loadFixture(
      deployContractsAndGetAccounts
    );
    await nftContract.mintToken("");
    const creator = await nftContract.getTokenCreatorById(1);
    expect(creator).to.eql(owner.address);
  });

  it("get all tokens created", async function () {
    const { nftContract, owner, acc1, acc2 } = await loadFixture(
      deployContractsAndGetAccounts
    );
    await nftContract.mintToken("");
    await nftContract.connect(acc1).mintToken("");
    await nftContract.connect(acc2).mintToken("");
    await nftContract.connect(owner).mintToken("");
    await nftContract.connect(acc1).mintToken("");
    await nftContract.connect(acc2).mintToken("");

    const allNftIds = await nftContract.getAllTokens();

    expect(allNftIds).to.have.length(6);

    expect(allNftIds).to.eql([
      BigNumber.from(1),
      BigNumber.from(2),
      BigNumber.from(3),
      BigNumber.from(4),
      BigNumber.from(5),
      BigNumber.from(6),
    ]);
  });

  it("get Latest token", async function () {
    const { nftContract } = await loadFixture(deployContractsAndGetAccounts);
    await nftContract.mintToken("");
    await nftContract.mintToken("");
    await nftContract.mintToken("");
    await nftContract.mintToken("");
    await nftContract.mintToken("");

    const latestTokenId = await nftContract.getLatestToken();

    expect(latestTokenId).to.eql(BigNumber.from(5));
  });

  it("token transfer", async function () {
    const { nftContract, owner, acc1, acc2 } = await loadFixture(
      deployContractsAndGetAccounts
    );

    await nftContract.mintToken("1");
    await nftContract.transferFrom(owner.address, acc1.address, 1);

    await nftContract.mintToken("2");
    let tokenOwner = await nftContract.ownerOf(1);
    expect(tokenOwner).to.eql(acc1.address);

    await nftContract.connect(acc1).transferFrom(acc1.address, acc2.address, 1);
    tokenOwner = await nftContract.ownerOf(1);
    expect(tokenOwner).to.eql(acc2.address);

    await nftContract
      .connect(acc2)
      .transferFrom(acc2.address, owner.address, 1);
    tokenOwner = await nftContract.ownerOf(1);
    expect(tokenOwner).to.eql(owner.address);

    // const tokensCreatedByMe = await nftContract.connect(acc2).getTokensCreatedByMe()
    // console.log(tokensCreatedByMe)

    // const tokensOwnedByMe = await nftContract.connect(acc2).getTokensOwnedByMe()
    // console.log(tokensOwnedByMe)
  });

  it("get all tokens & getAllTokensOwnedBy", async function () {
    const { nftContract, owner, acc1, acc2 } = await loadFixture(
      deployContractsAndGetAccounts
    );
    await nftContract.mintToken("1");
    await nftContract.connect(acc1).mintToken("2");
    await nftContract.connect(acc2).mintToken("3");
    await nftContract.connect(owner).mintToken("4");
    await nftContract.connect(acc1).mintToken("5");
    await nftContract.connect(acc2).mintToken("6");
    await nftContract.mintToken("7");

    const allTokens = await nftContract.getAllTokens();
    expect(allTokens).to.eql([
      BigNumber.from(1),
      BigNumber.from(2),
      BigNumber.from(3),
      BigNumber.from(4),
      BigNumber.from(5),
      BigNumber.from(6),
      BigNumber.from(7),
    ]);

    const allTokensOwnedByOwner = await nftContract.getAllTokensOwnedBy(
      owner.address
    );
    expect(allTokensOwnedByOwner).to.eql([
      BigNumber.from(1),
      BigNumber.from(4),
      BigNumber.from(7),
    ]);
    const noOfTokensOwnedByOwner = await nftContract.balanceOf(owner.address);
    expect(noOfTokensOwnedByOwner).to.eql(BigNumber.from(3));

    const allTokensOwnedByAcc1 = await nftContract.getAllTokensOwnedBy(
      acc1.address
    );
    expect(allTokensOwnedByAcc1).to.eql([BigNumber.from(2), BigNumber.from(5)]);
    const noOfTokensOwnedByAcc1 = await nftContract.balanceOf(acc1.address);
    expect(noOfTokensOwnedByAcc1).to.eql(BigNumber.from(2));

    const allTokensOwnedByAcc2 = await nftContract.getAllTokensOwnedBy(
      acc2.address
    );
    expect(allTokensOwnedByAcc2).to.eql([BigNumber.from(3), BigNumber.from(6)]);
    const noOfTokensOwnedByAcc2 = await nftContract.balanceOf(acc2.address);
    expect(noOfTokensOwnedByAcc2).to.eql(BigNumber.from(2));
  });
});
