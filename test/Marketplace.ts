import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, Signer } from "ethers";
import { deployContractsAndGetAccounts } from "../scripts/deploy";

const fromWei = (num: BigNumber) => ethers.utils.formatEther(num);
const toWei = (str: string) => ethers.utils.parseEther(str);

describe("Marketplace", function () {
  async function deployContractsAndSetAddressesFixture() {
    const { erc20Contract, nftContract, marketplaceContract, owner, acc1 } =
      await deployContractsAndGetAccounts();

    const buyer = acc1;
    // share 10k mtokens to buyer from owner
    await erc20Contract.transfer(buyer.address, toWei("10000"));

    return { marketplaceContract, nftContract, erc20Contract, owner, buyer };
  }

  async function mintTokenAndCreateMarketItem(
    listingFee: number | BigNumber,
    tokenId: number | BigNumber,
    price: BigNumber,
    transactionOptions: any,
    account: Signer
  ) {
    const { marketplaceContract, nftContract, erc20Contract } =
      await loadFixture(deployContractsAndSetAddressesFixture);
    await nftContract.connect(account).mintToken("");
    await erc20Contract
      .connect(account)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(account)
      .approve(marketplaceContract.address, tokenId);
    return marketplaceContract
      .connect(account)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        tokenId,
        price,
        transactionOptions
      );
  }

  it("creates a Market Item", async function () {
    const { nftContract, marketplaceContract, owner } = await loadFixture(
      deployContractsAndSetAddressesFixture
    );

    // Arrange
    const tokenId = 1;
    const price = ethers.utils.parseEther("10");
    const listingFee = await marketplaceContract.getListingFee();

    // Act and Assert
    await expect(
      mintTokenAndCreateMarketItem(listingFee, tokenId, price, {}, owner)
    )
      .to.emit(marketplaceContract, "MarketItemCreated")
      .withArgs(
        1,
        nftContract.address,
        tokenId,
        owner.address,
        owner.address,
        ethers.constants.AddressZero,
        price,
        false,
        false
      );
  });

  it("creates successive market items for the same token id by buying and selling", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner, buyer } =
      await loadFixture(deployContractsAndSetAddressesFixture);
    // Arrange
    const token1id = 1;
    const price = toWei("1.2");
    const listingFee = await marketplaceContract.getListingFee();

    // Account1 mints two tokens and put them for sale
    await nftContract.mintToken("");
    // createMarketItem internally invokes transferFrom owner to seller, so give allowance for marketplace by the owner for this tx to happen
    await erc20Contract.increaseAllowance(
      marketplaceContract.address,
      listingFee
    );
    expect(
      await marketplaceContract.createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token1id,
        price,
        { value: listingFee }
      )
    ).to.emit(marketplaceContract, "MarketItemCreated");
    expect(await nftContract.ownerOf(token1id)).to.eql(
      marketplaceContract.address
    );

    // Account 2 buys token 1
    const token1marketItemId = 1;
    await erc20Contract
      .connect(buyer)
      .increaseAllowance(marketplaceContract.address, price);
    await marketplaceContract
      .connect(buyer)
      .createMarketSale(
        nftContract.address,
        erc20Contract.address,
        token1marketItemId,
        { value: price }
      );
    expect(await nftContract.ownerOf(token1id)).to.eql(buyer.address);

    // Account 2 puts token 1 for sale
    await nftContract
      .connect(buyer)
      .approve(marketplaceContract.address, token1id);
    await erc20Contract
      .connect(buyer)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await marketplaceContract
      .connect(buyer)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token1id,
        price,
        { value: listingFee }
      );

    // Act
    // Account 1 buys token 1 back
    await erc20Contract.increaseAllowance(marketplaceContract.address, price);
    await marketplaceContract.createMarketSale(
      nftContract.address,
      erc20Contract.address,
      token1marketItemId,
      { value: price }
    );

    // Assert
    const tokenOwner = await nftContract.ownerOf(token1id);
    expect(tokenOwner).to.eql(owner.address);
  });

  it("cancels a market item", async () => {
    const { marketplaceContract, nftContract, owner } = await loadFixture(
      deployContractsAndSetAddressesFixture
    );

    // Arrange
    const tokenId = 1;
    const price = ethers.utils.parseEther("1");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    await mintTokenAndCreateMarketItem(
      listingFee,
      tokenId,
      price,
      transactionOptions,
      owner
    );

    // Act
    await marketplaceContract.cancelMarketItem(nftContract.address, 1);

    // Assert
    const tokenOwner = await nftContract.ownerOf(1);
    expect(tokenOwner).to.eql(owner.address);
  });

  it("reverts when trying to cancel an inexistent market item", async () => {
    const { marketplaceContract, nftContract } = await loadFixture(
      deployContractsAndSetAddressesFixture
    );

    // Act and Assert
    expect(
      marketplaceContract.cancelMarketItem(nftContract.address, 1)
    ).to.be.revertedWith("Market item has to exist");
  });

  it("reverts when trying to cancel a market item whose seller is not msg.sender", async () => {
    const { marketplaceContract, owner, buyer, nftContract } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    const tokenId = 1;
    const price = ethers.utils.parseEther("1");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    await mintTokenAndCreateMarketItem(
      listingFee,
      tokenId,
      price,
      transactionOptions,
      owner
    );

    // Act and Assert
    expect(
      marketplaceContract
        .connect(buyer)
        .cancelMarketItem(nftContract.address, 1)
    ).to.be.revertedWith("You are not the seller");
  });

  it("gets latest Market Item by the token id", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner, buyer } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    const token1id = 1;
    const token2id = 2;
    const price = toWei("10");
    const listingFee = await marketplaceContract.getListingFee();

    // Account1 mints two tokens and put them for sale
    await nftContract.mintToken("");
    await nftContract.mintToken("");

    await erc20Contract.increaseAllowance(
      marketplaceContract.address,
      listingFee
    );
    await marketplaceContract.createMarketItem(
      nftContract.address,
      erc20Contract.address,
      listingFee,
      token1id,
      price,
      { value: listingFee }
    );
    await erc20Contract.increaseAllowance(
      marketplaceContract.address,
      listingFee
    );
    await marketplaceContract.createMarketItem(
      nftContract.address,
      erc20Contract.address,
      listingFee,
      token2id,
      price,
      { value: listingFee }
    );
    // console.log("won't come here fails now")

    // Account 2 buys token 1
    const token1marketItemId = 1;
    await erc20Contract
      .connect(buyer)
      .increaseAllowance(marketplaceContract.address, price);
    await marketplaceContract
      .connect(buyer)
      .createMarketSale(
        nftContract.address,
        erc20Contract.address,
        token1marketItemId,
        { value: price }
      );

    // Account 2 puts token 1 for sale
    await nftContract
      .connect(buyer)
      .approve(marketplaceContract.address, token1id);
    await erc20Contract
      .connect(buyer)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await marketplaceContract
      .connect(buyer)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token1id,
        price,
        { value: listingFee }
      );

    // Act
    const marketItemResult =
      await marketplaceContract.getLatestMarketItemByTokenId(token1id);

    // Assert
    const marketItem = [
      BigNumber.from(3),
      nftContract.address,
      BigNumber.from(token1id),
      owner.address,
      buyer.address,
      ethers.constants.AddressZero,
      price,
      false,
      false,
    ];
    expect(marketItemResult).to.eql([marketItem, true]);
  });

  it("does not get a Market Item by a nonexistent token id", async function () {
    const { marketplaceContract } = await loadFixture(
      deployContractsAndSetAddressesFixture
    );

    // Arrange
    const tokenId = 1;

    // Act
    const marketItemResult =
      await marketplaceContract.getLatestMarketItemByTokenId(tokenId);

    // Assert
    const emptyMarketItem = [
      BigNumber.from(0),
      ethers.constants.AddressZero,
      BigNumber.from(0),
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      BigNumber.from(0),
      false,
      false,
    ];
    expect(marketItemResult).to.eql([emptyMarketItem, false]);
  });

  it("reverts a Market Item creation if listing fee is not right", async function () {
    const { marketplaceContract, owner } = await loadFixture(
      deployContractsAndSetAddressesFixture
    );

    // Arrange
    const tokenId = 1;
    const price = ethers.utils.parseEther("10");
    const listingFee = await marketplaceContract.getListingFee();
    const wrongListingFee = listingFee.div(2);
    const transactionOptions = { value: wrongListingFee };

    // Act and Assert
    expect(
      mintTokenAndCreateMarketItem(
        listingFee,
        tokenId,
        price,
        transactionOptions,
        owner
      )
    ).to.be.revertedWith("Price must be equal to listing price");
  });

  it("reverts a Market Item creation if price is 0", async function () {
    const { marketplaceContract, owner } = await loadFixture(
      deployContractsAndSetAddressesFixture
    );
    // Arrange
    const tokenId = 1;
    const price = ethers.utils.parseEther("0");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    // Act and Assert
    expect(
      mintTokenAndCreateMarketItem(
        listingFee,
        tokenId,
        price,
        transactionOptions,
        owner
      )
    ).to.be.revertedWith("Price must be at least 1 wei");
  });

  it("creates a Market Sale", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner, buyer } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    await erc20Contract.transfer(
      buyer.address,
      ethers.utils.parseEther("500000")
    );

    const tokenId = 1;
    const price = ethers.utils.parseEther("33");
    const listingFee = await marketplaceContract.getListingFee();
    await mintTokenAndCreateMarketItem(listingFee, tokenId, price, {}, owner);
    const initialOwnerBalance = await erc20Contract.balanceOf(owner.address);

    // Act
    await erc20Contract
      .connect(buyer)
      .approve(marketplaceContract.address, price);
    await marketplaceContract
      .connect(buyer)
      .createMarketSale(nftContract.address, erc20Contract.address, 1);

    // Assert
    const expectedOwnerBalance = initialOwnerBalance.add(price).add(listingFee);

    expect(await erc20Contract.balanceOf(owner.address)).to.equal(
      expectedOwnerBalance
    );
    expect(await nftContract.ownerOf(tokenId)).to.equal(buyer.address);
  });

  it("reverts a Market Sale if offer price is not the same as listing price", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner, buyer } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    const tokenId = 1;
    const listingPrice = ethers.utils.parseEther("10");
    const offerPrice = ethers.utils.parseEther("5");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    await mintTokenAndCreateMarketItem(
      listingFee,
      tokenId,
      listingPrice,
      transactionOptions,
      owner
    );

    // Act and Assert
    expect(
      marketplaceContract
        .connect(buyer)
        .createMarketSale(nftContract.address, erc20Contract.address, 1, {
          value: offerPrice,
        })
    ).to.be.revertedWith("Please submit the asking price in order to continue");
  });

  it("fetches available NFT tokens", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    const price = toWei("10");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    const token1id = 1;
    await nftContract.connect(owner).mintToken("");
    await erc20Contract
      .connect(owner)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(owner)
      .approve(marketplaceContract.address, token1id);
    await marketplaceContract
      .connect(owner)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token1id,
        price,
        transactionOptions
      );

    const token2id = 2;
    await nftContract.connect(owner).mintToken("");
    await erc20Contract
      .connect(owner)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(owner)
      .approve(marketplaceContract.address, token2id);
    await marketplaceContract
      .connect(owner)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token2id,
        price,
        transactionOptions
      );

    // await mintTokenAndCreateMarketItem(listingFee, 1, price, transactionOptions, owner)
    // await mintTokenAndCreateMarketItem(listingFee, 2, price, transactionOptions, owner)

    // Act
    const unsoldMarketItems =
      await marketplaceContract.fetchAvailableMarketItems();

    // Assert
    expect(unsoldMarketItems.length).to.equal(2);
  });

  it("fetches NFT tokens owned by msg.sender ", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner, buyer } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    const price = toWei("10");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    const token1id = 1;
    await nftContract.connect(owner).mintToken("");
    await erc20Contract
      .connect(owner)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(owner)
      .approve(marketplaceContract.address, token1id);
    await marketplaceContract
      .connect(owner)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token1id,
        price,
        transactionOptions
      );

    const token2id = 2;
    await nftContract.connect(owner).mintToken("");
    await erc20Contract
      .connect(owner)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(owner)
      .approve(marketplaceContract.address, token2id);
    await marketplaceContract
      .connect(owner)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token2id,
        price,
        transactionOptions
      );

    // await mintTokenAndCreateMarketItem(listingFee, 1, price, transactionOptions, owner)
    // await mintTokenAndCreateMarketItem(listingFee, 2, price, transactionOptions, owner)

    await erc20Contract
      .connect(buyer)
      .increaseAllowance(marketplaceContract.address, price);
    await marketplaceContract
      .connect(buyer)
      .createMarketSale(nftContract.address, erc20Contract.address, token1id, {
        value: price,
      });

    // Act
    const buyerNFTTokens = await marketplaceContract
      .connect(buyer)
      .fetchOwnedMarketItems();

    // Assert
    expect(buyerNFTTokens.length).to.equal(1);
    expect(buyerNFTTokens[0].tokenId).to.equal(token1id);
  });

  it("fetches NFT tokens that are listed by msg.sender", async function () {
    const { marketplaceContract, nftContract, erc20Contract, owner, buyer } =
      await loadFixture(deployContractsAndSetAddressesFixture);

    // Arrange
    const price = ethers.utils.parseEther("10");
    const listingFee = await marketplaceContract.getListingFee();
    const transactionOptions = { value: listingFee };

    // await mintTokenAndCreateMarketItem(listingFee, 1, price, transactionOptions, owner)
    // await mintTokenAndCreateMarketItem(listingFee, 2, price, transactionOptions, owner)
    // await mintTokenAndCreateMarketItem(listingFee, 3, price, transactionOptions, buyer)

    const token1id = 1;
    await nftContract.connect(owner).mintToken("");
    await erc20Contract
      .connect(owner)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(owner)
      .approve(marketplaceContract.address, token1id);
    await marketplaceContract
      .connect(owner)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token1id,
        price,
        transactionOptions
      );

    const token2id = 2;
    await nftContract.connect(owner).mintToken("");
    await erc20Contract
      .connect(owner)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(owner)
      .approve(marketplaceContract.address, token2id);
    await marketplaceContract
      .connect(owner)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token2id,
        price,
        transactionOptions
      );

    const token3id = 3;
    await nftContract.connect(buyer).mintToken("");
    await erc20Contract
      .connect(buyer)
      .increaseAllowance(marketplaceContract.address, listingFee);
    await nftContract
      .connect(buyer)
      .approve(marketplaceContract.address, token3id);
    await marketplaceContract
      .connect(buyer)
      .createMarketItem(
        nftContract.address,
        erc20Contract.address,
        listingFee,
        token3id,
        price,
        transactionOptions
      );

    // Act
    const buyerNFTTokens = await marketplaceContract.fetchSellingMarketItems();

    // Assert
    expect(buyerNFTTokens.length).to.equal(2);
  });
});
