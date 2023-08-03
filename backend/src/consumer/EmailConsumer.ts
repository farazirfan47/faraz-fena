import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AppService } from 'src/app.service';
import { EmailGateway } from 'src/gateway/email.gateway';

@Processor('email_queue')
export class EmailConsumer {

  constructor(
      private readonly emailGateway: EmailGateway,
      private readonly appService: AppService
  ) {}

  // THIS WILL PROCESS THE JOB
  @Process()
  async processEmails(job: Job<any>) {
    // ADDED A SECOND DELAY TO EMIT THE PROGRESS
    setTimeout(async () => {
      const { data } = job;
      var processedEmails = 0;
      var completed = false;
      for (let i = 1; i <= data?.total_emails; i++) {
        // SEND EMAIL LOGIC WILL BE HERE
        processedEmails += 1;
        completed = processedEmails == data?.total_emails;
        console.log("Completed: "+completed)
        const updatedJob = await this.appService.updateStatus(data?.id, processedEmails, completed);
        // BORADCAST TO ALL CLIENTS
        console.log('emitting emailProgress'+data?.id)
        this.emailGateway.server.emit('emailProgress'+data?.id, updatedJob)
    }
  }, 1000)}
}