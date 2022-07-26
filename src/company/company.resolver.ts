import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { CompanyEntity } from './entities/company.entity';
import { CreateCompanyInput } from './inputs/create-company.input';
import { UpdateCompanyInput } from './inputs/update-company.input';

@Resolver(() => CompanyEntity)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Mutation(() => CompanyEntity)
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companyService.create(createCompanyInput);
  }

  @Query(() => [CompanyEntity], { name: 'company' })
  findAll() {
    return this.companyService.findAll();
  }

  @Query(() => CompanyEntity, { name: 'company' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.companyService.findOne(id);
  }

  @Mutation(() => CompanyEntity)
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companyService.update(
      updateCompanyInput.id,
      updateCompanyInput,
    );
  }

  @Mutation(() => CompanyEntity)
  removeCompany(@Args('id', { type: () => Int }) id: number) {
    return this.companyService.remove(id);
  }
}
