const mongoose = require('mongoose');
const User = require('../models/User');
const Event = require('../models/Event');
require('dotenv').config();

const events = [
  {
    title: "Amr Diab Live in Concert",
    description: "Experience the legendary Amr Diab live in concert! Join us for an unforgettable night of Arabic pop music with the Mediterranean superstar.",
    date: new Date('2024-04-15'),
    time: "20:00",
    location: {
      name: "Cairo International Stadium",
      address: "Nasr City",
      city: "Cairo",
      area: "Nasr City"
    },
    category: "Concert",
    ticketTypes: [
      {
        type: "VIP",
        price: 2000,
        quantity: 100,
        available: 100
      },
      {
        type: "Premium",
        price: 1200,
        quantity: 200,
        available: 200
      },
      {
        type: "Regular",
        price: 600,
        quantity: 500,
        available: 500
      }
    ],
    image: "https://i.ytimg.com/vi/dFr0OtKrRpI/maxresdefault.jpg",
    status: "upcoming"
  },
  {
    title: "Manchester City vs Real Madrid - UCL Final",
    description: "The UEFA Champions League Final comes to Egypt! Watch the epic clash between Manchester City and Real Madrid at the magnificent Borg El Arab Stadium. Experience European football's biggest night in Alexandria!",
    date: new Date('2024-06-15'),
    time: "21:00",
    location: {
      name: "Borg El Arab Stadium",
      address: "Borg El Arab",
      city: "Alexandria",
      area: "Borg El Arab"
    },
    category: "Sports",
    ticketTypes: [
      {
        type: "VIP Box",
        price: 5000,
        quantity: 50,
        available: 50
      },
      {
        type: "Category 1",
        price: 3000,
        quantity: 1000,
        available: 1000
      },
      {
        type: "Category 2",
        price: 2000,
        quantity: 2000,
        available: 2000
      },
      {
        type: "Category 3",
        price: 1000,
        quantity: 3000,
        available: 3000
      }
    ],
    image: "https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt109c9c12baef2b36/64766e6d5517ed4e399cd0f9/Champions_League_final_2024.jpg",
    status: "upcoming"
  },
  {
    title: "Cairo International Film Festival",
    description: "Join us for the 46th edition of the Cairo International Film Festival, featuring premieres of the best films from around the world.",
    date: new Date('2024-05-01'),
    time: "18:00",
    location: {
      name: "Cairo Opera House",
      address: "El Gezira",
      city: "Cairo",
      area: "Zamalek"
    },
    category: "Festival",
    ticketTypes: [
      {
        type: "Festival Pass",
        price: 1500,
        quantity: 200,
        available: 200
      },
      {
        type: "Daily Pass",
        price: 300,
        quantity: 1000,
        available: 1000
      }
    ],
    image: "https://media.gemini.media/img/large/2018/11/20/2018_11_20_12_25_25_850.jpg",
    status: "upcoming"
  },
  {
    title: "Mohamed Hamaki Concert",
    description: "Don't miss Mohamed Hamaki's explosive performance! Experience his greatest hits live.",
    date: new Date('2024-04-20'),
    time: "21:00",
    location: {
      name: "New Capital Arena",
      address: "New Administrative Capital",
      city: "Cairo",
      area: "New Cairo"
    },
    category: "Concert",
    ticketTypes: [
      {
        type: "Golden Circle",
        price: 1800,
        quantity: 150,
        available: 150
      },
      {
        type: "Silver",
        price: 1000,
        quantity: 300,
        available: 300
      },
      {
        type: "Regular",
        price: 500,
        quantity: 600,
        available: 600
      }
    ],
    image: "https://media.gemini.media/img/large/2021/9/5/2021_9_5_1_27_11_405.jpg",
    status: "upcoming"
  },
  {
    title: "Al Ahly vs Zamalek Derby",
    description: "The biggest match in Egyptian football! Watch the Cairo derby live at the stadium.",
    date: new Date('2024-05-10'),
    time: "19:00",
    location: {
      name: "Cairo International Stadium",
      address: "Nasr City",
      city: "Cairo",
      area: "Nasr City"
    },
    category: "Sports",
    ticketTypes: [
      {
        type: "Main Tribune",
        price: 500,
        quantity: 1000,
        available: 1000
      },
      {
        type: "First Class",
        price: 300,
        quantity: 2000,
        available: 2000
      },
      {
        type: "Second Class",
        price: 150,
        quantity: 3000,
        available: 3000
      }
    ],
    image: "https://cdn.almalnews.com/wp-content/uploads/2020/11/%D8%A7%D9%84%D8%A3%D9%87%D9%84%D9%8A-%D9%88%D8%A7%D9%84%D8%B2%D9%85%D8%A7%D9%84%D9%83.jpg",
    status: "upcoming"
  },
  {
    title: "Hamlet - Arabic Adaptation",
    description: "Experience Shakespeare's masterpiece with an Egyptian twist at the iconic Cairo Opera House.",
    date: new Date('2024-04-25'),
    time: "19:30",
    location: {
      name: "Cairo Opera House",
      address: "El Gezira",
      city: "Cairo",
      area: "Zamalek"
    },
    category: "Theater",
    ticketTypes: [
      {
        type: "Premium",
        price: 400,
        quantity: 200,
        available: 200
      },
      {
        type: "Standard",
        price: 250,
        quantity: 300,
        available: 300
      }
    ],
    image: "https://media.timeout.com/images/105743233/750/422/image.jpg",
    status: "upcoming"
  },
  {
    title: "Cairo Fashion Week",
    description: "Experience the latest in Egyptian and Middle Eastern fashion with top designers and brands.",
    date: new Date('2024-05-15'),
    time: "16:00",
    location: {
      name: "Royal Maxim Palace Kempinski",
      address: "New Cairo",
      city: "Cairo",
      area: "New Cairo"
    },
    category: "Exhibition",
    ticketTypes: [
      {
        type: "VIP Week Pass",
        price: 2500,
        quantity: 100,
        available: 100
      },
      {
        type: "Regular Week Pass",
        price: 1200,
        quantity: 300,
        available: 300
      },
      {
        type: "Daily Pass",
        price: 300,
        quantity: 500,
        available: 500
      }
    ],
    image: "https://www.cairofashionweek.com/wp-content/uploads/2023/10/DSC_7766-scaled.jpg",
    status: "upcoming"
  },
  {
    title: "Tamer Hosny Live",
    description: "Join the King of Generation for an amazing night of music and entertainment!",
    date: new Date('2024-06-01'),
    time: "20:30",
    location: {
      name: "Al Manara Arena",
      address: "New Cairo",
      city: "Cairo",
      area: "New Cairo"
    },
    category: "Concert",
    ticketTypes: [
      {
        type: "VVIP",
        price: 2500,
        quantity: 50,
        available: 50
      },
      {
        type: "VIP",
        price: 1500,
        quantity: 200,
        available: 200
      },
      {
        type: "Regular",
        price: 750,
        quantity: 400,
        available: 400
      }
    ],
    image: "https://www.cairo24.com/Upload/libfiles/50/5/749.jpg",
    status: "upcoming"
  }
];

const seedEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an organizer user (or create one if doesn't exist)
    let organizer = await User.findOne({ role: 'organizer' });
    if (!organizer) {
      organizer = await User.create({
        name: 'Event Organizer',
        email: 'organizer@example.com',
        password: 'password123',
        role: 'organizer',
        phone: '01123456789',
        address: {
          street: 'Organizer Street',
          area: 'Maadi',
          city: 'Cairo'
        }
      });
    }

    // Add organizer reference to each event
    const eventsWithOrganizer = events.map(event => ({
      ...event,
      organizer: organizer._id
    }));

    // Clear existing events
    await Event.deleteMany({});

    // Insert new events
    await Event.insertMany(eventsWithOrganizer);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedEvents(); 