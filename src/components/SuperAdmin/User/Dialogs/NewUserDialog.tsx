
import React from 'react';
import CreateUserDialog from "./CreateUserDialog";
import { CreateUserDialogProps } from '@/types/user';

/**
 * This is a renamed export of CreateUserDialog for backward compatibility
 * It provides a consistent interface while supporting legacy prop patterns
 */
const NewUserDialog: React.FC<CreateUserDialogProps> = (props) => {
  // Use the actual provided onSubmit or provide a default
  const enhancedProps: CreateUserDialogProps = {
    ...props,
    onSubmit: props.onSubmit || (async (userData) => {
      // If onCreateUser exists, use it (backward compatibility)
      if (props.onCreateUser) {
        await props.onCreateUser(userData);
      }
      // If onCreate exists, use it (backward compatibility)
      else if (props.onCreate) {
        await props.onCreate(userData);
      }
      return true;
    })
  };

  return <CreateUserDialog {...enhancedProps} />;
};

export default NewUserDialog;
