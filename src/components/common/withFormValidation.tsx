
import React from 'react';
import { useForm, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

export interface FormValidationProps<T> {
  onSubmit: (data: T) => Promise<void>;
  schema: z.ZodType<T>;
  defaultValues?: DefaultValues<T>;
}

export function withFormValidation<T extends Record<string, any>>(
  WrappedComponent: React.ComponentType<any>
) {
  return function WithFormValidationComponent({
    onSubmit,
    schema,
    defaultValues,
    ...props
  }: FormValidationProps<T> & Record<string, any>) {
    const { toast } = useToast();
    const form = useForm<T>({
      resolver: zodResolver(schema),
      defaultValues: defaultValues || {} as DefaultValues<T>,
    });

    const handleSubmit = async (data: T) => {
      try {
        await onSubmit(data);
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred",
          variant: "destructive",
        });
      }
    };

    return (
      <WrappedComponent
        form={form}
        onSubmit={form.handleSubmit(handleSubmit)}
        {...props}
      />
    );
  };
}
