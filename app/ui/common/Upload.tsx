import {
  Controller,
  RegisterOptions,
  DeepMap,
  FieldError,
  UseFormRegister,
  Path,
  Control,
} from "react-hook-form";

import { Upload, UploadProps, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { apply, tw } from "twind";

import ErrorMessage from "./ErrorMessage";

interface CustomUploadProps {
  inputClassName?: string;
  label?: string;
}

type MyUploadProps<T> = {
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  errors?: Partial<DeepMap<T, FieldError>>;
  control: Control<T>;
} & CustomUploadProps &
  Omit<UploadProps, keyof CustomUploadProps>;

const MyInput = <T extends Record<string, unknown>>({
  className,
  inputClassName,
  name,
  control,
  label,
  ...props
}: MyUploadProps<T>) => (
  <Controller<T>
    control={control}
    name={name}
    render={({ field: { onChange, value }, fieldState }) => (
      <div className={tw(apply`flex flex-col w-full`, className)}>
        {label ? <label htmlFor={name}>{label}</label> : null}

        <Upload
          {...props}
          showUploadList={false}
          onChange={(info) => {
            const reader = new FileReader();
            reader.readAsDataURL(info.file as unknown as Blob);

            reader.onload = () => {
              onChange(reader.result);
            };
          }}
          beforeUpload={() => {
            return false;
          }}
        >
          <Button
            type="primary"
            className={tw(
              "text-xcolor5 flex flex-row items-center",
              "focus:(outline-0 shadow-0)"
            )}
            icon={<UploadOutlined />}
          >
            Click to Upload
          </Button>

          {value && typeof value === "string" ? (
            <img className="w-full h-auto" src={value} alt="preview" />
          ) : null}
        </Upload>

        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default MyInput;
