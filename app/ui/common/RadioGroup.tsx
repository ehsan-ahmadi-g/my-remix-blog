import {
  Controller,
  RegisterOptions,
  DeepMap,
  FieldError,
  UseFormRegister,
  Path,
  Control,
} from "react-hook-form";
import { Radio, RadioProps } from "antd";
import { apply, tw } from "twind";

import { ErrorMessage } from "./";

interface CustomRadioButtonProps {
  radioClassName?: string;
  values: Array<{ key: string; value: string | number }>;
}

type MyRadioButtonProps<T> = {
  name: Path<T>;
  rules?: RegisterOptions;
  register?: UseFormRegister<T>;
  errors?: Partial<DeepMap<T, FieldError>>;
  control: Control<T>;
} & CustomRadioButtonProps &
  Omit<RadioProps, keyof CustomRadioButtonProps>;

const MyRadio = <T extends Record<string, unknown>>({
  className,
  radioClassName,
  name,
  control,
  values,
  ...props
}: MyRadioButtonProps<T>) => (
  <Controller<T>
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <div className={tw(apply`flex flex-col w-full`, className)}>
        <Radio.Group value={field.value} onChange={field.onChange} {...props}>
          {values.map((radio) => (
            <Radio
              key={radio.value}
              className={tw(apply`w-full text-white my-1`, radioClassName)}
              value={radio.value}
            >
              {radio.key}
            </Radio>
          ))}
        </Radio.Group>

        <ErrorMessage message={fieldState.error?.message} />
      </div>
    )}
  />
);

export default MyRadio;
