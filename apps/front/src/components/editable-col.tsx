import { useEffect } from "react";

import { useState } from "react";

export type EditableColProps<T extends { id: number }> = {
  id: number;
  columnId: string;
  initialValue: string;
  update: (value: Partial<T>) => void;
};

export const EditableCol = <T extends { id: number }>({
  id,
  columnId,
  initialValue,
  update,
}: EditableColProps<T>) => {
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    if (value === initialValue) return;
    const updatedData = {
      id,
      [columnId]: value,
    };
    update(updatedData as Partial<T>);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
};
