const admin = require("firebase-admin");

const serviceAccount = require('./chat-18604-firebase-adminsdk-tqlo7-61390cda9d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chat-18604.firebaseio.com"
});

const db = admin.firestore();

const lines = [
    'Yes. Yes, It Is... In Prison!',
    'Unagi Is A Total State Of Awareness.',
    'You-You-You... You Threw My Sandwich Away...',
    `I Grew Up In A House With Monica, Okay. If You Didn't Eat Fast, You Didn't Eat.`,
    'I Am This Close To Tugging On My Testicles Again.'
]

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function handleNewMessage(db, botName) {
    const collection = db.collection('chats').doc(botName).collection('messages');

    const observer = collection.onSnapshot(collectionSnapshot => {
        const changes = collectionSnapshot.docChanges();
        const docs = changes.map(x => x.doc.data());
        const lastMessage = docs[0];

        if (lastMessage && lastMessage.author && lastMessage.author != botName) {
            const index = getRandomInt(5);
            const message = lines[index];

            const delay = (getRandomInt(4) + 1) * 1000;
            setTimeout(() => {
                db.collection('chats').doc(botName).collection('messages').add({
                    author: botName,
                    content: message,
                    createdAt: Date.now()
                });
            }, delay);

        }
    }, err => {
        console.log(`Encountered error: ${err}`);
    });
}

handleNewMessage(db, 'ross');
handleNewMessage(db, 'rachel');
handleNewMessage(db, 'monica');
handleNewMessage(db, 'chandler');
handleNewMessage(db, 'phoebe');