// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PoCCEscrow is Ownable {
    
    struct Batch {
        uint256 id;
        address farmer;
        uint256 amount;
        address currentCustodian;
        string currentStage;
        bool inTransit;
        bool breachDetected;
        address liableParty;
        bool settled;
    }

    mapping(uint256 => Batch) public batches;
    
    event BatchCreated(uint256 indexed batchId, address indexed farmer, uint256 amount);
    event CustodyTransferred(uint256 indexed batchId, address indexed newCustodian, string stage);
    event BreachRecorded(uint256 indexed batchId, address indexed liableParty, string evidenceHash);
    event EscrowReleased(uint256 indexed batchId, address indexed farmer);
    event LiabilityAssigned(uint256 indexed batchId, address indexed liableParty);

    constructor() Ownable(msg.sender) {}

    function createBatch(uint256 batchId, address farmer, uint256 amount) external payable {
        require(batches[batchId].id == 0, "Batch already exists");
        
        batches[batchId] = Batch({
            id: batchId,
            farmer: farmer,
            amount: amount,
            currentCustodian: farmer,
            currentStage: "FARM",
            inTransit: true,
            breachDetected: false,
            liableParty: address(0),
            settled: false
        });

        emit BatchCreated(batchId, farmer, amount);
    }

    function transferCustody(uint256 batchId, address newCustodian, string memory stage) external {
        Batch storage batch = batches[batchId];
        require(batch.id != 0, "Batch does not exist");
        require(!batch.settled, "Batch already settled");
        
        batch.currentCustodian = newCustodian;
        batch.currentStage = stage;

        emit CustodyTransferred(batchId, newCustodian, stage);
    }

    function recordSensorBreach(uint256 batchId, address liableParty, string memory evidenceHash) external {
        Batch storage batch = batches[batchId];
        require(batch.id != 0, "Batch does not exist");
        require(!batch.settled, "Batch already settled");
        require(!batch.breachDetected, "Breach already recorded");

        batch.breachDetected = true;
        batch.liableParty = liableParty;

        emit BreachRecorded(batchId, liableParty, evidenceHash);
    }

    function releaseToFarmer(uint256 batchId) external {
        Batch storage batch = batches[batchId];
        require(batch.id != 0, "Batch does not exist");
        require(!batch.settled, "Batch already settled");
        require(!batch.breachDetected, "Breach detected, liability must be penalized");
        
        batch.settled = true;
        batch.inTransit = false;

        emit EscrowReleased(batchId, batch.farmer);
        // Note: Real ETH/POL transfer would go here
        // payable(batch.farmer).transfer(batch.amount);
    }

    function penalizeLiableParty(uint256 batchId) external {
        Batch storage batch = batches[batchId];
        require(batch.id != 0, "Batch does not exist");
        require(!batch.settled, "Batch already settled");
        require(batch.breachDetected, "No breach detected");

        batch.settled = true;
        batch.inTransit = false;

        emit LiabilityAssigned(batchId, batch.liableParty);
        // Note: Logic for compensating the affected party or penalizing the liable party goes here
    }

    function getBatch(uint256 batchId) external view returns (Batch memory) {
        return batches[batchId];
    }
}
