import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly TagResponstory: Repository<TagEntity>,
  ) { }
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  findAll() {
    return `This action returns all tag`;
  }

  async findByIds(ids: string[]) {
    return this.TagResponstory.findByIds(ids);
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
  async checkName(name: string): Promise<number> {
    const List = await this.TagResponstory.findOne({ where: { name } })
    if (List) {
      return List.id
    } else {
      const newparam = await this.TagResponstory.create({ name })
      const info = await this.TagResponstory.save(newparam)
      return info.id
    }
  }

}
