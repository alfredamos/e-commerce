import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UuidTool } from 'uuid-tool';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.prisma.category.create({
      data: { ...createCategoryDto },
    });
  }

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({});
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ${id} is not found.`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const isEqual = UuidTool.compare(id, updateCategoryDto.id);
    if (!isEqual) throw new BadRequestException('Id mismatch');

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ${id} is not found.`);
    }
    return this.prisma.category.update({
      where: { id },
      data: { ...updateCategoryDto },
    });
  }

  async remove(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ${id} is not found.`);
    }
    return await this.prisma.category.delete({
      where: { id },
    });
  }
}
