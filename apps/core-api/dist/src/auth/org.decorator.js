"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Org = void 0;
const common_1 = require("@nestjs/common");
exports.Org = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user?.orgId;
});
//# sourceMappingURL=org.decorator.js.map