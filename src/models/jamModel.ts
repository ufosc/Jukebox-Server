import mongoose, { Types } from 'mongoose'

const generateJoinCode = (): string => {
  const length = 6
  const str = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''

  for (let i = 1; i <= length; i++) {
    const char = Math.floor(Math.random() * str.length + 1)

    code += str.charAt(char)
  }

  return code
}

// TODO: Guests can join a jam
const jamSchema = new mongoose.Schema({
  groupId: {
    type: Types.ObjectId,
    required: true,
    ref: 'Group'
  },
  joinCode: {
    type: String,
    default: generateJoinCode
  }
})

export const Jam = mongoose.model('Jam', jamSchema)
export type Jam = InstanceType<typeof Jam>
