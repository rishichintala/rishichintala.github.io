const contractAddress = "0x1232359557db5ac1f88ae8f82770a7a2e4fb0287"; // Deployed contract address
    const contractABI = [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ItemListed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "buyer",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "ItemPurchased",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_price",
                    "type": "uint256"
                }
            ],
            "name": "listItem",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_itemId",
                    "type": "uint256"
                }
            ],
            "name": "purchaseItem",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_itemId",
                    "type": "uint256"
                }
            ],
            "name": "getItem",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isSold",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "items",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "seller",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isSold",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "itemsCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "itemToSeller",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
const sepoliaEtherscanBaseUrl = 'https://sepolia.etherscan.io/tx/';
let contract;
let userAccount;

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(contractABI, contractAddress);
            userAccount = (await web3.eth.getAccounts())[0];
            loadItems();
            alert("Wallet connected successfully!!");
        } catch (error) {
            console.error("Could not connect to wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
    } else {
        alert("Please install MetaMask!");
    }
}


async function loadItems() {
    const itemCount = await contract.methods.itemsCount().call();
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '<h2>Listed Items</h2>';
    for (let i = 0; i < itemCount; i++) {
        const item = await contract.methods.getItem(i).call();
        appendItemToDOM(item, itemsDiv);
    }
}

function appendItemToDOM(item, itemsDiv) {
    const itemDiv = document.createElement('div');
    itemDiv.id = `item-${item.id}`;
    itemDiv.innerHTML = `
        <p>
            <strong>Title:</strong> ${he.encode(item.title)}<br>
            <strong>Description:</strong> ${he.encode(item.description)}<br>
            <strong>Price:</strong> ${web3.utils.fromWei(item.price, 'ether')} ETH<br>
            <strong>Status:</strong> ${item.isSold ? 'Sold' : 'Available'}
            ${!item.isSold ? `<button onclick="purchaseItem(${item.id})" id='buyBtn'>Buy <i class="fa-solid fa-coins"></i> </button>` : ''}
        </p>
        <div id="hash-${item.id}"></div>
    `;
    itemsDiv.appendChild(itemDiv);
    // let hashes = JSON.parse(localStorage.getItem('transactionHashes') || '{}');
    // if (hashes[item.id]) {
    //     displayTransactionHashes(hashes[item.id], item.id);
    // }
}

function displayTransactionHashes(hashes, itemId) {
    const hashDisplayDiv = document.getElementById(`hash-${itemId}`);
    if (!hashDisplayDiv) {
        console.error(`Failed to find hash display div for item ${itemId}`);
        return;
    }
    hashDisplayDiv.innerHTML = ''; // Clear previous entries if any

    if (hashes['Listed']) {
        hashDisplayDiv.innerHTML += `<p id='hash'>Listed Hash: <a href="${sepoliaEtherscanBaseUrl}${hashes['Listed']}" target="_blank">${hashes['Listed']}</a></p>`;
    }
    if (hashes['Purchased']) {
        hashDisplayDiv.innerHTML += `<p id='hash'>Purchased Hash: <a href="${sepoliaEtherscanBaseUrl}${hashes['Purchased']}" target="_blank">${hashes['Purchased']}</a></p>`;
    }
}

document.getElementById('listItemForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    await listItem(title, description, price);
});

async function listItem(title, description, price) {
    const priceInWei = web3.utils.toWei(price, 'ether');
    contract.methods.listItem(title, description, priceInWei).send({ from: userAccount })
        .on('transactionHash', function(hash){
        })
        .on('receipt', async function(receipt) {
            if (receipt.events.ItemListed && receipt.events.ItemListed.returnValues) {
                const newItemId = receipt.events.ItemListed.returnValues.id;

                if (confirm(`List Completed: ${receipt.transactionHash}. Do you wanna see the confirmation block?`)) {
                    window.open(`${sepoliaEtherscanBaseUrl}${receipt.transactionHash}`, '_blank');
                }

                // storeHash(newItemId, 'Listed', receipt.transactionHash);
                await loadItems();
                resetForm();
            } else {
                console.error('ItemListed event not found in the receipt:', receipt);
            }
        })
        .on('error', function(error) {
            console.error('Failed to list item:', error);
            alert('Failed to list item: ' + error.message);
        });
}

async function purchaseItem(itemId) {
    const item = await contract.methods.getItem(itemId).call();
    contract.methods.purchaseItem(itemId).send({
        from: userAccount,
        value: item.price
    })
    .on('receipt', async function(receipt) {
        if (confirm(`Purchase Completed: ${receipt.transactionHash}. Do you wanna see the confirmation block?`)) {
            window.open(`${sepoliaEtherscanBaseUrl}${receipt.transactionHash}`, '_blank');
        }

        await loadItems();
    })
    .on('error', function(error) {
        alert('Failed to purchase item: ' + error.message);
    });
}

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
}
