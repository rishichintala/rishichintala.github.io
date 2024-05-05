// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint256 id;
        address seller;
        string title;
        string description;
        uint256 price; // Price in wei
        bool isSold;
    }

    Item[] public items;
    mapping(uint256 => address) public itemToSeller;

    event ItemListed(uint256 indexed id, address indexed seller, string title, uint256 price);
    event ItemPurchased(uint256 indexed id, address indexed buyer, uint256 price);

    // Function to list an item on the marketplace
    function listItem(string memory _title, string memory _description, uint256 _price) external {
        require(_price > 0, "Price must be greater than zero");

        uint256 itemId = items.length;
        Item memory newItem = Item(itemId, msg.sender, _title, _description, _price, false);
        items.push(newItem);
        itemToSeller[itemId] = msg.sender;

        emit ItemListed(itemId, msg.sender, _title, _price);
    }

    // Function to purchase an item
    function purchaseItem(uint256 _itemId) external payable {
        require(_itemId < items.length, "Invalid item ID");
        Item storage item = items[_itemId];
        require(!item.isSold, "Item is already sold");
        require(msg.value >= item.price, "Insufficient funds");

        item.isSold = true;
        payable(item.seller).transfer(item.price);

        emit ItemPurchased(_itemId, msg.sender, item.price);
    }

    // Function to retrieve details about an item
    function getItem(uint256 _itemId) external view returns (uint256 id, address seller, string memory title, string memory description, uint256 price, bool isSold) {
        require(_itemId < items.length, "Invalid item ID");
        Item memory item = items[_itemId];
        return (item.id, item.seller, item.title, item.description, item.price, item.isSold);
    }

    // Function to get the total count of items in the marketplace
    function itemsCount() public view returns (uint256) {
        return items.length;
    }
}
