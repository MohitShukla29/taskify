"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const jose_1 = require("jose");
const secretKey = process.env.JWT_SECRET || 'super-secret-jwt-key-replace-in-production';
const key = new TextEncoder().encode(secretKey);
async function encrypt(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}
async function decrypt(input) {
    const { payload } = await (0, jose_1.jwtVerify)(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}
//# sourceMappingURL=auth.js.map