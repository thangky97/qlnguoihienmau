import { Company } from '@module/company/entity/company.entity';
import { Authority } from '@module/user/entity/authority.entity';
import { User } from '@module/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '@module/branch/entity/branch.entity';
import { Jobfield } from '@module/jobfield/entity/jobfield.entity';
import { Customer } from '@module/customer/entity/customer.entity';
import { Department } from '@module/department/entity/department.entity';
import { Workingprocesstemplate } from '@module/workingprocesstemplate/entity/workingprocesstemplate.entity';
import { Inquiry } from '@module/inquiry/entity/inquiry.entity';
import { Contract } from '@module/contract/entity/contract.entity';
import { Job } from '@module/job/entity/job.entity';
import { Task } from '@module/task/entity/task.entity';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';

const typeOrm = TypeOrmModule.forFeature([User, Authority, Company, Branch, Jobfield, Customer, Department, Workingprocesstemplate, Inquiry, Contract, Job, Task, NoteHistoryInquiry, NoteHistoryContract]);
export default typeOrm;
