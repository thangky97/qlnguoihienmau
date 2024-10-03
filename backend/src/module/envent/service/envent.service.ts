import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Envent } from '@module/envent/entity/envent.entity';
import { EnventDto } from '@module/envent/dto/envent.dto';

import { FindOneOptions, Like, Repository } from 'typeorm';
import { EnventFilterDto } from '@module/envent/dto/envent.filter.dto';
import { Status } from '@config/enum';
import { EnventUDDto } from '@module/envent/dto/enventUD.dto';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';
import { RegisterDonateBlood } from '@module/register_donate_blood/entity/register_donate_blood.entity';

@Injectable()
export class EnventService {
  constructor(
    @InjectRepository(Envent) private readonly enventRepository: Repository<Envent>,
    private readonly commonService: CommonService,
    @InjectRepository(NoteHistoryContract) private readonly noteHistoryRepository: Repository<NoteHistoryContract>,
    @InjectRepository(RegisterDonateBlood) private readonly registerDonateRepository: Repository<RegisterDonateBlood>,
  ) {}

  async findOne(query: FindOneOptions): Promise<Envent> {
    return await this.enventRepository.findOne(query);
  }

  // async create(envent: EnventDto) {
  //   try {
  //     const newEnvent = await this.enventRepository.save(envent);
  //     return newEnvent;
  //   } catch (error) {
  //     return error;
  //   }
  // }

  async create(envent: EnventDto, user_id_array: number[]) {
    try {
      // Lưu sự kiện vào cơ sở dữ liệu
      const newEnvent = await this.enventRepository.save(envent);

      if (newEnvent) {
        // Lặp qua từng user_id trong mảng và lưu vào bảng noteHistory
        for (const user_id of user_id_array) {
          const newNoteHistory = this.noteHistoryRepository.create({
            envent_id: newEnvent.id,
            user_id: user_id, // Lưu từng user_id riêng biệt
          });

          await this.noteHistoryRepository.save(newNoteHistory);
        }

        return newEnvent;
      }

      return null;
    } catch (error) {
      return error;
    }
  }

  async find(body: EnventFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'envent',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          category_post_id: body?.filter?.category_post_id || undefined,
        },
      },
      relations: {
        noteHistory: {
          user: true,
        },
        categoryPost: true,
      },
    });
  }

  async findUser(body: EnventFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'envent',
      body: {
        ...body,
        filter: {
          // status: body.filter.status,
          // department_id: body?.filter?.department_id || undefined,
        },
      },
      relations: {
        noteHistory: {
          user: true,
        },
        categoryPost: true,
      },
    });
  }

  async findAll(query) {
    return await this.enventRepository.find({
      where: {
        // name: query.name && Like(`%${query.name}%`),
        status: query.status,
      },
      relations: {
        noteHistory: {
          user: true,
        },
        categoryPost: true,
      },
      order: {
        // sequence: 'ASC',
      },
    });
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({
        where: { id: id },
        relations: {
          noteHistory: {
            user: true,
          },
          categoryPost: true,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getDetailUser(id: number) {
    try {
      const data = await this.findOne({
        where: { id: id },
        relations: {
          noteHistory: {
            user: true,
          },
          categoryPost: true,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(envent: EnventUDDto, id: number) {
    try {
      // Lấy sự kiện hiện tại
      const result = await this.enventRepository.findOne({
        where: { id: id },
        relations: ['noteHistory'], // Đảm bảo lấy noteHistory
      });

      if (!result) {
        throw new NotFoundException();
      }

      // Lấy danh sách user_id mới từ yêu cầu cập nhật
      const newUserIds = envent.user_id;

      // Lấy danh sách noteHistory hiện tại
      const currentNotes = result.noteHistory;
      const currentUserIds = currentNotes.map((note) => note.user_id);

      // Danh sách user_id cần thêm (có trong danh sách mới nhưng không có trong danh sách hiện tại)
      const userIdsToAdd = newUserIds.filter((userId) => !currentUserIds.includes(userId));
      // Danh sách user_id cần xóa (có trong danh sách hiện tại nhưng không có trong danh sách mới)
      const userIdsToRemove = currentUserIds.filter((userId) => !newUserIds.includes(userId));

      // Xóa các ghi chú không còn trong danh sách user_id mới
      for (const note of currentNotes) {
        if (userIdsToRemove.includes(note.user_id)) {
          const deleteResult = await this.noteHistoryRepository.delete(note.id);
        }
      }

      // Thêm các ghi chú mới vào noteHistory nếu có user_id mới
      for (const userId of userIdsToAdd) {
        const newNoteHistory = this.noteHistoryRepository.create({
          envent_id: Number(id), // Gán envent_id là id của sự kiện hiện tại
          user_id: userId,
        });

        console.log(`Ghi chú mới:`, newNoteHistory);

        try {
          // Lưu vào cơ sở dữ liệu
          const savedNote = await this.noteHistoryRepository.save(newNoteHistory);
        } catch (error) {
          console.error(`Lỗi khi lưu ghi chú mới: ${error.message}`);
        }
      }

      // Cập nhật sự kiện với các thông tin mới
      result.noteHistory = await this.noteHistoryRepository.find({ where: { envent_id: id } });

      // Cập nhật sự kiện với các thông tin mới
      const updatedEvent = await this.enventRepository.save({ ...result, ...envent });
      return updatedEvent;
    } catch (error) {
      console.error(error);
      throw error; // Để đảm bảo lỗi được bắt ở tầng cao hơn
    }
  }

  async delete(id: number) {
    try {
      // Tìm kiếm sự kiện với các ghi chú liên quan
      const result = await this.findOne({ where: { id: id }, relations: ['noteHistory'] });

      if (!result) {
        throw new NotFoundException('Event not found');
      }

      // Xóa các bản ghi noteHistory liên quan
      await this.noteHistoryRepository.delete({ envent_id: id });

      await this.registerDonateRepository.delete({ envent_id: id });

      // Xóa sự kiện
      await this.enventRepository.delete(id);

      return result;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}
