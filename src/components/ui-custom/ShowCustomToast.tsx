// utils/showCustomToast.ts
import { useToast } from "@/hooks/use-toast";
import { useToastCustomizationOption } from "@/hooks/useDashboardCustomization";

type ToastType = "success" | "error";

export const useCustomToast = () => {
  const {
    toastBackgroundColor,
    toastTitleColor,
    toastDescriptionColor,
    toastErrorBackgroundColor,
    toastErrorTitleColor,
    toastErrorDescriptionColor,
  } = useToastCustomizationOption();
  const { toast } = useToast();
  const showCustomToast = ({
    type,
    title,
    description,
    affiliate,
  }: {
    type: ToastType;
    title: string;
    description: string;
    affiliate: boolean;
  }) => {
    const isError = type === "error";

    const titleColor = isError
      ? affiliate && toastErrorTitleColor
      : affiliate && toastTitleColor;
    const descriptionColor = isError
      ? affiliate && toastErrorDescriptionColor
      : affiliate && toastDescriptionColor;

    const backgroundColor = isError
      ? affiliate && toastErrorBackgroundColor
      : affiliate && toastBackgroundColor;

    toast({
      title: (
        <span
          className="font-semibold"
          style={{ color: titleColor || undefined }}
        >
          {title}
        </span>
      ) as unknown as string,
      description: (
        <span
          className="text-sm"
          style={{ color: descriptionColor || undefined }}
        >
          {description}
        </span>
      ),
      ...(isError &&
        !toastErrorBackgroundColor &&
        !toastErrorTitleColor &&
        !toastErrorDescriptionColor && { variant: "destructive" }),
      ...(!isError &&
        !toastBackgroundColor &&
        !toastTitleColor &&
        !toastDescriptionColor && { variant: "default" }),
      ...(backgroundColor && {
        style: {
          backgroundColor,
          border: "none",
        },
      }),
    });
  };

  return { showCustomToast };
};
