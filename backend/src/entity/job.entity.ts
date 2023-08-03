import { jobStatus } from 'src/type/jobs.type';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,UpdateDateColumn  } from 'typeorm';

@Entity()
export class Job {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    total_emails: number;

    @Column()
    processed_emails: number;

    @Column({
        type: 'enum',
        enum: jobStatus,
        default: jobStatus.PENDING
    })
    status: jobStatus;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}