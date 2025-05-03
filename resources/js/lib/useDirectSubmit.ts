import { useForm, router } from '@inertiajs/react';

/**
 * Custom hook for direct form submissions without loading indicators
 * @param initialValues Initial form values
 * @param options Configuration options
 * @returns Form handling methods and state
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDirectSubmit<TForm extends Record<string, any>>(initialValues: TForm, options?: {
  preserveScroll?: boolean;
  preserveState?: boolean;
  only?: string[];
}) {
  const form = useForm(initialValues);

  const submit = (url: string, method: 'post' | 'put' | 'patch' | 'delete' = 'post', callbacks?: {
    onSuccess?: () => void;
    onError?: (errors: Record<string, string>) => void;
    onFinish?: () => void;
  }) => {
    // Use router directly with immediate option to disable progress indicator
    router[method](url, form.data, {
      preserveScroll: options?.preserveScroll ?? true,
      preserveState: options?.preserveState ?? true,
      only: options?.only,
      onSuccess: () => {
        // Clear errors on success
        form.clearErrors();
        callbacks?.onSuccess?.();
      },
      onError: (errors) => {
        callbacks?.onError?.(errors);
      },
      onFinish: () => {
        callbacks?.onFinish?.();
      }
    });
  };

  return {
    ...form,
    submit
  };
}

export default useDirectSubmit;
