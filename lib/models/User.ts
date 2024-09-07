import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Please provide a username'],
  },
  walletAddresses: [{
    type: String,
    required: [true, 'Please provide at least one wallet address'],
  }],
  stoken: {
    type: String,
    required: [true, 'Please provide an stoken'],
  },
})

export interface User extends mongoose.Document {
  email: string
  username: string
  walletAddresses: string[]
  stoken: string
}

const UserModel = mongoose.models.User || mongoose.model<User>('User', UserSchema)

export default UserModel