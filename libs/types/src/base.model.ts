
export interface BaseEntity {
    _id?;
}

export interface TenantEntity extends BaseEntity {
    owner;
}