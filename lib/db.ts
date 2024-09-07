import mongoose from 'mongoose'
import dbConnect from './dbConnect'
import UserModel, { User } from './models/User'

export async function createUser(userData: User): Promise<User | null> {
  await dbConnect()
  const user = new UserModel(userData)
  await user.save()
  return user.toObject()
}

export async function getUserByEmail(email: string): Promise<User | null> {
  await dbConnect()
  const user = await UserModel.findOne({ email })
  return user ? user.toObject() : null
}

export async function updateUser(id: mongoose.Types.ObjectId, updateData: Partial<User>): Promise<User | null> {
  await dbConnect()
  const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true })
  return user ? user.toObject() : null
}

export async function getUserByStoken(stoken: string): Promise<User | null> {
  await dbConnect()
  const user = await UserModel.findOne({ stoken })
  return user ? user.toObject() : null
}

export async function getUserByWalletAddress(walletAddress: string): Promise<User | null> {
  await dbConnect()
  const user = await UserModel.findOne({ walletAddresses: walletAddress })
  return user ? user.toObject() : null
}