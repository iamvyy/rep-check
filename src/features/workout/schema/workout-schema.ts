import { z } from 'zod';

export const WorkoutLogSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Must be a valid title'
          : 'Invalid title',
    })
    .trim()
    .min(1, { error: 'Exercise name is required' }),
  weight: z.coerce
    .number({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Weight must be a valid number'
          : 'Invalid weight',
    })
    .gt(0, { error: 'Weight is required and must be greater than 0' }),

  rep: z.coerce
    .number({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Reps must be a valid number'
          : 'Invalid reps',
    })
    .int({ error: 'Reps must be a whole number' })
    .gt(0, { error: 'Reps are required and must be greater than 0' }),

  notes: z.string().optional(),
});

export type WorkoutLogFormInput = z.input<typeof WorkoutLogSchema>;
export type WorkoutLogFormOutput = z.output<typeof WorkoutLogSchema>;

export interface WorkoutItem extends WorkoutLogFormOutput {
  id: string;
  date: string;
}
