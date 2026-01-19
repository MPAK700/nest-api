import { Type } from "class-transformer";
import { IsPositive } from "class-validator";


export class PaginationQueryDTO {
    @Type(()=>Number)
    @IsPositive()
    page: number;

    @Type(()=>Number)
    @IsPositive()
    limit: number;
}