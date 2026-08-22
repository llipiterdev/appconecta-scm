import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { buttonVariants } from '@/components/ui/buttonVariants';
import { cn } from '@/lib/cn';

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  block,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}
