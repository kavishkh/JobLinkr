import mongoose from 'mongoose';

async function check() {
  try {
    await mongoose.connect('mongodb+srv://kavishkhanna06_db_user:Kavish12@cluster0.ggl0ry3.mongodb.net/joblinkr?retryWrites=true&w=majority');
    const user = await mongoose.connection.collection('users').findOne({ email: 'kavishkhanna06@gmail.com' });
    console.log(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

check();
