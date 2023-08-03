import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { SendEmailsDto } from './dto/emails.dto';
import { Job } from './entity/job.entity';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // THIS WILL CREATE A NEW JOB IN DB AND ADD IT TO QUEUE
  @Post('sendEmails')
  async sendEmails(@Body() emailsDto: SendEmailsDto): Promise<Job> {
    const job = await this.appService.sendEmails(emailsDto.emails);
    return job
  }

  // THIS WILL FETCH THE JOB FROM DB AND RETURN THE STATUS
  @Get('jobStatus')
  async jobStatus(): Promise<Object> {
    return await this.appService.jobStatus();
  }

  // THIS WILL FETCH ALL THE JOBS FROM DB
  @Get('getJobs')
  async listJobs(): Promise<Job[]> {
    return await this.appService.fetchJobs();
  }

  // THIS WILL DELETE A JOB FROM DB
  @Delete('deleteJob/:id')
  async deleteJob(@Param('id') id: string): Promise<string> {
    await this.appService.deleteJob(id);
    return "Job has been deleted"
  }
}
