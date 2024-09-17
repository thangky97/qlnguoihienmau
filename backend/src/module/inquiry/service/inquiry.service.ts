import { CommonService } from '@module/common/common.service';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { InquiryDto } from '@module/inquiry/dto/inquiry.dto';
const ExcelJS = require('exceljs');
import { FindOneOptions, Like, Raw, Repository } from 'typeorm';
import { InquiryFilterDto } from '@module/inquiry/dto/inquiry.filter.dto';
import { InquiryUDDto } from '@module/inquiry/dto/inquiryUD.dto';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(@InjectRepository(Inquiry) private readonly inquiryRepository: Repository<Inquiry>, @InjectRepository(NoteHistoryInquiry) private readonly noteHistoryInquiryRepository: Repository<NoteHistoryInquiry>, private readonly commonService: CommonService) {}

  makeObjectQuery(startDate: Date, endDate: Date) {
    if (startDate && endDate) {
      return Raw((alias) => `${alias} >= :startDate and  ${alias} <= :endDate`, { startDate, endDate });
    } else if (startDate) {
      return Raw((alias) => `${alias} >= :startDate`, { startDate });
    } else if (endDate) {
      return Raw((alias) => `${alias} <= :endDate`, { endDate });
    }
  }

  async findOne(query: FindOneOptions): Promise<Inquiry> {
    return await this.inquiryRepository.findOne(query);
  }

  async create(inquiry: InquiryDto) {
    try {
      const newInquiry = await this.inquiryRepository.save(inquiry);

      if (newInquiry) {
        const newNoteHistory = this.noteHistoryInquiryRepository.create({
          inquiry_id: newInquiry.id,
          processingStatus: newInquiry?.processingStatus,
          note: newInquiry.note || '',
        });

        await this.noteHistoryInquiryRepository.save(newNoteHistory);

        return newInquiry;
      }

      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async find(body: InquiryFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'inquiry',
      body: {
        ...body,
        filter: {
          status: body.filter.status,
          customer_code: body?.filter?.customer_code || undefined,
          jobfield_id: body?.filter?.jobfield_id || undefined,
        },
      },
      relations: { customer: true, jobfield: true },
    });
  }

  async findAll(query) {
    try {
      return await this.inquiryRepository.find({
        where: {
          // name: query.name && Like(`%${query.name}%`),
          jobfield_id: query.jobfield_id,
          customer_code: query.customer_code,
          status: query.status,
          processingStatus: query?.processingStatus,
          created_at: (query.startDate || query.endDate) && this.makeObjectQuery(query.startDate, query.endDate),
        },
        relations: { customer: true, jobfield: true },
        order: {
          id: 'DESC',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getDetail(id: number) {
    try {
      const data = await this.findOne({ where: { id: id }, relations: { customer: true, jobfield: true } });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // async update(iquiry: InquiryUDDto, id: number) {
  //   try {
  //     const result = await this.inquiryRepository.findOne({
  //       where: { id: id },
  //     });

  //     if (!result) {
  //       throw new NotFoundException();
  //     }
  //     return await this.inquiryRepository.save({ ...result, ...iquiry });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async update(inquiry: InquiryUDDto, id: number) {
    try {
      const existingInquiry = await this.inquiryRepository.findOne({
        where: { id: id },
      });

      if (!existingInquiry) {
        throw new NotFoundException(`Inquiry with ID ${id} not found.`);
      }

      // Cập nhật thông tin inquiry hiện có
      const updatedInquiry = await this.inquiryRepository.save({
        ...existingInquiry,
        ...inquiry,
      });

      // Tạo bản ghi mới trong noteHistoryInquiry dựa trên thông tin inquiry đã cập nhật
      const newNoteHistory = this.noteHistoryInquiryRepository.create({
        inquiry_id: updatedInquiry.id,
        processingStatus: updatedInquiry.processingStatus,
        note: updatedInquiry.note || '',
      });

      await this.noteHistoryInquiryRepository.save(newNoteHistory);

      return updatedInquiry;
    } catch (error) {
      throw new Error(error.message || 'An error occurred while updating the inquiry.');
    }
  }

  async delete(id: number) {
    try {
      const result = await this.findOne({ where: { id: id } });
      await this.inquiryRepository.delete({
        id,
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async import(file: Express.Multer.File) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const workSheet = workbook.getWorksheet('import_inquiry');

    const listInquiry: InquiryDto[] = [];

    workSheet?._rows?.forEach((item: any, index: number) => {
      if (index > 0 && item.getCell(1).value != null) {
        listInquiry.push({
          jobfield_id: item?.getCell(1).value.result || item?.getCell(1).value,
          name: item?.getCell(2).value || null,
          customer_code: item?.getCell(3).value.result || item?.getCell(3).value,
          status: item?.getCell(4).value?.result || item?.getCell(4).value,
          description: item?.getCell(5).value || null,
          note: item?.getCell(6).value || null,
          company_id: null,
        });
      }
    });

    for (let i = 0; i < listInquiry.length; i++) {
      await this.create(listInquiry[i]);
    }
  }
}
