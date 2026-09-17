export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPER_ADMIN = "SUPER_ADMIN",
}

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

export enum PaymentMethod {
    COD = "COD",
}

export enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed",
}