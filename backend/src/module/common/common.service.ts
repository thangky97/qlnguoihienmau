import { OrderStatus } from '@config/enum';
import { CommonFilter } from '@config/type';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

import { DataSource } from 'typeorm';
import { PagingDto } from './dto/paging.dto';
import { SortingDto } from './dto/sorting.dto';

@Injectable()
export class CommonService {
  constructor(private readonly dataSource: DataSource) {}
  async getTotalAndList(custom: CommonFilter) {
    const { tableName, body, select, relations, order } = custom;

    const filter: SortingDto = body.filter;
    const sort: SortingDto = body.sort;
    const page: PagingDto = body.page;
    const count = await this.dataSource
      .getRepository(tableName)
      .find({
        where: filter,
        relations,
      })
      .then((data) => data.length);

    const list = await this.dataSource.getRepository(tableName).find({
      where: filter,
      relations,
      order: order
        ? order
        : {
            [sort.sortBy]: sort.sortDirection,
          },
      skip: page.limit * (page.page - 1),
      take: page.limit,
      select,
    });
    return {
      count,
      list,
    };
  }

  @Cron('*/10 * * * * *')
  handleCron() {
    // this.scanOrder();
  }
  async scanOrder() {
    const listOrder = await this.dataSource.getRepository('order').find({
      where: {
        status: 'HOLD',
      },
      relations: {
        product: { stocks: true },
      },
    });

    for (let i = 0; i < listOrder.length; i++) {
      const item = listOrder[i];

      if (moment().format('yyyy') >= moment(item?.created_at).format('yyyy') && moment(item?.created_at).add(item?.expire_hold, 'hour').format('DD-MM-YYYY HH:mm:ss a') <= moment().format('DD-MM-YYYY HH:mm:ss a') == true) {
        let total_amount = 0;
        item.details?.forEach((item: any) => {
          total_amount += item.amount;
        });

        const order = await this.dataSource.getRepository('order').findOne({ where: { code: item?.code } });
        await this.dataSource.getRepository('order').save({ ...order, status: OrderStatus.CANCEL, note: order?.note + ' - HUỶ QUÁ HẠN XÁC NHẬN' });
      }
    }
  }
}
