import { Status } from '@config/enum';
import { IsNumber, IsString, IsOptional, IsArray } from 'class-validator';

export class EnventUDDto {
  @IsString()
  name: string;
  @IsString()
  event_date: Date;
  @IsString()
  start_time: string;
  @IsString()
  end_time: string;
  @IsString()
  location: string;
  @IsString()
  blood_count: string;
  @IsString()
  content: string;
  @IsString()
  @IsOptional()
  blood_type: string;
  @IsString()
  status?: Status;
  @IsArray() // Kiểm tra là mảng
  @IsNumber({}, { each: true }) // Kiểm tra mỗi phần tử trong mảng là số
  @IsOptional()
  user_id: number[];

  @IsArray() // Kiểm tra là mảng
  @IsOptional()
  noteHistory?: { user_id: number /* các thuộc tính khác nếu cần */ }[]; // Thêm thuộc tính noteHistory
}
