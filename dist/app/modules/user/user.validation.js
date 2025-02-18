"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const createUserZodSchema = zod_1.z.object({
    name: zod_1.z.string({ required_error: 'First name is required' }),
    email: zod_1.z.string({ required_error: 'Email name is required' }),
    phone: zod_1.z.string({ required_error: 'Phone name is required' }),
    password: zod_1.z.string({ required_error: 'Password is required' }),
});
const updateZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    postCode: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
});
const updateLocationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        longitude: zod_1.z.string({ required_error: 'Longitude is required' }),
        latitude: zod_1.z.string({ required_error: 'Latitude is required' }),
    }),
});
exports.UserValidation = {
    createUserZodSchema,
    updateZodSchema,
    updateLocationZodSchema,
};
