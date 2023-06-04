import { Resolver, Query, Args, Subscription } from '@nestjs/graphql'
import { PersonalitiesService } from './personalities.service'
import { Personality } from './entities/personality.entity'
import {
  FindManyPersonalityArgs,
  FindUniquePersonalityArgs,
} from './dto/find.args'

import { PubSubService } from 'src/common/pub-sub/pub-sub.service'
import { AggregateCountOutput } from 'src/common/dtos/common.input'
import { PersonalityWhereInput } from './dto/where.args'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Resolver(() => Personality)
export class PersonalitiesResolver {
  constructor(
    private readonly personalitiesService: PersonalitiesService,
    private readonly prisma: PrismaService,
    private readonly pubSub: PubSubService,
  ) {}

  @Query(() => [Personality], { name: 'personalities' })
  findAll(@Args() args: FindManyPersonalityArgs) {
    return this.personalitiesService.findAll(args)
  }

  @Query(() => Personality, { name: 'personality' })
  findOne(@Args() args: FindUniquePersonalityArgs) {
    return this.personalitiesService.findOne(args)
  }

  @Subscription(() => Personality, {
    name: 'personalityCreated',
    nullable: true,
  })
  personalityCreated() {
    console.log('Connected...')
    return this.pubSub.asyncIterator('personalityCreated')
  }

  @Query(() => AggregateCountOutput, {
    name: 'personalitiesCount',
  })
  async personalitiesCount(
    @Args('where', { nullable: true })
    where: PersonalityWhereInput,
  ) {
    const personalities = await this.prisma.personality.aggregate({
      _count: { _all: true },
      where,
    })
    return { count: personalities._count._all }
  }
}
