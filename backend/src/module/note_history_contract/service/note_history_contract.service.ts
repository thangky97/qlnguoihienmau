import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';
import { NoteHistoryContractDto } from '@module/note_history_contract/dto/note_history_contract.dto';

import { FindOneOptions, Repository } from 'typeorm';
import { NoteHistoryContractFilterDto } from '@module/note_history_contract/dto/note_history_contract.filter.dto';
import { NoteHistoryContractUDDto } from '@module/note_history_contract/dto/note_history_contractUD.dto';
import { NoteHistoryContractQueryDto } from '../dto/note_history_contract.query.dto';

@Injectable()
export class NoteHistoryContractService {
  constructor(@InjectRepository(NoteHistoryContract) private readonly noteHistoryContractRepository: Repository<NoteHistoryContract>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<NoteHistoryContract> {
    return await this.noteHistoryContractRepository.findOne(query);
  }

  async create(noteHistoryContract: NoteHistoryContractDto) {
    try {
      const newNoteHistoryContract = await this.noteHistoryContractRepository.save(noteHistoryContract);
      return newNoteHistoryContract;
    } catch (error) {
      return error;
    }
  }

  async find(body: NoteHistoryContractFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'noteHistoryContract',
      body: {
        ...body,
        filter: {},
      },
    });
  }

  async findAll(@Query() query: NoteHistoryContractQueryDto) {
    return await this.noteHistoryContractRepository.find({
      where: {},
      order: {
        id: 'DESC',
      },
    });
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async update(noteHistoryContract: NoteHistoryContractUDDto, id: number) {
    try {
      const result = await this.noteHistoryContractRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.noteHistoryContractRepository.save({ ...result, ...noteHistoryContract });
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id: number) {
    try {
      const result = await this.findOne({ where: { id: id } });
      await this.noteHistoryContractRepository.delete({
        id,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
