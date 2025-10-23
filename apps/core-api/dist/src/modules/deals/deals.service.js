"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let DealsService = class DealsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(orgId, query) {
        const { page, size, search } = query;
        const skip = (page - 1) * size;
        const where = {
            orgId,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { stage: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [items, total] = await Promise.all([
            this.prisma.deal.findMany({
                where,
                skip,
                take: size,
                orderBy: { createdAt: 'desc' },
                include: { contact: true, company: true },
            }),
            this.prisma.deal.count({ where }),
        ]);
        return { items, total };
    }
    async get(orgId, id) {
        const deal = await this.prisma.deal.findFirst({
            where: { id, orgId },
            include: { contact: true, company: true }
        });
        if (!deal) {
            throw new common_1.NotFoundException('Deal not found');
        }
        return deal;
    }
    create(orgId, dto) {
        return this.prisma.deal.create({ data: { ...dto, orgId } });
    }
    async update(orgId, id, dto) {
        await this.get(orgId, id);
        return this.prisma.deal.update({ where: { id }, data: dto });
    }
    async remove(orgId, id) {
        await this.get(orgId, id);
        await this.prisma.deal.delete({ where: { id } });
        return { id, deleted: true };
    }
};
exports.DealsService = DealsService;
exports.DealsService = DealsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DealsService);
//# sourceMappingURL=deals.service.js.map