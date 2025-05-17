import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  async create(): Promise<Track> {
    const newTrack = this.trackRepository.create();
    return this.trackRepository.save(newTrack);
  }

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track | null> {
    return this.trackRepository.findOne({ where: { track_id: id } });
  }

  async remove(id: string): Promise<void> {
    await this.trackRepository.delete(id);
  }
}