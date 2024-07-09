import FormUi from "../ui/form";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import {
  useForm,
  SubmitHandler
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import ControllerForm from "../ui/form/ControllerForm";


export default function Form() {
  const { t } = useTranslation("form");
  const schema = z.object({
    email: z
      .string({
        message: t("errors.invalid_format", { field: t("fields.email.label") }),
      })
      .email({
        message: t("errors.invalid_format", { field: t("fields.email.label") }),
      }),
  });
  type FormValues = z.infer<typeof schema>;
  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    console.log(data);
    // run sign in logic
  }
  return (
    <FormUi
      className="flex flex-col gap-4"
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
    >
      <ControllerForm name="email">
        {({ field, error, state }) => (
          <FormUi.Input
            label={t("fields.email.label")}
            type="email"
            placeholder={t("fields.email.placeholder")}
            defaultValue={t("fields.email.default")}
            {...field}
            {...{
              errorMessage: error?.message,
              isInvalid: state.invalid
            }}
          />
        )}
      </ControllerForm>
      <Button type="submit" color="primary" size="lg">
        {t("buttons.continue_with_email")}
      </Button>
    </FormUi>
  );
}
