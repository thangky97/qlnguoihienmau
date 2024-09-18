import { CommonService } from '@module/common/common.service';
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryPost } from '@module/category_post/entity/category_post.entity';
import { CategoryPostDto } from '@module/category_post/dto/category_post.dto';
import * as moment from 'moment';
import { FindOneOptions, Like, Repository } from 'typeorm';
import { CategoryPostFilterDto } from '@module/category_post/dto/category_post.filter.dto';
import { Status } from '@config/enum';
import { CategoryPostUDDto } from '@module/category_post/dto/category_postUD.dto';
import { CategoryPostQueryDto } from '../dto/category_post.query.dto';
import { DataSource } from 'typeorm'; // Import DataSource

@Injectable()
export class CategoryPostService {
  constructor(@InjectRepository(CategoryPost) private readonly categoryPostRepository: Repository<CategoryPost>, private dataSource: DataSource, private readonly commonService: CommonService) {}

  async findOne(query: FindOneOptions): Promise<CategoryPost> {
    return await this.categoryPostRepository.findOne(query);
  }

  async create(category_post: CategoryPostDto) {
    try {
      const newCategoryPost = await this.categoryPostRepository.save(category_post);
      return newCategoryPost;
    } catch (error) {
      return error;
    }
  }

  async find(body: CategoryPostFilterDto) {
    return await this.commonService.getTotalAndList({
      tableName: 'category_post',
      body: {
        ...body,
        filter: {
          name: body.filter.name && Like(`%${body.filter.name}%`),
          status: body.filter.status,
        },
      },
    });
  }

  async findAll(@Query() query: CategoryPostQueryDto) {
    return await this.categoryPostRepository.find({
      where: {
        status: Status.ACTIVE,
      },
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

  async update(category_post: CategoryPostUDDto, id: number) {
    try {
      const result = await this.categoryPostRepository.findOne({
        where: { id: id },
      });

      if (!result) {
        throw new NotFoundException();
      }
      return await this.categoryPostRepository.save({ ...result, ...category_post });
    } catch (error) {
      console.log(error);
    }
  }

  // Delete department and it constrain
  async delete_department(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    // Start a transaction
    await queryRunner.startTransaction();

    try {
      // Disable foreign key checks
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

      // Perform the delete operation
      await queryRunner.query('DELETE FROM department WHERE id = ?;', [id]);

      // Re-enable foreign key checks
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');

      // Commit the transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback the transaction if something goes wrong
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
