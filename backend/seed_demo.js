const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/MERN_AUCTION_PLATFORM').then(async () => {
  const db = mongoose.connection.db;
  const user = await db.collection('users').findOne({});
  const userId = user ? user._id : new mongoose.Types.ObjectId();
  
  const demoItems = [
    {
      title: "MacBook Pro M3",
      category: "Electronics",
      currentBid: 1500,
      startingBid: 1000,
      image: {
        url: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
        public_id: "demo_macbook"
      },
      condition: "New",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      createdBy: userId,
      bids: [],
      description: "Brand new MacBook Pro M3. Sealed in box.",
      createdAt: new Date()
    },
    {
      title: "Rolex Watch",
      category: "Luxury",
      currentBid: 5500,
      startingBid: 4000,
      image: {
        url: "https://images.pexels.com/photos/9978721/pexels-photo-9978721.jpeg",
        public_id: "demo_rolex"
      },
      condition: "Excellent",
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      createdBy: userId,
      bids: [],
      description: "Excellent condition Rolex Watch. Comes with original papers.",
      createdAt: new Date()
    }
  ];

  for (const item of demoItems) {
    await db.collection('auctions').updateOne(
      { title: item.title },
      { $set: item },
      { upsert: true }
    );
  }
  
  console.log('Demo items added/updated successfully.');
  process.exit(0);
});
