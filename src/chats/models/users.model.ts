import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

const options: SchemaOptions = {
  timestamps: true,
  id: false,
};

@Schema(options)
export class User extends Document {
  @Prop({
    unique: true,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  socketId: string;

  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
