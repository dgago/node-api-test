const { MongoClient, ObjectID } = require("mongodb");

(async function() {
    // Connection URL
    const url = "mongodb://13.65.32.65:17510/desa-tucarpeta";
    // Database Name
    const dbName = "desa-tucarpeta";
    let client;

    try {
        // Use connect method to connect to the Server
        client = await MongoClient.connect(url);

        const db = client.db(dbName);

        let docs = await db.collection("idoc.roles").find({}).toArray();

        console.log("docs");
        console.log(JSON.stringify(docs, undefined, 2));
    } catch (err) {
        console.log(err.stack);
    }

    if (client) {
        client.close();
    }
})();
