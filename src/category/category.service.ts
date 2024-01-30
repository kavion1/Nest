import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly CategoryRepository: Repository<CategoryEntity>,
  ) { }
  async create(name: string) {
    const param = { name }
    const newPost: CategoryEntity = await this.CategoryRepository.create({
      ...param,
    });
    const cr = await this.CategoryRepository.save(newPost)
    return cr.id;
  }

  findAll() {
    return `This action returns all category`;
  }

  async findById(id: any) {
    return await this.CategoryRepository.findOne({ where: { id } })
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async checkName(name: string): Promise<number> {
    const List = await this.CategoryRepository.findOne({ where: { name } })
    if (List) {
      return List.id
    } else {
      const newparam = await this.CategoryRepository.create({ name })
      const info = await this.CategoryRepository.save(newparam)
      return info.id
    }
  }
}
