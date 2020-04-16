// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require('SupplyChain')
const truffleAssert = require('truffle-assertions')

contract('SupplyChain', function(accounts) {
    // Declare few constants and assign a few sample accounts generated by ganache-cli
    var   sku = 1
    var   upc = 1
    const ownerID = accounts[1]
    const originAuthorID = accounts[1]
    const originAuthorName = "Jasper Swift"
    const originAuthorInformation = "a mysterious character"
    var   productID = sku + upc
    const productNotes = "#1 New York Times Bestseller"
    const productPrice = web3.utils.toWei('1', "ether")
    var   itemState = 0
    const editorID = accounts[2]
    const designerID = accounts[3]
    const consumerID = accounts[4]
    const emptyAddress = '0x00000000000000000000000000000000000000'

    console.log("ganache-cli accounts used here...")
    console.log("Contract Owner: accounts[1] ", accounts[1])
    console.log("Author: accounts[1] ", accounts[1])
    console.log("Editor: accounts[2] ", accounts[2])
    console.log("Designer: accounts[3] ", accounts[3])
    console.log("Consumer: accounts[4] ", accounts[4])

    // 1st Test
    it("Testing smart contract function writeBook() that allows an author to write a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        await supplyChain.addAuthor(originAuthorID)

        // Mark a book as Written by calling function writeBook()
        let result = await supplyChain.writeBook(upc, originAuthorID, originAuthorName, originAuthorInformation, productNotes)

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], ownerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originAuthorID, 'Error: Missing or Invalid originAuthorID')
        assert.equal(resultBufferOne[4], originAuthorName, 'Error: Missing or Invalid originAuthorName')
        assert.equal(resultBufferOne[5], originAuthorInformation, 'Error: Missing or Invalid originAuthorInformation')
        assert.equal(resultBufferTwo[5], 0, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Written')
    })

    // 2nd Test
    it("Testing smart contract function sendForEditing() that allows an author to send a book for editing", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as SentForEditing by calling function sendForEditing()
        let result = await supplyChain.sendForEditing(upc, { from: originAuthorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'SentForEditing')
    })

    // 3rd Test
    it("Testing smart contract function editBook() that allows an editor to edit a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        await supplyChain.addEditor(editorID)

        // Mark an item as SentForEditing by calling function sendForEditing()
        let result = await supplyChain.editBook(upc, { from: editorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[6], editorID, 'Error: Missing or invalid editorID')
        truffleAssert.eventEmitted(result, 'Edited')
    })

    // 4th Test
    it("Testing smart contract function finishFinalDraft() that allows an author to finish the final draft of a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as SentForEditing by calling function sendForEditing()
        let result = await supplyChain.finishFinalDraft(upc, { from: originAuthorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'FinalDraft')
    })

    // 5th Test
    it("Testing smart contract function sendForDesign() that allows an author to send a book for designing", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as SentForEditing by calling function sendForEditing()
        let result = await supplyChain.sendForDesign(upc, { from: originAuthorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'SentForDesign')
    })

    // 6th Test
    it("Testing smart contract function designBook() that allows a designer to design a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        await supplyChain.addDesigner(designerID)

        // Mark an item as SentForEditing by calling function sendForEditing()
        let result = await supplyChain.designBook(upc, { from: designerID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[7], designerID, 'Error: Missing or invalid designerID')
        truffleAssert.eventEmitted(result, 'Designed')
    })

    // 7th Test
    it("Testing smart contract function publishBook() that allows an author to publish a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as SentForEditing by calling function sendForEditing()
        let result = await supplyChain.publishBook(upc, productPrice, { from: originAuthorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item price')
        assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Published')
    })

    // 8th Test
    it("Testing smart contract function advertiseBook() that allows an author to advertise a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Mark an item as Advertised by calling function advertiseBook()
        let result = await supplyChain.advertiseBook(upc, { from: originAuthorID })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State')
        truffleAssert.eventEmitted(result, 'Advertised')
    })

    // 9th Test
    it("Testing smart contract function buyBook() that allows a consumer to buy a book", async() => {
        const supplyChain = await SupplyChain.deployed()

        await supplyChain.addConsumer(consumerID)

        // Mark an item as Sold by calling function buyBook()
        let result = await supplyChain.buyBook(upc, { from: consumerID, value: productPrice })

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set
        assert.equal(resultBufferOne[2], consumerID, 'Error: Invalid ownerID')
        assert.equal(resultBufferTwo[5], 8, 'Error: Invalid item State')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid consumerID')
        truffleAssert.eventEmitted(result, 'Purchased')
    })

    // 10th Test
    it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc)

        // Verify the result set:
        assert.equal(resultBufferOne[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferOne[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferOne[2], consumerID, 'Error: Missing or Invalid ownerID')
        assert.equal(resultBufferOne[3], originAuthorID, 'Error: Missing or Invalid originAuthorID')
        assert.equal(resultBufferOne[4], originAuthorName, 'Error: Missing or Invalid originAuthorName')
        assert.equal(resultBufferOne[5], originAuthorInformation, 'Error: Missing or Invalid originAuthorInformation')
    })

    // 11th Test
    it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async() => {
        const supplyChain = await SupplyChain.deployed()

        // Retrieve the just now saved item from blockchain by calling function fetchItem()
        const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc)

        // Verify the result set:
        assert.equal(resultBufferTwo[0], sku, 'Error: Invalid item SKU')
        assert.equal(resultBufferTwo[1], upc, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[2], productID, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[3], productNotes, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[4], productPrice, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[5], 8, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[6], editorID, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[7], designerID, 'Error: Invalid item UPC')
        assert.equal(resultBufferTwo[8], consumerID, 'Error: Invalid item UPC')
    })

});
