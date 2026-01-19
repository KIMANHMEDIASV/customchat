import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsageLogsService {
  constructor(private prisma: PrismaService) {}

  async getUserUsageLogs(userId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.usageLog.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          model: {
            select: {
              id: true,
              nameDisplay: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.usageLog.count({ where: { userId } }),
    ]);

    return {
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
