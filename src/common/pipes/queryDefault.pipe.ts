import { PipeTransform } from '@nestjs/common';
import { QueryDto } from '../dto/query.dto';

// export class QueryDefaultPipe implements PipeTransform {
//     transform(value: any): QueryDto {
//         return {
//             sortBy: value.sortBy || 'createdAt',
//             sortDirection: value.sortDirection || 'desc',
//             pageNumber: value.pageNumber || 1,
//             pageSize: value.pageSize || 10,
//             searchEmailTerm: value.searchEmailTerm || null,
//             searchLoginTerm: value.searchLoginTerm || null,
//         }
//     }
// }