import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '@prisma/client';
import { UuidTool } from 'uuid-tool';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const categoryId = createProductDto.categoryId; //----> Get category Id

      const category = await this.prisma.category.findUnique({
        where: {id: categoryId},
      });

      if(!category){
        throw new NotFoundException(`Category with id = ${categoryId} is not found.`);
      }

      return await this.prisma.product.create({
        data: { ...createProductDto },
      });
    } catch (error) {
      throw new Error(`message: ${error.message}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return this.prisma.product.findMany({
        include: {
          productOrders: true,
        },
      });
    } catch (error) {
      throw new Error(`message: ${error.message}`);
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with id = ${id} is not found.`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const isEqual = UuidTool.compare(id, updateProductDto.id);
    if(!isEqual) throw new BadRequestException('Id mismatch');

    try {
      const categoryId = updateProductDto.categoryId; //----> Get category Id

      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with id = ${categoryId} is not found.`,
        );
      }

      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with id = ${id} is not found.`);
      }

      return await this.prisma.product.update({
        where: { id },
        data: { ...updateProductDto },
      });
    } catch (error) {
      throw new Error(`message: ${error.message}`);
    }
  }

  async remove(id: string): Promise<Product> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException(`Product with id = ${id} is not found.`);
      }
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`message: ${error.message}`);
    }
  }
}
