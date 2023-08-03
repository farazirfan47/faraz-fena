import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { Repository } from 'typeorm';
import { jobStatus } from './type/jobs.type';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectQueue('email_queue')
    private emailQueue: Queue,
  ) {}

  // THIS WILL CREATE A NEW JOB IN DB AND ADD IT TO QUEUE
  async sendEmails(totalEmail: number): Promise<Job> {
    const job = new Job()
    job.total_emails = totalEmail
    job.processed_emails = 0
    job.status = jobStatus.PENDING
    await this.jobRepository.save(job)
    await this.emailQueue.add(job);
    return job
  }

  // THIS WILL FETCH THE JOB FROM DB AND RETURN THE STATUS
  async jobStatus(): Promise<Object> {
    const inProgressJob = await this.jobRepository.findOneBy({ status: jobStatus.PENDING })
    if (inProgressJob) {
      return {
        status: inProgressJob.status,
        processed_emails: inProgressJob.processed_emails,
        total_emails: inProgressJob.total_emails,
      }
    }
    return {
      status: jobStatus.DONE
    }
  }

  // THIS WILL UPDATE STATUS IN DB IN CASE WE WANT TO RESTART THE SERVER
  async updateStatus(jobId: number, processedEmails: number, completed: boolean): Promise<Job> {
    const jobToUpdate = await this.jobRepository.findOneBy({
        id: jobId,
    })
    jobToUpdate.processed_emails = processedEmails
    jobToUpdate.status = completed ? jobStatus.DONE : jobStatus.PENDING
    await this.jobRepository.save(jobToUpdate)
    return jobToUpdate
  }

  // THIS WILL FETCH ALL THE JOBS FROM DB
  async fetchJobs(): Promise<Job[]> {
    return await this.jobRepository.find({
      where: {
        status: jobStatus.PENDING
      }
    })
  }

  // THIS WILL DELETE THE JOB FROM DB
  async deleteJob(id: string): Promise<void> {
    await this.jobRepository.delete(id)
  }
}
