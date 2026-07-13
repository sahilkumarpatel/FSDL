require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('./models/User');

const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5001;
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@campuscare.local';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

async function seedDefaultAdmin() {
  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await User.create({
    name: DEFAULT_ADMIN_NAME,
    email: DEFAULT_ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin'
  });

  console.log(`Seeded default admin account: ${DEFAULT_ADMIN_EMAIL}`);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  return seedDefaultAdmin();
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
