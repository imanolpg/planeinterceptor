const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:10101", { useUnifiedTopology: true });

/**
 * Connects the client to the local MongoDB database server
 * @async the function is asynchronous
 */
connectDatabase = async () => {
    try {
        await client.connect();
    } catch (err) {
        console.log(err);
    }
}

/**
 * Inserts in the flights colection of the database
 * @async the function is asynchronous
 * @argument {object} planeToInsert object that will be inserted in database
 */
insertInDatabase = async (planeToInsert) => {
    if (client.isConnected())
        client.db("planeinterceptor").collection("flights").insertOne(planeToInsert).catch((err) => console.log(err));
}

/**
 * Updates the first object that finds in the flights collection
 * @async the function is asynchronous
 * @param {object} planeToUpdate object that contains the fields to locate the object to update
 * @param {object} newData object with the fields and their new value
 */
updateInDatabase = async (planeToUpdate, newData) => {
    if (client.isConnected())
        client.db("planeinterceptor").collection("flights").updateOne(planeToUpdate, {$set: newData});
}

/**
 * Finds the an object in the flights collection
 * @param {object} options fields to locate the object to return
 */
findInDatabase = (options = {}) => {
    return new Promise ((resolve, reject) => {
        try{
            return resolve(client.db("planeinterceptor").collection("flights").find(options).toArray());
        } catch (err) {
            return reject(err);
        }
    });
    
}

/**
 * Counts the amount of documents in the database with the options passed as parameter
 * @param {object} options options to count in database. Default {}
 */
countInDatabase = (options = {}) => {
    return new Promise((resolve, reject) => {
        try {
            return resolve(client.db("planeinterceptor").collection("flights").find(options).count());
        } catch (err) {
            return reject(err);
        }
    });
}

connectDatabase();

module.exports = {
    insertInDatabase,
    updateInDatabase,
    findInDatabase,
    countInDatabase
} 