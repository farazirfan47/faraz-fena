import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entity/job.entity';
import { BullModule } from '@nestjs/bull';
import { EmailConsumer } from './consumer/EmailConsumer';
import { EmailGateway } from './gateway/email.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql_server',
      port: 3306,
      username: 'localhost',
      password: 'localhost',
      database: 'local_db',
      entities: [Job],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'redis_server',
        port: 6379,
        password: 'eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81'
      },
    }),
    BullModule.registerQueue({
      name: 'email_queue',
    }),
    TypeOrmModule.forFeature([Job])
  ],
  controllers: [AppController],
  providers: [AppService, EmailConsumer, EmailGateway],
})
export class AppModule {}
