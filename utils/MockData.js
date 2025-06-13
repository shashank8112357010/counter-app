export const mockUsers = [
  {
    id: "1",
    firstName: "Emma",
    lastName: "Johnson",
    email: "emma@example.com",
    password: "password123",
    age: 25,
    bio: "Love traveling, yoga, and trying new cuisines. Looking for genuine connections and meaningful conversations. 🌟",
    photos: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b302?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop",
    ],
    interests: ["Travel", "Yoga", "Cooking", "Reading"],
    isOnline: true,
    lastSeen: new Date().toISOString(),
    location: "New York, NY",
    occupation: "Graphic Designer",
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael@example.com",
    password: "password123",
    age: 28,
    bio: "Software engineer by day, rock climber by weekend. Always up for an adventure or a good coffee chat. ☕🧗‍♂️",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop",
    ],
    interests: ["Rock Climbing", "Coffee", "Technology", "Hiking"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(),
    location: "San Francisco, CA",
    occupation: "Software Engineer",
  },
  {
    id: "3",
    firstName: "Sofia",
    lastName: "Rodriguez",
    email: "sofia@example.com",
    password: "password123",
    age: 23,
    bio: "Artist and dreamer. I paint emotions and capture moments. Looking for someone who appreciates art and life. 🎨",
    photos: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=400&h=600&fit=crop",
    ],
    interests: ["Art", "Photography", "Music", "Dancing"],
    isOnline: true,
    lastSeen: new Date().toISOString(),
    location: "Los Angeles, CA",
    occupation: "Artist",
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Wilson",
    email: "james@example.com",
    password: "password123",
    age: 30,
    bio: "Fitness enthusiast and dog lover. Believe in living life to the fullest. Let's explore the city together! 🐕💪",
    photos: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
    ],
    interests: ["Fitness", "Dogs", "Running", "Outdoor Activities"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000).toISOString(),
    location: "Chicago, IL",
    occupation: "Personal Trainer",
  },
  {
    id: "5",
    firstName: "Lily",
    lastName: "Zhang",
    email: "lily@example.com",
    password: "password123",
    age: 26,
    bio: "Book lover and tea enthusiast. Always searching for the next great story, both in books and in life. 📚🍵",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    ],
    interests: ["Reading", "Tea", "Writing", "Museums"],
    isOnline: true,
    lastSeen: new Date().toISOString(),
    location: "Seattle, WA",
    occupation: "Librarian",
  },
  {
    id: "6",
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex@example.com",
    password: "password123",
    age: 27,
    bio: "Musician and foodie. Life is too short for bad music and bland food. Let's discover new places together! 🎵🍕",
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=600&fit=crop",
    ],
    interests: ["Music", "Food", "Concerts", "Guitar"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 1800000).toISOString(),
    location: "Austin, TX",
    occupation: "Musician",
  },
  {
    id: "7",
    firstName: "Maya",
    lastName: "Patel",
    email: "maya@example.com",
    password: "password123",
    age: 24,
    bio: "Medical student with a passion for helping others. Love dancing, good movies, and deep conversations. 💃🎬",
    photos: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=600&fit=crop",
    ],
    interests: ["Medicine", "Dancing", "Movies", "Volunteering"],
    isOnline: true,
    lastSeen: new Date().toISOString(),
    location: "Boston, MA",
    occupation: "Medical Student",
  },
  {
    id: "8",
    firstName: "Ryan",
    lastName: "Murphy",
    email: "ryan@example.com",
    password: "password123",
    age: 29,
    bio: "Entrepreneur and world traveler. Building the future one startup at a time. Always ready for the next adventure! ✈️💡",
    photos: [
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=600&fit=crop",
    ],
    interests: ["Entrepreneurship", "Travel", "Innovation", "Networking"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 5400000).toISOString(),
    location: "Miami, FL",
    occupation: "Entrepreneur",
  },
];

export const generateMockMessage = (senderId, receiverId, type = "text") => {
  const textMessages = [
    "Hey there! How's your day going?",
    "I loved your photos! That trip looked amazing.",
    "What do you like to do for fun?",
    "Coffee sometime this week?",
    "Your profile caught my eye 😊",
    "I see we both love hiking!",
    "That's such an interesting hobby!",
    "I'd love to hear more about that.",
    "Hope you're having a great day!",
    "Thanks for the match! 💕",
  ];

  const message = {
    id: Date.now().toString() + Math.random(),
    senderId,
    receiverId,
    type,
    timestamp: new Date().toISOString(),
    read: false,
  };

  switch (type) {
    case "text":
      message.content =
        textMessages[Math.floor(Math.random() * textMessages.length)];
      break;
    case "image":
      message.content =
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop";
      message.caption = "Check out this view!";
      break;
    case "audio":
      message.content = "audio_message.mp3";
      message.duration = Math.floor(Math.random() * 60) + 5; // 5-65 seconds
      break;
    case "video":
      message.content = "video_message.mp4";
      message.duration = Math.floor(Math.random() * 30) + 10; // 10-40 seconds
      message.thumbnail =
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop";
      break;
  }

  return message;
};
