import {
  Controller,
  RegisterOptions,
  DeepMap,
  FieldError,
  UseFormRegister,
  Path,
  Control,
} from "react-hook-form";
import { Select, SelectProps } from "antd";
import { apply, tw } from "twind";

import { ErrorMessage } from "./";

interface CustomSelectProps {
  selectClassName?: string;
  label?: string;
  options: Array<any>;
  // options: Array<{
  //   name: string;
  //   key: string;
  // }>;
}

type MySelectProps<T> = {
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  errors?: Partial<DeepMap<T, FieldError>>;
  control: Control<T>;
} & CustomSelectProps &
  Omit<SelectProps, keyof CustomSelectProps>;

const MyInput = <T extends Record<string, unknown>>({
  className,
  selectClassName,
  name,
  control,
  placeholder = name,
  label,
  ...props
}: MySelectProps<T>) => (
  <Controller<T>
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <div className={tw(apply`flex flex-col w-full`, className)}>
        {label ? <label htmlFor={name}>{label}</label> : null}

        <Select
          size="large"
          mode="tags"
          placeholder={placeholder}
          status={fieldState.error?.message ? "error" : ""}
          {...field}
          {...props}
        />

        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default MyInput;
