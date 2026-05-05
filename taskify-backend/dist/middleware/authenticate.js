"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const auth_1 = require("../lib/auth");
async function authenticate(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const payload = await (0, auth_1.decrypt)(token);
        if (!payload || !payload.userId) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        req.userId = payload.userId;
        next();
    }
    catch {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
//# sourceMappingURL=authenticate.js.map