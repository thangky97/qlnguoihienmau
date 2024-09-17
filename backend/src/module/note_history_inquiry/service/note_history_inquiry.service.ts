import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';
import { NoteHistoryInquiryDto } from '@module/note_history_inquiry/dto/note_history_inquiry.dto';

import { FindOneOptions, Repository } from 'typeorm';
import { NoteHistoryInquiryFilterDto } from '@module/note_history_inquiry/dto/note_history_inquiry.filter.dto';
import { ProcessingStatus } from '@config/enum';
import { NoteHistoryInquiryUDDto } from '@module/note_history_inquiry/dto/note_history_inquiryUD.dto';
import { NoteHistoryInquiryQueryDto } from '../dto/note_history_inquiry.query.dto';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';

@Injectable()
export class NoteHistoryInquiryService {
  constructor(@InjectRepository(NoteHistoryInquiry) private readonly noteHistoryInquiryRepository: Repository<NoteHistoryInquiry>, @InjectRepository(Inquiry) private readonly inquiryRepository: Repository<Inquiry>, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<NoteHistoryInquiry> {
    return await this.noteHistoryInquiryRepository.findOne(query);
  }

  async create(noteHistoryInquiry: NoteHistoryInquiryDto) {
    try {
      const newNoteHistoryInquiry = await this.noteHistoryInquiryRepository.save(noteHistoryInquiry);
      return newNoteHistoryInquiry;
    } catch (error) {
      return error;
    }
  }

  async find(body: NoteHistoryInquiryFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'noteHistoryInquiry',
      body: {
        ...body,
        filter: {},
      },
    });
  }

  async findAll(@Query() query: NoteHistoryInquiryQueryDto) {
    return await this.noteHistoryInquiryRepository.find({
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

  async update(noteHistoryInquiry: NoteHistoryInquiryUDDto, id: number) {
    try {
      const result = await this.noteHistoryInquiryRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.noteHistoryInquiryRepository.save({ ...result, ...noteHistoryInquiry });
    } catch (error) {
      console.log(error);
    }
  }
}
