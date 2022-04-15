import {
  Controller,
  RegisterOptions,
  DeepMap,
  FieldError,
  UseFormRegister,
  Path,
  Control,
} from "react-hook-form";
import { Input } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { apply, tw } from "twind";

import { ErrorMessage } from "./";

const { TextArea } = Input;

interface CustomTextAreaProps {
  textAreaClassName?: string;
}

type MyTextAreaProps<T> = {
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  errors?: Partial<DeepMap<T, FieldError>>;
  control: Control<T>;
} & CustomTextAreaProps &
  Omit<TextAreaProps, keyof CustomTextAreaProps>;

const MyTextArea = <T extends Record<string, unknown>>({
  className,
  textAreaClassName,
  name,
  control,
  placeholder = name,
  ...props
}: MyTextAreaProps<T>) => {
  return (
    <Controller<T>
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <label className={tw(apply`flex flex-col w-full`, className)}>
          <TextArea
            placeholder={placeholder}
            className={tw(
              apply`w-full rounded-0 text-white border-xcolor5 focus:(border-xcolor4)`,
              "resize-none border-t-0! border-r-0! border-l-0! bg-transparent! outline-none! shadow-none!",
              textAreaClassName
            )}
            status={fieldState.error?.message ? "error" : ""}
            rows={3}
            {...field}
            {...props}
          />

          <ErrorMessage message={fieldState.error?.message} />
        </label>
      )}
    />
  );
};

export default MyTextArea;
