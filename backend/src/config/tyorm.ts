import { Authority } from '@module/user/entity/authority.entity';
import { User } from '@module/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '@module/customer/entity/customer.entity';
import { NoteHistoryInquiry } from '@module/note_history_inquiry/entity/note_history_inquiry.entity';
import { NoteHistoryContract } from '@module/note_history_contract/entity/note_history_contract.entity';
import { CategoryPost } from '@module/category_post/entity/category_post.entity';
import { Envent } from '@module/envent/entity/envent.entity';
import { RegisterDonateBlood } from '@module/register_donate_blood/entity/register_donate_blood.entity';
import { Hospital } from '@module/hospital/entity/hospital.entity';
import { Blood } from '@module/blood/entity/blood.entity';
import { BloodDetail } from '@module/blood_detail/entity/blood_detail.entity';

const typeOrm = TypeOrmModule.forFeature([User, Authority, Customer, NoteHistoryInquiry, NoteHistoryContract, CategoryPost, Envent, RegisterDonateBlood, Hospital, Blood, BloodDetail]);
export default typeOrm;
