import { Column } from "typeorm";

/**
 * Cbase abstract class for adit entities type orm
 */
export abstract class BaseAuditTypeOrmEntity {

    @Column()
    createdAt!: Date;

    @Column()
    updatedAt!: Date;
}