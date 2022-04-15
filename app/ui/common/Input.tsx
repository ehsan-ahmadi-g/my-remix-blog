import {
  Controller,
  RegisterOptions,
  DeepMap,
  FieldError,
  UseFormRegister,
  Path,
  Control,
} from "react-hook-form";
import { Input, InputProps } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

import { apply, tw } from "twind";

import { ErrorMessage } from "./";

interface CustomInputProps {
  inputClassName?: string;
  label?: string;
}

type MyInputProps<T> = {
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  errors?: Partial<DeepMap<T, FieldError>>;
  control: Control<T>;
} & CustomInputProps &
  Omit<InputProps, keyof CustomInputProps>;

const MyInput = <T extends Record<string, unknown>>({
  className,
  inputClassName,
  name,
  control,
  placeholder = name,
  label,
  ...props
}: MyInputProps<T>) => (
  <Controller<T>
    control={control}
    name={name}
    render={({ field, fieldState }) => {
      const baseProps = {
        size: "large",
        placeholder,
        className: tw(
          apply`w-full rounded-0 text-white bg-transparent! border-xcolor5 focus:(border-xcolor4)`,
          "border-t-0! border-r-0! border-l-0! bg-transparent! outline-none! shadow-none!",
          inputClassName
        ),
        status: fieldState.error?.message ? "error" : "",
        ...field,
        ...props,
      };

      return (
        <div className={tw(apply`flex flex-col w-full`, className)}>
          {label ? <label htmlFor={name}>{label}</label> : null}

          {props.type === "password" ? (
            <Input.Password
              {...baseProps}
              iconRender={(visible) =>
                visible ? (
                  <EyeOutlined
                    style={{
                      color: "#fff",
                      fontSize: "1.25rem",
                      fill: "#fff",
                    }}
                  />
                ) : (
                  <EyeInvisibleOutlined
                    style={{
                      color: "#fff",
                      fontSize: "1.25rem",
                      fill: "#fff",
                    }}
                  />
                )
              }
            />
          ) : (
            <Input {...baseProps} />
          )}

          {/* <Input
          size="large"
          placeholder={placeholder}
          className={tw(
            apply`w-full rounded-0 text-white border-xcolor5 focus:(border-xcolor4)`,
            "border-t-0! border-r-0! border-l-0! bg-transparent! outline-none! shadow-none!",
            inputClassName
          )}
          status={fieldState.error?.message ? "error" : ""}
          {...field}
          {...props}
        /> */}

          <ErrorMessage message={fieldState.error?.message} />
        </div>
      );
    }}
  />
);

export default MyInput;
