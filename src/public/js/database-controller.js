const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:10101", { useUnifiedTopology: true });

/**
 * @async the function is asynchronous
 * Connects the client to the local MongoDB database server
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
 * @argument planeToInsert object that will be inserted in database
 */
insertInDatabase = async (planeToInsert) => {
    if (client.isConnected())
        client.db("planeinterceptor").collection("flights").insertOne(planeToInsert).catch((err) => console.log(err));
    else
        console.log("client is not connected")
}

/**
 * Updates the first object that finds in the flights collection
 * @async the function is asynchronous
 * @param planeToUpdate object that contains the fields to locate the object to update
 * @param newData object with the fields and their new value
 */
updateInDatabase = async (planeToUpdate, newData) => {
    if (client.isConnected())
        client.db("planeinterceptor").collection("flights").updateOne(planeToUpdate, {$set: newData})

}

/**
 * Finds the an object in the flights collection
 * @param options fields to locate the object to return. Default {}
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
 * @param options options to count in database. Default {}
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
//setTimeout(insertInDatabase, 1000, {plane: "4", w: 2, a: 908});
//setTimeout(updateInDatabase, 2000, {plane: "4"}, {w: 3, a: 4});
//setTimeout(findInDatabase, 3000, {plane: "4"});

module.exports = {
    insertInDatabase,
    updateInDatabase,
    findInDatabase,
    countInDatabase
} 