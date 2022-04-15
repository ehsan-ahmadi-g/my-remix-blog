import {
  Controller,
  RegisterOptions,
  DeepMap,
  FieldError,
  UseFormRegister,
  Path,
  Control,
} from "react-hook-form";
import { Checkbox, CheckboxProps } from "antd";
import { apply, tw } from "twind";

import { ErrorMessage } from "./";

interface CustomCheckboxProps {
  checkboxClassName?: string;
  label?: string;
}

type MyCheckboxProps<T> = {
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  errors?: Partial<DeepMap<T, FieldError>>;
  control: Control<T>;
} & CustomCheckboxProps &
  Omit<CheckboxProps, keyof CustomCheckboxProps>;

const MyCheckbox = <T extends Record<string, unknown>>({
  className,
  checkboxClassName,
  name,
  control,
  label,
  ...props
}: MyCheckboxProps<T>) => (
  <Controller<T>
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <div className={tw(apply`flex flex-col w-full`, className)}>
        <Checkbox
          className={tw(apply`w-full`, checkboxClassName)}
          {...field}
          {...props}
        >
          {label}
        </Checkbox>

        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default MyCheckbox;
