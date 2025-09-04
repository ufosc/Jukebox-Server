import { IsNotEmpty, IsString } from "class-validator";

export class SetPlayerDeviceDto {
  @IsNotEmpty()
  @IsString()
  device_id: string
}
